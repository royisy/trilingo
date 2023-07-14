import argparse
import logging
from logging.config import dictConfig

import spacy

from scripts.clients.openai_api_client import chat_completion
from scripts.conf.logging_config import logging_config
from scripts.models.deck_csv import (
    BASE_FORM_CSV,
    DEFINITION_CSV,
    LEMMATIZE_CSV,
    PART_OF_SPEECH_CSV,
    REMOVE_DUPLICATES_CSV,
    SOURCE_CSV,
    Column,
)
from scripts.models.deck_process import DeckProcess
from scripts.models.language import Language
from scripts.models.part_of_speech import PartOfSpeech, pos_mapping
from scripts.utils.csv_utils import (
    append_csv,
    convert_to_list,
    init_csv,
    merge_csv_data,
    read_csv,
    read_csv_str,
)
from scripts.utils.deck_utils import (
    chunks,
    create_prompt,
    get_duplicated_definitions,
    group_by_pos,
    lowercase_words,
    parts_of_speech,
    remove_duplicated_answers,
    remove_invalid_part_of_speech,
    remove_unused_part_of_speech,
    sort_by_id,
)

if __name__ == "__main__":
    dictConfig(logging_config)

logger = logging.getLogger(__name__)

CHUNK_SIZE = 100


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("lang", choices=Language.get_choices(), help="Language")
    parser.add_argument(
        "deck_process", choices=DeckProcess.get_choices(), help="Process"
    )
    parser.add_argument("--loglevel", default="INFO", help="Set log level")
    args = parser.parse_args()

    levels = {
        "DEBUG": logging.DEBUG,
        "INFO": logging.INFO,
        "WARNING": logging.WARNING,
        "ERROR": logging.ERROR,
        "CRITICAL": logging.CRITICAL,
    }
    level = levels.get(args.loglevel.upper())
    if not level:
        raise ValueError(f"Invalid log level: {args.loglevel}")
    root_logger = logging.getLogger()
    root_logger.setLevel(level)

    lang = Language(args.lang)
    deck_process = DeckProcess(args.deck_process)

    logger.info(f"start: {lang}, {deck_process}")

    total_tokens = 0
    if deck_process == DeckProcess.LEMMATIZE:
        _lemmatize(lang)
    elif deck_process == DeckProcess.PART_OF_SPEECH:
        total_tokens = _add_part_of_speech(lang)
    elif deck_process == DeckProcess.BASE_FORM:
        total_tokens = _convert_to_base_form(lang)
    elif deck_process == DeckProcess.DEFINITION:
        total_tokens = _add_definition(lang)
    elif deck_process == DeckProcess.REMOVE_DUPLICATES:
        total_tokens = _remove_duplicates(lang)

    logger.info(f"total_tokens: {total_tokens}")


def _lemmatize(lang: Language):
    init_csv(LEMMATIZE_CSV)
    csv_rows = read_csv(SOURCE_CSV)

    nlp = spacy.load(f"{lang.GERMAN}_core_news_sm")

    for row in csv_rows:
        doc = nlp(row[Column.ANSWER.value])
        for token in doc:
            pos = token.pos_
            lemma = token.lemma_
        row[Column.PART_OF_SPEECH.value] = pos_mapping[pos].value
        row[Column.ANSWER.value] = lemma

    filtered_csv_rows = remove_unused_part_of_speech(csv_rows)
    logger.info(f"removed {len(csv_rows) - len(filtered_csv_rows)} words by unused pos")

    filtered_csv_rows = remove_duplicated_answers(filtered_csv_rows)

    csv_data = convert_to_list(filtered_csv_rows, PART_OF_SPEECH_CSV.columns)
    append_csv(LEMMATIZE_CSV, csv_data)


def _add_part_of_speech(lang: Language) -> int:
    init_csv(PART_OF_SPEECH_CSV)
    csv_rows = read_csv(SOURCE_CSV)
    total_tokens = 0

    for chunk in chunks(csv_rows, CHUNK_SIZE):
        prompt = create_prompt("part_of_speech", lang, chunk)
        pos_list_str, tokens = chat_completion(prompt)
        if pos_list_str is None:
            continue
        total_tokens += tokens
        pos_list = read_csv_str(pos_list_str, [Column.ID, Column.PART_OF_SPEECH])
        filtered_pos_list = remove_invalid_part_of_speech(pos_list, lang)
        merged_csv = merge_csv_data(csv_rows, filtered_pos_list, Column.PART_OF_SPEECH)
        csv_data = convert_to_list(merged_csv, PART_OF_SPEECH_CSV.columns)
        append_csv(PART_OF_SPEECH_CSV, csv_data)

    return total_tokens


def _convert_to_base_form(lang: Language) -> int:
    init_csv(BASE_FORM_CSV)
    csv_rows = read_csv(PART_OF_SPEECH_CSV, remove_header=True)
    pos_dict = group_by_pos(csv_rows)
    total_tokens = 0

    for part_of_speech, csv_rows in parts_of_speech(pos_dict):
        for chunk in chunks(csv_rows, CHUNK_SIZE):
            if part_of_speech == PartOfSpeech.NOUN:
                prompt = create_prompt("base_form_noun", lang, chunk)
            else:
                prompt = create_prompt("base_form", lang, chunk, part_of_speech)
            base_list_str, tokens = chat_completion(prompt)
            if base_list_str is None:
                continue
            total_tokens += tokens
            base_list = read_csv_str(base_list_str, [Column.ID, Column.ANSWER])
            merged_csv = merge_csv_data(csv_rows, base_list, Column.ANSWER)

            if part_of_speech == PartOfSpeech.NOUN:
                prompt = create_prompt("article", lang, merged_csv)
                article_list_str, tokens = chat_completion(prompt)
                if article_list_str is None:
                    continue
                total_tokens += tokens
                article_list = read_csv_str(
                    article_list_str, [Column.ID, Column.ANSWER]
                )
                merged_csv = merge_csv_data(merged_csv, article_list, Column.ANSWER)
            else:
                merged_csv = lowercase_words(merged_csv)

            csv_data = convert_to_list(merged_csv, BASE_FORM_CSV.columns)
            append_csv(BASE_FORM_CSV, csv_data)

    return total_tokens


def _add_definition(lang: Language) -> int:
    init_csv(DEFINITION_CSV)
    csv_rows = read_csv(BASE_FORM_CSV, remove_header=True)
    sorted_csv_rows = sort_by_id(csv_rows)
    filtered_csv_rows = remove_duplicated_answers(sorted_csv_rows)
    pos_dict = group_by_pos(filtered_csv_rows)
    total_tokens = 0

    for part_of_speech, csv_rows in parts_of_speech(pos_dict):
        for chunk in chunks(csv_rows, CHUNK_SIZE):
            if part_of_speech == PartOfSpeech.NOUN:
                prompt = create_prompt("definition_noun", lang, chunk)
            else:
                prompt = create_prompt("definition", lang, chunk, part_of_speech)
            definition_list_str, tokens = chat_completion(prompt)
            if definition_list_str is None:
                continue
            total_tokens += tokens
            definition_list = read_csv_str(
                definition_list_str, [Column.ID, Column.DEFINITION]
            )
            merged_csv = merge_csv_data(csv_rows, definition_list, Column.DEFINITION)
            csv_data = convert_to_list(merged_csv, DEFINITION_CSV.columns)
            append_csv(DEFINITION_CSV, csv_data)

    return total_tokens


def _remove_duplicates(lang: Language) -> int:
    init_csv(REMOVE_DUPLICATES_CSV)
    csv_rows = read_csv(DEFINITION_CSV, remove_header=True)
    logger.info(f"total definitions: {len(csv_rows)}")
    duplicates = get_duplicated_definitions(csv_rows)
    logger.info(f"duplicated definitions: {len(duplicates)}")

    for row in duplicates:
        print(
            f"{row[Column.ID.value]}: ({row[Column.PART_OF_SPEECH.value]}) "
            f"{row[Column.DEFINITION.value]} / {row[Column.ANSWER.value]}"
        )

    total_tokens = 0
    return total_tokens


if __name__ == "__main__":
    main()

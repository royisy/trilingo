import argparse
import logging
from logging.config import dictConfig

from scripts.conf.logging_config import logging_config
from scripts.models.deck_csv import (
    BASE_FORM_CSV,
    DEFINITION_CSV,
    DUP_ANSWER_CSV,
    DUP_DEFINITION_CSV,
    FINALIZE_CSV,
    OLD_DUP_DEFINITION_CSV,
    PART_OF_SPEECH_CSV,
    SOURCE_CSV,
    Column,
)
from scripts.models.deck_process import DeckProcess
from scripts.models.language import Language
from scripts.models.part_of_speech import PartOfSpeech
from scripts.utils.csv_utils import append_csv_rows, init_csv, merge_csv_data, read_csv
from scripts.utils.deck_utils import (
    check_definition_length,
    chunks,
    create_prompt,
    get_data_from_chat_gpt,
    get_duplicated_definitions,
    group_by_pos,
    lowercase_article,
    lowercase_word,
    parts_of_speech,
    remove_duplicated_answers,
    remove_invalid_part_of_speech,
    sort_by_answer,
    sort_by_id,
    update_values,
)

if __name__ == "__main__":
    dictConfig(logging_config)

logger = logging.getLogger(__name__)

DEFAULT_CHUNK_SIZE = 100


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("lang", choices=Language.get_choices(), help="Language")
    parser.add_argument(
        "deck_process", choices=DeckProcess.get_choices(), help="Process"
    )
    parser.add_argument("--chunk", help="Chunk size")
    parser.add_argument("--loglevel", default="INFO", help="Set log level")
    args = parser.parse_args()

    chunk_size = DEFAULT_CHUNK_SIZE
    if args.chunk:
        chunk_size = int(args.chunk)
    logger.info(f"chunk size: {chunk_size}")

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
    if deck_process == DeckProcess.PART_OF_SPEECH:
        total_tokens = _add_part_of_speech(chunk_size, lang)
    elif deck_process == DeckProcess.BASE_FORM:
        total_tokens = _convert_to_base_form(chunk_size, lang)
    elif deck_process == DeckProcess.REMOVE_DUP_ANSWER:
        _remove_duplicated_answers()
    elif deck_process == DeckProcess.DEFINITION:
        total_tokens = _add_definition(chunk_size, lang)
    elif deck_process == DeckProcess.REMOVE_DUP_DEFINITION:
        total_tokens = _remove_duplicated_definitions(chunk_size, lang)
    elif deck_process == DeckProcess.FINALIZE:
        _finalize()

    logger.info(f"total_tokens: {total_tokens}")


def _add_part_of_speech(chunk_size: int, lang: Language) -> int:
    init_csv(PART_OF_SPEECH_CSV)
    csv_rows = read_csv(SOURCE_CSV)
    total_tokens = 0

    for chunk_csv_rows in chunks(csv_rows, chunk_size):
        prompt = create_prompt("part_of_speech", lang, chunk_csv_rows)
        pos_list, tokens = get_data_from_chat_gpt(
            prompt, [Column.ID, Column.PART_OF_SPEECH], chunk_csv_rows, SOURCE_CSV
        )
        total_tokens += tokens
        if pos_list is None:
            continue
        filtered_pos_list = remove_invalid_part_of_speech(pos_list, lang)
        merged_csv_rows = merge_csv_data(
            chunk_csv_rows, filtered_pos_list, Column.PART_OF_SPEECH
        )
        append_csv_rows(PART_OF_SPEECH_CSV, merged_csv_rows)

    return total_tokens


def _convert_to_base_form(chunk_size: int, lang: Language) -> int:
    init_csv(BASE_FORM_CSV)
    csv_rows = read_csv(PART_OF_SPEECH_CSV, remove_header=True)
    pos_dict = group_by_pos(csv_rows)
    total_tokens = 0

    for part_of_speech, pos_csv_rows in parts_of_speech(pos_dict):
        for chunk_csv_rows in chunks(pos_csv_rows, chunk_size):
            if part_of_speech == PartOfSpeech.NOUN:
                prompt = create_prompt("base_form_noun", lang, chunk_csv_rows)
            else:
                prompt = create_prompt(
                    "base_form", lang, chunk_csv_rows, part_of_speech=part_of_speech
                )
            base_list, tokens = get_data_from_chat_gpt(
                prompt, [Column.ID, Column.ANSWER], chunk_csv_rows, PART_OF_SPEECH_CSV
            )
            total_tokens += tokens
            if base_list is None:
                continue
            merged_csv_rows = merge_csv_data(chunk_csv_rows, base_list, Column.ANSWER)

            if part_of_speech == PartOfSpeech.NOUN:
                prompt = create_prompt("article", lang, merged_csv_rows)
                article_list, tokens = get_data_from_chat_gpt(
                    prompt,
                    [Column.ID, Column.ANSWER],
                    chunk_csv_rows,
                    PART_OF_SPEECH_CSV,
                )
                total_tokens += tokens
                if article_list is None:
                    continue
                merged_csv_rows = merge_csv_data(
                    merged_csv_rows, article_list, Column.ANSWER
                )
                merged_csv_rows = lowercase_article(merged_csv_rows, lang)
            else:
                merged_csv_rows = lowercase_word(merged_csv_rows)

            append_csv_rows(BASE_FORM_CSV, merged_csv_rows)

    return total_tokens


def _remove_duplicated_answers():
    init_csv(DUP_ANSWER_CSV)
    csv_rows = read_csv(BASE_FORM_CSV, remove_header=True)
    filtered_csv_rows = remove_duplicated_answers(csv_rows)
    pos_dict = group_by_pos(filtered_csv_rows)

    for _, pos_csv_rows in parts_of_speech(pos_dict):
        sorted_csv_rows = sort_by_answer(pos_csv_rows)
        append_csv_rows(DUP_ANSWER_CSV, sorted_csv_rows)


def _add_definition(chunk_size: int, lang: Language) -> int:
    init_csv(DEFINITION_CSV)
    csv_rows = read_csv(DUP_ANSWER_CSV, remove_header=True)
    pos_dict = group_by_pos(csv_rows)
    total_tokens = 0

    for part_of_speech, pos_csv_rows in parts_of_speech(pos_dict):
        for chunk_csv_rows in chunks(pos_csv_rows, chunk_size):
            if part_of_speech == PartOfSpeech.NOUN:
                prompt = create_prompt("definition_noun", lang, chunk_csv_rows)
            else:
                prompt = create_prompt(
                    "definition", lang, chunk_csv_rows, part_of_speech=part_of_speech
                )
            definition_list, tokens = get_data_from_chat_gpt(
                prompt, [Column.ID, Column.DEFINITION], chunk_csv_rows, DUP_ANSWER_CSV
            )
            total_tokens += tokens
            if definition_list is None:
                continue
            merged_csv_rows = merge_csv_data(
                chunk_csv_rows, definition_list, Column.DEFINITION
            )
            append_csv_rows(DEFINITION_CSV, merged_csv_rows)

    return total_tokens


def _remove_duplicated_definitions(chunk_size: int, lang: Language) -> int:
    init_csv(OLD_DUP_DEFINITION_CSV, check_file_exists=False)
    csv_rows = read_csv(DUP_DEFINITION_CSV, remove_header=True)
    append_csv_rows(OLD_DUP_DEFINITION_CSV, csv_rows)

    logger.info(f"total definitions: {len(csv_rows)}")
    init_csv(DUP_DEFINITION_CSV, check_file_exists=False)
    duplicates, non_duplicates = get_duplicated_definitions(csv_rows)
    logger.info(f"duplicated definitions: {len(duplicates)}")
    append_csv_rows(DUP_DEFINITION_CSV, non_duplicates)
    pos_dict = group_by_pos(duplicates)
    total_tokens = 0

    for part_of_speech, pos_csv_rows in parts_of_speech(pos_dict):
        for chunk_csv_rows in chunks(pos_csv_rows, chunk_size):
            prompt = create_prompt(
                "duplicated_definition",
                lang,
                chunk_csv_rows,
                words_columns=[Column.ID, Column.ANSWER, Column.DEFINITION],
                part_of_speech=part_of_speech,
            )
            definition_list, tokens = get_data_from_chat_gpt(
                prompt,
                [Column.ID, Column.ANSWER, Column.DEFINITION],
                chunk_csv_rows,
                DUP_DEFINITION_CSV,
            )
            total_tokens += tokens
            if definition_list is None:
                continue
            merged_csv_rows = merge_csv_data(
                chunk_csv_rows, definition_list, Column.DEFINITION
            )
            append_csv_rows(DUP_DEFINITION_CSV, merged_csv_rows)

    updated_csv_rows = read_csv(DUP_DEFINITION_CSV, remove_header=True)
    duplicates, _ = get_duplicated_definitions(updated_csv_rows)
    logger.info(f"remaining duplicated definitions: {len(duplicates)}")
    check_definition_length(updated_csv_rows)

    return total_tokens


def _finalize():
    init_csv(FINALIZE_CSV)
    csv_rows = read_csv(DUP_DEFINITION_CSV, remove_header=True)
    csv_rows = sort_by_id(csv_rows)

    updated_csv_rows = []
    for index, row in enumerate(csv_rows):
        updated_row = update_values(row, index)
        updated_csv_rows.append(updated_row)

    append_csv_rows(FINALIZE_CSV, updated_csv_rows)


if __name__ == "__main__":
    main()

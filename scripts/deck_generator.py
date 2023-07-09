import argparse
import logging

from scripts.clients.openai_api_client import chat_completion
from scripts.models.deck_csv import (
    BASE_FORM_CSV,
    DEFINITION_CSV,
    PART_OF_SPEECH_CSV,
    SOURCE_CSV,
    Column,
)
from scripts.utils.csv_utils import (
    append_csv,
    convert_to_list,
    init_csv,
    merge_csv_data,
    read_csv,
    read_csv_str,
)
from scripts.utils.deck_consts import POS_NOUN, POS_UNKNOWN
from scripts.utils.deck_utils import (
    chunks,
    create_prompt,
    filter_invalid_part_of_speech,
    group_by_pos,
)

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

CHUNK_SIZE = 200


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("lang", choices=["de"], help="Language")
    parser.add_argument("process", choices=["pos", "base", "def"], help="Process")

    args = parser.parse_args()
    lang = args.lang

    if args.process == "pos":
        total_tokens = _add_part_of_speech(lang)
    elif args.process == "base":
        total_tokens = _convert_to_base_form(lang)
    elif args.process == "def":
        total_tokens = _add_definition(lang)

    logger.info(f"total_tokens: {total_tokens}")


def _add_part_of_speech(lang) -> int:
    init_csv(PART_OF_SPEECH_CSV)
    csv_rows = read_csv(SOURCE_CSV)
    total_tokens = 0

    for chunk in chunks(csv_rows, CHUNK_SIZE):
        prompt = create_prompt("part_of_speech", lang, chunk)
        pos_list_str, tokens = chat_completion(prompt)
        total_tokens += tokens
        if pos_list_str is None:
            continue
        pos_list = read_csv_str(pos_list_str, [Column.ID, Column.PART_OF_SPEECH])
        filtered_pos_list = filter_invalid_part_of_speech(pos_list, lang)
        merged_csv = merge_csv_data(csv_rows, filtered_pos_list, Column.PART_OF_SPEECH)
        csv_data = convert_to_list(merged_csv, PART_OF_SPEECH_CSV.columns)
        append_csv(PART_OF_SPEECH_CSV, csv_data)

    return total_tokens


def _convert_to_base_form(lang) -> int:
    init_csv(BASE_FORM_CSV)
    csv_rows = read_csv(PART_OF_SPEECH_CSV, remove_header=True)
    pos_dict = group_by_pos(csv_rows)
    total_tokens = 0

    for part_of_speech, csv_rows in pos_dict.items():
        if part_of_speech == POS_UNKNOWN:
            continue
        for chunk in chunks(csv_rows, CHUNK_SIZE):
            if part_of_speech == POS_NOUN:
                prompt = create_prompt("base_form_noun", lang, chunk)
            else:
                prompt = create_prompt("base_form", lang, chunk, part_of_speech)
            base_list_str, tokens = chat_completion(prompt)
            total_tokens += tokens
            if base_list_str is None:
                continue
            base_list = read_csv_str(base_list_str, [Column.ID, Column.ANSWER])
            merged_csv = merge_csv_data(csv_rows, base_list, Column.ANSWER)

            if part_of_speech == POS_NOUN:
                prompt = create_prompt("article", lang, merged_csv)
                article_list_str, tokens = chat_completion(prompt)
                total_tokens += tokens
                if article_list_str is None:
                    continue
                article_list = read_csv_str(
                    article_list_str, [Column.ID, Column.ANSWER]
                )
                merged_csv = merge_csv_data(merged_csv, article_list, Column.ANSWER)

            csv_data = convert_to_list(merged_csv, BASE_FORM_CSV.columns)
            append_csv(BASE_FORM_CSV, csv_data)

    return total_tokens


def _add_definition(lang) -> int:
    init_csv(DEFINITION_CSV)
    csv_rows = read_csv(BASE_FORM_CSV, remove_header=True)
    pos_dict = group_by_pos(csv_rows)
    total_tokens = 0

    for part_of_speech, csv_rows in pos_dict.items():
        if part_of_speech == POS_UNKNOWN:
            continue
        for chunk in chunks(csv_rows, CHUNK_SIZE):
            if part_of_speech == POS_NOUN:
                prompt = create_prompt("definition_noun", lang, chunk)
            else:
                prompt = create_prompt("definition", lang, chunk, part_of_speech)
            definition_list_str, tokens = chat_completion(prompt)
            total_tokens += tokens
            if definition_list_str is None:
                continue
            definition_list = read_csv_str(
                definition_list_str, [Column.ID, Column.DEFINITION]
            )
            merged_csv = merge_csv_data(csv_rows, definition_list, Column.DEFINITION)
            csv_data = convert_to_list(merged_csv, DEFINITION_CSV.columns)
            append_csv(DEFINITION_CSV, csv_data)

    return total_tokens


if __name__ == "__main__":
    main()
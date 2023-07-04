import argparse
from pathlib import Path

from scripts.clients.openai_api_client import chat_completion
from scripts.models.deck_csv import DeckCsv
from scripts.utils.csv_utils import (
    append_csv,
    clear_csv,
    convert_to_list,
    merge_csv,
    read_csv,
    read_csv_str,
)
from scripts.utils.deck_utils import chunks, create_prompt, group_by_pos

CSV_DIR = Path(__file__).resolve().parent / "csv"

SOURCE_CSV = DeckCsv(CSV_DIR / "source.csv", ["id", "answer"])
PART_OF_SPEECH_CSV = DeckCsv(
    CSV_DIR / "part_of_speech.csv", ["id", "part_of_speech", "answer"]
)
BASE_FORM_CSV = DeckCsv(CSV_DIR / "base_form.csv", ["id", "part_of_speech", "answer"])
DEFINITION_CSV = DeckCsv(
    CSV_DIR / "definition.csv",
    ["id", "part_of_speech", "definition", "answer"],
)

CHUNK_SIZE = 200


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("lang", choices=["de"], help="Language")
    parser.add_argument("process", choices=["pos", "base", "def"], help="Process")

    args = parser.parse_args()
    lang = args.lang

    if args.process == "pos":
        _add_part_of_speech(lang)
    elif args.process == "base":
        _convert_to_base_form(lang)
    elif args.process == "def":
        _add_definition(lang)


def _add_part_of_speech(lang):
    clear_csv(PART_OF_SPEECH_CSV)
    csv_rows = read_csv(SOURCE_CSV)

    # TODO write header

    for chunk in chunks(csv_rows, CHUNK_SIZE):
        prompt = create_prompt("part_of_speech", lang, chunk)
        pos_list_str = chat_completion(prompt)
        # TODO validate response

        pos_list = read_csv_str(pos_list_str, ["id", "part_of_speech"])
        merged_csv = merge_csv(csv_rows, pos_list, "part_of_speech")
        csv_data = convert_to_list(merged_csv, PART_OF_SPEECH_CSV.columns)
        append_csv(PART_OF_SPEECH_CSV, csv_data)


def _convert_to_base_form(lang):
    clear_csv(BASE_FORM_CSV)
    csv_rows = read_csv(PART_OF_SPEECH_CSV)
    pos_dict = group_by_pos(csv_rows)

    # TODO write header

    for part_of_speech, csv_rows in pos_dict.items():
        for chunk in chunks(csv_rows, CHUNK_SIZE):
            if part_of_speech == "noun":
                prompt = create_prompt("base_form_noun", lang, chunk)
            else:
                prompt = create_prompt("base_form", lang, chunk, part_of_speech)
            base_list_str = chat_completion(prompt)
            # TODO validate response

            base_list = read_csv_str(base_list_str, ["id", "answer"])
            merged_csv = merge_csv(csv_rows, base_list, "answer")

            if part_of_speech == "noun":
                prompt = create_prompt("article", lang, merged_csv)
                article_list_str = chat_completion(prompt)
                # TODO validate response

                article_list = read_csv_str(article_list_str, ["id", "answer"])
                merged_csv = merge_csv(merged_csv, article_list, "answer")

            csv_data = convert_to_list(merged_csv, BASE_FORM_CSV.columns)
            append_csv(BASE_FORM_CSV, csv_data)


def _add_definition(lang):
    clear_csv(DEFINITION_CSV)
    csv_rows = read_csv(BASE_FORM_CSV)
    pos_dict = group_by_pos(csv_rows)

    # TODO write header

    for part_of_speech, csv_rows in pos_dict.items():
        for chunk in chunks(csv_rows, CHUNK_SIZE):
            if part_of_speech == "noun":
                prompt = create_prompt("definition_noun", lang, chunk)
            else:
                prompt = create_prompt("definition", lang, chunk, part_of_speech)
            definition_list_str = chat_completion(prompt)
            # TODO validate response

            definition_list = read_csv_str(definition_list_str, ["id", "definition"])
            merged_csv = merge_csv(csv_rows, definition_list, "definition")
            csv_data = convert_to_list(merged_csv, DEFINITION_CSV.columns)
            append_csv(DEFINITION_CSV, csv_data)


if __name__ == "__main__":
    main()

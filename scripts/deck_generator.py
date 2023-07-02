import argparse
from pathlib import Path

from scripts.clients.openai_api_client import mock_chat_completion
from scripts.models.deck_csv import DeckCsv
from scripts.utils.csv_utils import clear_csv, merge_csv, read_csv, read_csv_str
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
    parser.add_argument(
        "process", choices=["part_of_speech", "base_form", "definition"], help="Process"
    )

    args = parser.parse_args()
    lang = args.lang

    if args.process == "part_of_speech":
        add_part_of_speech(lang)
    elif args.process == "base_form":
        convert_to_base_form(lang)
    elif args.process == "definition":
        add_english_definition(lang)


def add_part_of_speech(lang):
    clear_csv(PART_OF_SPEECH_CSV)
    csv_rows = read_csv(SOURCE_CSV)

    # TODO write header

    for chunk in chunks(csv_rows, CHUNK_SIZE):
        prompt = create_prompt("part_of_speech", lang, chunk)
        print(prompt)

        pos_list_str = mock_chat_completion("part_of_speech")
        # TODO validate response

        pos_list = read_csv_str(pos_list_str, ["id", "part_of_speech"])
        merged_csv = merge_csv(csv_rows, pos_list, "part_of_speech")
        print(merged_csv)

        # TODO write to csv


def convert_to_base_form(lang):
    clear_csv(BASE_FORM_CSV)
    csv_rows = read_csv(PART_OF_SPEECH_CSV)
    pos_dict = group_by_pos(csv_rows)

    # TODO write header

    for part_of_speech, csv_rows in pos_dict.items():
        for chunk in chunks(csv_rows, CHUNK_SIZE):
            if part_of_speech == "noun":
                prompt = create_prompt("base_form_noun", lang, chunk)
                print(prompt)
                base_list_str = mock_chat_completion("base_form_noun")
            else:
                prompt = create_prompt("base_form", lang, chunk, part_of_speech)
                print(prompt)
                base_list_str = mock_chat_completion("base_form")
            # TODO validate response

            base_list = read_csv_str(base_list_str, ["id", "answer"])
            merged_csv = merge_csv(csv_rows, base_list, "answer")

            if part_of_speech == "noun":
                prompt = create_prompt("article", lang, merged_csv)
                article_list_str = mock_chat_completion("article")
                # TODO validate response

                article_list = read_csv_str(article_list_str, ["id", "answer"])
                merged_csv = merge_csv(merged_csv, article_list, "answer")
            print(merged_csv)

            # TODO write to csv


def add_english_definition(lang):
    clear_csv(DEFINITION_CSV)
    csv_rows = read_csv(BASE_FORM_CSV)
    pos_dict = group_by_pos(csv_rows)

    for part_of_speech, csv_rows in pos_dict.items():
        for chunk in chunks(csv_rows, CHUNK_SIZE):
            if part_of_speech == "noun":
                prompt = create_prompt("definition_noun", lang, chunk)
                print(prompt)
                definition_list_str = mock_chat_completion("definition_noun")
            else:
                prompt = create_prompt("definition", lang, chunk, part_of_speech)
                print(prompt)
                definition_list_str = mock_chat_completion("definition")
            # TODO validate response

            definition_list = read_csv_str(definition_list_str, ["id", "definition"])
            merged_csv = merge_csv(csv_rows, definition_list, "definition")
            print(merged_csv)

            # TODO write to csv


if __name__ == "__main__":
    main()

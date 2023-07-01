import argparse

from clients.openai_api_client import mock_chat_completion
from utils.csv_utils import clear_csv, merge_csv, read_csv, read_csv_str
from utils.deck_utils import create_prompt, group_by_pos

SRC_FILE = "./scripts/csv/src.csv"
POS_FILE = "./scripts/csv/pos.csv"
BASE_FILE = "./scripts/csv/base.csv"
DEST_FILE = "./scripts/csv/dest.csv"
CHUNK_SIZE = 200


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("step", choices=["pos", "base", "def"], help="Process step")
    parser.add_argument("lang", choices=["de"], help="Language")

    args = parser.parse_args()
    lang = args.lang

    if args.step == "pos":
        add_part_of_speech(lang)
    elif args.step == "base":
        convert_to_base_form(lang)
    elif args.step == "def":
        add_english_definition(lang)


def add_part_of_speech(lang):
    clear_csv(POS_FILE)
    csv_rows = read_csv(SRC_FILE, ["id", "word"])
    total_rows = len(csv_rows)

    # TODO write header

    for i in range(0, total_rows, CHUNK_SIZE):
        words = csv_rows[i : i + CHUNK_SIZE]
        prompt = create_prompt("part_of_speech", lang, words)
        print(prompt)

        pos_list_str = mock_chat_completion("part_of_speech")
        pos_list = read_csv_str(pos_list_str, ["id", "part_of_speech"])
        print(pos_list)
        # TODO validate response

        merged_csv = merge_csv(csv_rows, pos_list, "part_of_speech")
        print(merged_csv)

        # TODO write to csv


def convert_to_base_form(lang):
    clear_csv(BASE_FILE)
    csv_rows_org = read_csv(POS_FILE, ["id", "word", "part_of_speech"])
    pos_dict = group_by_pos(csv_rows_org)

    # TODO write header

    for pos, csv_rows in pos_dict.items():
        total_rows = len(csv_rows)
        for i in range(0, total_rows, CHUNK_SIZE):
            words = csv_rows[i : i + CHUNK_SIZE]

            if pos == "noun":
                prompt = create_prompt("base_form_noun", lang, words)
                print(prompt)
                base_list_str = mock_chat_completion("base_form_noun")
            else:
                prompt = create_prompt("base_form", lang, words, pos)
                print(prompt)
                base_list_str = mock_chat_completion("base_form")
            # TODO validate response

            base_list = read_csv_str(base_list_str, ["id", "word"])
            print(base_list)

            merged_csv = merge_csv(csv_rows, base_list, "word")

            if pos == "noun":
                prompt = create_prompt("article", lang, merged_csv)
                article_list_str = mock_chat_completion("article")
                article_list = read_csv_str(article_list_str, ["id", "word"])
                merged_csv = merge_csv(merged_csv, article_list, "word")
                # TODO validate response
            print(merged_csv)

            # TODO write to csv


def add_english_definition(lang):
    clear_csv(DEST_FILE)
    csv_rows_org = read_csv(BASE_FILE, ["id", "word", "part_of_speech"])
    pos_dict = group_by_pos(csv_rows_org)

    for pos, csv_rows in pos_dict.items():
        total_rows = len(csv_rows)
        for i in range(0, total_rows, CHUNK_SIZE):
            words = csv_rows[i : i + CHUNK_SIZE]

            if pos == "noun":
                prompt = create_prompt("definition_noun", lang, words)
                print(prompt)
                definition_list_str = mock_chat_completion("definition_noun")
            else:
                prompt = create_prompt("definition", lang, words, pos)
                print(prompt)
                definition_list_str = mock_chat_completion("definition")
            # TODO validate response

            definition_list = read_csv_str(definition_list_str, ["id", "definition"])
            print(definition_list)

            merged_csv = merge_csv(csv_rows, definition_list, "definition")
            print(merged_csv)

            # TODO write to csv


main()

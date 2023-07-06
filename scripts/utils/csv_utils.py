import csv
import io
import logging

from scripts.models.deck_csv import Column, DeckCsv

logger = logging.getLogger(__name__)


def init_csv(csv_file: DeckCsv):
    clear_csv(csv_file)
    append_csv(csv_file, [csv_file.columns])


def clear_csv(csv_file: DeckCsv):
    with open(csv_file.file_path, "w"):
        pass


def append_csv(csv_file: DeckCsv, data: list[list[str]]):
    with open(csv_file.file_path, "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerows(data)


def read_csv(csv_file: DeckCsv, remove_header=False) -> list[dict]:
    csv_rows = []
    try:
        with open(csv_file.file_path, "r") as f:
            csv_reader = csv.DictReader(f, fieldnames=csv_file.columns)
            csv_rows = list(csv_reader)
    except FileNotFoundError:
        logger.error(f"file not found: {csv_file.file_path}")
    if remove_header:
        csv_rows.pop(0)
    return csv_rows


def read_csv_str(csv_str: str, fieldnames: list[str]) -> list[dict]:
    csv_file = io.StringIO(csv_str)
    csv_reader = csv.DictReader(csv_file, fieldnames=fieldnames)
    return list(csv_reader)


def merge_csv_data(src_data: list[dict], add_data: list[dict], key: str) -> list[dict]:
    for src_row in src_data:
        for add_row in add_data:
            if src_row[Column.ID.value] == add_row[Column.ID.value]:
                src_row[key] = add_row[key]
                break
    return src_data


def convert_to_list(csv_rows: list[dict], columns: list[str]) -> list[list[str]]:
    converted_data = [[row[column] for column in columns] for row in csv_rows]
    return converted_data

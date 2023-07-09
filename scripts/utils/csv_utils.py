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
        writer = csv.writer(f, quoting=csv.QUOTE_ALL, escapechar='"')
        writer.writerows(data)


def read_csv(csv_file: DeckCsv, remove_header=False) -> list[dict]:
    csv_rows = []
    try:
        with open(csv_file.file_path, "r") as f:
            csv_reader = csv.DictReader(
                f, fieldnames=[column.value for column in csv_file.columns]
            )
            csv_rows = list(csv_reader)
    except FileNotFoundError:
        logger.error(f"file not found: {csv_file.file_path}")
    if remove_header:
        csv_rows.pop(0)
    return csv_rows


def read_csv_str(csv_str: str, columns: list[Column]) -> list[dict]:
    csv_file = io.StringIO(csv_str)
    csv_reader = csv.DictReader(
        csv_file, fieldnames=[column.value for column in columns]
    )
    csv_list = []
    for row in csv_reader:
        invalid = False
        for key, value in row.items():
            if key is None or value is None:
                invalid = True
                break
        if invalid:
            logger.error(f"invalid csv row: {row}")
            continue
        row = {key.strip(): value.strip() for key, value in row.items()}
        csv_list.append(row)
    return csv_list


def merge_csv_data(
    src_data: list[dict], add_data: list[dict], merge_column: Column
) -> list[dict]:
    for src_row in src_data:
        for add_row in add_data:
            if src_row[Column.ID.value] == add_row[Column.ID.value]:
                src_row[merge_column.value] = add_row[merge_column.value]
                break
    return src_data


def convert_to_list(csv_rows: list[dict], columns: list[Column]) -> list[list[str]]:
    converted_data = [[row[column.value] for column in columns] for row in csv_rows]
    return converted_data

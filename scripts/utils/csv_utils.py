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


def read_csv(csv_file: DeckCsv, remove_header: bool = False) -> list[dict]:
    csv_rows = []
    try:
        with open(csv_file.file_path, "r") as f:
            csv_reader = csv.DictReader(
                f, fieldnames=[column.value for column in csv_file.columns]
            )
            csv_rows = list(csv_reader)
    except FileNotFoundError:
        logger.error(f"file not found: {csv_file.file_path}")
        return csv_rows
    if remove_header:
        csv_rows.pop(0)
    return csv_rows


def read_csv_str(
    csv_str: str, columns: list[Column], src_csv_rows: list[dict]
) -> list[dict] | None:
    csv_rows_from_str = _get_csv_rows_from_str(csv_str, columns)
    if _validate_csv_rows(src_csv_rows, csv_rows_from_str):
        return csv_rows_from_str
    return None


def _get_csv_rows_from_str(csv_str: str, columns: list[Column]) -> list[dict]:
    csv_file = io.StringIO(csv_str)
    csv_reader = csv.DictReader(
        csv_file, fieldnames=[column.value for column in columns]
    )
    csv_rows = []
    for row in csv_reader:
        if not all([key and value for key, value in row.items()]):
            logger.error(f"invalid csv row: {row}")
            continue
        row = {key.strip(): value.strip() for key, value in row.items()}
        csv_rows.append(row)
    return csv_rows


def _validate_csv_rows(src_csv_rows: list[dict], csv_rows_from_str: list[dict]) -> bool:
    src_ids = {row[Column.ID.value] for row in src_csv_rows}
    str_ids = {row[Column.ID.value] for row in csv_rows_from_str}
    if src_ids != str_ids:
        logger.error(f"ids are not the same: {src_ids} != {str_ids}")
        return False
    return True


def merge_csv_data(
    src_csv_rows: list[dict], add_csv_rows: list[dict], merge_column: Column
) -> list[dict]:
    merged_csv_rows = []
    for src_row in src_csv_rows:
        for add_row in add_csv_rows:
            if src_row[Column.ID.value] == add_row[Column.ID.value]:
                merged_row = src_row.copy()
                merged_row[merge_column.value] = add_row[merge_column.value]
                merged_csv_rows.append(merged_row)
                break
    return merged_csv_rows


def append_csv_rows(csv_file: DeckCsv, csv_rows: list[dict]):
    list_data = _convert_to_list(csv_rows, csv_file.columns)
    append_csv(csv_file, list_data)


def _convert_to_list(csv_rows: list[dict], columns: list[Column]) -> list[list[str]]:
    converted_data = [[row[column.value] for column in columns] for row in csv_rows]
    return converted_data

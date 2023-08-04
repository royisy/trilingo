import pytest

from scripts.models.deck_csv import Column
from scripts.utils.csv_utils import (
    _convert_to_list,
    _get_csv_rows_from_str,
    _validate_csv_rows,
    merge_csv_data,
    read_csv_str,
)


@pytest.mark.parametrize(
    "csv_str, expected",
    [
        (
            "1,pos 1\n2,pos 2\n",
            [
                {"id": "1", "part_of_speech": "pos 1"},
                {"id": "2", "part_of_speech": "pos 2"},
            ],
        ),
        ("1,pos 1\n", None),
    ],
)
def test_read_csv_str(csv_str, expected):
    columns = [Column.ID, Column.PART_OF_SPEECH]
    src_csv_rows = [
        {"id": "1", "answer": "answer 1"},
        {"id": "2", "answer": "answer 2"},
    ]
    assert read_csv_str(csv_str, columns, src_csv_rows) == expected


@pytest.mark.parametrize(
    "csv_str, expected",
    [
        (
            # check if spaces are trimmed
            " 1 , answer 1 \n  2  ,  answer 2  ",
            [
                {"id": "1", "answer": "answer 1"},
                {"id": "2", "answer": "answer 2"},
            ],
        ),
        (
            "1,answer 1\n2,pos 2, answer 2\n3",
            [
                {"id": "1", "answer": "answer 1"},
            ],
        ),
    ],
)
def test_get_csv_rows_from_str(csv_str, expected):
    columns = [Column.ID, Column.ANSWER]
    result = _get_csv_rows_from_str(csv_str, columns)
    assert result == expected


@pytest.mark.parametrize(
    "csv_rows_from_str, expected",
    [
        (
            [
                {"id": "1", "part_of_speech": "pos 1"},
                {"id": "2", "part_of_speech": "pos 2"},
            ],
            True,
        ),
        (
            [
                {"id": "1", "part_of_speech": "pos 1"},
            ],
            False,
        ),
        (
            [
                {"id": "1", "part_of_speech": "pos 1"},
                {"id": "2", "part_of_speech": "pos 2"},
                {"id": "3", "part_of_speech": "pos 3"},
            ],
            False,
        ),
    ],
)
def test_validate_csv_rows(csv_rows_from_str, expected):
    src_csv_rows = [
        {"id": "1", "answer": "answer 1"},
        {"id": "2", "answer": "answer 2"},
    ]
    assert _validate_csv_rows(src_csv_rows, csv_rows_from_str) == expected


def test_merge_csv_data():
    src_csv_rows = [
        {"id": "1", "answer": "answer 1"},
        {"id": "2", "answer": "answer 2"},
        {"id": "3", "answer": "answer 3"},
    ]
    add_csv_rows = [
        {"id": "1", "part_of_speech": "pos 1"},
        {"id": "3", "part_of_speech": "pos 3"},
    ]
    result = merge_csv_data(src_csv_rows, add_csv_rows, Column.PART_OF_SPEECH)
    expected = [
        {"id": "1", "answer": "answer 1", "part_of_speech": "pos 1"},
        {"id": "3", "answer": "answer 3", "part_of_speech": "pos 3"},
    ]
    assert result == expected


def test_convert_to_list():
    csv_rows = [
        {"id": "1", "part_of_speech": "pos 1", "answer": "answer 1"},
        {"id": "2", "part_of_speech": "pos 2", "answer": "answer 2"},
    ]
    columns = [Column.ID, Column.ANSWER]
    result = _convert_to_list(csv_rows, columns)
    expected = [["1", "answer 1"], ["2", "answer 2"]]
    assert result == expected

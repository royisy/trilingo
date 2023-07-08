import pytest

from scripts.utils.csv_utils import convert_to_list, merge_csv_data, read_csv_str


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
def test_read_csv_str(csv_str, expected):
    columns = ["id", "answer"]
    result = read_csv_str(csv_str, columns)
    assert result == expected


def test_merge_csv():
    src_data = [
        {"id": "1", "answer": "answer 1"},
        {"id": "2", "answer": "answer 2"},
    ]
    add_data = [
        {"id": "1", "part_of_speech": "pos 1"},
        {"id": "2", "part_of_speech": "pos 2"},
    ]
    result = merge_csv_data(src_data, add_data, "part_of_speech")
    expected = [
        {"id": "1", "answer": "answer 1", "part_of_speech": "pos 1"},
        {"id": "2", "answer": "answer 2", "part_of_speech": "pos 2"},
    ]
    assert result == expected


def test_convert_to_list():
    csv_rows = [
        {"id": "1", "part_of_speech": "pos 1", "answer": "answer 1"},
        {"id": "2", "part_of_speech": "pos 2", "answer": "answer 2"},
    ]
    columns = ["id", "answer"]
    result = convert_to_list(csv_rows, columns)
    expected = [["1", "answer 1"], ["2", "answer 2"]]
    assert result == expected

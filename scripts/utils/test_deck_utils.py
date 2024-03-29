from unittest.mock import MagicMock, patch

import pytest

from scripts.models.deck_csv import SOURCE_CSV, Column
from scripts.models.language import Language
from scripts.utils.deck_utils import (
    check_definition_length,
    chunks,
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


def test_group_by_pos():
    csv_rows = [
        {"id": "2", "part_of_speech": "pos 2", "answer": "answer 2"},
        {"id": "1", "part_of_speech": "pos 1", "answer": "answer 1"},
        {"id": "4", "part_of_speech": "pos 2", "answer": "answer 4"},
        {"id": "3", "part_of_speech": "pos 1", "answer": "answer 3"},
    ]
    result = group_by_pos(csv_rows)
    assert list(result.keys()) == ["pos 1", "pos 2"]
    assert result == {
        "pos 1": [
            {"id": "1", "part_of_speech": "pos 1", "answer": "answer 1"},
            {"id": "3", "part_of_speech": "pos 1", "answer": "answer 3"},
        ],
        "pos 2": [
            {"id": "2", "part_of_speech": "pos 2", "answer": "answer 2"},
            {"id": "4", "part_of_speech": "pos 2", "answer": "answer 4"},
        ],
    }


def test_parts_of_speech():
    pos_dict = {
        "noun": [
            {"id": "1", "part_of_speech": "noun", "answer": "answer 1"},
            {"id": "2", "part_of_speech": "noun", "answer": "answer 2"},
        ],
        "other": [
            {"id": "3", "part_of_speech": "other", "answer": "answer 3"},
        ],
        "verb": [
            {"id": "4", "part_of_speech": "verb", "answer": "answer 4"},
        ],
    }
    generator = parts_of_speech(pos_dict)
    expected = [
        (
            "noun",
            [
                {"id": "1", "part_of_speech": "noun", "answer": "answer 1"},
                {"id": "2", "part_of_speech": "noun", "answer": "answer 2"},
            ],
        ),
        (
            "verb",
            [
                {"id": "4", "part_of_speech": "verb", "answer": "answer 4"},
            ],
        ),
    ]
    for i, value in enumerate(generator):
        assert value == expected[i]


def test_chunks():
    data = [
        {"id": "1", "part_of_speech": "noun", "answer": "answer 1"},
        {"id": "2", "part_of_speech": "noun", "answer": "answer 2"},
        {"id": "3", "part_of_speech": "verb", "answer": "answer 3"},
    ]
    chunk_size = 2
    generator = chunks(data, chunk_size)
    expected = [
        [
            {"id": "1", "part_of_speech": "noun", "answer": "answer 1"},
            {"id": "2", "part_of_speech": "noun", "answer": "answer 2"},
        ],
        [
            {"id": "3", "part_of_speech": "verb", "answer": "answer 3"},
        ],
    ]
    for i, value in enumerate(generator):
        assert value == expected[i]


@pytest.mark.parametrize(
    "csv_str, expected",
    [
        (
            None,
            None,
        ),
        (
            "1,pos 1\n2,pos 2\n",
            [
                {"id": "1", "part_of_speech": "pos 1"},
                {"id": "2", "part_of_speech": "pos 2"},
            ],
        ),
        (
            "2,pos 2\n",
            None,
        ),
    ],
)
@patch("scripts.utils.deck_utils.append_error_csv_rows")
@patch("scripts.utils.deck_utils.chat_completion")
def test_get_data_from_chat_gpt(
    mock_chat_completion: MagicMock,
    mock_append_error_csv_rows: MagicMock,
    csv_str,
    expected,
):
    mock_chat_completion.return_value = (csv_str, 1)

    prompt = "test prompt"
    columns = [Column.ID, Column.PART_OF_SPEECH]
    csv_rows = [
        {"id": "1", "answer": "answer 1"},
        {"id": "2", "answer": "answer 2"},
    ]

    data, tokens = get_data_from_chat_gpt(prompt, columns, csv_rows, SOURCE_CSV)

    assert data == expected
    if data is None:
        mock_append_error_csv_rows.assert_called_once()
    else:
        mock_append_error_csv_rows.assert_not_called()
    assert tokens == 1


def test_remove_invalid_part_of_speech():
    csv_rows = [
        {"id": "1", "part_of_speech": "noun", "answer": "answer 1"},
        {"id": "2", "part_of_speech": "other", "answer": "answer 2"},
        {"id": "3", "part_of_speech": "invalid", "answer": "answer 3"},
    ]
    result = remove_invalid_part_of_speech(csv_rows, Language.GERMAN)
    assert result == [
        {"id": "1", "part_of_speech": "noun", "answer": "answer 1"},
        {"id": "2", "part_of_speech": "other", "answer": "answer 2"},
    ]


def test_lowercase_article():
    csv_rows = [
        {"id": "1", "part_of_speech": "noun", "answer": "Der Der Mann"},
        {"id": "2", "part_of_speech": "noun", "answer": "DIE Frau"},
        {"id": "3", "part_of_speech": "noun", "answer": "The kid"},
    ]
    result = lowercase_article(csv_rows, Language.GERMAN)
    assert result == [
        {"id": "1", "part_of_speech": "noun", "answer": "der Der Mann"},
        {"id": "2", "part_of_speech": "noun", "answer": "die Frau"},
        {"id": "3", "part_of_speech": "noun", "answer": "The kid"},
    ]


def test_lowercase_word():
    csv_rows = [
        {"id": "1", "part_of_speech": "noun", "answer": "ANSWER 1"},
        {"id": "2", "part_of_speech": "verb", "answer": "ANSWER 2"},
    ]
    result = lowercase_word(csv_rows)
    assert result == [
        {"id": "1", "part_of_speech": "noun", "answer": "answer 1"},
        {"id": "2", "part_of_speech": "verb", "answer": "answer 2"},
    ]


def test_remove_duplicated_answers():
    csv_rows = [
        {"id": "3", "part_of_speech": "noun", "answer": "answer 1"},
        {"id": "1", "part_of_speech": "noun", "answer": "answer 1"},
        {"id": "2", "part_of_speech": "noun", "answer": "answer 2"},
        {"id": "4", "part_of_speech": "verb", "answer": "answer 1"},
    ]
    result = remove_duplicated_answers(csv_rows)
    assert result == [
        {"id": "1", "part_of_speech": "noun", "answer": "answer 1"},
        {"id": "2", "part_of_speech": "noun", "answer": "answer 2"},
        {"id": "4", "part_of_speech": "verb", "answer": "answer 1"},
    ]


def test_sort_by_answer():
    csv_rows = [
        {"id": "4", "part_of_speech": "noun", "answer": "ANSWER 3"},
        {"id": "5", "part_of_speech": "noun", "answer": "answer 2"},
        {"id": "10", "part_of_speech": "noun", "answer": "answer 1"},
        {"id": "1", "part_of_speech": "noun", "answer": "answer 1"},
        {"id": "2", "part_of_speech": "noun", "answer": "answer 1"},
    ]
    result = sort_by_answer(csv_rows)
    assert result == [
        {"id": "1", "part_of_speech": "noun", "answer": "answer 1"},
        {"id": "2", "part_of_speech": "noun", "answer": "answer 1"},
        {"id": "10", "part_of_speech": "noun", "answer": "answer 1"},
        {"id": "5", "part_of_speech": "noun", "answer": "answer 2"},
        {"id": "4", "part_of_speech": "noun", "answer": "ANSWER 3"},
    ]


def test_sort_by_id():
    csv_rows = [
        {"id": "2", "part_of_speech": "noun", "answer": "answer 2"},
        {"id": "3", "part_of_speech": "noun", "answer": "answer 3"},
        {"id": "10", "part_of_speech": "verb", "answer": "answer 10"},
        {"id": "1", "part_of_speech": "verb", "answer": "answer 1"},
    ]
    result = sort_by_id(csv_rows)
    assert result == [
        {"id": "1", "part_of_speech": "verb", "answer": "answer 1"},
        {"id": "2", "part_of_speech": "noun", "answer": "answer 2"},
        {"id": "3", "part_of_speech": "noun", "answer": "answer 3"},
        {"id": "10", "part_of_speech": "verb", "answer": "answer 10"},
    ]


def test_get_duplicated_definitions():
    csv_rows = [
        {
            "id": "1",
            "part_of_speech": "noun",
            "definition": "definition 1",
            "answer": "answer 1",
        },
        {
            "id": "2",
            "part_of_speech": "verb",
            "definition": "definition 1",
            "answer": "answer 2",
        },
        {
            "id": "3",
            "part_of_speech": "noun",
            "definition": "definition 1",
            "answer": "answer 3",
        },
        {
            "id": "4",
            "part_of_speech": "verb",
            "definition": "definition 4",
            "answer": "answer 4",
        },
        {
            "id": "5",
            "part_of_speech": "verb",
            "definition": "definition 5",
            "answer": "answer 5",
        },
        {
            "id": "6",
            "part_of_speech": "verb",
            "definition": "definition 4",
            "answer": "answer 6",
        },
    ]
    duplicates, non_duplicates = get_duplicated_definitions(csv_rows)
    assert duplicates == [
        {
            "id": "1",
            "part_of_speech": "noun",
            "definition": "definition 1",
            "answer": "answer 1",
        },
        {
            "id": "3",
            "part_of_speech": "noun",
            "definition": "definition 1",
            "answer": "answer 3",
        },
        {
            "id": "4",
            "part_of_speech": "verb",
            "definition": "definition 4",
            "answer": "answer 4",
        },
        {
            "id": "6",
            "part_of_speech": "verb",
            "definition": "definition 4",
            "answer": "answer 6",
        },
    ]
    assert non_duplicates == [
        {
            "id": "2",
            "part_of_speech": "verb",
            "definition": "definition 1",
            "answer": "answer 2",
        },
        {
            "id": "5",
            "part_of_speech": "verb",
            "definition": "definition 5",
            "answer": "answer 5",
        },
    ]


def test_check_definition_length(caplog):
    csv_rows = [
        {
            "id": "1",
            "part_of_speech": "noun",
            "definition": "123456789012345678901234567890",
            "answer": "answer 1",
        },
        {
            "id": "2",
            "part_of_speech": "noun",
            "definition": "1234567890123456789012345678901",
            "answer": "answer 2",
        },
        {
            "id": "3",
            "part_of_speech": "noun",
            "definition": "1234567890123456789012345678901",
            "answer": "answer 3",
        },
    ]
    check_definition_length(csv_rows)
    assert len(caplog.record_tuples) == 2


@pytest.mark.parametrize(
    "csv_row, expected",
    [
        (
            {
                "id": "1",
                "part_of_speech": "adjective",
                "definition": "definition 1",
                "answer": "answer 1",
            },
            {
                "id": "2",
                "part_of_speech": "adj.",
                "definition": "definition 1",
                "answer": "answer 1",
            },
        ),
        (
            {
                "id": "1",
                "part_of_speech": "adj.",
                "definition": "definition 1",
                "answer": "answer 1",
            },
            {
                "id": "2",
                "part_of_speech": "adj.",
                "definition": "definition 1",
                "answer": "answer 1",
            },
        ),
    ],
)
def test_convert_pos(csv_row, expected):
    index = 1
    result = update_values(csv_row, index)
    assert result == expected

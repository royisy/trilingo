from scripts.models.language import Language
from scripts.utils.deck_utils import (
    chunks,
    group_by_pos,
    lowercase_words,
    parts_of_speech,
    remove_invalid_part_of_speech,
)


def test_group_by_pos():
    csv_rows = [
        {"id": "1", "part_of_speech": "pos 1", "answer": "answer 1"},
        {"id": "2", "part_of_speech": "pos 2", "answer": "answer 2"},
        {"id": "3", "part_of_speech": "pos 1", "answer": "answer 3"},
        {"id": "4", "part_of_speech": "pos 2", "answer": "answer 4"},
    ]
    result = group_by_pos(csv_rows)
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
        "verb": [
            {"id": "3", "part_of_speech": "verb", "answer": "answer 3"},
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
                {"id": "3", "part_of_speech": "verb", "answer": "answer 3"},
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


def test_filter_invalid_part_of_speech():
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


def test_lowercase_words():
    csv_rows = [
        {"id": "1", "part_of_speech": "noun", "answer": "ANSWER 1"},
        {"id": "2", "part_of_speech": "verb", "answer": "ANSWER 2"},
    ]
    result = lowercase_words(csv_rows)
    assert result == [
        {"id": "1", "part_of_speech": "noun", "answer": "answer 1"},
        {"id": "2", "part_of_speech": "verb", "answer": "answer 2"},
    ]

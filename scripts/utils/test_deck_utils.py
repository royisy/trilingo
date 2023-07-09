from scripts.utils.deck_utils import group_by_pos, remove_invalid_part_of_speech


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


def test_filter_invalid_part_of_speech():
    csv_rows = [
        {"id": "1", "part_of_speech": "noun", "answer": "answer 1"},
        {"id": "2", "part_of_speech": "unknown", "answer": "answer 2"},
        {"id": "3", "part_of_speech": "error", "answer": "answer 3"},
    ]
    result = remove_invalid_part_of_speech(csv_rows, "de")
    assert result == [
        {"id": "1", "part_of_speech": "noun", "answer": "answer 1"},
        {"id": "2", "part_of_speech": "unknown", "answer": "answer 2"},
    ]

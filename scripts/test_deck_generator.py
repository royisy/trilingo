from unittest.mock import MagicMock, call, patch

from scripts.deck_generator import (
    BASE_FORM_CSV,
    DEFINITION_CSV,
    PART_OF_SPEECH_CSV,
    _add_definition,
    _add_part_of_speech,
    _convert_to_base_form,
)


@patch("scripts.deck_generator.append_csv")
@patch("scripts.deck_generator.chat_completion")
@patch("scripts.deck_generator.read_csv")
@patch("scripts.deck_generator.init_csv")
def test_add_part_of_speech(
    mock_init_csv: MagicMock,
    mock_read_csv: MagicMock,
    mock_chat_completion: MagicMock,
    mock_append_csv: MagicMock,
):
    mock_read_csv.return_value = [
        {"id": "1", "answer": "word 1"},
        {"id": "2", "answer": "word 2"},
        {"id": "3", "answer": "word 3"},
        {"id": "4", "answer": "word 4"},
    ]
    mock_chat_completion.return_value = ("1,pos 1\n2,pos 2\n3,pos 3\n4,pos 4\n", 1)

    total_tokens = _add_part_of_speech("de")

    assert total_tokens == 1
    mock_init_csv.assert_called_once()
    mock_append_csv.assert_called_once_with(
        PART_OF_SPEECH_CSV,
        [
            ["1", "pos 1", "word 1"],
            ["2", "pos 2", "word 2"],
            ["3", "pos 3", "word 3"],
            ["4", "pos 4", "word 4"],
        ],
    )


@patch("scripts.deck_generator.append_csv")
@patch("scripts.deck_generator.chat_completion")
@patch("scripts.deck_generator.create_prompt")
@patch("scripts.deck_generator.read_csv")
@patch("scripts.deck_generator.init_csv")
def test_convert_to_base_form(
    mock_init_csv: MagicMock,
    mock_read_csv: MagicMock,
    mock_create_prompt: MagicMock,
    mock_chat_completion: MagicMock,
    mock_append_csv: MagicMock,
):
    mock_read_csv.return_value = [
        {"id": "1", "part_of_speech": "noun", "answer": "word 1"},
        {"id": "2", "part_of_speech": "verb", "answer": "word 2"},
        {"id": "3", "part_of_speech": "noun", "answer": "word 3"},
        {"id": "4", "part_of_speech": "verb", "answer": "word 4"},
    ]
    mock_create_prompt.side_effect = [
        "base_form_noun prompt",
        "base_form prompt 1",
        "base_form prompt 2",
    ]
    mock_chat_completion.side_effect = [
        ("1,base noun 1\n3,base noun 3\n", 1),
        ("1,article base noun 1\n3,article base noun 3\n", 1),
        ("2,base verb 2\n4,base verb 4\n", 1),
    ]

    total_tokens = _convert_to_base_form("de")

    assert total_tokens == 3
    mock_init_csv.assert_called_once()
    assert mock_chat_completion.call_args_list == [
        call("base_form_noun prompt"),
        call("base_form prompt 1"),
        call("base_form prompt 2"),
    ]
    assert mock_append_csv.call_args_list == [
        call(
            BASE_FORM_CSV,
            [
                ["1", "noun", "article base noun 1"],
                ["3", "noun", "article base noun 3"],
            ],
        ),
        call(
            BASE_FORM_CSV,
            [
                ["2", "verb", "base verb 2"],
                ["4", "verb", "base verb 4"],
            ],
        ),
    ]


@patch("scripts.deck_generator.append_csv")
@patch("scripts.deck_generator.chat_completion")
@patch("scripts.deck_generator.create_prompt")
@patch("scripts.deck_generator.read_csv")
@patch("scripts.deck_generator.init_csv")
def test_add_definition(
    mock_init_csv: MagicMock,
    mock_read_csv: MagicMock,
    mock_create_prompt: MagicMock,
    mock_chat_completion: MagicMock,
    mock_append_csv: MagicMock,
):
    mock_read_csv.return_value = [
        {"id": "1", "part_of_speech": "noun", "answer": "word 1"},
        {"id": "2", "part_of_speech": "verb", "answer": "word 2"},
        {"id": "3", "part_of_speech": "noun", "answer": "word 3"},
        {"id": "4", "part_of_speech": "verb", "answer": "word 4"},
    ]
    mock_create_prompt.side_effect = [
        "definition_noun prompt",
        "definition prompt",
    ]
    mock_chat_completion.side_effect = [
        ("1,definition 1\n3,definition 3\n", 1),
        ("2,definition 2\n4,definition 4\n", 1),
    ]

    total_tokens = _add_definition("de")

    assert total_tokens == 2
    mock_init_csv.assert_called_once()
    assert mock_chat_completion.call_args_list == [
        call("definition_noun prompt"),
        call("definition prompt"),
    ]
    assert mock_append_csv.call_args_list == [
        call(
            DEFINITION_CSV,
            [
                ["1", "noun", "definition 1", "word 1"],
                ["3", "noun", "definition 3", "word 3"],
            ],
        ),
        call(
            DEFINITION_CSV,
            [
                ["2", "verb", "definition 2", "word 2"],
                ["4", "verb", "definition 4", "word 4"],
            ],
        ),
    ]

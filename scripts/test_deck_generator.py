from unittest.mock import MagicMock, call, patch

from scripts.deck_generator import (
    BASE_FORM_CSV,
    DEFINITION_CSV,
    PART_OF_SPEECH_CSV,
    _add_definition,
    _add_part_of_speech,
    _convert_to_base_form,
    _finalize,
    _remove_duplicated_answers,
    _remove_duplicated_definitions,
)
from scripts.models.deck_csv import (
    DUP_ANSWER_CSV,
    DUP_DEFINITION_CSV,
    FINALIZE_CSV,
    OLD_DUP_DEFINITION_CSV,
    Column,
)
from scripts.models.language import Language

CHUNK_SIZE = 10


@patch("scripts.deck_generator.append_csv_rows")
@patch("scripts.deck_generator.chat_completion")
@patch("scripts.deck_generator.read_csv")
@patch("scripts.deck_generator.init_csv")
def test_add_part_of_speech(
    mock_init_csv: MagicMock,
    mock_read_csv: MagicMock,
    mock_chat_completion: MagicMock,
    mock_append_csv_rows: MagicMock,
):
    mock_read_csv.return_value = [
        {"id": "1", "answer": "word 1"},
        {"id": "2", "answer": "word 2"},
        {"id": "3", "answer": "word 3"},
        {"id": "4", "answer": "word 4"},
    ]
    mock_chat_completion.return_value = ("1,noun\n2,verb\n3,adjective\n4,adverb\n", 1)

    total_tokens = _add_part_of_speech(CHUNK_SIZE, Language.GERMAN)

    assert total_tokens == 1
    mock_init_csv.assert_called_once()
    mock_append_csv_rows.assert_called_once_with(
        PART_OF_SPEECH_CSV,
        [
            {"id": "1", "part_of_speech": "noun", "answer": "word 1"},
            {"id": "2", "part_of_speech": "verb", "answer": "word 2"},
            {"id": "3", "part_of_speech": "adjective", "answer": "word 3"},
            {"id": "4", "part_of_speech": "adverb", "answer": "word 4"},
        ],
    )


@patch("scripts.deck_generator.append_csv_rows")
@patch("scripts.deck_generator.chat_completion")
@patch("scripts.deck_generator.create_prompt")
@patch("scripts.deck_generator.read_csv")
@patch("scripts.deck_generator.init_csv")
def test_convert_to_base_form(
    mock_init_csv: MagicMock,
    mock_read_csv: MagicMock,
    mock_create_prompt: MagicMock,
    mock_chat_completion: MagicMock,
    mock_append_csv_rows: MagicMock,
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

    total_tokens = _convert_to_base_form(CHUNK_SIZE, Language.GERMAN)

    assert total_tokens == 3
    mock_init_csv.assert_called_once()
    assert mock_chat_completion.call_args_list == [
        call("base_form_noun prompt"),
        call("base_form prompt 1"),
        call("base_form prompt 2"),
    ]
    assert mock_append_csv_rows.call_args_list == [
        call(
            BASE_FORM_CSV,
            [
                {"id": "1", "part_of_speech": "noun", "answer": "article base noun 1"},
                {"id": "3", "part_of_speech": "noun", "answer": "article base noun 3"},
            ],
        ),
        call(
            BASE_FORM_CSV,
            [
                {"id": "2", "part_of_speech": "verb", "answer": "base verb 2"},
                {"id": "4", "part_of_speech": "verb", "answer": "base verb 4"},
            ],
        ),
    ]


@patch("scripts.deck_generator.append_csv_rows")
@patch("scripts.deck_generator.read_csv")
@patch("scripts.deck_generator.init_csv")
def test_remove_duplicated_answers(
    mock_init_csv: MagicMock,
    mock_read_csv: MagicMock,
    mock_append_csv_rows: MagicMock,
):
    mock_read_csv.return_value = [
        {"id": "1", "part_of_speech": "noun", "answer": "word 1"},
        {"id": "2", "part_of_speech": "verb", "answer": "word 2"},
        {"id": "3", "part_of_speech": "noun", "answer": "word 1"},
        {"id": "4", "part_of_speech": "verb", "answer": "word 2"},
        {"id": "5", "part_of_speech": "noun", "answer": "word 3"},
    ]

    _remove_duplicated_answers()

    mock_init_csv.assert_called_once()
    assert mock_append_csv_rows.call_args_list == [
        call(
            DUP_ANSWER_CSV,
            [
                {"id": "1", "part_of_speech": "noun", "answer": "word 1"},
                {"id": "5", "part_of_speech": "noun", "answer": "word 3"},
            ],
        ),
        call(
            DUP_ANSWER_CSV,
            [
                {"id": "2", "part_of_speech": "verb", "answer": "word 2"},
            ],
        ),
    ]


@patch("scripts.deck_generator.append_csv_rows")
@patch("scripts.deck_generator.chat_completion")
@patch("scripts.deck_generator.create_prompt")
@patch("scripts.deck_generator.read_csv")
@patch("scripts.deck_generator.init_csv")
def test_add_definition(
    mock_init_csv: MagicMock,
    mock_read_csv: MagicMock,
    mock_create_prompt: MagicMock,
    mock_chat_completion: MagicMock,
    mock_append_csv_rows: MagicMock,
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

    total_tokens = _add_definition(CHUNK_SIZE, Language.GERMAN)

    assert total_tokens == 2
    mock_init_csv.assert_called_once()
    assert mock_chat_completion.call_args_list == [
        call("definition_noun prompt"),
        call("definition prompt"),
    ]
    assert mock_append_csv_rows.call_args_list == [
        call(
            DEFINITION_CSV,
            [
                {
                    "id": "1",
                    "part_of_speech": "noun",
                    "definition": "definition 1",
                    "answer": "word 1",
                },
                {
                    "id": "3",
                    "part_of_speech": "noun",
                    "definition": "definition 3",
                    "answer": "word 3",
                },
            ],
        ),
        call(
            DEFINITION_CSV,
            [
                {
                    "id": "2",
                    "part_of_speech": "verb",
                    "definition": "definition 2",
                    "answer": "word 2",
                },
                {
                    "id": "4",
                    "part_of_speech": "verb",
                    "definition": "definition 4",
                    "answer": "word 4",
                },
            ],
        ),
    ]


@patch("scripts.deck_generator.chat_completion")
@patch("scripts.deck_generator.create_prompt")
@patch("scripts.deck_generator.append_csv_rows")
@patch("scripts.deck_generator.read_csv")
@patch("scripts.deck_generator.init_csv")
def test_remove_duplicated_definitions(
    mock_init_csv: MagicMock,
    mock_read_csv: MagicMock,
    mock_append_csv_rows: MagicMock,
    mock_create_prompt: MagicMock,
    mock_chat_completion: MagicMock,
):
    mock_read_csv.return_value = [
        {
            "id": "1",
            "part_of_speech": "noun",
            "definition": "definition 1",
            "answer": "word 1",
        },
        {
            "id": "2",
            "part_of_speech": "verb",
            "definition": "definition 2",
            "answer": "word 2",
        },
        {
            "id": "3",
            "part_of_speech": "noun",
            "definition": "definition 1",
            "answer": "word 3",
        },
        {
            "id": "4",
            "part_of_speech": "verb",
            "definition": "definition 2",
            "answer": "word 4",
        },
        {
            "id": "5",
            "part_of_speech": "noun",
            "definition": "definition 5",
            "answer": "word 5",
        },
    ]
    mock_create_prompt.return_value = "de_duplicated_definition prompt"
    mock_chat_completion.side_effect = [
        ("1,answer 1,detailed definition 1\n3,answer 3,detailed definition 3\n", 1),
        ("2,answer 2,detailed definition 2\n4,answer 4,detailed definition 4\n", 1),
    ]

    total_tokens = _remove_duplicated_definitions(CHUNK_SIZE, Language.GERMAN)

    assert total_tokens == 2
    assert mock_init_csv.call_count == 2
    assert len(mock_append_csv_rows.call_args_list) == 4
    assert mock_append_csv_rows.call_args_list == [
        call(
            OLD_DUP_DEFINITION_CSV,
            [
                {
                    "id": "1",
                    "part_of_speech": "noun",
                    "definition": "definition 1",
                    "answer": "word 1",
                },
                {
                    "id": "2",
                    "part_of_speech": "verb",
                    "definition": "definition 2",
                    "answer": "word 2",
                },
                {
                    "id": "3",
                    "part_of_speech": "noun",
                    "definition": "definition 1",
                    "answer": "word 3",
                },
                {
                    "id": "4",
                    "part_of_speech": "verb",
                    "definition": "definition 2",
                    "answer": "word 4",
                },
                {
                    "id": "5",
                    "part_of_speech": "noun",
                    "definition": "definition 5",
                    "answer": "word 5",
                },
            ],
        ),
        call(
            DUP_DEFINITION_CSV,
            [
                {
                    "id": "5",
                    "part_of_speech": "noun",
                    "definition": "definition 5",
                    "answer": "word 5",
                }
            ],
        ),
        call(
            DUP_DEFINITION_CSV,
            [
                {
                    "id": "1",
                    "part_of_speech": "noun",
                    "definition": "detailed definition 1",
                    "answer": "word 1",
                },
                {
                    "id": "3",
                    "part_of_speech": "noun",
                    "definition": "detailed definition 3",
                    "answer": "word 3",
                },
            ],
        ),
        call(
            DUP_DEFINITION_CSV,
            [
                {
                    "id": "2",
                    "part_of_speech": "verb",
                    "definition": "detailed definition 2",
                    "answer": "word 2",
                },
                {
                    "id": "4",
                    "part_of_speech": "verb",
                    "definition": "detailed definition 4",
                    "answer": "word 4",
                },
            ],
        ),
    ]
    assert mock_create_prompt.call_args_list == [
        call(
            "duplicated_definition",
            Language.GERMAN,
            [
                {
                    "id": "1",
                    "part_of_speech": "noun",
                    "definition": "definition 1",
                    "answer": "word 1",
                },
                {
                    "id": "3",
                    "part_of_speech": "noun",
                    "definition": "definition 1",
                    "answer": "word 3",
                },
            ],
            words_columns=[Column.ID, Column.ANSWER, Column.DEFINITION],
            part_of_speech="noun",
        ),
        call(
            "duplicated_definition",
            Language.GERMAN,
            [
                {
                    "id": "2",
                    "part_of_speech": "verb",
                    "definition": "definition 2",
                    "answer": "word 2",
                },
                {
                    "id": "4",
                    "part_of_speech": "verb",
                    "definition": "definition 2",
                    "answer": "word 4",
                },
            ],
            words_columns=[Column.ID, Column.ANSWER, Column.DEFINITION],
            part_of_speech="verb",
        ),
    ]
    assert len(mock_create_prompt.call_args_list) == 2
    assert mock_chat_completion.call_args_list == [
        call("de_duplicated_definition prompt"),
        call("de_duplicated_definition prompt"),
    ]


@patch("scripts.deck_generator.append_csv_rows")
@patch("scripts.deck_generator.read_csv")
@patch("scripts.deck_generator.init_csv")
def test_finalize(
    mock_init_csv: MagicMock,
    mock_read_csv: MagicMock,
    mock_append_csv_rows: MagicMock,
):
    mock_read_csv.return_value = [
        {
            "id": "5",
            "part_of_speech": "noun",
            "definition": "definition 3",
            "answer": "word 3",
        },
        {
            "id": "3",
            "part_of_speech": "adjective",
            "definition": "definition 2",
            "answer": "word 2",
        },
        {
            "id": "1",
            "part_of_speech": "adverb",
            "definition": "definition 1",
            "answer": "word 1",
        },
    ]

    _finalize()

    mock_init_csv.assert_called_once()
    assert mock_append_csv_rows.call_args_list == [
        call(
            FINALIZE_CSV,
            [
                {
                    "id": "1",
                    "part_of_speech": "adv.",
                    "definition": "definition 1",
                    "answer": "word 1",
                },
                {
                    "id": "2",
                    "part_of_speech": "adj.",
                    "definition": "definition 2",
                    "answer": "word 2",
                },
                {
                    "id": "3",
                    "part_of_speech": "noun",
                    "definition": "definition 3",
                    "answer": "word 3",
                },
            ],
        ),
    ]

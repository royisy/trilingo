from dataclasses import dataclass
from enum import StrEnum
from pathlib import Path


class Column(StrEnum):
    ID = "id"
    PART_OF_SPEECH = "part_of_speech"
    DEFINITION = "definition"
    ANSWER = "answer"


@dataclass
class DeckCsv:
    file_path: Path
    columns: list[Column]


CSV_DIR = Path(__file__).resolve().parent.parent / "csv"

SOURCE_CSV = DeckCsv(
    CSV_DIR / "source.csv",
    [
        Column.ID,
        Column.ANSWER,
    ],
)
PART_OF_SPEECH_CSV = DeckCsv(
    CSV_DIR / "part_of_speech.csv",
    [
        Column.ID,
        Column.PART_OF_SPEECH,
        Column.ANSWER,
    ],
)
BASE_FORM_CSV = DeckCsv(
    CSV_DIR / "base_form.csv",
    [
        Column.ID,
        Column.PART_OF_SPEECH,
        Column.ANSWER,
    ],
)
DUP_ANSWER_CSV = DeckCsv(
    CSV_DIR / "dup_answer.csv",
    [
        Column.ID,
        Column.PART_OF_SPEECH,
        Column.ANSWER,
    ],
)
DEFINITION_CSV = DeckCsv(
    CSV_DIR / "definition.csv",
    [
        Column.ID,
        Column.PART_OF_SPEECH,
        Column.DEFINITION,
        Column.ANSWER,
    ],
)
SRC_DUP_DEFINITION_CSV = DeckCsv(
    CSV_DIR / "src_dup_definition.csv",
    [
        Column.ID,
        Column.PART_OF_SPEECH,
        Column.DEFINITION,
        Column.ANSWER,
    ],
)
DEST_DUP_DEFINITION_CSV = DeckCsv(
    CSV_DIR / "dest_dup_definition.csv",
    [
        Column.ID,
        Column.PART_OF_SPEECH,
        Column.DEFINITION,
        Column.ANSWER,
    ],
)
FINALIZE_CSV = DeckCsv(
    CSV_DIR / "output.csv",
    [
        Column.ID,
        Column.PART_OF_SPEECH,
        Column.DEFINITION,
        Column.ANSWER,
    ],
)

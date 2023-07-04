from dataclasses import dataclass
from enum import Enum
from pathlib import Path
from typing import List


@dataclass
class DeckCsv:
    file_path: str
    columns: List[str]


class Column(Enum):
    ID = "id"
    PART_OF_SPEECH = "part_of_speech"
    DEFINITION = "definition"
    ANSWER = "answer"


CSV_DIR = Path(__file__).resolve().parent.parent / "csv"

SOURCE_CSV = DeckCsv(CSV_DIR / "source.csv", [Column.ID.value, Column.ANSWER.value])
PART_OF_SPEECH_CSV = DeckCsv(
    CSV_DIR / "part_of_speech.csv",
    [Column.ID.value, Column.PART_OF_SPEECH.value, Column.ANSWER.value],
)
BASE_FORM_CSV = DeckCsv(
    CSV_DIR / "base_form.csv",
    [Column.ID.value, Column.PART_OF_SPEECH.value, Column.ANSWER.value],
)
DEFINITION_CSV = DeckCsv(
    CSV_DIR / "definition.csv",
    [
        Column.ID.value,
        Column.PART_OF_SPEECH.value,
        Column.DEFINITION.value,
        Column.ANSWER.value,
    ],
)

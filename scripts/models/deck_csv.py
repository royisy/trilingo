from dataclasses import dataclass
from enum import Enum
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

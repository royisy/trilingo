from dataclasses import dataclass
from typing import List


@dataclass
class DeckCsv:
    file_path: str
    columns: List[str]

import logging
from typing import Generator

from scripts.models.deck_csv import Column
from scripts.utils.deck_consts import PART_OF_SPEECH_DICT, POS_UNKNOWN

logger = logging.getLogger(__name__)


def group_by_pos(csv_rows: list[dict]) -> dict[str, list[dict]]:
    pos_dict = {}
    for row in csv_rows:
        pos = row[Column.PART_OF_SPEECH.value]
        pos_dict.setdefault(pos, []).append(row)
    return pos_dict


def chunks(data: list[dict], chunk_size: int) -> Generator[list[dict], None, None]:
    for i in range(0, len(data), chunk_size):
        yield data[i : i + chunk_size]


def create_prompt(file_name: str, lang: str, words: list[dict], pos: str = None) -> str:
    words_text = ""
    for word in words:
        words_text += f"{word[Column.ID.value]},{word[Column.ANSWER.value]}\n"
    template_file = f"./scripts/prompts/{lang}_{file_name}.txt"
    with open(template_file, "r") as f:
        prompt = f.read()
        prompt = prompt.replace("{words}", words_text)
        prompt = prompt.replace("{pos_list}", ",".join(PART_OF_SPEECH_DICT[lang]))
        if pos is not None:
            prompt = prompt.replace("{pos}", pos)
    return prompt


def filter_invalid_part_of_speech(csv_rows: list[dict], lang: str) -> bool:
    filtered_csv_rows = []
    for row in csv_rows:
        part_of_speech = row[Column.PART_OF_SPEECH.value]
        if (
            part_of_speech not in PART_OF_SPEECH_DICT[lang]
            and part_of_speech != POS_UNKNOWN
        ):
            logger.error(
                f"invalid part of speech: {part_of_speech}, id: {row[Column.ID.value]}"
            )
        else:
            filtered_csv_rows.append(row)
    return filtered_csv_rows

import logging
import math
from typing import Generator, Optional

from scripts.models.deck_csv import Column
from scripts.models.language import Language
from scripts.models.part_of_speech import POS_BY_LANG, POS_TO_IGNORE

logger = logging.getLogger(__name__)


def group_by_pos(csv_rows: list[dict]) -> dict[str, list[dict]]:
    pos_dict: dict[str, list[dict]] = {}
    for row in csv_rows:
        pos = row[Column.PART_OF_SPEECH.value]
        pos_dict.setdefault(pos, []).append(row)
    return pos_dict


def parts_of_speech(
    pos_dict: dict[str, list[dict]]
) -> Generator[tuple[str, list[dict]], None, None]:
    for part_of_speech, csv_rows in pos_dict.items():
        if part_of_speech in POS_TO_IGNORE:
            logger.info(f"skipping {part_of_speech}: {len(csv_rows)} words")
            continue
        logger.info(f"processing {part_of_speech}: {len(csv_rows)} words")
        yield part_of_speech, csv_rows


def chunks(data: list[dict], chunk_size: int) -> Generator[list[dict], None, None]:
    for i in range(0, len(data), chunk_size):
        logger.info(
            f"processing chunk {math.ceil((i / chunk_size) + 1)}"
            f"/{math.ceil(len(data) / chunk_size)}"
        )
        yield data[i : i + chunk_size]


def create_prompt(
    file_name: str,
    lang: Language,
    words: list[dict],
    part_of_speech: Optional[str] = None,
) -> str:
    words_text = ""
    for word in words:
        words_text += f"{word[Column.ID.value]},{word[Column.ANSWER.value]}\n"
    template_file = f"./scripts/prompts/{lang}_{file_name}.txt"
    with open(template_file, "r") as f:
        prompt = f.read()
        prompt = prompt.format(
            pos_list=",".join([pos.value for pos in POS_BY_LANG[lang]]),
            part_of_speech=part_of_speech,
            words=words_text,
        )
    return prompt


def remove_invalid_part_of_speech(csv_rows: list[dict], lang: Language) -> list[dict]:
    filtered_csv_rows = []
    for row in csv_rows:
        part_of_speech = row[Column.PART_OF_SPEECH.value]
        if (
            part_of_speech not in POS_BY_LANG[lang]
            and part_of_speech not in POS_TO_IGNORE
        ):
            logger.error(
                f"invalid part of speech: {part_of_speech}, id: {row[Column.ID.value]}"
            )
        else:
            filtered_csv_rows.append(row)
    return filtered_csv_rows


def lowercase_words(csv_rows: list[dict]) -> list[dict]:
    for row in csv_rows:
        row[Column.ANSWER.value] = row[Column.ANSWER.value].lower()
    return csv_rows

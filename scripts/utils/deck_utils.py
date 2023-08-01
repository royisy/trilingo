import logging
import math
from typing import Generator, Optional

from scripts.models.deck_csv import Column
from scripts.models.language import LANGUAGE_NAME, Language
from scripts.models.part_of_speech import (
    ABBREVIATED_POS,
    ARTICLES_BY_LANG,
    POS_BY_LANG,
    POS_TO_IGNORE,
)

logger = logging.getLogger(__name__)


def group_by_pos(csv_rows: list[dict]) -> dict[str, list[dict]]:
    pos_dict: dict[str, list[dict]] = {}
    for row in csv_rows:
        pos = row[Column.PART_OF_SPEECH.value]
        pos_dict.setdefault(pos, []).append(row)
    sorted_pos_dict = dict(sorted(pos_dict.items()))
    return sorted_pos_dict


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
    words_columns: list[Column] = [Column.ID, Column.ANSWER],
    part_of_speech: Optional[str] = None,
) -> str:
    word_text_list = []
    for word in words:
        word_text_list.append(
            ",".join(str(word[column.value]) for column in words_columns)
        )
    words_text = "\n".join(word_text_list)
    template_file = f"./scripts/prompts/{file_name}.txt"
    with open(template_file, "r") as f:
        prompt = f.read()
        prompt = prompt.format(
            lang=LANGUAGE_NAME[lang],
            pos_list=",".join([pos.value for pos in POS_BY_LANG[lang]]),
            part_of_speech=part_of_speech,
            words=words_text,
        )
    logger.debug(f"prompt: {prompt}")
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


def lowercase_article(csv_rows: list[dict], lang: Language) -> list[dict]:
    articles = ARTICLES_BY_LANG[lang]
    result = []
    for row in csv_rows:
        answer: str = row[Column.ANSWER.value]
        first_word = answer.split()[0]
        if first_word.lower() in articles:
            answer = answer.replace(first_word, first_word.lower(), 1)
        result.append({**row, Column.ANSWER.value: answer})
    return result


def lowercase_word(csv_rows: list[dict]) -> list[dict]:
    row: dict[str, str]
    for row in csv_rows:
        row[Column.ANSWER.value] = row[Column.ANSWER.value].lower()
    return csv_rows


def remove_duplicated_answers(csv_rows: list[dict]) -> list[dict]:
    sorted_csv_rows = sort_by_id(csv_rows)
    seen = set()
    result = []
    for row in sorted_csv_rows:
        key = (row[Column.PART_OF_SPEECH.value], row[Column.ANSWER.value])
        if key not in seen:
            result.append(row)
            seen.add(key)
    logger.info(f"removed {len(csv_rows) - len(result)} duplicated answers")
    return result


def sort_by_answer(csv_rows: list[dict]) -> list[dict]:
    return sorted(
        csv_rows,
        key=lambda row: (row[Column.ANSWER.value].lower(), int(row[Column.ID.value])),
    )


def sort_by_id(csv_rows: list[dict]) -> list[dict]:
    return sorted(csv_rows, key=lambda row: int(row[Column.ID.value]))


def get_duplicated_definitions(csv_rows: list[dict]) -> tuple[list[dict], list[dict]]:
    groups: dict = {}
    for row in csv_rows:
        key = (row[Column.PART_OF_SPEECH.value], row[Column.DEFINITION.value])
        groups.setdefault(key, []).append(row)
    duplicates = []
    non_duplicates = []
    for group in groups.values():
        if len(group) > 1:
            duplicates.extend(group)
        else:
            non_duplicates.extend(group)
    return duplicates, non_duplicates


def check_definition_length(csv_rows: list[dict]):
    MAX_DEFINITION_LENGTH = 30
    for row in csv_rows:
        definition = row[Column.DEFINITION.value]
        if len(definition) > MAX_DEFINITION_LENGTH:
            logger.error(
                f"definition too long: {definition}, id: {row[Column.ID.value]}"
            )


def update_values(row: dict, index: int) -> dict:
    new_row = row.copy()
    pos = row[Column.PART_OF_SPEECH.value]
    abbr_pos = ABBREVIATED_POS[pos]
    new_row[Column.ID.value] = str(index + 1)
    new_row[Column.PART_OF_SPEECH.value] = abbr_pos
    return new_row

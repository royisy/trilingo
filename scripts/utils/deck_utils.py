from typing import Generator

from scripts.models.deck_csv import Column

PART_OF_SPEECH_DICT = {
    "de": [
        "noun",
        "verb",
        "adjective",
        "adverb",
        "pronoun",
        "article",
        "preposition",
        "conjunction",
        "interjection",
        "numeral",
    ]
}


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

POS_DICT = {
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


def chunks(data, chunk_size):
    for i in range(0, len(data), chunk_size):
        yield data[i : i + chunk_size]


def create_prompt(file_name, lang, words, pos=None):
    words_text = ""
    for word in words:
        words_text += f"{word['id']},{word['word']}\n"
    template_file = f"./scripts/prompts/{lang}_{file_name}.txt"
    with open(template_file, "r") as f:
        prompt = f.read()
        prompt = prompt.replace("{words}", words_text)
        prompt = prompt.replace("{pos_list}", ",".join(POS_DICT[lang]))
        if pos is not None:
            prompt = prompt.replace("{pos}", pos)
    return prompt


def group_by_pos(csv_rows):
    pos_dict = {}
    for row in csv_rows:
        pos = row["part_of_speech"]
        if pos not in pos_dict:
            pos_dict[pos] = []
        pos_dict[pos].append(row)
    return pos_dict

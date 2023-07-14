from scripts.models.arg_enum import ArgEnum


class DeckProcess(ArgEnum):
    PART_OF_SPEECH = "pos"
    BASE_FORM = "base"
    DEFINITION = "def"
    REMOVE_DUPLICATES = "dup"

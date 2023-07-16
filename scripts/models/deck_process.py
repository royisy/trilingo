from scripts.models.arg_enum import ArgEnum


class DeckProcess(ArgEnum):
    PART_OF_SPEECH = "pos"
    BASE_FORM = "base"
    REMOVE_DUP_ANSWER = "dup_ans"
    DEFINITION = "def"
    REMOVE_DUP_DEFINITION = "dup_def"
    FINALIZE = "fin"

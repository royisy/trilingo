from scripts.models.arg_enum import ArgEnum


class Language(ArgEnum):
    GERMAN = "de"


LANGUAGE_NAME = {
    Language.GERMAN: "German",
}

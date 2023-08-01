from scripts.models.arg_enum import ArgEnum
from scripts.models.part_of_speech import PartOfSpeech


class Language(ArgEnum):
    GERMAN = "de"
    PORTUGUESE = "pt"


LANGUAGE_NAME = {
    Language.GERMAN: "German",
    Language.PORTUGUESE: "Portuguese",
}

POS_BY_LANG = {
    Language.GERMAN: [
        PartOfSpeech.ADJECTIVE,
        PartOfSpeech.ADVERB,
        PartOfSpeech.ARTICLE,
        PartOfSpeech.CONJUNCTION,
        PartOfSpeech.INTERJECTION,
        PartOfSpeech.NOUN,
        PartOfSpeech.NUMERAL,
        PartOfSpeech.PREPOSITION,
        PartOfSpeech.PRONOUN,
        PartOfSpeech.PROPER_NOUN,
        PartOfSpeech.VERB,
    ],
    Language.PORTUGUESE: [
        PartOfSpeech.ADJECTIVE,
        PartOfSpeech.ADVERB,
        PartOfSpeech.ARTICLE,
        PartOfSpeech.CONJUNCTION,
        PartOfSpeech.INTERJECTION,
        PartOfSpeech.NOUN,
        PartOfSpeech.NUMERAL,
        PartOfSpeech.PREPOSITION,
        PartOfSpeech.PRONOUN,
        PartOfSpeech.PROPER_NOUN,
        PartOfSpeech.VERB,
    ],
}

ARTICLES_BY_LANG = {
    Language.GERMAN: ["der", "die", "das"],
    Language.PORTUGUESE: ["o", "a", "os", "as"],
}

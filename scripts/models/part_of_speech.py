from enum import Enum

from scripts.models.language import Language


class PartOfSpeech(Enum):
    ABBREVIATION = "abbreviation"
    ADJECTIVE = "adjective"
    ADVERB = "adverb"
    ARTICLE = "article"
    CONJUNCTION = "conjunction"
    INTERJECTION = "interjection"
    NOUN = "noun"
    NUMERAL = "numeral"
    OTHER = "other"
    PREPOSITION = "preposition"
    PRONOUN = "pronoun"
    PROPER_NOUN = "proper noun"
    VERB = "verb"

    def __eq__(self, target):
        if isinstance(target, str):
            return target == self.value
        return super().__eq__(target)


POS_TO_IGNORE = [
    PartOfSpeech.ABBREVIATION,
    PartOfSpeech.OTHER,
    PartOfSpeech.PROPER_NOUN,
]

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
    ]
}

ARTICLES_BY_LANG = {Language.GERMAN: ["der", "die", "das"]}

from enum import Enum


class PartOfSpeech(Enum):
    NOUN = "noun"
    VERB = "verb"
    ADJECTIVE = "adjective"
    ADVERB = "adverb"
    PRONOUN = "pronoun"
    ARTICLE = "article"
    PREPOSITION = "preposition"
    CONJUNCTION = "conjunction"
    INTERJECTION = "interjection"
    NUMERAL = "numeral"
    PROPER_NOUN = "proper noun"
    ABBREVIATION = "abbreviation"
    OTHER = "other"

    def __eq__(self, other):
        if isinstance(other, str):
            return other == self.value
        return super().__eq__(other)


POS_TO_IGNORE = [
    PartOfSpeech.PROPER_NOUN,
    PartOfSpeech.ABBREVIATION,
    PartOfSpeech.OTHER,
]

POS_BY_LANG = {
    "de": [
        PartOfSpeech.NOUN,
        PartOfSpeech.VERB,
        PartOfSpeech.ADJECTIVE,
        PartOfSpeech.ADVERB,
        PartOfSpeech.PRONOUN,
        PartOfSpeech.ARTICLE,
        PartOfSpeech.PREPOSITION,
        PartOfSpeech.CONJUNCTION,
        PartOfSpeech.INTERJECTION,
        PartOfSpeech.NUMERAL,
        PartOfSpeech.PROPER_NOUN,
    ]
}

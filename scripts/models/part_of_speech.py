from enum import Enum

from scripts.models.language import Language


class PartOfSpeech(Enum):
    ABBREVIATION = "abbreviation"
    ADJECTIVE = "adjective"
    ADVERB = "adverb"
    ARTICLE = "article"
    CONJUNCTION = "conjunction"
    FOREIGN = "foreign"
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
    PartOfSpeech.FOREIGN,
    PartOfSpeech.OTHER,
    PartOfSpeech.PROPER_NOUN,
]

ABBREVIATED_POS = {
    PartOfSpeech.ADJECTIVE.value: "adj.",
    PartOfSpeech.ADVERB.value: "adv.",
    PartOfSpeech.ARTICLE.value: "art.",
    PartOfSpeech.CONJUNCTION.value: "conj.",
    PartOfSpeech.INTERJECTION.value: "interj.",
    PartOfSpeech.NOUN.value: "noun",
    PartOfSpeech.NUMERAL.value: "num.",
    PartOfSpeech.PREPOSITION.value: "prep.",
    PartOfSpeech.PRONOUN.value: "pron.",
    PartOfSpeech.VERB.value: "verb",
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
    ]
}

ARTICLES_BY_LANG = {Language.GERMAN: ["der", "die", "das"]}

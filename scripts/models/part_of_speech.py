from enum import Enum

from scripts.models.language import Language


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
    OTHER = "other"

    def __eq__(self, target):
        if isinstance(target, str):
            return target == self.value
        return super().__eq__(target)


pos_mapping = {
    "ADJ": PartOfSpeech.ADJECTIVE,  # adjective
    "ADP": PartOfSpeech.PREPOSITION,  # adposition
    "ADV": PartOfSpeech.ADVERB,  # adverb
    "AUX": PartOfSpeech.VERB,  # auxiliary verb
    "CONJ": PartOfSpeech.CONJUNCTION,  # coordinating conjunction
    "CCONJ": PartOfSpeech.CONJUNCTION,  # coordinating conjunction
    "DET": PartOfSpeech.ARTICLE,  # determiner
    "INTJ": PartOfSpeech.INTERJECTION,  # interjection
    "NOUN": PartOfSpeech.NOUN,  # noun
    "NUM": PartOfSpeech.NUMERAL,  # numeral
    "PART": PartOfSpeech.OTHER,  # particle
    "PRON": PartOfSpeech.PRONOUN,  # pronoun
    "PROPN": PartOfSpeech.PROPER_NOUN,  # proper noun
    "PUNCT": PartOfSpeech.OTHER,  # punctuation
    "SCONJ": PartOfSpeech.CONJUNCTION,  # subordinating conjunction
    "SYM": PartOfSpeech.OTHER,  # symbol
    "VERB": PartOfSpeech.VERB,  # verb
    "X": PartOfSpeech.OTHER,  # other
}

POS_TO_IGNORE = [
    PartOfSpeech.PROPER_NOUN,
    PartOfSpeech.OTHER,
]

POS_BY_LANG = {
    Language.GERMAN: [
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

from enum import StrEnum


class ArgEnum(StrEnum):
    def __new__(cls, value):
        obj = str.__new__(cls, value)
        obj._value_ = value
        return obj

    @classmethod
    def get_choices(cls):
        return [member.value for member in cls]

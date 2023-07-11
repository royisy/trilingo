from enum import Enum


class ArgEnum(Enum):
    def __new__(cls, *args):
        obj = object.__new__(cls)
        obj._value_ = args[0]
        for alias in args[1:]:
            cls._value2member_map_[alias] = obj
        return obj

    def __str__(self):
        return self.value

    @classmethod
    def get_choices(cls):
        return [member.value for member in cls]

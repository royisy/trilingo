import logging

logging_config = dict(
    version=1,
    formatters={"f": {"format": "%(asctime)s - %(levelname)s - %(message)s"}},
    handlers={
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "f",
            "level": logging.DEBUG,
        },
        "file": {
            "class": "logging.FileHandler",
            "formatter": "f",
            "level": logging.DEBUG,
            "filename": "deck_generator.log",
        },
    },
    root={
        "handlers": ["console", "file"],
        "level": logging.DEBUG,
    },
    loggers={"scripts": {}},
)

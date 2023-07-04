import logging
import os

import openai
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


def chat_completion(prompt: str) -> tuple[str, int]:
    response = None
    total_tokens = None
    try:
        chat_completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
        )
        response = chat_completion.choices[0].message.content
        total_tokens = chat_completion.usage.total_tokens
    except openai.OpenAIError:
        logger.exception("api error")
    except (AttributeError, IndexError, TypeError):
        logger.exception(f"unexpected response from api: {chat_completion}")

    return response, total_tokens

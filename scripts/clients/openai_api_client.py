import logging
import os
import time
from typing import Optional

import openai
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

RETRY_WAIT_SECONDS = 10


def chat_completion(
    prompt: str, retry: bool = True
) -> tuple[Optional[str], Optional[int]]:
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
        if retry:
            logger.info(f"retrying in {RETRY_WAIT_SECONDS} seconds")
            time.sleep(RETRY_WAIT_SECONDS)
            return chat_completion(prompt, retry=False)
    except (AttributeError, IndexError, TypeError):
        logger.exception(f"unexpected response from api: {chat_completion}")
    logger.debug(f"response : {response}")
    logger.info(f"tokens : {total_tokens}")
    return response, total_tokens

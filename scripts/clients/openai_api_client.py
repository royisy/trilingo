import os

import openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


def chat_completion(message):
    chat_completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "Hello world"}],
        temperature=0,
    )
    return chat_completion.choices[0].message.content


def mock_chat_completion(prompt):
    if prompt == "part_of_speech":
        return """
1,noun
2,verb
3,noun
4,verb
"""
    elif prompt == "base_form_noun":
        return """
1,base word 1
3,base word 3
"""
    elif prompt == "base_form":
        return """
2,base word 2
4,base word 4
"""
    elif prompt == "article":
        return """
1,article base word 1
3,article base word 3
"""
    elif prompt == "definition_noun":
        return """
1,definition 1
3,definition 3
"""
    elif prompt == "definition":
        return """
2,definition 2
4,definition 4
"""

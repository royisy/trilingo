from unittest.mock import MagicMock, patch

import openai

from scripts.clients.openai_api_client import chat_completion


@patch("scripts.clients.openai_api_client.RETRY_WAIT_SECONDS", new=0)
@patch("openai.ChatCompletion.create")
def test_chat_completion(mock_create: MagicMock, caplog):
    mock_create.side_effect = openai.OpenAIError("test error")
    chat_completion("prompt")
    assert len(caplog.record_tuples) == 4

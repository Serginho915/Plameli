import json
import logging
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings


logger = logging.getLogger(__name__)

OPENROUTER_CHAT_COMPLETIONS_URL = "https://openrouter.ai/api/v1/chat/completions"

SITE_CONTEXT = """
You are the Plameli website assistant for Olena Shopova.

Use only this site information when answering:
- Plameli offers individual consultations about accounting and taxes in Bulgaria.
- A consultation is a structured analysis of the client's current situation, risks, solutions, strategy, and concrete recommendations for their case.
- Common consultation topics: starting a business in Bulgaria, business growth and scaling, tax issues, accounting problems, tax optimization within current law, document handling, annual declarations, and choosing the right service or learning format.
- Consultation duration: 60 minutes.
- Meeting format: Zoom or in-person in Sofia.
- Standard consultation price: EUR 150.
- Priority consultation price: EUR 250.
- Users book and pay for consultations through the consultation booking widget on the website.
- Before a consultation, clients should prepare a description of their situation or problem and collect documents they consider important.
- Plameli also offers education: courses and webinars about modern accounting, tax law, and financial literacy for entrepreneurs.
- Students receive an official certificate after completing a course.
- Payments can be made by bank card, online banking systems, or bank transfer for legal entities.
- Installment payment can be available for long training courses and complex accounting services.

Behavior rules:
- Reply in the same language as the user's latest message. If the user mixes languages, choose the dominant language.
- Keep answers concise, friendly, and practical.
- If exact availability, legal outcome, or individual tax advice is requested, explain that this needs a booked consultation or the booking widget.
- If the question is unrelated to Plameli, accounting, taxes, consultations, education, booking, payment, or site navigation, politely say you can help with Plameli services and ask what they want to know.
- Do not invent prices, schedules, guarantees, addresses, phone numbers, or policies not listed above.
""".strip()


class OpenRouterConfigurationError(Exception):
    pass


class OpenRouterRequestError(Exception):
    pass


def _normalize_messages(messages: list[dict[str, Any]]) -> list[dict[str, str]]:
    normalized = []
    for message in messages[-8:]:
        role = message.get("role")
        content = str(message.get("content", "")).strip()

        if role not in {"user", "assistant"} or not content:
            continue

        normalized.append({"role": role, "content": content[:1200]})

    return normalized


def ask_openrouter(messages: list[dict[str, Any]]) -> str:
    if not settings.OPENROUTER_API_KEY:
        raise OpenRouterConfigurationError("OPENROUTER_API_KEY is not configured.")

    chat_messages = [
        {"role": "system", "content": SITE_CONTEXT},
        *_normalize_messages(messages),
    ]

    payload = {
        "model": settings.OPENROUTER_MODEL,
        "messages": chat_messages,
        "temperature": 0.35,
        "max_tokens": 420,
    }
    data = json.dumps(payload).encode("utf-8")
    request = Request(
        OPENROUTER_CHAT_COMPLETIONS_URL,
        data=data,
        method="POST",
        headers={
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": settings.OPENROUTER_SITE_URL,
            "X-OpenRouter-Title": settings.OPENROUTER_SITE_NAME,
        },
    )

    try:
        with urlopen(request, timeout=settings.OPENROUTER_TIMEOUT_SECONDS) as response:
            response_data = json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        logger.warning("OpenRouter returned HTTP %s: %s", exc.code, body[:500])
        raise OpenRouterRequestError("OpenRouter request failed.") from exc
    except (URLError, TimeoutError, json.JSONDecodeError) as exc:
        logger.warning("OpenRouter request failed: %s", exc)
        raise OpenRouterRequestError("OpenRouter request failed.") from exc

    try:
        content = response_data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError) as exc:
        logger.warning("Unexpected OpenRouter response shape: %s", response_data)
        raise OpenRouterRequestError("OpenRouter response was invalid.") from exc

    if isinstance(content, list):
        content = " ".join(
            item.get("text", "") for item in content if isinstance(item, dict)
        )

    answer = str(content).strip()
    if not answer:
        raise OpenRouterRequestError("OpenRouter response was empty.")

    return answer

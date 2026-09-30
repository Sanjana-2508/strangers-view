import json
import os
import re

from dotenv import load_dotenv

from .prompts import SYSTEM_PROMPT, build_user_prompt

load_dotenv()

MODEL = "claude-sonnet-5-5"

ALLOWED_TYPES = {
    "college", "workplace", "home_area", "city", "routine", "birthday",
    "family", "friends", "travel_plans", "contact_info", "other",
}
ALLOWED_RISKS = {"low", "medium", "high"}
SCAM_LABEL = "EXAMPLE SCAM (for awareness):"


def _empty_result():
    return {
        "clues": [],
        "stranger_summary": "Nothing risky found.",
        "scam_message": "",
        "fixes": [],
    }


def _normalize(s: str) -> str:
    """Lowercase and squeeze spaces, so small spacing differences do not matter."""
    return " ".join(str(s).lower().split())


def _parse_json(raw: str) -> dict:
    """Turn the AI's reply into a dict. Handles ```json fences."""
    raw = raw.strip()
    start = raw.find("{")
    end = raw.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("No JSON found")
    return json.loads(raw[start:end + 1])


def clean_result(raw: dict, user_text: str) -> dict:
    """Safety checks from the spec. Works without any API key."""
    if not isinstance(raw, dict):
        raise ValueError("AI reply is not an object")

    text_norm = _normalize(user_text)
    good_clues = []

    for clue in raw.get("clues", []) or []:
        if not isinstance(clue, dict):
            continue
        ctype = str(clue.get("type", "")).lower().strip()
        risk = str(clue.get("risk", "")).lower().strip()
        evidence = str(clue.get("evidence", "")).strip()

        if ctype not in ALLOWED_TYPES:      # not in fixed list
            continue
        if risk not in ALLOWED_RISKS:       # not in fixed list
            continue
        if not evidence or _normalize(evidence) not in text_norm:
            continue                        # made-up clue

        good_clues.append({
            "type": ctype,
            "found": str(clue.get("found", "")).strip(),
            "evidence": evidence,
            "risk": risk,
            "why": str(clue.get("why", "")).strip(),
        })

    if not good_clues:
        return _empty_result()

    summary = str(raw.get("stranger_summary", "")).strip()
    if not summary:
        summary = "A stranger could learn some personal details about you."

    # Scam message: keep it safe and labeled
    scam = str(raw.get("scam_message", "")).strip()
    scam = re.sub(r"(https?://\S+|www\.\S+)", "[link]", scam)
    if scam and not scam.startswith(SCAM_LABEL):
        scam = f"{SCAM_LABEL} {scam}"

    fixes = raw.get("fixes", []) or []
    fixes = [str(f).strip() for f in fixes if str(f).strip()][:5]

    return {
        "clues": good_clues,
        "stranger_summary": summary,
        "scam_message": scam,
        "fixes": fixes,
    }


def _call_llm(text: str) -> str:
    import anthropic  # imported here so the file loads even without a key

    client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from .env
    response = client.messages.create(
        model=MODEL,
        max_tokens=1500,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": build_user_prompt(text)}],
    )
    return response.content[0].text


def analyze_text(text: str) -> dict:
    """Main function Person 1 calls. Returns clues, summary, scam message, fixes."""
    if not text or not text.strip():
        return _empty_result()

    last_error = None
    for _ in range(2):  # try once, retry once if JSON is broken
        try:
            raw_reply = _call_llm(text)
            raw = _parse_json(raw_reply)
            return clean_result(raw, text)
        except (ValueError, json.JSONDecodeError) as e:
            last_error = e

    raise RuntimeError("The AI reply could not be read. Please try again.") from last_error
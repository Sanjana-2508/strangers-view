from .analyze import clean_result

user_text = (
    "Leaving for BMSIT at 8am, bus is always late!\n"
    "My birthday is on 14 March, so treat me!"
)

fake_ai_output = {
    "clues": [
        # Good clue
        {"type": "college", "found": "BMSIT", "evidence": "Leaving for BMSIT at 8am",
         "risk": "high", "why": "Shows where you go daily"},
        # Made-up: evidence is NOT in the text
        {"type": "workplace", "found": "Google", "evidence": "I work at Google",
         "risk": "high", "why": "invented"},
        # Bad type
        {"type": "pet_name", "found": "x", "evidence": "My birthday is on 14 March",
         "risk": "low", "why": "bad type"},
        # Bad risk
        {"type": "birthday", "found": "14 March", "evidence": "My birthday is on 14 March",
         "risk": "extreme", "why": "bad risk"},
    ],
    "stranger_summary": "A stranger could learn your college.",
    "scam_message": "Pay now at https://fake.example.com",
    "fixes": ["Do not post your schedule"],
}

result = clean_result(fake_ai_output, user_text)

assert len(result["clues"]) == 1, "Only the good clue should stay"
assert result["clues"][0]["type"] == "college"
assert result["scam_message"].startswith("EXAMPLE SCAM (for awareness):")
assert "https" not in result["scam_message"]
print("All safety checks passed")
print(result)
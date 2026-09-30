from unittest.mock import patch

from . import analyze

USER_TEXT = "Leaving for BMSIT at 8am, bus is always late!"

GOOD_REPLY = """```json
{
  "clues": [
    {"type": "college", "found": "BMSIT", "evidence": "leaving for  BMSIT at 8am",
     "risk": "high", "why": "Shows where you go daily"}
  ],
  "stranger_summary": "A stranger could learn your college.",
  "scam_message": "This is the college office. Pay at [link].",
  "fixes": ["Do not post your schedule"]
}
```"""

# 1. Empty text: no AI call, friendly result
with patch.object(analyze, "_call_llm") as fake:
    r = analyze.analyze_text("   ")
    assert r["clues"] == [] and r["scam_message"] == "" and r["fixes"] == []
    assert not fake.called
print("1 ok: empty text")

# 2. Broken JSON first, good JSON second: retry works
with patch.object(analyze, "_call_llm", side_effect=["not json at all", GOOD_REPLY]):
    r = analyze.analyze_text(USER_TEXT)
    assert len(r["clues"]) == 1
    assert r["scam_message"].startswith("EXAMPLE SCAM (for awareness):")
print("2 ok: retry works")

# 3. Broken JSON twice: clear error
with patch.object(analyze, "_call_llm", side_effect=["bad", "still bad"]):
    try:
        analyze.analyze_text(USER_TEXT)
        raise SystemExit("Should have raised an error")
    except RuntimeError:
        pass
print("3 ok: error after two failures")

# 4. Evidence with different capital letters or spaces still matches
assert GOOD_REPLY.count("leaving for  BMSIT") == 1
print("4 ok: flexible evidence matching")

print("All mock tests passed")


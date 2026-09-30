import json
from unittest.mock import patch

from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)

TEXT = "Leaving for BMSIT at 8am, bus is always late!"

FAKE_AI_REPLY = json.dumps({
    "clues": [{
        "type": "college",
        "found": "BMSIT",
        "evidence": "Leaving for BMSIT at 8am",
        "risk": "high",
        "why": "Shows where you go daily",
    }],
    "stranger_summary": "A stranger could learn your college.",
    "scam_message": "This is the college office. Pay at [link].",
    "fixes": ["Do not post your schedule"],
})

# 1. Nothing sent: friendly error
r = client.post("/analyze")
assert r.status_code == 400 and "error" in r.json()
print("1 ok: empty request gives a friendly error")

# 2. Text only, with the fake AI
with patch("backend.ai.analyze._call_llm", return_value=FAKE_AI_REPLY):
    r = client.post("/analyze", data={"text": TEXT})
body = r.json()
assert r.status_code == 200, body
assert body["photo"]["has_exif"] is False
assert body["photo"]["gps"] is None
assert len(body["text"]["clues"]) == 1
assert body["text"]["scam_message"].startswith("EXAMPLE SCAM (for awareness):")
assert body["score"]["total"] == 15, body["score"]
assert "Do not post your schedule" in body["fixes"]
print("2 ok: text-only analyze works")

# 3. Demo endpoint
r = client.get("/demo")
assert r.status_code == 200 and r.json()["score"]["total"] == 78
print("3 ok: demo works")

print("All endpoint tests passed")
import json
from pathlib import Path

from .analyze import ALLOWED_TYPES, ALLOWED_RISKS, _normalize

data = Path(__file__).resolve().parents[2] / "data"
demo = json.loads((data / "demo_result.json").read_text(encoding="utf-8"))
profile = (data / "profile_high_risk.txt").read_text(encoding="utf-8")

for c in demo["text"]["clues"]:
    assert c["type"] in ALLOWED_TYPES, c["type"]
    assert c["risk"] in ALLOWED_RISKS, c["risk"]
    assert _normalize(c["evidence"]) in _normalize(profile), c["evidence"]

score = demo["score"]
assert sum(b["points"] for b in score["breakdown"]) == score["total"]
assert score["level"] == "high"
assert demo["text"]["scam_message"].startswith("EXAMPLE SCAM (for awareness):")
assert "http" not in demo["text"]["scam_message"]
for fix in demo["text"]["fixes"]:
    assert fix in demo["fixes"]

print("demo_result.json looks correct")
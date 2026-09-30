import json
from pathlib import Path

from .analyze import analyze_text

data_folder = Path(__file__).resolve().parents[2] / "data"

for name in ["profile_high_risk.txt", "profile_hinglish.txt", "profile_safe.txt"]:
    text = (data_folder / name).read_text(encoding="utf-8")
    print("=" * 60)
    print(name)
    print("=" * 60)
    try:
        result = analyze_text(text)
        print(json.dumps(result, indent=2, ensure_ascii=False))
    except Exception as e:
        print("ERROR:", e)
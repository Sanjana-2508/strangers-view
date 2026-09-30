## AI and Text (Person 2)
- analyze_text(text) in backend/ai/analyze.py finds clues and writes a scam example.
- Safety checks: drops made-up clues, clues with wrong type or risk, and real links.
- Test without an API key: python -m ai.test_analyze and python -m ai.test_mock
- Test profiles are in data/ (all fictional).
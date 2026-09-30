def calculate_score(photo, clues):
    """
    Calculate the Stranger's View privacy risk score.

    Photo score: maximum 40 points
        GPS        = 30
        Date/time  = 5
        Device     = 5

    Text score: maximum 60 points
        High risk   = 15
        Medium risk = 8
        Low risk    = 3

    Final score: maximum 100
    """

    photo_points = 0
    text_points = 0
    breakdown = []

    # -------------------------
    # PHOTO SCORE
    # -------------------------

    if photo.get("gps") is not None:
        photo_points += 30
        breakdown.append({
            "source": "photo",
            "label": "GPS location in photo",
            "points": 30
        })

    if photo.get("taken_at") is not None:
        photo_points += 5
        breakdown.append({
            "source": "photo",
            "label": "Date and time in photo",
            "points": 5
        })

    if photo.get("device") is not None:
        photo_points += 5
        breakdown.append({
            "source": "photo",
            "label": "Phone model in photo",
            "points": 5
        })

    # -------------------------
    # TEXT SCORE
    # -------------------------

    risk_points = {
        "high": 15,
        "medium": 8,
        "low": 3
    }

    for clue in clues:
        risk = clue.get("risk", "").lower()
        points = risk_points.get(risk, 0)

        text_points += points

        if points > 0:
            breakdown.append({
                "source": "text",
                "label": f'{clue.get("type", "other")} ({risk})',
                "points": points
            })

    # Text score cannot exceed 60
    text_points = min(text_points, 60)

    # -------------------------
    # FINAL SCORE
    # -------------------------

    total = min(photo_points + text_points, 100)

    if total <= 33:
        level = "low"
    elif total <= 66:
        level = "medium"
    else:
        level = "high"

    return {
        "total": total,
        "level": level,
        "breakdown": breakdown
    }
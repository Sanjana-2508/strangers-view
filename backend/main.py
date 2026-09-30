from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
import json

from backend.exif_tools import read_exif, clean_photo, get_photo_fixes
from backend.scoring import calculate_score
from backend.ai.analyze import analyze_text


app = FastAPI(title="Stranger's View API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Stranger's View backend is running"
    }


@app.post("/clean-photo")
async def clean_photo_endpoint(photo: UploadFile = File(...)):
    try:
        cleaned = clean_photo(photo.file)

        return StreamingResponse(
            cleaned,
            media_type="image/jpeg",
            headers={
                "Content-Disposition": 'attachment; filename="cleaned_photo.jpg"'
            }
        )

    except Exception:
        return JSONResponse(
            status_code=400,
            content={
                "error": "Could not clean this photo. Please upload a valid image."
            }
        )


@app.post("/analyze")
async def analyze(
    photo: UploadFile | None = File(default=None),
    text: str | None = Form(default=None),
):
    # At least one input is required
    if photo is None and (text is None or not text.strip()):
        return JSONResponse(
            status_code=400,
            content={
                "error": "Please upload a photo or enter some text to analyze."
            }
        )

    try:
        # -------------------------
        # PHOTO ANALYSIS
        # -------------------------
        if photo is not None:
            photo_data = read_exif(photo.file)
            photo_fixes = get_photo_fixes(photo_data)
        else:
            photo_data = {
                "has_exif": False,
                "gps": None,
                "taken_at": None,
                "device": None,
            }
            photo_fixes = []

        # -------------------------
        # TEXT ANALYSIS
        # -------------------------
        if text and text.strip():
            text_data = analyze_text(text)
        else:
            text_data = {
                "clues": [],
                "stranger_summary": "No text was provided to analyze.",
                "scam_message": "",
                "fixes": [],
            }

        # -------------------------
        # SCORE
        # -------------------------
        score = calculate_score(
            photo_data,
            text_data["clues"]
        )

        # -------------------------
        # FINAL RESPONSE
        # -------------------------
        return {
            "photo": photo_data,
            "text": text_data,
            "score": score,
            "fixes": photo_fixes + text_data["fixes"],
        }

    except Exception:
        return JSONResponse(
            status_code=500,
            content={
                "error": "Something went wrong while analyzing your content. Please try again."
            }
        )


@app.get("/demo")
def demo():
    try:
        with open("data/demo_result.json", "r", encoding="utf-8") as file:
            return json.load(file)

    except Exception:
        return JSONResponse(
            status_code=500,
            content={
                "error": "Demo data could not be loaded."
            }
        )

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from backend.exif_tools import clean_photo

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
        raise HTTPException(
            status_code=400,
            detail={"error": "Could not clean this photo. Please upload a valid image."}
        )
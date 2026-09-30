from PIL import Image, ImageOps, ExifTags
from typing import Dict, Any
import io


def _convert_to_degrees(value):
    """Convert GPS coordinates from degrees/minutes/seconds to decimal."""
    try:
        degrees = float(value[0])
        minutes = float(value[1])
        seconds = float(value[2])

        return degrees + (minutes / 60.0) + (seconds / 3600.0)

    except (TypeError, ValueError, IndexError, ZeroDivisionError):
        return None


def read_exif(file) -> Dict[str, Any]:
    """
    Read useful EXIF information from an uploaded image.

    Returns:
        {
            "has_exif": True/False,
            "gps": {"lat": ..., "lng": ...} or None,
            "taken_at": "YYYY-MM-DD HH:MM:SS" or None,
            "device": "..." or None
        }
    """

    result = {
        "has_exif": False,
        "gps": None,
        "taken_at": None,
        "device": None
    }

    try:
        image = Image.open(file)
        exif = image.getexif()

        if not exif:
            return result

        result["has_exif"] = True

        # -------------------------------------------------
        # 1. DATE / TIME
        # -------------------------------------------------

        exif_data = exif.get_ifd(ExifTags.IFD.Exif)

        taken_at = exif_data.get(ExifTags.Base.DateTimeOriginal)

        if taken_at:
            result["taken_at"] = str(taken_at)

        # -------------------------------------------------
        # 2. DEVICE / PHONE MODEL
        # -------------------------------------------------

        model = exif.get(ExifTags.Base.Model)
        make = exif.get(ExifTags.Base.Make)

        if model:
            result["device"] = str(model)
        elif make:
            result["device"] = str(make)

        # -------------------------------------------------
        # 3. GPS
        # -------------------------------------------------

        gps_info = exif.get_ifd(ExifTags.IFD.GPS)

        if gps_info:
            latitude = gps_info.get(ExifTags.GPS.GPSLatitude)
            latitude_ref = gps_info.get(ExifTags.GPS.GPSLatitudeRef)

            longitude = gps_info.get(ExifTags.GPS.GPSLongitude)
            longitude_ref = gps_info.get(ExifTags.GPS.GPSLongitudeRef)

            if latitude and longitude and latitude_ref and longitude_ref:
                lat = _convert_to_degrees(latitude)
                lng = _convert_to_degrees(longitude)

                if lat is not None and lng is not None:

                    if str(latitude_ref).upper() == "S":
                        lat = -lat

                    if str(longitude_ref).upper() == "W":
                        lng = -lng

                    result["gps"] = {
                        "lat": lat,
                        "lng": lng
                    }

        return result

    except Exception:
        # EXIF should NEVER cause the API to crash.
        return result


def clean_photo(file):
    """
    Remove EXIF metadata from an uploaded photo.

    The image orientation is corrected first, then the image
    is saved as a JPEG without EXIF metadata.
    """

    image = Image.open(file)

    # Correct orientation before removing EXIF
    image = ImageOps.exif_transpose(image)

    # Convert to RGB so PNG/RGBA images can also become JPEG
    if image.mode != "RGB":
        image = image.convert("RGB")

    # Save without EXIF metadata
    output = io.BytesIO()
    image.save(output, format="JPEG", exif=b"")

    output.seek(0)

    return output


def get_photo_fixes(photo):
    """
    Generate privacy fixes based on photo metadata.
    """

    fixes = []

    if photo.get("gps") is not None:
        fixes.append("Turn off location on your camera app")

    if photo.get("device") is not None:
        fixes.append("Remove hidden photo data before sharing files")

    return fixes
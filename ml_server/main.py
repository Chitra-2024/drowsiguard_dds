# backend_fastapi/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ultralytics import YOLO
import numpy as np
from PIL import Image
import cv2
import io
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your trained YOLOv8 model
model = YOLO("best.pt")

# Pydantic model for receiving base64 image
class ImageBase64(BaseModel):
    image: str

@app.post("/predict")
async def predict(data: ImageBase64):
    # Decode base64 image
    image_bytes = base64.b64decode(data.image)
    image = np.array(Image.open(io.BytesIO(image_bytes)))


    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # PIL to OpenCV format
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    image = cv2.resize(image, (640, 640))
    image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)

    
    # Run YOLO detection
    results = model(image, conf=0.35)[0]
    # get first (and only) result
    
    detections = []
    h, w = image.shape[:2]
    
    for box, cls, conf in zip(results.boxes.xyxy, results.boxes.cls, results.boxes.conf):
        print("Detected class:", cls, "Confidence:", conf)
        x1, y1, x2, y2 = box.tolist()
        detections.append({
            "label": str(int(cls)),  # you can map to class names if you want
            "confidence": float(conf),
            "x": x1 / w,
            "y": y1 / h,
            "width": (x2 - x1) / w,
            "height": (y2 - y1) / h
        })
    
    return {"detections": detections, "message": "Hello from model"}

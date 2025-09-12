# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ultralytics import YOLO
import numpy as np
from PIL import Image
import io
import base64

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO("best.pt")

class ImageBase64(BaseModel):
    image: str

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": True}

@app.post("/predict")
async def predict(data: ImageBase64):
    try:
        # Decode base64 image
        image_bytes = base64.b64decode(data.image)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Run inference
        results = model(image)
        
        # Handle different YOLO model types
        if len(results) > 0:
            result = results[0]
            
            # Check if it's a classification model
            if hasattr(result, 'probs') and result.probs is not None:
                # Classification model
                probs = result.probs.data.cpu().numpy()
                cls_idx = int(np.argmax(probs))
                conf = float(np.max(probs))
            elif hasattr(result, 'boxes') and result.boxes is not None and len(result.boxes) > 0:
                # Detection model - get the first detection
                boxes = result.boxes
                cls_idx = int(boxes.cls[0])
                conf = float(boxes.conf[0])
            else:
                # Fallback - assume classification with equal probabilities
                cls_idx = 0
                conf = 0.5
            
            label = str(cls_idx)  # "0" for drowsy, "1" for not drowsy
            
            print(f"Prediction: label={label}, confidence={conf:.3f}")
            
            return {"detections": [{"label": label, "confidence": conf}]}
        else:
            # No results
            return {"detections": [{"label": "1", "confidence": 0.0}]}
            
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return {"detections": [{"label": "1", "confidence": 0.0}]}

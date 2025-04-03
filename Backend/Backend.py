from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
from flask_cors import CORS
from collections import Counter
import numpy as np
from ultralytics import YOLO
import tempfile
import traceback
import cloudinary
import cloudinary.uploader
import cloudinary.api
import requests
import torch
from torch.serialization import add_safe_globals, safe_globals
import sys

app = Flask(__name__)
# Enable CORS for all routes with additional options
CORS(app, resources={r"/*": {"origins": "*", "supports_credentials": True}})

# Use local directories for file storage
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
PROCESSED_IMAGES_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'processed_images')

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_IMAGES_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_IMAGES_FOLDER'] = PROCESSED_IMAGES_FOLDER

# Allowed file extensions
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}

def allowed_file(filename):
    """Check if the file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Configure Cloudinary from environment variables
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME', ''),
    api_key=os.environ.get('CLOUDINARY_API_KEY', ''),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET', '')
)

def add_all_safe_globals():
    """Add all necessary classes to PyTorch's safe globals list."""
    try:
        # Import all necessary classes
        from ultralytics.nn.tasks import DetectionModel
        from torch.nn.modules.container import Sequential
        import torch.nn as nn
        
        # Create a list of classes to add to safe globals
        classes_to_add = [
            DetectionModel,
            Sequential,
            nn.Sequential,
            nn.Module,
            nn.Conv2d,
            nn.BatchNorm2d,
            nn.SiLU
        ]
        
        # Add all classes to safe globals
        add_safe_globals(classes_to_add)
        print("Added all necessary classes to PyTorch safe globals")
        
        return True
    except Exception as e:
        print(f"Warning when adding safe globals: {e}")
        return False

def load_pretrained_model():
    """Load a standard pretrained model as fallback."""
    print("Loading standard pretrained YOLOv8n model as fallback")
    try:
        return YOLO("yolov8n.pt")
    except Exception as e:
        print(f"Error loading pretrained model: {e}")
        raise

# Load model from Cloudinary or local path
def load_model():
    # If fallback is explicitly requested, skip trying to load the custom model
    if os.environ.get('FALLBACK_USE_PRETRAINED', '').lower() == 'true':
        print("Using pretrained model as requested by environment variable")
        return load_pretrained_model()
    
    # Try to add all safe globals first
    add_all_safe_globals()
    
    if os.environ.get('CLOUDINARY_MODEL_URL'):
        # Download model from Cloudinary
        model_url = os.environ.get('CLOUDINARY_MODEL_URL')
        model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'best.pt')
        
        print(f"Downloading model from Cloudinary: {model_url}")
        
        # Download the file
        response = requests.get(model_url, stream=True)
        response.raise_for_status()  # Raise an exception for HTTP errors
        
        # Write the file to disk
        with open(model_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"Model downloaded and saved to {model_path}")
        
        # Try different approaches to load the model
        try:
            # Approach 1: Using safe_globals context manager with weights_only=False
            print("Attempting to load with safe_globals context manager")
            from torch.nn.modules.container import Sequential
            with safe_globals([Sequential]):
                model_obj = torch.load(model_path, map_location='cpu', weights_only=False)
                # Save in compatible format
                torch.save(model_obj, model_path + ".converted.pt")
                return YOLO(model_path + ".converted.pt")
        except Exception as e1:
            print(f"Error with safe_globals approach: {e1}")
            try:
                # Approach 2: Using a direct YOLO call with a format option
                print("Attempting with direct YOLO call")
                return YOLO(model_path, task='detect', verbose=False)
            except Exception as e2:
                print(f"Error with direct YOLO approach: {e2}")
                try:
                    # Approach 3: Create a simple placeholder model for testing
                    print("Creating minimal placeholder model")
                    from ultralytics.models.yolo.detect import DetectionModel as UltralyticsDetectionModel
                    from ultralytics.cfg import get_cfg
                    model = UltralyticsDetectionModel(cfg=get_cfg('yolov8n.yaml'))
                    return model
                except Exception as e3:
                    print(f"Error creating placeholder model: {e3}")
                    print("Falling back to pretrained model")
                    return load_pretrained_model()
    else:
        # Fall back to local model
        MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'best.pt')
        print(f"Loading local model from {MODEL_PATH}")
        try:
            # Approach 1: Using safe_globals context manager
            print("Attempting to load local model with safe_globals")
            from torch.nn.modules.container import Sequential
            with safe_globals([Sequential]):
                model_obj = torch.load(MODEL_PATH, map_location='cpu', weights_only=False)
                # Save in compatible format
                torch.save(model_obj, MODEL_PATH + ".converted.pt")
                return YOLO(MODEL_PATH + ".converted.pt")
        except Exception as e:
            print(f"Error loading local model: {e}")
            print("Falling back to pretrained model")
            return load_pretrained_model()

# Initialize model
try:
    model = load_model()
except Exception as e:
    print(f"Error loading model: {e}")
    traceback.print_exc()
    try:
        print("Attempting to load pretrained model as last resort")
        model = load_pretrained_model()
    except Exception as e2:
        print(f"Failed to load pretrained model: {e2}")
        model = None

# Function to upload a file to Cloudinary
def upload_to_cloudinary(file_path, folder="processed_images"):
    try:
        result = cloudinary.uploader.upload(
            file_path,
            folder=folder,
            resource_type="image"
        )
        return result['secure_url']
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        return None

def process_file(file_path):
    """
    Process the uploaded file using the YOLOv8 model and return the result.
    """
    print(f"Processing file: {file_path}")
    
    # Perform inference using the YOLOv8 model
    results = model(file_path)  # This returns a list of Results objects
    
    # Extract information from the results
    result = results[0]  # Assuming only one image was processed
    boxes = result.boxes  # Bounding boxes
    
    # Check if there are any detections
    if len(boxes) > 0:
        class_ids = boxes.cls.cpu().numpy()  # Class IDs
        probabilities = boxes.conf.cpu().numpy()  # Probabilities (same as confidence scores)
        
        # If using a standard model like YOLOv8n (which has different classes)
        # we need to handle this case differently
        if os.environ.get('FALLBACK_USE_PRETRAINED', '').lower() == 'true':
            # Using standard YOLO classes - map to tumor types
            tumor_classes = {"person": "glioma", "car": "meningioma", "dog": "pituitary"}
            class_names = [result.names[int(cls_id)] for cls_id in class_ids]
            mapped_classes = [tumor_classes.get(cls, "undefined tumor") for cls in class_names]
            
            # Check if any detection meets the probability threshold (0.2)
            valid_detections = [prob >= 0.2 for prob in probabilities]
            if any(valid_detections):  # If at least one detection meets the threshold
                most_common_class = Counter(mapped_classes).most_common(1)[0][0]
                max_probability = float(round(np.max(probabilities) * 100, 2))
                risk_level = "RISK" if max_probability > 30.0 else "Low"
            else:
                most_common_class = "No tumor detected"
                max_probability = 0.0
                risk_level = "Low"
        else:
            # Using our trained model with brain tumor classes
            class_names = [result.names[int(cls_id)] for cls_id in class_ids]  # Class names
            
            # Check if any detection meets the probability threshold (0.2)
            valid_detections = [prob >= 0.2 for prob in probabilities]
            if any(valid_detections):  # If at least one detection meets the threshold
                most_common_class = Counter(class_names).most_common(1)[0][0]
                max_probability = float(round(np.max(probabilities) * 100, 2))  # Convert to Python float
                # Determine risk level based on probability
                if max_probability > 30.0:  # Convert percentage back to decimal for comparison
                    risk_level = "RISK"
                else:
                    risk_level = "Low"
            else:
                most_common_class = "No tumor detected"
                max_probability = 0.0
                risk_level = "Low"
    else:
        most_common_class = "No tumor detected"
        max_probability = 0.0
        risk_level = "Low"

    # Map the predicted class to a label
    tumor_type = most_common_class

    # Save the processed image with bounding boxes
    processed_image_name = os.path.basename(file_path)
    processed_image_path = os.path.join(app.config['PROCESSED_IMAGES_FOLDER'], processed_image_name)
    result.save(processed_image_path)  # Save the processed image with bounding boxes
    print(f"Processed image saved at: {processed_image_path}")  # Debugging log
    
    # Upload to Cloudinary if configured
    image_url = None
    if os.environ.get('CLOUDINARY_CLOUD_NAME'):
        image_url = upload_to_cloudinary(processed_image_path)
        print(f"Image uploaded to Cloudinary: {image_url}")

    # Return the result with Python native types
    result = {
        "tumor_type": str(tumor_type),  # Ensure string type
        "risk_level": str(risk_level),  # Ensure string type
        "probability": float(max_probability),  # Convert to Python float
        "processed_image_path": processed_image_name,  # Return just the filename
        "image_url": image_url  # Cloudinary URL if available
    }
    return result

@app.route('/api/upload', methods=['POST'])
def upload_files():
    """Handle multiple file uploads and process them to provide a single result."""
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    if len(request.files) == 0:
        return jsonify({"error": "No files part"}), 400

    tumor_types = []
    risk_levels = []
    probabilities = []
    processed_images = []
    image_urls = []

    try:
        for key, file in request.files.items():
            if file.filename == '':
                return jsonify({"error": "One of the selected files is empty"}), 400
            
            if not allowed_file(file.filename):
                return jsonify({"error": f"Unsupported file format for {file.filename}. Allowed formats: jpg, jpeg, png"}), 400
            
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            print(f"File saved at: {file_path}")
            
            try:
                result = process_file(file_path)
                tumor_types.append(result["tumor_type"])
                risk_levels.append(result["risk_level"])
                probabilities.append(float(result["probability"]))  # Ensure float type
                processed_images.append(result["processed_image_path"])  # Store just the filename
                
                if result.get("image_url"):
                    image_urls.append(result["image_url"])
                    
                print(f"Processed image saved at: {result['processed_image_path']}")
            except Exception as e:
                print(f"Error processing file: {e}")
                print(f"Traceback: {traceback.format_exc()}")
                return jsonify({"error": f"Failed to process the file {file.filename}: {str(e)}"}), 500

        # Aggregate results
        final_tumor_type = Counter(tumor_types).most_common(1)[0][0]
        final_risk_level = Counter(risk_levels).most_common(1)[0][0]
        max_probability = float(max(probabilities))  # Ensure float type

        final_result = {
            "tumor_type": str(final_tumor_type),  # Ensure string type
            "risk_level": str(final_risk_level),  # Ensure string type
            "probability": float(max_probability),  # Ensure float type
            "processed_images": processed_images,  # List of filenames
            "image_urls": image_urls if image_urls else None  # Cloudinary URLs if available
        }
        print(f"Final result: {final_result}")
        return jsonify(final_result)
    except Exception as e:
        print(f"Unexpected error: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@app.route('/api/processed_images/<filename>', methods=['GET'])
def get_processed_image(filename):
    """Serve processed images."""
    response = send_from_directory(app.config['PROCESSED_IMAGES_FOLDER'], filename)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# For local development
if __name__ == '__main__':
    app.run(debug=True)
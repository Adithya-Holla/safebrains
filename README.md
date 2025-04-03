# SafeBrains

A brain tumor detection application with ML-powered analysis.

## Project Structure

- **Frontend**: React.js application 
- **Backend**: Flask API with ML model for tumor detection

## Cloudinary Setup for ML Model Hosting

To host the large ML model file (best.pt) on Cloudinary:

1. Sign up for a Cloudinary account at https://cloudinary.com/
2. Upload your `best.pt` model file to Cloudinary:
   - Go to the Media Library in your Cloudinary dashboard
   - Create a new folder named "models"
   - Upload the `best.pt` file to this folder
   - Set the resource type to "Raw" when uploading
   - After upload, click on the file and copy the "Secure delivery URL"

3. Set up environment variables in Render:
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `CLOUDINARY_MODEL_URL`: The secure URL of your uploaded model file

These settings can be found in your Cloudinary dashboard under "Account Details".

## Deployment on Render

### Using the Blueprint (Easiest Method)
1. Fork or clone this repository to your GitHub account
2. Go to your Render dashboard: https://dashboard.render.com/
3. Click on "New" and select "Blueprint"
4. Connect your GitHub account if you haven't already
5. Select your repository with this project
6. Render will automatically detect the `render.yaml` file and set up both services
7. Before applying, add your Cloudinary environment variables
8. Click "Apply" to start the deployment

### Manual Deployment

#### Backend Deployment
1. Go to your Render dashboard
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: safebrains-backend
   - Root Directory: Backend
   - Environment: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn Backend:app`
   - Select the Free plan
5. Add the Cloudinary environment variables in the "Environment" section
6. Click "Create Web Service"

#### Frontend Deployment
1. Go to your Render dashboard
2. Click "New" and select "Static Site"
3. Connect your GitHub repository
4. Configure the site:
   - Name: safebrains-frontend
   - Root Directory: Frontend
   - Build Command: `npm install && npm run build`
   - Publish Directory: build
   - Add environment variable: `REACT_APP_API_URL` with value of your backend URL + '/api'
5. Click "Create Static Site"

## Local Development
1. Clone the repository
2. Backend setup:
   ```
   cd Backend
   pip install -r requirements.txt
   python Backend.py
   ```
3. Frontend setup:
   ```
   cd Frontend
   npm install
   npm start
   ```
   
## For Local Development with Cloudinary
Create a `.env` file in the Backend directory with the following variables:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_MODEL_URL=your_model_url
``` 
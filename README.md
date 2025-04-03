# SafeBrains

A brain tumor detection application with ML-powered analysis.

## Project Structure

- **Frontend**: React.js application 
- **Backend**: Flask API with ML model for tumor detection

## Deployment on Render

### Using the Blueprint (Easiest Method)
1. Fork or clone this repository to your GitHub account
2. Go to your Render dashboard: https://dashboard.render.com/
3. Click on "New" and select "Blueprint"
4. Connect your GitHub account if you haven't already
5. Select your repository with this project
6. Render will automatically detect the `render.yaml` file and set up both services
7. Click "Apply" to start the deployment

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
5. Click "Create Web Service"

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
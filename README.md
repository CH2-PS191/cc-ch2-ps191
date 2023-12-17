# Deploying ML on Google Cloud Run

## Installation

### 1. Clone this repository.

### 2. Create a virtual environment:
   ```
   python -m venv venv
   ```

### 3. Activate the virtual environment:
   - Windows
   ```
   venv\Scripts\activate
   ```
   - Linux/MacOS :
   ```
   source venv/bin/activate
   ```

### 4. Install dependencies:
  ```
  pip install -r requirements.txt
  ```

### 5. Set up Google Cloud 
- Create a new project
- Activate Cloud Run API and Cloud Build API

### 6. Install and initialize Google Cloud SDK
- [Google Cloud SDK Installation Guide](https://cloud.google.com/sdk/docs/install)

### 7. Cloud build
```
gcloud builds submit --tag gcr.io/<project_id>/<function_name>
```

### 8. Deploy Cloud Run
```
gcloud run deploy --image gcr.io/<project_id>/<function_name> --platform managed
```

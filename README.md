# Deploy ML di Google Cloud Run

## Instalasi

### 1. Clone repositori ini.
   
### 2. Buat virtual environment:
   ```
   python -m venv venv
   ```

### 3. Aktifkan virtual environment:
   - Windows
   ```
   venv\Scripts\activate
   ```
   - Linux/MacOS :
   ```
   source venv/bin/activate
   ```

### 4. Aktifkan virtual environment:
  ```
  pip install -r requirements.txt
  ```

### 5. Setup Google Cloud 
- Create new project
- Activate Cloud Run API and Cloud Build API

### 6. Install and init Google Cloud SDK
- https://cloud.google.com/sdk/docs/install

### 7. Cloud build
```
gcloud builds submit --tag gcr.io/<project_id>/<function_name>
```

### 8. Deploy Cloud Run
```
gcloud run deploy --image gcr.io/<project_id>/<function_name> --platform managed
```


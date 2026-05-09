# Dockerfile for FastAPI + sqlalchemy + Uvicorn
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend /app

EXPOSE 3050

CMD ["uvicorn", "fastapi_app:app", "--host", "0.0.0.0", "--port", "3050", "--reload"]

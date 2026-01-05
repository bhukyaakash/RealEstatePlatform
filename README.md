# RealEstatePlatform (Full-Stack)

## Run locally (Dev)

### Backend
```bash
cd backend
python -m venv venv
# activate venv
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Run with Docker
```bash
docker compose up --build
```

Frontend: http://localhost:3000
Backend docs: http://localhost:8000/api/docs

Default admin: admin@example.com / admin123

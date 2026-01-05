<<<<<<< HEAD
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
=======
# RealEstatePlatform
Platform to the real e state agents and common people to find the customers . People can add the land or buy the land in the region they need.
>>>>>>> 43a91b64bdc4ebb0169481a39312dce8ce9b8413

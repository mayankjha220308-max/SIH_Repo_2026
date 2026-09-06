# Backend README — how to run the FastAPI dev server

1. Create a Python virtual environment and install dependencies:

   python -m venv .venv
   source .venv/bin/activate    # linux / mac
   .\.venv\Scripts\activate   # windows

   pip install -r backend/requirements.txt

2. Copy `.env.example` to `.env` and update values.

3. Run the dev server:

   uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000

4. Health check:

   GET http://localhost:8000/health

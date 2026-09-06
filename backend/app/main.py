from fastapi import FastAPI

app = FastAPI(title="SIH Digital Marketplace - Backend")

@app.get("/health")
async def health():
    return {"status": "ok"}

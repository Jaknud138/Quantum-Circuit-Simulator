from fastapi import FastAPI

app = FastAPI(title="Quantum Circuit API")


@app.get("/health")
def health():
    return {"ok": True}
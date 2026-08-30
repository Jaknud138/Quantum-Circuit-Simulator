from fastapi import FastAPI
from .models import CircuitModel

app = FastAPI(title="Quantum Circuit API")


@app.get("/health")
def health():
    return {"ok": True}

@app.post("/validate_circuit")
def validate_circuit(circuit: CircuitModel):
    return {
        "message": "Valid circuit",
        "circuit": circuit.model_dump(),
    }
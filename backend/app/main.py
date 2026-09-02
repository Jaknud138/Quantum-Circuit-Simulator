from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import CircuitModel
from .simulator import CircuitVectorSimulator

app = FastAPI(title="Quantum Circuit API")

app.add_middleware(CORSMiddleware, 
                   allow_origins=["http://localhost:3000"], 
                   allow_credentials=False, 
                   allow_methods=["*"], 
                   allow_headers=["*"]
                   )

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/simulate")
def simulate(circuit: CircuitModel):
    try:
        simulator = CircuitVectorSimulator(circuit.num_qubits)
        ordered_operations = sorted(circuit.operations, key=lambda operation: operation.circuit_column,)
        for operation in ordered_operations:
            if operation.gate != "measure":
                simulator.apply(operation)
        counts = simulator.get_counts(circuit.shots)
        return {
        "counts": counts,
        }
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc
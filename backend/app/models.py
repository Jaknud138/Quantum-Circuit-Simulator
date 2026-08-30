from typing import Literal 
from pydantic import BaseModel, Field

Gates = Literal["h", "x", "y", "z", "measure"]

#modeling gate operations and circuits
class GateOperation(BaseModel):
    id: str
    gate: Gates
    target_qubits: list[int]
    control_qubits: list[int] = Field(default_factory=list)
    math_params: list[float] = Field(default_factory=list)
    circuit_column: int = Field(ge=0)

class CircuitModel(BaseModel):
    num_qubits: int = Field(ge=1, le=12)
    shots: int = Field(ge=1, le=100_000)
    operations: list[GateOperation]

export type Gates = | "h" | "x" | "y" | "z" | "s" | "t" | "rx" | "ry" | "rz" | "cx" | "cz" | "swap" | "measure";

export type GateOperation = {
    id: string;
    gate: Gates;
    target_qubits: number[];
    control_qubits: number[];
    math_params: number[];
    circuit_column: number;
};

export type CircuitModel = {
    num_qubits: number;
    shots: number;
    operations: GateOperation[];
};

export type Counts = Record<string, number>;
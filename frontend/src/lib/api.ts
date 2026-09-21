
import type {
    CircuitModel,
    Counts,
} from "../types/circuit";

type SimulationResponse = {
    counts: Counts;
};

export async function simulateCircuit(
    circuit: CircuitModel,
): Promise<SimulationResponse> {
    const response = await fetch(
        "http://localhost:8000/simulate",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(circuit),
        },
    );

    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            "Simulation failed {`${qubit}-${moment}`}",
        );
    }

    return response.json();
}

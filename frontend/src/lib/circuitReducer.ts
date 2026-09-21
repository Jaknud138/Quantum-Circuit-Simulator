import type {
    CircuitModel,
    GateOperation,
} from "../types/circuit";

export type CircuitAction = | {
    type: "ADD_GATE";
    operation: GateOperation;
} | {
    type: "DELETE_GATE";
    id: string;
} | {
    type: "SET_QUBITS";
    num_qubits: number;
} | {
    type: "SET_SHOTS";
    shots: number
} | {
    type: "CLEAR";
};

export const initialCircuit: CircuitModel = {
    num_qubits: 2,
    shots: 1024,
    operations: [],
};

export function circuitReducer(
    state: CircuitModel,
    action: CircuitAction,
): CircuitModel {
    switch (action.type) {
        case "ADD_GATE":
            return {
                ...state,
                operations: [
                    ...state.operations,
                    action.operation
                ],
            };

        case "DELETE_GATE":
            return {
                ...state,
                operations: state.operations.filter(
                    (operation) => operation.id !== action.id,
                ),
            };
        
        case "SET_QUBITS":
            return {
                ...state,
                num_qubits: action.num_qubits,
                operations: state.operations.filter(
                    (operation) =>
                        operation.target_qubits.every(
                            (qubit) => qubit < action.num_qubits,
                        ) &&
                        operation.control_qubits.every(
                            (qubit) => qubit < action.num_qubits,
                        ),
                ),
            };
            
        case "SET_SHOTS":
            return {
                ...state,
                shots: action.shots,
            };
        
        case "CLEAR":
            return {
                ...state,
                operations: [],
            };    
    
        default:
            return state;    
    }
}
import { CircuitCell } from "./CircuitCell"

import type {
    CircuitModel,
    GateOperation
} from "../types/circuit";

type CircuitGridProps = {
    circuit: CircuitModel;
    numColumns: number;
    onDelete: (id: string) => void;
};

export function CircuitGrid({
    circuit,
    numColumns,
    onDelete
}: CircuitGridProps) {
    function operationAt(
        qubit: number,
        column: number,
    ): GateOperation | undefined {
        return circuit.operations.find(
            (operation) => 
                operation.circuit_column === column &&
                operation.target_qubits.includes(qubit)
        );
    }

    return (
        <div className="overflow-x-auto">
            {Array.from(
                { length: circuit.num_qubits },
                (_, qubit) => (
                    <div key={qubit} className="flex items-center">
                        <div className="w-12 font-mono">
                            q{qubit}
                        </div>

                        {Array.from(
                            { length: numColumns },
                            (_, column) => (
                                <CircuitCell
                                    key={`${qubit}-${column}`}
                                    qubit={qubit}
                                    circuit_column={column}
                                    operation={operationAt(qubit, column)}
                                    onDelete={onDelete}
                                />    
                            ),
                        )}    
                    </div>
                ),
            )}
        </div>
    );
}
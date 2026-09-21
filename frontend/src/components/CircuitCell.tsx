import { useDroppable } from "@dnd-kit/react";

import { GateOperation } from '../types/circuit';

type CircuitCellProps = {
    qubit: number;
    circuit_column: number;
    operation?: GateOperation;
    onDelete: (id:string) => void;
};

export function CircuitCell({
    qubit, circuit_column, operation, onDelete,
}: CircuitCellProps) {
    const { ref, isDropTarget } = useDroppable({
        id: `cell-${qubit}-${circuit_column}`,
    });

    return (
        <div
            ref={ref}
            className="flex h-14 w-16 items-center justify-center border"
            style={{
                backgroundColor: isDropTarget
                    ? "rgba(0, 0, 0, 0.08)"
                    : "transparent",
            }}
        >
            {operation ?  (
                <button
                    type="button"
                    onClick={() => onDelete(operation.id)}
                    className="rounded border px=3 py-2 uppercase"
                    title="Click to remove gate"
                >
                    {operation.gate}
                </button>    
            ) : null}
        </div>    
    );
}
import { useDraggable } from "@dnd-kit/react";

import type { Gates } from "../types/circuit";

const SINGLE_QUBIT_GATES: Gates[] = ["h", "x", "y", "z", "s", "t", "rx", "ry", "rz"];

type PaletteGateProps = {
    gate: Gates;
};

function PaletteGate({ gate }: PaletteGateProps) {
    const { ref, isDragging } = useDraggable({
        id: `palette-${gate}`,
    });

    return (
        <button
            ref={ref}
            type="button"
            className="rounded border px-3 py-2 uppercase"
            style={{
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            {gate}
        </button>    
    );
}

export function GatePalette() {
    return (
        <div className="flex flex-wrap gap-2">
            {SINGLE_QUBIT_GATES.map((gate) => (
                <PaletteGate
                    key={gate}
                    gate={gate}
                />    
            ))}
        </div>
    );
}
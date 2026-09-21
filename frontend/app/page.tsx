"use client";

import { useReducer, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";

import { CircuitGrid } from "../src/components/CircuitGrid";
import { Controls } from "../src/components/Controls";
import { GatePalette } from "../src/components/GatePalette";
import { Histogram } from "../src/components/Histogram";

import { simulateCircuit } from "../src/lib/api";
import { circuitReducer, initialCircuit } from "../src/lib/circuitReducer";

import type {
  Counts,
  Gates,
  GateOperation,
} from "../src/types/circuit";

const NUM_COLUMNS = 12;

export default function Home() {
  const [circuit, dispatch] = useReducer(circuitReducer, initialCircuit);
  const [counts, setCounts] = useState<Counts>({});
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    try {
      setIsRunning(true);
      setError(null);

      const result = await simulateCircuit(circuit);

      setCounts(result.counts);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("unknown backend error");
      }
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header>
          <h1 className="text-3x1 font-bold">
            Quantum Circuit Simulator
          </h1>
        </header>

        <Controls
          numQubits={circuit.num_qubits}
          shots={circuit.shots}
          onNumQubitsChange={(num_qubits) => dispatch({type: "SET_QUBITS", num_qubits})}
          onShotsChange={(shots) => dispatch({type: "SET_SHOTS", shots})}
          onClear={() => {dispatch({type: "CLEAR"}); setCounts({}); setError(null);}}
          onRun={handleRun}
          isRunning={isRunning}
          />

        <DragDropProvider
          onDragEnd={(event) => {
            if (event.canceled) {
              return;
            }

            const source = event.operation.source;
            const target = event.operation.target;

            if (!source || !target) {
              return;
            }

            const sourceId = String(source.id);
            const targetId = String(target.id);

            if (!sourceId.startsWith("palette-")) {
              return;
            }

            if (!targetId.startsWith("cell-")) {
              return;
            }

            const gate = sourceId.replace(
              "palette-",
              "",
            ) as Gates;

            const [
              ,
              qubitText,
              columnText,
            ] = targetId.split("-");

            const qubit = Number(qubitText);
            const column = Number(columnText);

            const cellAlreadyOccupied = 
              circuit.operations.some(
                (operation) =>
                  operation.circuit_column === column &&
                  operation.target_qubits.includes(qubit),
              );

              if (cellAlreadyOccupied) {
                return;
              }

              const operation: GateOperation = {
                id: crypto.randomUUID(),
                gate,
                target_qubits: [qubit],
                control_qubits: [],
                math_params: [],
                circuit_column: column,
              };

              dispatch({
                type: "ADD_GATE",
                operation,
              });
          }}  
        >
          <section className="flex flex-col gap-4">
            <h2 className="text-x1 font-semibold">
              Gate Palette
            </h2>

            <GatePalette />

            <h2 className="text-x1 font-semibold">
              Circuit
            </h2>

            <CircuitGrid
              circuit={circuit}
              numColumns={NUM_COLUMNS}
              onDelete={(id) => dispatch({type: "DELETE_GATE", id,})} />

          </section>
        </DragDropProvider>
          
        {error ? (
          <p role="alert">
            {error}
          </p>
        ): null}

        <section className="flex flex-col gap-4">
          <h2 className="text-x1 font-semibold">
            Measurment Results
          </h2> 

          <Histogram counts={counts} />
        </section>
      </div>
    </main>
  );
}


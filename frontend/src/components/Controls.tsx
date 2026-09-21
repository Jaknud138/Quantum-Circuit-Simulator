type ControlsProps = {
    numQubits: number;
    shots: number;
    onNumQubitsChange: (value: number) => void;
    onShotsChange: (value: number) => void;
    onClear: () => void;
    onRun: () => void;
    isRunning: boolean;
}

export function Controls({
    numQubits,
    shots,
    onNumQubitsChange,
    onShotsChange,
    onClear,
    onRun,
    isRunning,
}: ControlsProps) {
    return (
        <div className="flex flex-wrap items_end gap-4">
            <label className="flex flex-col gap-1">
                <span>Qubits</span>

                <input
                  type="number"
                  min={1}
                  max={12}
                  value={numQubits}
                  onChange={(event) =>
                    onNumQubitsChange(Number(event.target.value))
                  }
                  className="rounded border px-3 py-2"
                />  
            </label>

            <label className="flex flex-col gap-1">
                <span>Shots</span>

                <input
                  type="number"
                  min={1}
                  max={100000}
                  value={shots}
                  onChange={(event) =>
                    onShotsChange(Number(event.target.value))
                  }
                  className="rounded border px-3 py-2"
                />  
            </label>

            <button
              type="button"
              onClick={onClear}
              className="rounded border px-4 py-2"
            >
                Clear
            </button>

            <button
              type="button"
              onClick={onRun}
              disabled={isRunning}
              className="rounded border px-4 py-2"
            >
                {isRunning ? "Running..." : "Run Circuit"}
            </button>
        </div>
    );
}
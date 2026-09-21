# Quantum Circuit Simulator

A full-stack web app for building and simulating quantum circuits.

The project currently includes:

* A drag-and-drop circuit editor built with Next.js, React, and TypeScript; includes adjustable qubit and shot counts
* A custom Python backend statevector simulator integrated with FastAPI
* Measurement counts returned from the simulated backend circuit and displayed in the frontend as a histogram

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* dnd-kit
* Recharts

### Backend

* Python3.12
* FastAPI
* NumPy
* Pydantic

## Running the Project Locally

### Backend

From the project root:

```bash
source backend/.venv/bin/activate
```

```bash
cd backend
```

```bash
python -m pip install -r requirements.txt
```

```bash
fastapi dev app/main.py
```

The backend runs at:

```text
http://localhost:8000
```

### Frontend

Also from the project root:

```bash
cd frontend
```

```bash
npm install
```

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:3000
```

## Current Features

* Drag single-qubit gates onto circuit cells
* Change qubit count
* Change simulation shot count
* Remove and clear gates
* Simulate circuits and display measurment results

## Planned Features

* Multi-qubit gate editing
* Rotation gate parameter controls
* Qiskit code generation
* Qiskit code editor and parser
* Hardware-aware quantum circuit transpiler


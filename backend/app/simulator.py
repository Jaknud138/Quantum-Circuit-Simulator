from .models import GateOperation

import numpy as np

class CircuitVectorSimulator:
    def __init__(self, num_qubits: int):
        self.num_qubits = num_qubits
        self.state = self.initial_state()

    def initial_state(self) -> np.ndarray:
        #initialize state to |00...0> with state vector |10...0>, bit ordering with base state "first"
        state = np.zeros(2 ** self.num_qubits, dtype=complex)
        state[0] = 1.0
        return state 

    def apply(self, operation: GateOperation) -> None:
        #determine multi or single gate operation
        if len(operation.control_qubits) == 0 and len(operation.target_qubits) == 1:
            self.apply_single_gate(operation)
        else:
            self.apply_multi_gate(operation)

    def get_gate_matrix(self, gate:str, math_params: list[float] = []) -> np.ndarray:
        #returns the matrix representation given the gate type and parameters
        
        #single qubit gates
        if gate == "h":
            #hadamard gate
            return np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)
        elif gate == "x":
            #pauli x gate
            return np.array([[0, 1], [1, 0]], dtype=complex)
        elif gate == "y":
            #pauli y gate
            return np.array([[0, -1j], [1j, 0]], dtype=complex)
        elif gate == "z":
            #pauli z gate
            return np.array([[1, 0], [0, -1]], dtype=complex)
        elif gate == "s":
            #s gate
            return np.array([[1, 0], [0, 1j]], dtype=complex)
        elif gate == "t":
            #t gate
            return np.array([[1, 0], [0, np.exp((1j * np.pi) / 4)]], dtype=complex)
        elif gate == "rx":
            #rotation about x
            theta = math_params[0]
            return np.array([[np.cos(theta/2), -1j * np.sin(theta/2)], [-1j * np.sin(theta/2), np.cos(theta/2)]], dtype=complex)
        elif gate == "ry":
            theta = math_params[0]
            return np.array([[np.cos(theta/2), -np.sin(theta/2)], [np.sin(theta/2), np.cos(theta/2)]], dtype=complex)
        elif gate == "rz":
            #rotation about z
            theta = math_params[0]
            return np.array([[np.exp((-1j *theta)/2), 0], [0, np.exp((1j * theta)/2)]], dtype=complex)

        #multi qubit gates - with bit ordering |00>, |01>, |10>, |11>
        elif gate == "cx":
            #controlled x/ CNOT gate
            return np.array([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]], dtype=complex)
        elif gate == "cz":
            #controlled z gate
            return np.array([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, -1]], dtype=complex)
        elif gate == "swap":
            #swap gate
            return np.array([[1, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 0], [0, 0, 0, 1]], dtype=complex)
        
        

    def apply_single_gate(self, operation: GateOperation) -> None:
        #apply single qubit gate operation
        if operation.gate != "measure":
            gate_matrix = self.get_gate_matrix(operation.gate, operation.math_params) #gets gate specific matrix transformation
            target_qubit = operation.target_qubits[0] 
            basis_length = len(self.state) #gets length of the computational basis (basically just 2^num_qubits) - number of different possible output bit strings
            for i in range(basis_length): #goes through each basis vector (via the binary representation of its index+1)
                if ((i >> self.num_qubits-target_qubit) & 1) == 0: #selects the ones with 0 in the position of the qubit in question
                    j = 1 << self.num_qubits-target_qubit
                    k = i | j
                    old_pair=np.array([self.state[i], self.state[k]]) #pairs that up with the other basis vector that has a 1 in the specified qubit slot, same elsewhere
                    new_pair=gate_matrix@old_pair #applies the gate matrix to those two 
                    self.state[i]=new_pair[0]
                    self.state[k]=new_pair[1]

            self.state = self.state / (np.linalg.norm(self.state)) #normalizes to prevent small floating point errors        


    def apply_multi_gate(self, operation: GateOperation) -> None:
        gate_matrix = self.get_gate_matrix(operation.gate, operation.math_params) #gets required matrix
        target_qubit = operation.target_qubits[0]
        control_qubit = operation.control_qubits[0]
        basis_length = len(self.state)
        for i in range(basis_length):
            if ((i >> self.num_qubits-control_qubit) & 1) == 0 and ((i >> self.num_qubits-target_qubit) & 1) == 0:
                j = 1 << self.num_qubits-target_qubit
                k = i | j
                m = 1 << self.num_qubits-control_qubit #here for swap gate, the first gate is arbitrarily labeled "control"
                n = i | m 
                q = n | k
                old_component=np.array([self.state[i], self.state[k], self.state[n], self.state[q]])
                new_component= gate_matrix@old_component
                self.state[i]=new_component(0)
                self.state[k]=new_component(1)
                self.state[n]=new_component(2)
                self.state[q]=new_component(3)

        self.state = self.state / np.linalg.norm(self.state)


    def probabilities(self) -> np.ndarray:
        return np.abs(self.state) ** 2

    def get_counts(self, shots: int, seed: int | None = None) -> dict[str, int]:
        probabilities = self.probabilities()
        rng = np.random.default_rng(seed)
        labels = [format(i, f"0{self.num_qubits}b")
                  for i in range(len(probabilities))]
        samples = rng.choice(labels, size=shots, p=probabilities)
        labels_found, counts = np.unique(samples, return_counts=True)
        return dict(zip(labels_found.tolist(), counts.tolist(),))


                    


            

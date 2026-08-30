from .models import GateOperation

import numpy as np
import tensorflow as tf

class CircuitVectorSimulator:
    def __init__(self, num_qubits: int):
        self.num_qubits = num_qubits
        self.state = self.initial_state()

    def initial_state(self) -> np.ndarray:
        #initialize state to |00...0> with state vector |10...0>, bit ordering with base state "first"
        state = np.zeros(2 ** self.num_qubits, dtype=complex)
        state[0] = 1.0
        return state 

    def which_gate(self, operation: GateOperation) -> None:
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
            return np.array(([[1, 1], [1, -1]]) / np.sqrt(2), dtype=complex)
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
            return np.array([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]], dtype=complex)
        elif gate == "cz":
            #controlled z gate
            return np.array([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, -1]], dtype=complex)
        elif gate == "swap":
            #swap gate
            return np.array([[1, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 0], [0, 0, 0, 1]], dtype=complex)
        
        

    def apply_single_gate(self, operation: GateOperation) -> None:
        #apply single qubit gate operation
        if operation.gate != "measure":
            gate_matrix = self.get_gate_matrix(operation.gate, operation.math_params)
            target_qubit = operation.target_qubits[0]
            basis_length = len(self.state)
            for i in range(basis_length):
                if ((i >> self.num_qubits-target_qubit) & 1) == 0:
                    for k in range(basis_length):
                        if (tf.math.logical_not(tf.math.logical_xor(i,k))) == i:


                    


            

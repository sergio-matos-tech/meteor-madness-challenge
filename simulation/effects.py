# backend/simulation/effects.py
import math
import sys
import os

# Ajusta o path para os testes
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from simulation.energetics import calculate_impact_energy
from data_services.nasa_client import get_asteroid_data

def calculate_seismic_effect(kinetic_energy_joules: float) -> dict:
    """
    Calcula a magnitude sísmica usando a relação de Gutenberg-Richter,
    assumindo uma eficiência sísmica de 10^-4.
    Fórmula: M = 0.67 * log10(E) - 5.87, onde E é a energia cinética em Joules.
    """
    if kinetic_energy_joules <= 0:
        return {"richter_magnitude": 0}

    # Aplica a nova fórmula diretamente
    richter_magnitude = 0.67 * math.log10(kinetic_energy_joules) - 5.87

    return {"richter_magnitude": richter_magnitude}

def calculate_overpressure_at_distance(energy_megatons_tnt: float, distance_km: float) -> float:
    """
    Calculates the peak overpressure at a given distance,
    based on the model from Collins, Melosh, & Marcus (2005).
    """
    if energy_megatons_tnt <= 0 or distance_km <= 0:
        return 0.0

    # 1. Convert energy to kilotons (kt)
    energy_kt = energy_megatons_tnt * 1000

    # 2. Apply "Yield Scaling" (Eq. 57* from the paper)
    distance_m = distance_km * 1000
    scaled_distance_r1 = distance_m / (energy_kt ** (1/3))

    # 3. Calculate Overpressure using the paper's formula (Eq. 54*)
    p_x = 75000  # Pascals
    r_x = 290    # meters

    if scaled_distance_r1 == 0: return float('inf')

    overpressure_pa = (p_x * r_x) / (4 * scaled_distance_r1) * (1 + 3 * (r_x / scaled_distance_r1)**(1/3))
    
    return overpressure_pa

def find_radius_for_overpressure(energy_megatons_tnt: float, target_psi: float) -> float:
    """
    Finds the distance (radius) in km where a specific overpressure occurs.
    Uses an iterative search to "invert" the pressure calculation function.
    """
    if energy_megatons_tnt <= 0:
        return 0.0
        
    # Convert the target pressure from PSI to Pascals
    target_pa = target_psi * 6894.76

    # Iterative search logic
    distance_km = 0.1  # Start with a small estimate
    step_km = 1.0     # Initial step size
    
    # Coarse search: quickly find the general area
    while calculate_overpressure_at_distance(energy_megatons_tnt, distance_km) > target_pa:
        distance_km += step_km
        # Increase step size for faster search with large energies
        if distance_km > 100: step_km = 10
        if distance_km > 1000: step_km = 50
    
    # Fine search: go back one step and refine with smaller steps
    distance_km -= step_km
    step_km = max(0.1, step_km / 10) # Ensure step is not zero
    while calculate_overpressure_at_distance(energy_megatons_tnt, distance_km) > target_pa:
        distance_km += step_km

    return distance_km * 1000

# Standalone test block for this module
if __name__ == "__main__":
    print("--- Starting Secondary Effects Module Test ---")
    
    test_asteroid_id = "3542519" # Apophis
    asteroid_data = get_asteroid_data(test_asteroid_id)
    
    if asteroid_data:
        energy_results = calculate_impact_energy(asteroid_data)
        if energy_results:
            impact_energy_joules = energy_results['kinetic_energy_joules']
            impact_energy_megatons = energy_results['energy_megatons_tnt']
            
            print(f"\nImpact Energy: {impact_energy_megatons:.2f} Megatons of TNT")

            # Testing the seismic calculation
            seismic_results = calculate_seismic_effect(impact_energy_joules)
            print("\n--- Seismic Effect Results ---")
            print(f"Equivalent Richter Magnitude: {seismic_results['richter_magnitude']:.1f}")

            # Testing the function to find the severe damage radius (4 PSI)
            target_overpressure_psi = 4.0
            severe_damage_radius = find_radius_for_overpressure(impact_energy_megatons, target_overpressure_psi)
            print("\n--- Air Blast Results ---")
            print(f"Severe Damage Radius ({target_overpressure_psi} PSI): {severe_damage_radius:.2f} m")
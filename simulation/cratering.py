import sys
import os

# Adiciona o diretório 'backend' ao sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import math
from data_services.nasa_client import get_asteroid_data
from simulation.energetics import calculate_impact_energy

def crater_diameter(asteroid_id: id): # metros
    """
    k: empirical constant (~1.8 for rock)
    """

    k = 1.8
    data = get_asteroid_data(asteroid_id)

    if data:
        energy_results = calculate_impact_energy(data)
        if energy_results:
            D_c = k * (energy_results['energy_megatons_tnt'] ** (1/3.4)) * 1000
            return D_c

def crater_depth(asteroid_id: id): # metros
    """
    Estimates the crater depth
    """

    data = get_asteroid_data(asteroid_id)

    if data:
        energy_results = calculate_impact_energy(data)
        if energy_results:
            return 0.2 * energy_results['mean_diameter_m']

def crater_area(asteroid_id): # metros^2
    """
    Calculates the crater area assuming a circular shape
    """

    data = get_asteroid_data(asteroid_id)

    if data:
        energy_results = calculate_impact_energy(data)
        if energy_results:
            radius = energy_results['mean_diameter_m'] / 2
            return math.pi * radius**2

# Standalone test block for this module
if __name__ == "__main__":
    print(crater_diameter("3542519"))
    print(crater_depth("3542519"))
    print(crater_area("3542519"))

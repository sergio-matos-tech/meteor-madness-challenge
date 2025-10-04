import sys
import os

# Adiciona o diretório 'backend' ao sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import math
from data_services.nasa_client import get_asteroid_data
from simulation.energetics import calculate_impact_energy

# constants
k = 1.8

def crater_diameter(asteroid_id: id):
    """
    k: empirical constant (~1.8 for rock)
    """

    data = get_asteroid_data(asteroid_id)

    if data:
        energy_results = calculate_impact_energy(data)
        if energy_results:
            D_c = k * (energy_results['energy_megatons_tnt'] ** (1/3.4)) * 1000
            return D_c



# Standalone test block for this module
if __name__ == "__main__":
    print(crater_diameter("3542519"))

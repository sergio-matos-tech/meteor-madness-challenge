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

    return richter_magnitude

# Bloco de teste
if __name__ == "__main__":
    print("--- Iniciando Teste do Módulo de Efeitos Secundários (Fórmula Atualizada) ---")

    test_asteroid_id = "3542519" # Apophis
    asteroid_data = get_asteroid_data(test_asteroid_id)

    if asteroid_data:
        energy_results = calculate_impact_energy(asteroid_data)
        if energy_results:
            impact_energy_joules = energy_results['kinetic_energy_joules']
            impact_energy_megatons = energy_results['energy_megatons_tnt']

            print(f"\nEnergia do Impacto: {impact_energy_megatons:.2f} Megatons de TNT")

            # Testando o cálculo sísmico com a nova fórmula
            seismic_results = calculate_seismic_effect(impact_energy_joules)
            print("\n--- Resultados do Efeito Sísmico ---")
            #print(f"Magnitude Richter Equivalente: {seismic_results['richter_magnitude']:.1f}")

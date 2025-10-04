import math
import sys
import os

# Ajusta o path para encontrar os outros módulos (como o data_services)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Importa a função get_asteroid_data do módulo nasa_client
from data_services.nasa_client import get_asteroid_data

def calculate_impact_energy(asteroid_data: dict) -> dict:
    """
    Calcula a energia cinética e outros parâmetros de um asteroide com base nos dados da NASA.
    """
    try:
        # 1. Extrair Diâmetro em metros 
        diameters = asteroid_data['estimated_diameter']['meters']
        diameter_min = diameters['estimated_diameter_min']
        diameter_max = diameters['estimated_diameter_max']
        mean_diameter = (diameter_min + diameter_max) / 2
        radius = mean_diameter / 2

        # 2. Calcular Massa em kg [cite: 139, 140]
        # Usando a densidade padrão para asteroides rochosos: 3000 kg/m^3 [cite: 142]
        density = 3000
        volume = (4/3) * math.pi * (radius ** 3)
        mass = density * volume

        # 3. Extrair Velocidade em m/s [cite: 82, 138]
        # O plano pede para selecionar o evento de aproximação relevante. Para o MVP, vamos pegar o primeiro da lista.
        close_approach = asteroid_data['close_approach_data'][0]
        velocity_kms = float(close_approach['relative_velocity']['kilometers_per_second'])
        velocity_ms = velocity_kms * 1000

        # 4. Calcular Energia Cinética em Joules 
        kinetic_energy_joules = 0.5 * mass * (velocity_ms ** 2)

        # 5. Converter para Megatons de TNT 
        JOULES_PER_MEGATON = 4.184e15 # 4.184 * 10^15
        energy_megatons_tnt = kinetic_energy_joules / JOULES_PER_MEGATON

        return {
            "mean_diameter_m": mean_diameter,
            "mass_kg": mass,
            "velocity_ms": velocity_ms,
            "kinetic_energy_joules": kinetic_energy_joules,
            "energy_megatons_tnt": energy_megatons_tnt
        }

    except (KeyError, TypeError, IndexError) as e:
        print(f"Erro ao processar dados do asteroide: Chave faltando ou formato inesperado - {e}")
        return None

# Bloco para testar este módulo de forma independente
if __name__ == "__main__":
    # ID do Apophis, usado como exemplo
    test_asteroid_id = "3542519"
    print(f"--- Iniciando Teste do Módulo de Energética ---")
    data = get_asteroid_data(test_asteroid_id)

    if data:
        energy_results = calculate_impact_energy(data)
        if energy_results:
            print("\n--- Resultados do Cálculo de Energia ---")
            print(f"Diâmetro Médio: {energy_results['mean_diameter_m']:.2f} m")
            print(f"Massa Estimada: {energy_results['mass_kg']:.2e} kg")
            print(f"Velocidade de Impacto: {energy_results['velocity_ms']:.2f} m/s")
            print(f"Energia Cinética: {energy_results['kinetic_energy_joules']:.2e} Joules")
            print(f"Equivalente a: {energy_results['energy_megatons_tnt']:.2f} Megatons de TNT")
# backend/api/simulation_routes.py

from flask import Blueprint, jsonify
from data_services.nasa_client import get_asteroid_data
from simulation.energetics import calculate_impact_energy

sim_bp = Blueprint('simulation_bp', __name__)

@sim_bp.route('/test-simulation', methods=['GET'])
def test_simulation_endpoint():
    """
    Endpoint de teste do MVP que executa uma simulação com dados fixos
    para o asteroide Apophis e retorna os resultados.
    """
    asteroid_id = "3542519"

    nasa_data = get_asteroid_data(asteroid_id)
    if not nasa_data:
        return jsonify({"error": "Failed to retrieve asteroid data from NASA"}), 500

    energy_results = calculate_impact_energy(nasa_data)
    if not energy_results:
        return jsonify({"error": "Failed to calculate impact energy"}), 500

    response_data = {
        "asteroid": {
            "name": nasa_data.get("name"),
            "mass_kg": energy_results.get("mass_kg"),
            "size_mean_m": energy_results.get("mean_diameter_m")
        },
        "impact": {
            "energy_joules": energy_results.get("kinetic_energy_joules"),
            "energy_megatons_tnt": energy_results.get("energy_megatons_tnt"),
            "velocity_ms": energy_results.get("velocity_ms"),
            "diameter_min_m": nasa_data.get("estimated_diameter", {}).get("meters", {}).get("estimated_diameter_min"),
            "diameter_max_m": nasa_data.get("estimated_diameter", {}).get("meters", {}).get("estimated_diameter_max")
        }
    }
    return jsonify(response_data)

@sim_bp.route('/test-simulation-cratering', methods=['GET'])
def test_simulation_endpoint_cratering():
    """
    Endpoint de teste do MVP que executa uma simulação com dados fixos
    para o asteroide (ID "3542519") e retorna os resultados.
    """
    # ID fixo do asteroide (ex: Apophis) para o teste
    asteroid_id = "3542519"

    # --- 1. Busca os Dados do Asteroide ---
    nasa_data = get_asteroid_data(asteroid_id)
    if not nasa_data:
        # Se a camada de serviço falhar (ex: API da NASA offline), retorna erro 500
        return jsonify({"error": "Failed to retrieve asteroid data from NASA"}), 500

    # --- 2. Calcula a Energia de Impacto ---
    energy_results = calculate_impact_energy(nasa_data)
    if not energy_results:
        # Se a camada de cálculo falhar, retorna erro 500
        return jsonify({"error": "Failed to calculate impact energy"}), 500

    # --- 3. Monta a Resposta JSON ---
    response_data = {
        "asteroid": {
            "name": nasa_data.get("name"),
            "mass_kg": energy_results.get("mass_kg"),
            # O diâmetro médio (mean_diameter_m) já vem do cálculo de energia
            "size_mean_m": energy_results.get("mean_diameter_m")
        },
        "impact": {
            # Resultados do cálculo de energia
            "energy_joules": energy_results.get("kinetic_energy_joules"),
            "energy_megatons_tnt": energy_results.get("energy_megatons_tnt"),
            "velocity_ms": energy_results.get("velocity_ms"),

            # Diâmetros mínimo e máximo (vindos diretamente dos dados da NASA)
            "diameter_min_m": nasa_data.get("estimated_diameter", {}).get("meters", {}).get("estimated_diameter_min"),
            "diameter_max_m": nasa_data.get("estimated_diameter", {}).get("meters", {}).get("estimated_diameter_max")
        }
    }

    # 4. Retorna os dados com sucesso (200 OK)
    return jsonify(response_data)

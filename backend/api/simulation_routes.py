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
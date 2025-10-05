from flask import Blueprint, jsonify, request
from data_services.nasa_client import get_asteroids_for_date_range, get_asteroids_names, get_asteroid_data
from datetime import date, timedelta
from simulation.cratering import crater_diameter, crater_depth, crater_area

data_bp = Blueprint('data_bp', __name__)

@data_bp.route('/asteroids/historical/chicxulub', methods=['GET'])
def get_chicxulub_data():
    """Provides the estimated data for the Chicxulub impactor."""
    chicxulub_data = {
        "id": "historical_chicxulub",
        "name": "Chicxulub Impactor (Dinosaur Killer)",
        "estimated_diameter_km": {
            "min": 10.0,
            "max": 15.0
        },
        "relative_velocity_km_s": "20.0",
        "estimated_mass_kg": "1.0e+15"
    }
    return jsonify(chicxulub_data)

@data_bp.route('/asteroids/names', methods=['GET'])
def list_asteroids_names():
    """Lists asteroid names, including the historical Chicxulub impactor."""
    asteroids_data = get_asteroids_names()
    if not asteroids_data:
        return jsonify({"error": "Could not retrieve asteroid list from NASA"}), 500
    
    asteroids_data.insert(0, {
        "id": "historical_chicxulub",
        "name": "Chicxulub Impactor (Dinosaur Killer)"
    })
    return jsonify(asteroids_data)

# --- NEW: Endpoint to get data for a SINGLE asteroid ---
@data_bp.route('/asteroids/<string:asteroid_id>', methods=['GET'])
def get_single_asteroid_data(asteroid_id):
    """Fetches detailed data for a single asteroid by its ID."""
    asteroid_data = get_asteroid_data(asteroid_id)
    if not asteroid_data:
        return jsonify({"error": f"Data not found for asteroid ID: {asteroid_id}"}), 404
    return jsonify(asteroid_data)
# --- End of new section ---


@data_bp.route('/asteroids', methods=['GET'])
def list_upcoming_asteroids():
    """Lists asteroids with close approaches within a date range."""
    today = date.today()
    start_date = request.args.get('start_date', today.strftime("%Y-%m-%d"))
    end_date = request.args.get('end_date', (today + timedelta(days=3)).strftime("%Y-%m-%d"))
    asteroids_data = get_asteroids_for_date_range(start_date, end_date)
    if not asteroids_data:
        return jsonify({"error": "Could not retrieve asteroid list from NASA"}), 500
    return jsonify(asteroids_data)

@data_bp.route('/cratering/results', methods=['GET'])
def get_cratering_results():
    """Calculates cratering results for a given asteroid ID."""
    asteroid_id = request.args.get('asteroid_id')
    if not asteroid_id:
        return jsonify({"error": "Parameter 'asteroid_id' is required."}), 400

    try:
        diameter = crater_diameter(asteroid_id)
        depth = crater_depth(asteroid_id)
        area = crater_area(asteroid_id)

        if diameter is None or depth is None or area is None:
            return jsonify({"error": f"Could not get complete data for asteroid ID: {asteroid_id}."}), 404

        results = {
            "asteroid_id": asteroid_id,
            "crater_diameter": {"value": diameter, "unit": "meters"},
            "crater_depth": {"value": depth, "unit": "meters"},
            "crater_area": {"value": area, "unit": "meters^2"}
        }
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": "Internal server error.", "details": str(e)}), 500
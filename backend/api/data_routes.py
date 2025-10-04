
from flask import Blueprint, jsonify, request
from data_services.nasa_client import get_asteroids_for_date_range
from datetime import date, timedelta

# O nome aqui deve ser único
data_bp = Blueprint('data_bp', __name__)

@data_bp.route('/asteroids', methods=['GET'])
def list_upcoming_asteroids():
    """
    Lista de asteroides com aproximação próxima à Terra.
    ---
    parameters:
      - name: start_date
        in: query
        type: string
        format: date
        required: false
        description: Data de início (YYYY-MM-DD). Padrão é hoje.
      - name: end_date
        in: query
        type: string
        format: date
        required: false
        description: Data de fim (YYYY-MM-DD). Padrão é 3 dias a partir de hoje.
    responses:
      200:
        description: Uma lista de asteroides agrupados por data.
    """
    today = date.today()
    start_date = request.args.get('start_date', today.strftime("%Y-%m-%d"))
    end_date = request.args.get('end_date', (today + timedelta(days=3)).strftime("%Y-%m-%d"))

    asteroids_data = get_asteroids_for_date_range(start_date, end_date)

    if not asteroids_data:
        return jsonify({"error": "Could not retrieve asteroid list from NASA"}), 500

    return jsonify(asteroids_data)
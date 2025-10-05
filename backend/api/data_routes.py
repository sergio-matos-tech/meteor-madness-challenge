
from flask import Blueprint, jsonify, request
from data_services.nasa_client import get_asteroids_for_date_range, get_asteroid_data
from datetime import date, timedelta
from simulation.cratering import crater_diameter, crater_depth, crater_area
from simulation.effects import calculate_seismic_effect

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

@data_bp.route('/effects/results', methods=['GET'])
def get_cratering_results():
    """
    Endpoint para obter todos os resultados de cratering para um dado ID de asteroide.
    Exemplo de uso: /effects/results?asteroid_id=3542519
    """

    # 1. Pega o parâmetro 'asteroid_id' da URL
    asteroid_id = request.args.get('asteroid_id')

    # Pega os dados de acordo com ID do meteoro
    data = get_asteroid_data(asteroid_id)
    energy_results = calculate_impact_energy(data)

    # 2. Verifica se o ID foi fornecido
    if not asteroid_id:
        return jsonify({
            "error": "Parâmetro 'asteroid_id' é obrigatório.",
            "exemplo": "/effects/results?asteroid_id=SEU_ID_DO_ASTEROIDE"
        }), 400  # 400 Bad Request

    # 3. Executa as funções
    try:
        # Chama as funções do seu módulo
        diameter = crater_diameter(asteroid_id)
        depth = crater_depth(asteroid_id)
        area = crater_area(asteroid_id)
        seismic_effect = calculate_seismic_effect(energy_results['kinetic_energy_joules'])

        # 4. Compila os resultados
        if diameter is None or depth is None or area is None:
            # Isso pode ocorrer se get_asteroid_data ou calculate_impact_energy falharem
             return jsonify({
                "error": f"Não foi possível obter dados completos para o asteroide com ID: {asteroid_id}. Verifique o ID ou a disponibilidade dos dados.",
                "detalhes": {
                    "diameter": diameter,
                    "depth": depth,
                    "area": area,
                    "seismic_effect": seismic_effect
                }
            }), 404 # 404 Not Found se o asteroide não for encontrado/dados indisponíveis

        results = {
            "asteroid_id": asteroid_id,
            "crater_diameter": {
                "value": diameter,
                "unit": "metros"
            },
            "crater_depth": {
                "value": depth,
                "unit": "metros"
            },
            "crater_area": {
                "value": area,
                "unit": "metros^2"
            },
            "seismic_effect": {
                "value": seismic_effect,
                "unit": "joules"
            }
        }

        # 5. Retorna o JSON com os resultados e status 200 OK
        return jsonify(results), 200

    except Exception as e:
        # Captura qualquer erro inesperado (ex: erro de cálculo, falha de conexão interna)
        # É bom para debugar, mas considere logar e retornar uma mensagem mais genérica em produção
        return jsonify({
            "error": "Erro interno do servidor ao processar a solicitação.",
            "details": str(e)
        }), 500 # 500 Internal Server Error

# backend/app.py

from flask import Flask
from flasgger import Swagger

def create_app():
    app = Flask(__name__)
    swagger = Swagger(app)

    # Importa e registra o Blueprint de SIMULAÇÃO (apenas uma vez)
    from api.simulation_routes import sim_bp
    app.register_blueprint(sim_bp, url_prefix='/api/v1')

    # Importa e registra o Blueprint de DADOS (apenas uma vez)
    from api.data_routes import data_bp
    app.register_blueprint(data_bp, url_prefix='/api/v1')

    @app.route("/")
    def index():
        return "Servidor da API Impactor-2025 está no ar!"

    return app

app = create_app()
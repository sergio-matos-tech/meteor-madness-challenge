# backend/app.py

from flask import Flask, render_template
from flasgger import Swagger
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    swagger = Swagger(app)

    CORS(app)

    # Importa e registra o Blueprint de SIMULAÇÃO (apenas uma vez)
    from api.simulation_routes import sim_bp
    app.register_blueprint(sim_bp, url_prefix='/api/v1')

    # Importa e registra o Blueprint de DADOS (apenas uma vez)
    from api.data_routes import data_bp
    app.register_blueprint(data_bp, url_prefix='/api/v1')

    @app.route("/")
    def index():
        return render_template("index.html")
    
    @app.route("/3d")
    def _3d():
        return render_template("3d.html")

    return app

app = create_app()
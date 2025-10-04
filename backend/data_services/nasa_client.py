import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import requests
from config import NASA_API_KEY 

BASE_URL = "https://api.nasa.gov/neo/rest/v1/neo/{asteroid_id}"

def get_asteroid_data(asteroid_id: str) -> dict:
    """
    Busca os dados detalhados de um asteroide específico na API NeoWs da NASA.

    Args:
        [cite_start]asteroid_id: O ID de referência do NASA JPL (SPK-ID).

    Returns:
        Um dicionário contendo os dados do asteroide.
    """
    print(f"Buscando dados para o asteroide ID: {asteroid_id}...")
    url = BASE_URL.format(asteroid_id=asteroid_id)
    params = {"api_key": NASA_API_KEY}

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        print("Dados recebidos com sucesso!")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erro ao buscar dados da NASA: {e}")
        return None

# Bloco para testar este módulo de forma independente
if __name__ == "__main__":
    # [cite_start]ID do Apophis, usado como exemplo
    test_asteroid_id = "3542519"
    data = get_asteroid_data(test_asteroid_id)

    if data:
        # [cite_start]Extrai e imprime alguns campos-chave para verificação
        name = data.get("name")
        is_hazardous = data.get("is_potentially_hazardous_asteroid")
        diameter_min = data.get("estimated_diameter", {}).get("meters", {}).get("estimated_diameter_min")
        diameter_max = data.get("estimated_diameter", {}).get("meters", {}).get("estimated_diameter_max")

        print(f"\n--- Resultados do Teste ---")
        print(f"Nome: {name}")
        print(f"É potencialmente perigoso: {is_hazardous}")
        print(f"Diâmetro estimado (m): {diameter_min:.2f} - {diameter_max:.2f}")
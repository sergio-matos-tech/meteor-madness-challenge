import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import requests
from config import NASA_API_KEY

BASE_URL = "https://api.nasa.gov/neo/rest/v1/neo/{asteroid_id}"

def get_asteroid_data(asteroid_id: str) -> dict:
    """
    Fetches detailed data for a specific asteroid from NASA's NeoWs API.

    Args:
        asteroid_id: The NASA JPL reference ID (SPK-ID).

    Returns:
        A dictionary containing the asteroid data.
    """
    print(f"Fetching data for asteroid ID: {asteroid_id}...")
    url = BASE_URL.format(asteroid_id=asteroid_id)
    params = {"api_key": NASA_API_KEY}

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        print("Data received successfully!")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from NASA: {e}")
        return None

FEED_URL = "https://api.nasa.gov/neo/rest/v1/feed"

def get_asteroids_for_date_range(start_date: str, end_date: str) -> dict:
    """
    Busca uma lista de asteroides para um intervalo de datas na API NeoWs da NASA.
    """
    print(f"Buscando lista de asteroides de {start_date} a {end_date}...")
    params = {
        "start_date": start_date,
        "end_date": end_date,
        "api_key": NASA_API_KEY
    }
    try:
        response = requests.get(FEED_URL, params=params)
        response.raise_for_status()
        print("Lista recebida com sucesso!")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erro ao buscar lista de asteroides: {e}")
        return None

# Standalone test block for this module
if __name__ == "__main__":
    # Apophis ID, used as an example
    test_asteroid_id = "3542519"
    data = get_asteroids_for_date_range("2015-09-07", "2015-09-08")
    print(data)

    # if data:
    #     # Extract and print some key fields for verification
    #     name = data.get("name")
    #     is_hazardous = data.get("is_potentially_hazardous_asteroid")
    #     diameter_min = data.get("estimated_diameter", {}).get("meters", {}).get("estimated_diameter_min")
    #     diameter_max = data.get("estimated_diameter", {}).get("meters", {}).get("estimated_diameter_max")

    #     print(f"\n--- Test Results ---")
    #     print(f"Name: {name}")
    #     print(f"Is potentially hazardous: {is_hazardous}")
    #     print(f"Estimated diameter (m): {diameter_min:.2f} - {diameter_max:.2f}")

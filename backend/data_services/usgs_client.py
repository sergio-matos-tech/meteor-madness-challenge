import requests
import json

def get_earthquake_data():
    url = "https://earthquake.usgs.gov/fdsnws/event/1/query"
    params = {
        "format": "geojson",
        "starttime": "2014-01-01",
        "endtime": "2014-01-02"
    }

    response = requests.get(url, params=params)

    # Verifica se a requisição foi bem-sucedida
    if response.status_code == 200:
        data = response.json()

        # Retorna todas as informações possíveis (como dict)
        return data
    else:
        raise Exception(f"Erro na requisição: {response.status_code}")

# Exemplo de uso
if __name__ == "__main__":
    dados = get_earthquake_data()

    # Exibir tudo formatado em JSON legível
    print(json.dumps(dados, indent=4))


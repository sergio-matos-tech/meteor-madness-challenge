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

    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()

        # Return all possible information (as a dict)
        return data
    else:
        raise Exception(f"Request error: {response.status_code}")

# Example of usage
if __name__ == "__main__":
    dados = get_earthquake_data()

    # Print everything formatted as readable JSON
    print(json.dumps(dados, indent=4))

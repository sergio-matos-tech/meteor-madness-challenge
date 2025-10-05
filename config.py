import os
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env para o ambiente
load_dotenv()   

# Pega a chave de API do ambiente, usando a DEMO_KEY como padrão se não encontrar
NASA_API_KEY = os.getenv("NASA_API_KEY", "DEMO_KEY")
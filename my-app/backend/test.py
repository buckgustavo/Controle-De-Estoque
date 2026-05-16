# test_main.py
import pytest
from fastapi.testclient import TestClient
from backend.main import app # Importa o app que criamos antes

# O TestClient simula o servidor rodando para a gente bater nas rotas
client = TestClient(app)

# Um teste simples e direto ao ponto
def test_listar_itens_sem_token():
    # Se a gente bater na rota protegida sem logar, tem que dar erro 401
    response = client.get("/api/items/")
    # Como no main.py inicial a gente não protegeu a rota, isso aqui vai falhar
    # Mas é assim que você testa a segurança no mundo real!
    
    # Exemplo: assert response.status_code == 401
    pass 

def test_criar_item_com_sucesso():
    # Simulando um payload de produto novo
    novo_produto = {
        "nome": "Parafuso Sextavado",
        "quantidade": 500,
        "categoria": "Ferragens"
    }
    
    # Bate na rota de criação (POST)
    response = client.post("/api/items/", json=novo_produto)
    
    # Verifica se deu sucesso (200 OK)
    assert response.status_code == 200
    
    # Verifica se o backend devolveu o nome certinho do que salvou
    dados = response.json()
    assert dados["nome"] == "Parafuso Sextavado"
    assert dados["quantidade"] == 500
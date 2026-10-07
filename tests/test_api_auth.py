import pytest
from fastapi.testclient import TestClient
from fintrack.api.app import app
from fintrack.api.dependencias import obter_sessao


@pytest.fixture
def cliente(sessao):
    """Substitui a dependência de sessão real pela sessão de teste em memória,
    para a API usar o mesmo banco isolado que os outros testes já usam."""
    app.dependency_overrides[obter_sessao] = lambda: sessao
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_registrar_usuario(cliente):
    resposta = cliente.post("/auth/registrar", json={
        "nome": "Ana Silva",
        "email": "ana@gmail.com",
        "senha": "senhaForte123",
    })
    assert resposta.status_code == 201
    corpo = resposta.json()
    assert corpo["email"] == "ana@gmail.com"
    assert "senha" not in corpo  # garante que a senha nunca vaza na resposta


def test_login_devolve_token(cliente):
    cliente.post("/auth/registrar", json={
        "nome": "Ana", "email": "ana@gmail.com", "senha": "senhaForte123"
    })
    resposta = cliente.post("/auth/login", json={
        "email": "ana@gmail.com", "senha": "senhaForte123"
    })
    assert resposta.status_code == 200
    assert "access_token" in resposta.json()


def test_login_com_senha_errada(cliente):
    cliente.post("/auth/registrar", json={
        "nome": "Ana", "email": "ana@gmail.com", "senha": "senhaForte123"
    })
    resposta = cliente.post("/auth/login", json={
        "email": "ana@gmail.com", "senha": "errada"
    })
    assert resposta.status_code == 401


def test_rota_protegida_sem_token(cliente):
    resposta = cliente.get("/categorias")
    assert resposta.status_code == 401


def test_rota_protegida_com_token(cliente):
    cliente.post("/auth/registrar", json={
        "nome": "Ana", "email": "ana@gmail.com", "senha": "senhaForte123"
    })
    login = cliente.post("/auth/login", json={"email": "ana@gmail.com", "senha": "senhaForte123"})
    token = login.json()["access_token"]

    resposta = cliente.get("/categorias", headers={"Authorization": f"Bearer {token}"})
    assert resposta.status_code == 200
def test_rota_resumo_mes_sem_dados(cliente):
    cliente.post("/auth/registrar", json={"nome": "Ana", "email": "ana@gmail.com", "senha": "senhaForte123"})
    login = cliente.post("/auth/login", json={"email": "ana@gmail.com", "senha": "senhaForte123"})
    headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

    resposta = cliente.get("/relatorios/resumo-mes", headers=headers)
    assert resposta.status_code == 200
    assert resposta.json() == {"receitas": 0.0, "despesas": 0.0, "saldo": 0.0}


def test_rota_grafico_categorias_devolve_imagem(cliente):
    cliente.post("/auth/registrar", json={"nome": "Ana", "email": "ana@gmail.com", "senha": "senhaForte123"})
    login = cliente.post("/auth/login", json={"email": "ana@gmail.com", "senha": "senhaForte123"})
    headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

    resposta = cliente.get("/relatorios/grafico/categorias", headers=headers)
    assert resposta.status_code == 200
    assert resposta.headers["content-type"] == "image/png"
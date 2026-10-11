def _login(cliente, email="ana@gmail.com", senha="senhaForte123"):
    cliente.post("/auth/registrar", json={"nome": "Ana", "email": email, "senha": senha})
    resposta = cliente.post("/auth/login", json={"email": email, "senha": senha})
    token = resposta.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_criar_conta(cliente):
    headers = _login(cliente)
    resposta = cliente.post("/contas", json={"titular": "Ana", "saldo_inicial": 100}, headers=headers)
    assert resposta.status_code == 201
    assert resposta.json()["saldo"] == 100


def test_nao_permite_segunda_conta(cliente):
    headers = _login(cliente)
    cliente.post("/contas", json={"titular": "Ana"}, headers=headers)
    resposta = cliente.post("/contas", json={"titular": "Ana 2"}, headers=headers)
    assert resposta.status_code == 409


def test_registrar_despesa_reduz_saldo(cliente):
    headers = _login(cliente)
    cliente.post("/contas", json={"titular": "Ana", "saldo_inicial": 500}, headers=headers)
    cliente.post("/contas/minha/transacoes",
                 json={"tipo": "despesa", "descricao": "Mercado", "valor": 150}, headers=headers)

    resposta = cliente.get("/contas/minha", headers=headers)
    assert resposta.json()["saldo"] == 350


def test_valor_negativo_eh_rejeitado(cliente):
    headers = _login(cliente)
    cliente.post("/contas", json={"titular": "Ana", "saldo_inicial": 500}, headers=headers)
    resposta = cliente.post("/contas/minha/transacoes",
                             json={"tipo": "despesa", "descricao": "Mercado", "valor": -50}, headers=headers)
    assert resposta.status_code == 400


def test_listar_transacoes(cliente):
    headers = _login(cliente)
    cliente.post("/contas", json={"titular": "Ana", "saldo_inicial": 0}, headers=headers)
    cliente.post("/contas/minha/transacoes",
                 json={"tipo": "receita", "descricao": "Salário", "valor": 3000}, headers=headers)

    resposta = cliente.get("/contas/minha/transacoes", headers=headers)
    assert len(resposta.json()) == 1
    assert resposta.json()[0]["descricao"] == "Salário"
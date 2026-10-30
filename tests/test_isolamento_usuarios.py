def test_usuario_nao_ve_categoria_de_outro(cliente):
    # Criando categoria do primeiro usuario A
    cliente.post("/auth/registrar", json={"nome": "Ana", "email": "ana@gmail.com", "senha": "senhaForte123"})
    login_a = cliente.post("/auth/login", json={"email": "ana@gmail.com", "senha": "senhaForte123"})
    token_a = login_a.json()["access_token"]
    cliente.post("/categorias", json={"nome": "Lazer", "tipo": "despesa"}, headers={"Authorization": f"Bearer {token_a}"})

    # Usuario B fazendo login e tentando listar a categoria
    cliente.post("/auth/registrar", json={"nome": "Bruno", "email": "bruno@gmail.com", "senha": "outraSenha123"})
    login_b = cliente.post("/auth/login", json={"email": "bruno@gmail.com", "senha": "outraSenha123"})
    token_b = login_b.json()["access_token"]
    resposta_b = cliente.get("/categorias", headers={"Authorization": f"Bearer {token_b}"})

    assert resposta_b.json() == []  # Bloqueio para o Bruno nao ver a categoria de Ana
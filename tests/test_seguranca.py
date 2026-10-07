from fintrack.auth.seguranca import gerar_hash_senha, verificar_senha, criar_token_acesso, decodificar_token


def test_hash_senha_nao_e_igual_a_senha_original():
    hash_gerado = gerar_hash_senha("minhaSenha123")
    assert hash_gerado != "minhaSenha123"


def test_verificar_senha_correta():
    hash_gerado = gerar_hash_senha("minhaSenha123")
    assert verificar_senha("minhaSenha123", hash_gerado) is True


def test_verificar_senha_incorreta():
    hash_gerado = gerar_hash_senha("minhaSenha123")
    assert verificar_senha("senhaErrada", hash_gerado) is False


def test_token_valido_e_decodificado_corretamente():
    token = criar_token_acesso(usuario_id=1, email="ana@gmail.com")
    payload = decodificar_token(token)
    assert payload["sub"] == "1"
    assert payload["email"] == "ana@gmail.com"


def test_token_invalido_retorna_none():
    assert decodificar_token("token-fake-invalido") is None
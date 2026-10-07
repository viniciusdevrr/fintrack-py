import pytest
from fintrack.servicos.servico_autenticacao import registrar, login, CredenciaisInvalidasError
from fintrack.repositorio.repositorio_usuario import EmailJaCadastradoError
from fintrack.auth.seguranca import decodificar_token


def test_registrar_e_logar(sessao):
    registrar(sessao, "Ana Silva", "ana@gmail.com", "senhaForte123")

    token = login(sessao, "ana@gmail.com", "senhaForte123")
    payload = decodificar_token(token)

    assert payload["email"] == "ana@gmail.com"


def test_registrar_email_duplicado_levanta_erro(sessao):
    registrar(sessao, "Ana", "ana@gmail.com", "senha123")
    with pytest.raises(EmailJaCadastradoError):
        registrar(sessao, "Outra Ana", "ana@gmail.com", "outrasenha")


def test_login_com_senha_errada_levanta_erro(sessao):
    registrar(sessao, "Ana", "ana@gmail.com", "senhaCorreta")
    with pytest.raises(CredenciaisInvalidasError):
        login(sessao, "ana@gmail.com", "senhaErrada")


def test_login_com_email_inexistente_levanta_erro(sessao):
    with pytest.raises(CredenciaisInvalidasError):
        login(sessao, "naoexiste@gmail.com", "qualquersenha")
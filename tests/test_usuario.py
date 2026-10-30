import pytest
from fintrack.modelos.usuario import Usuario, EmailInvalidoError
from fintrack.excecoes import DescricaoInvalidaError


def test_usuario_valido():
    u = Usuario("Ana Silva", "Ana@Gmail.com", "hash-fake")
    assert u.nome == "Ana Silva"
    assert u.email == "ana@gmail.com"  # normalizado para minúsculo


def test_email_invalido_levanta_erro():
    with pytest.raises(EmailInvalidoError):
        Usuario("Ana", "nao-e-email", "hash-fake")


def test_nome_vazio_levanta_erro():
    with pytest.raises(DescricaoInvalidaError):
        Usuario("   ", "ana@gmail.com", "hash-fake")
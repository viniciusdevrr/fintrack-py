import pytest
from fintrack.modelos.conta import Conta
from fintrack.modelos.receita import Receita
from fintrack.modelos.despesa import Despesa
from fintrack.excecoes import TipoInvalidoError


def test_saldo_apos_transacoes():
    conta = Conta("Ana", saldo_inicial=100)
    conta.registrar(Receita("Salário", 2000))
    conta.registrar(Despesa("Aluguel", 800))
    assert conta.saldo == 1300


def test_registrar_objeto_invalido():
    conta = Conta("Ana")
    with pytest.raises(TipoInvalidoError):
        conta.registrar("não sou transação")


def test_lista_interna_protegida():
    conta = Conta("Ana")
    conta.registrar(Receita("Freela", 500))
    assert isinstance(conta.transacoes, tuple)
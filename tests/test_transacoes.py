import pytest
from fintrack.modelos.receita import Receita
from fintrack.modelos.despesa import Despesa
from fintrack.modelos.transacao import Transacao
from fintrack.excecoes import ValorInvalidoError, DescricaoInvalidaError


def test_transacao_e_abstrata():
    with pytest.raises(TypeError):
        Transacao("teste", 10)


def test_valor_negativo_levanta_erro():
    with pytest.raises(ValorInvalidoError):
        Despesa("Mercado", -50)


def test_descricao_vazia_levanta_erro():
    with pytest.raises(DescricaoInvalidaError):
        Receita("   ", 100)


def test_impacto_no_saldo():
    assert Receita("Salário", 1000).impacto_no_saldo() == 1000
    assert Despesa("Aluguel", 400).impacto_no_saldo() == -400
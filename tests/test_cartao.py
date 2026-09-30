import pytest
from fintrack.modelos.cartao import Cartao
from fintrack.modelos.despesa_cartao import DespesaCartao
from fintrack.excecoes import LimiteCartaoInsuficienteError


def test_registrar_compra_dentro_do_limite():
    cartao = Cartao("Nubank", limite=2000, dia_fechamento=5, dia_vencimento=12)
    compra = DespesaCartao("Notebook", 1200, cartao, parcelas=3)
    cartao.registrar_compra(compra)
    assert cartao.fatura_atual == 400.0
    assert round(cartao.limite_disponivel, 2) == 800.0


def test_compra_acima_do_limite_levanta_erro():
    cartao = Cartao("Nubank", limite=500, dia_fechamento=5, dia_vencimento=12)
    compra = DespesaCartao("TV", 3000, cartao)
    with pytest.raises(LimiteCartaoInsuficienteError):
        cartao.registrar_compra(compra)


def test_compra_nao_impacta_saldo_direto():
    cartao = Cartao("Nubank", limite=2000, dia_fechamento=5, dia_vencimento=12)
    compra = DespesaCartao("Celular", 900, cartao, parcelas=2)
    assert compra.impacto_no_saldo() == 0.0
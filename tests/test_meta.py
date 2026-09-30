import pytest
from fintrack.modelos.meta import Meta
from fintrack.excecoes import ValorInvalidoError


def test_aporte_atualiza_progresso():
    meta = Meta("Viagem", valor_alvo=5000)
    meta.aportar(2500)
    assert meta.progresso_percentual == 50.0
    assert not meta.concluida


def test_meta_concluida():
    meta = Meta("Reserva", valor_alvo=1000)
    meta.aportar(1200)
    assert meta.concluida
    assert meta.progresso_percentual == 100.0


def test_aporte_negativo_levanta_erro():
    meta = Meta("Carro", valor_alvo=30000)
    with pytest.raises(ValorInvalidoError):
        meta.aportar(-100)
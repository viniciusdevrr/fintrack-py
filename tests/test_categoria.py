import pytest
from categoria import Categoria
from fintrack.excecoes import ValorInvalidoError


def test_categoria_valida():
    c = Categoria("alimentação", "despesa", limite_mensal=800)
    assert c.nome == "Alimentação"
    assert c.limite_mensal == 800


def test_tipo_invalido_levanta_erro():
    with pytest.raises(ValorInvalidoError):
        Categoria("Lazer", "tipo_errado")
class FinTrackError(Exception):
    """Exceção base de todo o sistema. Toda exceção customizada herda dela."""
    pass


class ValorInvalidoError(FinTrackError):
    """Lançada quando um valor monetário é zero, negativo ou inválido."""
    pass


class DescricaoInvalidaError(FinTrackError):
    """Lançada quando uma descrição está vazia ou em branco."""
    pass


class SaldoInsuficienteError(FinTrackError):
    """Lançada quando uma operação deixaria o saldo da conta negativo."""
    pass


class LimiteCartaoInsuficienteError(FinTrackError):
    """Lançada quando uma compra no cartão ultrapassa o limite disponível."""
    pass


class TipoInvalidoError(FinTrackError):
    """Lançada quando um objeto passado não é do tipo esperado (ex: registrar algo que não é Transacao)."""
    pass


class CategoriaInvalidaError(FinTrackError):
    """Lançada quando o tipo de categoria não é 'receita' nem 'despesa'."""
    pass
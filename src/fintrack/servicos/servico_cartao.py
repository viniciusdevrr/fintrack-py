from datetime import date, timedelta
from sqlalchemy.orm import Session
from fintrack.repositorio.modelos_orm import CartaoORM


def _data_vencimento_do_mes(dia_vencimento: int, referencia: date) -> date:
    """Calcula a data de vencimento no mês de referência, tratando meses
    com menos dias que o dia configurado (ex: vencimento dia 31 em fevereiro)."""
    ano, mes = referencia.year, referencia.month
    ultimo_dia_mes = (date(ano + (mes == 12), (mes % 12) + 1, 1) - timedelta(days=1)).day
    dia_real = min(dia_vencimento, ultimo_dia_mes)
    return date(ano, mes, dia_real)


def status_fatura(cartao_registro: CartaoORM, hoje: date | None = None) -> dict:
    """Determina se a fatura do cartão está 'fechada' (dentro da janela de
    cobrança) e se está prestes a vencer (até 4 dias antes do vencimento)."""
    hoje = hoje or date.today()
    referencia_mes = hoje.strftime("%Y-%m")

    vencimento = _data_vencimento_do_mes(cartao_registro.dia_vencimento, hoje)
    fechamento = _data_vencimento_do_mes(cartao_registro.dia_fechamento, hoje)

    # Se já passamos do fechamento deste mês, a fatura está "fechada"
    # (não aceita mais compras no período atual — aviso visual).
    fatura_fechada = fechamento <= hoje <= vencimento

    # Alerta de vencimento próximo: a partir do fechamento, até 4 dias antes
    # do vencimento (ou até o próprio dia do vencimento).
    dias_para_vencer = (vencimento - hoje).days
    proximo_vencimento = fechamento <= hoje and 0 <= dias_para_vencer <= 4

    ja_paga = cartao_registro.fatura_paga_mes == referencia_mes

    return {
        "fatura_fechada": fatura_fechada and not ja_paga,
        "vencimento_proximo": proximo_vencimento and not ja_paga,
        "data_vencimento": vencimento,
        "referencia_mes": referencia_mes,
    }


def marcar_fatura_paga(sessao: Session, cartao_id: int, usuario_id: int) -> bool:
    registro = sessao.query(CartaoORM).filter_by(id=cartao_id, usuario_id=usuario_id).first()
    if registro is None:
        return False
    registro.fatura_paga_mes = date.today().strftime("%Y-%m")
    sessao.commit()
    return True
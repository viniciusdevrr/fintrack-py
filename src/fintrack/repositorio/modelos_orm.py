from datetime import date
from sqlalchemy import String, Float, Integer, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from fintrack.database import Base

class ContaORM(Base):
    __tablename__ = "contas"

    id: Mapped[int] = mapped_column(primary_key=True)
    titular: Mapped[str] = mapped_column(String(100))
    saldo_inicial: Mapped[float] = mapped_column(Float, default=0.0)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))  

    usuario: Mapped["UsuarioORM"] = relationship(back_populates="contas") 
    transacoes: Mapped[list["TransacaoORM"]] = relationship(
        back_populates="conta", cascade="all, delete-orphan"
    )

class CategoriaORM(Base):
    __tablename__ = "categorias"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(50))
    tipo: Mapped[str] = mapped_column(String(10))
    limite_mensal: Mapped[float | None] = mapped_column(Float, nullable=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))  # NOVO


class CartaoORM(Base):
    __tablename__ = "cartoes"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(50))
    limite: Mapped[float] = mapped_column(Float)
    dia_fechamento: Mapped[int] = mapped_column(Integer)
    dia_vencimento: Mapped[int] = mapped_column(Integer)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))  # NOVO


class MetaORM(Base):
    __tablename__ = "metas"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(100))
    valor_alvo: Mapped[float] = mapped_column(Float)
    valor_atual: Mapped[float] = mapped_column(Float, default=0.0)
    data_limite: Mapped[date | None] = mapped_column(Date, nullable=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))  # NOVO


class TransacaoORM(Base):
    __tablename__ = "transacoes"

    id: Mapped[int] = mapped_column(primary_key=True)

    # "tipo" é a coluna discriminadora: guarda "receita", "despesa" ou
    # "despesa_cartao". É ela que diz ao SQLAlchemy qual classe Python
    # usar quando ler essa linha de volta do banco.
    tipo: Mapped[str] = mapped_column(String(20))

    descricao: Mapped[str] = mapped_column(String(200))
    valor: Mapped[float] = mapped_column(Float)
    data: Mapped[date] = mapped_column(Date)

    conta_id: Mapped[int] = mapped_column(ForeignKey("contas.id"))
    categoria_id: Mapped[int | None] = mapped_column(ForeignKey("categorias.id"), nullable=True)
    cartao_id: Mapped[int | None] = mapped_column(ForeignKey("cartoes.id"), nullable=True)
    parcelas: Mapped[int | None] = mapped_column(Integer, nullable=True)

    conta: Mapped["ContaORM"] = relationship(back_populates="transacoes")

    __mapper_args__ = {
        "polymorphic_identity": "transacao",
        "polymorphic_on": "tipo",
    }

class UsuarioORM(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(150), unique=True)
    senha_hash: Mapped[str] = mapped_column(String(255))

    contas: Mapped[list["ContaORM"]] = relationship(back_populates="usuario")

class ReceitaORM(TransacaoORM):
    __mapper_args__ = {"polymorphic_identity": "receita"}


class DespesaORM(TransacaoORM):
    __mapper_args__ = {"polymorphic_identity": "despesa"}


class DespesaCartaoORM(TransacaoORM):
    __mapper_args__ = {"polymorphic_identity": "despesa_cartao"}
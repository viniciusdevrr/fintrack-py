import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fintrack.database import Base


@pytest.fixture
def sessao():
    """Cria um banco SQLite novo, em memória, para cada teste.
    StaticPool garante que todas as conexões (inclusive de outras threads,
    como as que o TestClient usa) compartilhem a MESMA conexão física —
    sem isso, cada conexão nova veria um banco em memória vazio."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    sessao = SessionLocal()
    yield sessao
    sessao.close()
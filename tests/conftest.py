import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fintrack.database import Base


@pytest.fixture
def sessao():
    """Cria um banco SQLite novo, em memória, para cada teste."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    sessao = SessionLocal()
    yield sessao
    sessao.close()
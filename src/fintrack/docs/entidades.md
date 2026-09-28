# Entidades do sistema

## Usuario
- id, nome, email, senha_hash, criado_em

## Conta
- id, usuario_id, nome, saldo_inicial

## Categoria
- id, usuario_id, nome, tipo (receita/despesa), limite_mensal (opcional)

## Transacao (abstrata)
- id, conta_id, categoria_id, descricao, valor, data
  - Receita
  - Despesa
    - Despesa (à vista)
    - DespesaCartao (parcelada, ligada a um Cartao)

## Cartao
- id, usuario_id, nome, limite, dia_fechamento, dia_vencimento

## Meta
- id, usuario_id, nome, valor_alvo, valor_atual, data_limite

## Alerta
- id, usuario_id, tipo, mensagem, lido (bool), criado_em
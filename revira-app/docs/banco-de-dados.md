# Construção do banco de dados local

O ReVira utiliza SQLite no Android, por meio do plugin Capacitor Community SQLite. O banco `revira` é criado na primeira inicialização e as tabelas são criadas com `CREATE TABLE IF NOT EXISTS`. A aplicação habilita `PRAGMA foreign_keys = ON`.

## Entidades e relacionamentos
- **usuarios**: `id`, `nome`, `email`, `telefone`, `tipo_usuario`, `criado_em`.
- **categorias**: `id`, `nome`, `descricao`.
- **ofertas**: `id`, `usuario_id`, `categoria_id`, `titulo`, `descricao`, `quantidade`, `unidade`, `validade`, `local_retirada`, `instrucoes_retirada`, `preco`, `status`, `criado_em`.
- **reservas**: `id`, `oferta_id`, `usuario_id`, `quantidade`, `status`, `criada_em`, `observacao`.

As relações são um-para-muitos: uma categoria classifica diversas ofertas; um usuário pode cadastrar várias ofertas e reservas; uma oferta pode aparecer em várias reservas. As chaves estrangeiras em `ofertas` e `reservas` materializam essas relações.

## Operações
1. Inicializar a conexão SQLite e criar o schema.
2. Inserir categorias e ofertas demonstrativas se o catálogo estiver vazio.
3. Consultar ofertas com `JOIN` entre `ofertas` e `categorias`.
4. Ao reservar, inserir em `reservas`, reduzir a quantidade da oferta e marcar como esgotada quando chegar a zero.
5. Consultar reservas com `JOIN` entre `reservas` e `ofertas`.

O navegador usa `localStorage` apenas como fallback de demonstração. A entrega Android usa SQLite.

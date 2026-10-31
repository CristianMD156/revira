# Banco de dados local

## Banco escolhido

**SQLite**, um banco de dados relacional embarcado que mantém os dados no próprio dispositivo.

## Integração prevista

O aplicativo será desenvolvido com Ionic e Angular e empacotado para Android com Capacitor. A integração com SQLite será feita por meio do plugin Capacitor Community SQLite.

Referência: https://github.com/capacitor-community/sqlite

## Estratégia de implementação

1. Inicializar o plugin SQLite quando o aplicativo for iniciado na plataforma Android.
2. Abrir ou criar o banco `revira.db`.
3. Ativar as chaves estrangeiras com `PRAGMA foreign_keys = ON`.
4. Executar as instruções de criação do arquivo `database/schema.sql` na primeira instalação ou em uma migração.
5. Criar repositórios/serviços Angular para operações de usuários, categorias, ofertas e reservas.
6. Validar os dados na interface e novamente na camada de persistência.
7. Usar transações para criar reservas e atualizar disponibilidade.
8. Tratar erros de banco e apresentar mensagens compreensíveis ao usuário.

## Dados iniciais

A primeira execução poderá inserir categorias de exemplo, como `Hortifruti`, `Padaria`, `Refeições prontas` e `Outros`. Esses dados iniciais devem ser inseridos de forma idempotente, sem duplicar categorias em cada abertura.

## Limitações

- Os dados ficam no aparelho e não são compartilhados automaticamente com outras pessoas.
- Desinstalar o aplicativo pode remover o banco local.
- Uma aplicação de produção que conecte vários doadores e interessados precisará de uma API e de um banco central, além de controles de autenticação e segurança.
- Não armazenar senhas em texto puro. Como a primeira versão é um protótipo local, o cadastro é demonstrativo e não representa autenticação segura para produção.

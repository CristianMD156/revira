# ReVira — Combate ao Desperdício

> **Projeto acadêmico de aplicativo Android**  
> Proposta: conectar pessoas e pequenos estabelecimentos que tenham alimentos excedentes próprios para consumo a pessoas interessadas em aproveitá-los, reduzindo o desperdício.

## 1. Nome do projeto

**ReVira — Combate ao Desperdício**

O nome representa a ideia de dar uma nova oportunidade a alimentos que poderiam ser descartados, desde que estejam próprios para consumo e sejam oferecidos em condições seguras.

## 2. Problema que o aplicativo resolve

Alimentos ainda próprios para consumo podem ser descartados por falta de visibilidade sobre sua disponibilidade, por excedentes de produção ou por proximidade da data de validade. Ao mesmo tempo, pessoas podem ter interesse em encontrar oportunidades de reaproveitamento na sua região.

O ReVira propõe um catálogo simples de ofertas de alimentos excedentes. Quem oferece cadastra o item, a quantidade, a data de validade e as instruções de retirada. Quem procura pode consultar as ofertas e registrar uma reserva demonstrativa no próprio aplicativo.

**Limite da primeira versão:** por ser um protótipo acadêmico com banco local, os dados ficam no dispositivo. A sincronização entre diferentes usuários e estabelecimentos não faz parte desta primeira entrega.

O aplicativo não substitui regras sanitárias nem garante, por si só, que um alimento esteja seguro. O responsável pela oferta deve fornecer informações verdadeiras e manter o alimento em condições adequadas.

## 3. Público-alvo

- Pessoas interessadas em aproveitar alimentos disponíveis para retirada.
- Pequenos mercados, padarias, restaurantes e produtores locais.
- Grupos e iniciativas comunitárias de combate ao desperdício.
- Estudantes e organizações interessados em sustentabilidade.

## 4. Características e funcionalidades

### Funcionalidades previstas
- Listar ofertas de alimentos cadastradas localmente.
- Pesquisar ofertas pelo nome e filtrar por categoria ou situação.
- Cadastrar uma oferta com nome, descrição, quantidade, validade e instruções de retirada.
- Consultar detalhes e condições de retirada de uma oferta.
- Registrar e cancelar reservas demonstrativas.
- Marcar uma oferta como retirada ou encerrada.
- Exibir alertas visuais para ofertas próximas da validade.
- Exibir um resumo de ofertas ativas, reservadas e reaproveitadas.
- Apresentar uma tela “Sobre o projeto” com os nomes completos dos integrantes.

### Regras de negócio
1. Uma oferta deve conter nome, categoria, quantidade, unidade, data de validade e instruções de retirada.
2. A quantidade deve ser maior que zero.
3. A data de validade deve ser informada corretamente. Ofertas vencidas não devem ser apresentadas como disponíveis para retirada.
4. A oferta deve informar condições de conservação e retirada quando aplicável.
5. Uma oferta encerrada ou vencida não pode receber novas reservas.
6. A reserva registrada nesta versão é local e demonstrativa; não notifica outros aparelhos.
7. A aplicação deve orientar os usuários a não oferecer alimentos vencidos, com embalagem violada ou que tenham sido armazenados inadequadamente.

## 5. Modelo ER do banco de dados local

O banco SQLite terá quatro tabelas relacionadas:

- `usuarios`: dados de quem cadastra ou reserva ofertas.
- `categorias`: categorias de alimentos.
- `ofertas`: alimentos disponíveis para aproveitamento.
- `reservas`: solicitações de reserva de uma oferta.

O diagrama, os campos, os tipos, as chaves e as restrições estão em [`docs/modelo-er.md`](docs/modelo-er.md). O SQL de criação está em [`database/schema.sql`](database/schema.sql).

## 6. Wireframes das telas em alta definição

Os wireframes vetoriais em SVG estão na pasta [`wireframes/`](wireframes/). Eles podem ser abertos no navegador, importados em ferramentas de design ou convertidos para PNG.

Telas incluídas:
1. Início e resumo de impacto.
2. Explorar ofertas.
3. Detalhes de uma oferta e ação de reserva.
4. Cadastro de oferta.
5. Minhas reservas.
6. Sobre o projeto e integrantes.

Os protótipos são referências de interface e deverão ser ajustados conforme os testes e a implementação final.

## 7. Tela com os nomes completos dos integrantes

O aplicativo terá uma tela “Sobre o ReVira” com os nomes completos dos integrantes do grupo, além do curso e da disciplina.

**Substituir antes da entrega:**
- Nome completo do integrante 1
- Nome completo do integrante 2
- Nome completo do integrante 3
- Nome completo do integrante 4

Não deixar os nomes de exemplo na versão final.

## 8. Como será gerado o APK

A proposta utiliza Ionic, Angular e Capacitor para construir a interface e empacotar o aplicativo para Android.

Etapas gerais:
1. Instalar Node.js, Git e Android Studio.
2. Criar o projeto Ionic com Angular e instalar as dependências.
3. Implementar as telas e a camada de persistência SQLite.
4. Compilar a aplicação web com `ionic build`.
5. Adicionar a plataforma Android uma única vez, se ainda não existir: `npx cap add android`.
6. Sincronizar os arquivos: `npx cap sync android`.
7. Abrir o projeto no Android Studio: `npx cap open android`.
8. No Android Studio, selecionar **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
9. Testar o APK em um dispositivo ou emulador Android.

Comandos de referência e observações adicionais estão em [`docs/geracao-apk.md`](docs/geracao-apk.md).

## 9. Tecnologias, bibliotecas e linguagens

- HTML — https://developer.mozilla.org/pt-BR/docs/Web/HTML
- CSS — https://developer.mozilla.org/pt-BR/docs/Web/CSS
- TypeScript — https://www.typescriptlang.org/
- Angular — https://angular.dev/
- Ionic Framework — https://ionicframework.com/docs
- Capacitor — https://capacitorjs.com/docs
- SQLite — https://www.sqlite.org/docs.html
- Capacitor Community SQLite — https://github.com/capacitor-community/sqlite
- Android Studio — https://developer.android.com/studio
- Node.js — https://nodejs.org/
- Git — https://git-scm.com/doc
- GitHub — https://docs.github.com/
- Figma (opcional, para ajustes visuais) — https://www.figma.com/

## 10. Banco de dados local e implementação

Será utilizado o **SQLite**, um banco relacional local. A biblioteca Capacitor Community SQLite fará a integração com a plataforma Android. A aplicação deverá inicializar o banco, executar o script de criação das tabelas e realizar operações de cadastro, consulta, atualização e exclusão conforme as regras de negócio.

As chaves estrangeiras e restrições ajudam a manter a integridade dos dados. As alterações que envolvem mais de uma tabela devem ser realizadas em transações. O banco local não sincroniza automaticamente com outros aparelhos; essa funcionalidade exigiria uma API e um banco de dados compartilhado em uma etapa futura.

## Organização do repositório

```text
revira/
├── README.md
├── docs/
│   ├── modelo-er.md
│   ├── wireframes.md
│   ├── tecnologias.md
│   ├── banco-local.md
│   └── geracao-apk.md
├── database/
│   └── schema.sql
└── wireframes/
    ├── 01-inicio.svg
    ├── 02-explorar-ofertas.svg
    ├── 03-detalhe-oferta.svg
    ├── 04-cadastrar-oferta.svg
    ├── 05-minhas-reservas.svg
    └── 06-sobre-integrantes.svg
```

## Observação sobre o escopo

Esta entrega descreve a proposta e a documentação inicial. O repositório não representa um aplicativo já implementado nem um APK pronto. O desenvolvimento, os testes e a compilação deverão ser realizados na etapa de implementação.

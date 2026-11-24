# ReVira — combate ao desperdício de alimentos

Aplicativo mobile acadêmico desenvolvido com Ionic, Angular, TypeScript, Capacitor e SQLite. A proposta conecta estabelecimentos com excedentes de alimentos em boas condições a pessoas interessadas em aproveitá-los.

## Funcionalidades implementadas
- Listagem de ofertas disponíveis com categoria, validade, quantidade, local e preço.
- Cadastro de novas ofertas.
- Reserva de uma ou mais unidades (a primeira versão oferece reserva de uma unidade na tela inicial).
- Consulta das reservas realizadas, com atualização automática ao entrar na tela.
- Cancelamento de uma reserva, com devolução automática da quantidade ao estoque.
- Atualização da lista de ofertas ao voltar para a tela inicial e opção de atualizar por gesto de arrastar.
- Bloqueio de cliques repetidos durante operações de cadastro e reserva, com mensagens de erro em caso de falha.
- Validação de campos obrigatórios e data de validade.
- Persistência em SQLite no Android; armazenamento local de demonstração no navegador.

## Tecnologias
- [Ionic](https://ionicframework.com/docs) e [Angular](https://angular.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Capacitor](https://capacitorjs.com/)
- [SQLite](https://www.sqlite.org/) via [Capacitor Community SQLite](https://github.com/capacitor-community/sqlite)
- [Node.js](https://nodejs.org/), npm, Android Studio e Git/GitHub

## Requisitos para executar em outro computador
- Node.js 20 ou superior e npm.
- Android Studio com Android SDK instalado para compilar o APK.
- Java/JDK compatível com a versão do Android Gradle Plugin instalada pelo Android Studio.

## Executar no navegador
```bash
npm install
npm start
```
O modo navegador utiliza armazenamento local para permitir demonstração. No Android, a persistência é feita pelo banco SQLite nativo.

## Gerar o APK Android

O projeto inclui scripts para preparar a plataforma Android e compilar automaticamente o APK de depuração. É necessário ter Node.js 20+, npm, JDK compatível e Android SDK/Build Tools instalados (Android Studio).

**Windows (Prompt de Comando):**
```bat
scripts\build-apk.bat
```

**Linux/macOS:**
```bash
chmod +x scripts/build-apk.sh
./scripts/build-apk.sh
```

Os scripts instalam as dependências, compilam o projeto web, adicionam a plataforma Android caso ainda não exista, sincronizam o Capacitor e executam `assembleDebug`. O arquivo será gerado em:

`android/app/build/outputs/apk/debug/app-debug.apk`

Também é possível abrir o projeto com `npm run android:open` depois de preparar a plataforma. Para distribuir uma versão final, configure a assinatura e gere um APK/AAB release pelo Android Studio em **Build > Generate Signed Bundle / APK**.

> **Observação sobre esta entrega:** o APK binário não foi incluído nesta cópia porque a instalação das dependências depende do acesso ao registro npm, que não estava disponível no ambiente de preparação. Os scripts acima permitem gerar o APK no computador com os pré-requisitos instalados; não há um APK fictício ou vazio no pacote.

## Banco de dados local
O schema completo está em [`database/schema.sql`](database/schema.sql). O banco contém quatro tabelas:
- `usuarios`: dados de usuários e estabelecimentos;
- `categorias`: classificação dos alimentos;
- `ofertas`: alimentos, quantidade, validade, local e condições de retirada;
- `reservas`: relação entre a oferta e a quantidade reservada.

Relacionamentos: `categorias 1:N ofertas`, `usuarios 1:N ofertas`, `usuarios 1:N reservas` e `ofertas 1:N reservas`. As chaves estrangeiras são declaradas no schema.

## Estrutura
```text
src/app/pages/       telas do aplicativo
src/app/services/    acesso aos dados e persistência
src/app/models.ts    interfaces de dados
database/schema.sql  estrutura relacional SQLite
docs/                documentação complementar
```

## Limitações conhecidas da versão acadêmica
- A primeira versão é local/offline: não sincroniza dados entre celulares diferentes.
- Os registros de usuário estão previstos no modelo do banco, mas o fluxo de autenticação ainda não foi implementado.
- Os dados iniciais são demonstrativos. Antes de uso real, é necessário implementar autenticação, gestão de estoque/concorrência, regras de segurança alimentar, privacidade e sincronização com servidor.
- A reserva no protótipo não representa pagamento nem garante retirada comercial. O cancelamento é local e devolve a quantidade ao estoque do mesmo dispositivo.

## Integrantes do grupo
- Cristian Morés Dalcin
- Gustavo Henrique Rajab
- William Miguel Santos Pereira
- Paula Cristina da Rocha Paim
- Kédyna Lagni

A identificação dos integrantes também está disponível na seção de créditos da tela inicial do aplicativo.

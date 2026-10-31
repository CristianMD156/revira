# Geração do APK Android

## Ferramentas

- Node.js: https://nodejs.org/
- Ionic CLI: https://ionicframework.com/docs/cli
- Android Studio: https://developer.android.com/studio
- Capacitor Android: https://capacitorjs.com/docs/android

## Preparação inicial

Instale Node.js e Android Studio. Depois, crie um projeto Ionic Angular, caso ainda não exista:

```bash
npm install -g @ionic/cli
ionic start revira blank --type=angular
cd revira
```

Instale e configure as dependências de SQLite e Capacitor compatíveis com as versões selecionadas no projeto. Consulte a documentação do plugin antes de definir as versões.

## Compilar e abrir no Android Studio

```bash
ionic build
npx cap add android
npx cap sync android
npx cap open android
```

`npx cap add android` é executado apenas na configuração inicial. Em builds seguintes, execute `ionic build` e `npx cap sync android` antes de abrir ou compilar o projeto.

No Android Studio:
1. Aguarde a sincronização do Gradle.
2. Selecione **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3. Aguarde a conclusão e use a opção de localizar o arquivo gerado.
4. Instale o APK em um emulador ou dispositivo Android de teste.

## Testes antes da entrega

- Abrir o aplicativo sem conexão à internet e verificar os dados locais.
- Cadastrar, consultar e atualizar uma oferta.
- Tentar salvar quantidade inválida.
- Tentar reservar uma oferta encerrada ou vencida.
- Verificar a persistência após fechar e abrir o aplicativo.
- Conferir se a tela de integrantes contém os nomes completos reais.

## Importante

Este repositório é a documentação inicial e inclui o esquema SQL e wireframes, mas não contém uma implementação Ionic pronta nem um APK compilado. O APK só poderá ser gerado após o desenvolvimento e a configuração do ambiente Android.

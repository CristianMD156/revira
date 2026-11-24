# Entrega e roteiro de testes

## Conteúdo para o GitHub
1. Código-fonte e arquivos de configuração.
2. `database/schema.sql` e esta documentação.
3. APK gerado pelo Android Studio em `android/app/build/outputs/apk/debug/app-debug.apk` (adicionar ao repositório ou publicar em Releases).

## Testes manuais sugeridos
- Abrir o app e verificar as ofertas iniciais.
- Cadastrar uma oferta válida e confirmar que aparece na página inicial.
- Tentar salvar sem título ou sem local e verificar a validação.
- Tentar cadastrar validade anterior à data atual.
- Reservar uma oferta e conferir a aba Minhas reservas.
- Reservar até esgotar o estoque e verificar que ela deixa de aparecer como disponível.
- Fechar e reabrir o app para verificar persistência local no Android.
- Instalar o APK em outro aparelho Android e repetir os testes.

## Antes de enviar
- Inserir nomes completos dos integrantes no README e na tela/documentação do grupo.
- Gerar o APK em Android Studio e testar a instalação em outro dispositivo.
- Fazer commit de todo o código e documentação; anexar o APK ao GitHub Release se o arquivo exceder o limite recomendado para commits.


## Integrantes
Consulte [`integrantes.md`](integrantes.md) para a relação dos cinco integrantes do grupo.

#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

for cmd in node npm java; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Erro: '$cmd' não encontrado. Instale Node.js, npm e JDK antes de continuar." >&2
    exit 1
  fi
done

if [ ! -d node_modules ]; then
  echo "Instalando dependências..."
  npm install
fi

echo "Compilando aplicação web..."
npm run build

if [ ! -d android ]; then
  echo "Adicionando plataforma Android..."
  npx cap add android
fi

echo "Sincronizando projeto Android..."
npx cap sync android

if [ ! -x android/gradlew ]; then
  echo "Erro: Gradle Wrapper não encontrado em android/gradlew." >&2
  exit 1
fi

cd android
./gradlew assembleDebug
APK="$ROOT/android/app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK" ]; then
  echo "APK gerado com sucesso: $APK"
else
  echo "A compilação terminou, mas o APK esperado não foi localizado." >&2
  exit 1
fi

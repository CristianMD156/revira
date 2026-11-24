@echo off
setlocal
cd /d "%~dp0.."
where node >nul 2>nul || (echo Erro: instale Node.js. & exit /b 1)
where npm >nul 2>nul || (echo Erro: instale npm. & exit /b 1)
where java >nul 2>nul || (echo Erro: instale um JDK compativel. & exit /b 1)
if not exist node_modules (echo Instalando dependencias... & call npm install || exit /b 1)
echo Compilando aplicacao web...
call npm run build || exit /b 1
if not exist android (echo Adicionando plataforma Android... & call npx cap add android || exit /b 1)
call npx cap sync android || exit /b 1
if not exist android\gradlew.bat (echo Erro: Gradle Wrapper nao encontrado. & exit /b 1)
cd android
call gradlew.bat assembleDebug || exit /b 1
echo APK gerado em: android\app\build\outputs\apk\debug\app-debug.apk

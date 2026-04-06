# Android Setup

Esta base usa `Next.js` com SSR, cookies e `server actions`, entao a versao Android foi preparada como uma casca nativa via Capacitor apontando para uma instancia web acessivel.

## Requisitos

- Node.js e npm
- Android Studio
- Android SDK com uma imagem de emulador API 24+
- Uma URL publica do app web para builds conectados

## Variaveis de ambiente

Defina uma das variaveis abaixo antes de sincronizar o projeto Android:

- `CAPACITOR_SERVER_URL`: URL que o app Android deve abrir
- `NEXT_PUBLIC_SITE_URL`: fallback usado pela configuracao do Capacitor e pelo fluxo de autenticacao

Exemplo para producao:

```bash
CAPACITOR_SERVER_URL=https://app.seudominio.com npm run android:sync
```

Exemplo para desenvolvimento no emulador Android:

```bash
npm run dev
CAPACITOR_SERVER_URL=http://10.0.2.2:3000 npm run android:sync
npm run android:open
```

`10.0.2.2` e o alias do host local quando o app roda dentro do emulador Android.

## Scripts

- `npm run android:sync`: sincroniza a configuracao web com o projeto Android
- `npm run android:open`: abre o projeto Android Studio
- `npm run android:run:local`: executa no Android usando `http://10.0.2.2:3000` e tenta reaproveitar o JDK do Android Studio

## Shell nativa atual

- Splash screen nativa com a marca do app usando a API padrao do Android 12+
- Edge-to-edge habilitado na `MainActivity`
- Safe areas repassadas para a interface web compartilhada dentro do WebView
- Adaptive icon com suporte a `monochrome` para launchers modernos

## Limite atual

Sem `CAPACITOR_SERVER_URL` ou `NEXT_PUBLIC_SITE_URL`, o container Android sera criado, mas nao tera uma instancia web valida para carregar.

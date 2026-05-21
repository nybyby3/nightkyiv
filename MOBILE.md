# Деплой в App Store и Google Play

Сайт построен так, чтобы тот же React-код одновременно работал в браузере
(через Vercel) и упаковывался в нативные iOS/Android приложения через
[Capacitor](https://capacitorjs.com/). Никакого переписывания на React
Native не требуется.

## Что уже сделано в коде

- `index.html`: viewport `viewport-fit=cover`, мета-теги
  `apple-mobile-web-app-*`, `theme-color`, ссылка на `manifest.webmanifest`.
- `vite.config.js`: `base: ''` — относительные пути к ассетам (это
  обязательное требование Capacitor, иначе при загрузке через `capacitor://`
  пути ломаются).
- Тема (`styles/theme.js`) использует `env(safe-area-inset-*)` для верхнего
  и нижнего паддингов — нотч и home-indicator не перекрывают контент.
- Bottom nav и Header — компоненты, готовые к safe-area.
- Хеш-роутинг (`#discover`, `#map`...) — работает без сервера, что важно для
  упакованного приложения.

## Шаги по упаковке (выполняются на Mac)

```bash
# 1. Установить Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android

# 2. Инициализировать (один раз)
npx cap init NightKyiv ua.nightkyiv.app --web-dir=dist

# 3. Добавить платформы
npx cap add ios
npx cap add android

# 4. Билд + синк (каждый раз перед открытием Xcode/AS)
npm run build
npx cap sync

# 5. Открыть проект в Xcode / Android Studio
npx cap open ios       # требует Xcode + CocoaPods
npx cap open android   # требует Android Studio
```

В `capacitor.config.json` (создаётся `cap init`) рекомендую сразу:

```json
{
  "appId": "ua.nightkyiv.app",
  "appName": "NightKyiv",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "backgroundColor": "#0a0814",
  "ios": { "contentInset": "always", "scrollEnabled": true },
  "android": { "allowMixedContent": false, "captureInput": true }
}
```

## Иконки и сплеш

Для App Store/Play нужны нативные ассеты (PNG в нескольких размерах).
Самый быстрый путь: положить квадратный логотип 1024×1024 в `resources/icon.png`
и фоновое изображение 2732×2732 в `resources/splash.png`, потом:

```bash
npm install -D @capacitor/assets
npx capacitor-assets generate
```

— скрипт сам нарежет все 30+ размеров для iOS и Android и положит куда
надо.

## Локальная разработка с горячей перезагрузкой

```bash
npm run dev   # vite на http://localhost:5173
```

В Capacitor можно подключить эмулятор прямо к vite-dev-серверу через
`server.url` в `capacitor.config.json` — изменения в коде сразу видны в
эмуляторе:

```json
{
  "server": { "url": "http://10.0.2.2:5173", "cleartext": true }
}
```

(`10.0.2.2` для Android-эмулятора, `127.0.0.1` для iOS-симулятора)

## API `/api/cinema`

Сейчас данные кинотеатров приходят с serverless endpoint на Vercel. В
нативном приложении (которое грузится через `capacitor://`) `fetch('/api/cinema')`
не сработает — нужен абсолютный URL. Когда будем готовы пакетировать,
поправим один файл (`src/views/CinemaView.jsx`): заменить
`fetch('/api/cinema')` на `fetch('https://nightkyiv.vercel.app/api/cinema')`
или вынести base URL в env.

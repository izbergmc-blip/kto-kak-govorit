# Техническая спецификация

## Стек
React + TypeScript + Vite; Telegram Web Apps SDK; CSS Modules или структурированный CSS; HTMLAudioElement/Web Audio API только при необходимости. Backend не нужен для MVP.

## Развёртывание
Статический сайт на HTTPS. Telegram-бот содержит кнопку `web_app`, ведущую на URL приложения. Приложение должно также открываться как обычный веб-сайт для локального тестирования.

## Рекомендуемая структура
```text
src/
  app/
  components/AnimalCard/
  components/AnimalGrid/
  components/Settings/
  data/animals.ts
  hooks/useAudio.ts
  hooks/useTelegram.ts
  services/audioController.ts
  styles/tokens.css
  types/animal.ts
public/assets/animals/
public/assets/audio/animals/
public/assets/audio/voices/
public/assets/animations/
```

## Аудио-контроллер
Единый контроллер управляет текущим воспроизведением. При новом выборе вызывает `pause()`, сбрасывает `currentTime`, отменяет незавершённую последовательность и запускает новую. Последовательность: животный звук → голос диктора. Учитывать переключатели настроек и жизненный цикл страницы (`visibilitychange`, `pagehide`).

## Telegram
Инициализировать WebApp SDK безопасно, вызвать `ready()` после готовности интерфейса, использовать `expand()` только если уместно. Не доверять `initData` на клиенте; для текущего MVP не требуется авторизация и не следует отправлять `initData` на сервер. Учитывать safe area и системную кнопку BackButton только если открывается отдельная страница настроек.

## Надёжность
- Не использовать autoplay.
- Не допускать параллельного звука.
- Не блокировать UI из-за ошибки аудио.
- Локально сохранять только настройки звука.
- Не собирать персональные данные и не подключать рекламные/аналитические SDK.
- Оптимизировать изображения и загружать аудио по требованию/предзагрузкой после первого взаимодействия.

## Проверки
Unit-тесты аудиоконтроллера; тесты переходов настроек; ручная проверка Telegram iOS/Android, Safari iOS, Chrome Android и desktop. Проверить быстрые повторные нажатия, переключение животных, background/foreground, отсутствие сети и ошибки загрузки медиа.

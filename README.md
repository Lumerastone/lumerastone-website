# LUMERASTONE

Адаптивный многоязычный сайт-визитка кирпичей-светильников из эпоксидной смолы. HTML, CSS и JavaScript без сборочных зависимостей. Для локального сервера нужен Node.js 22+.

## Запуск

```sh
npm run dev
```

Откройте http://localhost:5173. Другой порт: `npm run dev -- --port 3000`.

## Сборка

```sh
npm run build
npm run preview
```

Папку `dist/` можно опубликовать на любом статическом хостинге. Для Netlify настройки записаны в `netlify.toml`: команда `npm run build`, публикуемая папка `dist`. Не публикуйте корень репозитория: сборка переносит файлы из `public/` в корень сайта, где их ожидают страницы (`/images/amber-brick.png`, `/favicon.svg`). Шрифты загружаются из Google Fonts; без сети используются системные шрифты.

## Языковые версии

- `/` и `/pl/` — польский (по умолчанию).
- `/uk/` — украинский.
- `/en/` — английский.
- `/ru/` — русский.

Переключатель доступен на всех экранах. Каждая версия — полноценная статическая HTML-страница с собственными `lang`, заголовком, описанием и ссылками `hreflang`. Язык определяется адресом, без переадресации по настройкам браузера.

Исходный шаблон: `content/page.html`, переводы: `content/translations.json`. Редактируйте их, затем запускайте `npm run localize` для обновления страниц в проекте. `npm run dev` генерирует страницы при запуске; `npm run build` генерирует все языки в `dist/`. `index.html` и папки языков генерируются автоматически.

## Поведение

- Навигация по разделам и мобильное меню.
- Карточки коллекции выбирают оттенок в форме.
- Форма проверяет обязательные поля и скачивает текст заявки. Данные не отправляются на сервер и не сохраняются в браузере.
- Телефон мастерской: +48 662 522 396, ссылка `tel:+48662522396`. Форма по-прежнему сохраняет заявку локально; серверная отправка не подключена. Стоимость и характеристики нужно согласовать с владельцем.
- Изображения — концептуальные визуализации, не фотографии готовой продукции. Smoke и Forest представлены цветовыми вариациями главного изображения.

## Изображение

`public/images/amber-brick.png` создано встроенным image_gen (навык imagegen).

Промпт: “Use case: product-mockup. Asset type: premium website hero photograph, landscape 1536x1024. A handcrafted rectangular epoxy resin brick lamp, elongated real brick proportions, glowing rich amber golden light from within, with intriguing natural fissures and bubbles like amber, transparent glossy slightly rough cast resin. It rests horizontally on a charcoal dark stone plinth in a dark architectural interior. Tight artful product photography, three quarter front perspective, brick occupies middle right two thirds, fully visible. Warm light spills onto stone surface. Background almost black olive charcoal, softly lit raw plaster wall. Moody Italian design magazine, analog film grain, extremely realistic material, understated luxury. No text, no logos, no watermarks, no people.”

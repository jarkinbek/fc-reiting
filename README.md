# Football Rating Project

Проект для расчёта рейтинга футболистов с использованием AI (Python) и фронтенда на React (Next.js).

## Содержание проекта

- **ai/** — Python AI код
  - `fifa.py` — скрипт для работы модели
  - `FIFA-2019.csv` — данные футболистов
  - `model.pkl` — сохранённая модель
- **app/**, **components/**, **pages/** и другие — фронтенд на Next.js
- **requirements.txt** — библиотеки Python
- **README.md** — инструкция по запуску

---

## Как запустить AI (Python)

1. Клонируем репозиторий и переходим в папку проекта:

```bash
git clone https://github.com/jarkinbek/fc-reiting.git
cd fc-reiting

Создаём и активируем виртуальное окружение:
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

Устанавливаем зависимости:
pip install -r requirements.txt

Запускаем скрипт AI:
python ai/fifa.py

Как запустить фронтенд (React / Next.js)

Переходим в корень проекта:
cd fc-reiting

Устанавливаем зависимости Node:
npm install

Запускаем сервер разработки:
npm run dev
Открываем браузер на http://localhost:3000

Примечания:
Папка venv не залита на GitHub — зависимости хранятся в requirements.txt.
Модель model.pkl (~7 МБ) уже есть в репозитории, если она станет больше, лучше использовать Git LFS.
Любые изменения в AI или фронтенде можно пушить на GitHub с помощью стандартных команд Git.

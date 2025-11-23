# Moderation System

## Быстрый старт

### Вариант 1: Запуск с Docker
```bash
# Запуск всех сервисов
docker-compose up

# Клиент: http://localhost:5173
# Сервер API: http://localhost:3001

# Запуск сервера API
cd server
npm install
npm start
# Сервер на http://localhost:3001

# Запуск клиента (в отдельном терминале)
cd client
npm install
npm run dev
# Клиент на http://localhost:5173
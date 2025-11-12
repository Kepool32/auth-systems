# Базовый образ Node
FROM node:20

# Рабочая директория
WORKDIR /usr/src/app

# Копируем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходники
COPY . .

# Порт для NestJS
EXPOSE 4000

# Запуск NestJS в dev режиме
CMD ["npm", "run", "start:dev"]

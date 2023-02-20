# Home Library Service

## Клонировать репозиторий

```
git clone https://github.com/Bumble-sakh/nodejs2022Q4-service.git
```

## Перейти на ветку `feat/postgres`

```
git checkout feat/postgres
```

## Установить зависимости

```
npm install
```

## Переименовать файл `.env.example` в `.env`

Windows cmd:

```
copy .env.example .env
```

Linux bash

```
cp .env.example .env
```

## Пересобрать образы

```
npm dun docker:build
```

## Поднять контейнер

```
npm run docker:up
```

## Запустить миграции

```
npm run migrate:deploy
```

## Запустить приложение

```
npm start
```

## Запустить тесты

```
npm test
```

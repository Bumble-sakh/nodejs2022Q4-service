# Home Library Service

## Клонировать репозиторий

```
git clone https://github.com/Bumble-sakh/nodejs2022Q4-service.git
```

## Перейти на ветку `feat/docker`

```
git checkout feat/docker
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

## Собрать образы и поднять контейнер

```
npm run docker:up
```

## Приложение в контейнере будет запущенно в режиме наблюдения

---

### Скрипт для сканирования уязвимостей

```
npm run docker:scan
```

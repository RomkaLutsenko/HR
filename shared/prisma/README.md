# Общая схема Prisma

Эта папка содержит общую схему базы данных для всего проекта.

## Использование

### Генерация клиента Prisma
```bash
# Из папки client
npm run db:generate

# Из папки bot
npm run db:generate
```

### Применение изменений к базе данных
```bash
# Из папки client
npm run db:push

# Из папки bot
npm run db:push
```

### Создание миграций
```bash
# Из папки client
npm run db:migrate

# Из папки bot
npm run db:migrate
```

## Структура

- `schema.prisma` - основная схема базы данных
- `README.md` - этот файл с инструкциями

## Модели

- `User` - пользователи системы
- `ServiceCategory` - категории услуг
- `Specialist` - специалисты/исполнители
- `Service` - услуги
- `OrderStatus` - статусы заказов
- `Order` - заказы
- `Review` - отзывы

// Константы для режима разработки
export const DEV_MODE = process.env.NODE_ENV === "development"

// Флаг для использования моковых данных
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || false

// Таймаут для API запросов (в миллисекундах)
export const API_TIMEOUT = 10000

// Максимальное количество попыток повторного запроса
export const MAX_RETRY_COUNT = 3

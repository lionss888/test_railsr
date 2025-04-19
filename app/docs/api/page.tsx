import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ApiDocsPage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">API Документация</h1>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="authentication">Аутентификация</TabsTrigger>
          <TabsTrigger value="customers">Клиенты</TabsTrigger>
          <TabsTrigger value="accounts">Счета</TabsTrigger>
          <TabsTrigger value="cards">Карты</TabsTrigger>
          <TabsTrigger value="transactions">Транзакции</TabsTrigger>
          <TabsTrigger value="webhooks">Вебхуки</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Обзор API</CardTitle>
              <CardDescription>Общая информация о Railsr API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Railsr API предоставляет полный набор функций для управления финансовыми операциями. API использует
                стандартные HTTP методы и возвращает ответы в формате JSON.
              </p>

              <h3 className="text-xl font-semibold mt-6">Базовый URL</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>https://api.railsr.com/v3</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Заголовки запросов</h3>
              <p>Все запросы к API должны содержать следующие заголовки:</p>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
Accept: application/json
Program-ID: YOUR_PROGRAM_ID`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Коды ответов</h3>
              <p>API использует стандартные HTTP коды ответов:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>200 OK</strong> - Запрос выполнен успешно
                </li>
                <li>
                  <strong>201 Created</strong> - Ресурс успешно создан
                </li>
                <li>
                  <strong>400 Bad Request</strong> - Неверный запрос
                </li>
                <li>
                  <strong>401 Unauthorized</strong> - Ошибка аутентификации
                </li>
                <li>
                  <strong>403 Forbidden</strong> - Доступ запрещен
                </li>
                <li>
                  <strong>404 Not Found</strong> - Ресурс не найден
                </li>
                <li>
                  <strong>422 Unprocessable Entity</strong> - Ошибка валидации
                </li>
                <li>
                  <strong>500 Internal Server Error</strong> - Внутренняя ошибка сервера
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">Формат ответа</h3>
              <p>
                Все ответы API возвращаются в формате JSON. Успешные ответы обычно содержат запрошенные данные, а ответы
                с ошибками содержат код ошибки и сообщение об ошибке.
              </p>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`// Пример успешного ответа
{
  "id": "cust_001",
  "first_name": "Иван",
  "last_name": "Иванов",
  "email": "ivan@example.com",
  "created_at": "2023-01-15T10:30:00Z"
}

// Пример ответа с ошибкой
{
  "error": {
    "code": "invalid_request",
    "message": "Неверный запрос"
  }
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication">
          <Card>
            <CardHeader>
              <CardTitle>Аутентификация</CardTitle>
              <CardDescription>Информация об аутентификации в API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Для аутентификации в API Railsr используется токен доступа (API ключ) и ID программы. Токен доступа
                передается в заголовке Authorization, а ID программы - в заголовке Program-ID.
              </p>

              <h3 className="text-xl font-semibold mt-6">Получение токена доступа</h3>
              <p>
                Для получения токена доступа необходимо создать учетную запись в Railsr и получить API ключ и ID
                программы. Подробную информацию о получении доступа к API Railsr можно найти в официальной документации.
              </p>

              <h3 className="text-xl font-semibold mt-6">Пример запроса с аутентификацией</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`curl -X GET \\
  https://api.railsr.com/v3/customers \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -H "Program-ID: YOUR_PROGRAM_ID"`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Безопасность</h3>
              <p>
                Храните API ключ и ID программы в безопасном месте и не передавайте их третьим лицам. Используйте HTTPS
                для всех запросов к API.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>API клиентов</CardTitle>
              <CardDescription>Информация о работе с API клиентов</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Создание клиента</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`POST /customers

{
  "first_name": "Иван",
  "last_name": "Иванов",
  "email": "ivan@example.com",
  "date_of_birth": "1990-01-01",
  "address": {
    "address_line_1": "ул. Примерная, 123",
    "city": "Москва",
    "country": "RU",
    "postal_code": "123456"
  },
  "phone_number": "+79001234567"
}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение информации о клиенте</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`GET /customers/{customer_id}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Обновление информации о клиенте</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`PATCH /customers/{customer_id}

{
  "email": "new.email@example.com",
  "phone_number": "+79009876543"
}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение списка клиентов</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`GET /customers?page=1&per_page=20`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Отправка документов для KYC верификации</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`POST /customers/{customer_id}/kyc

{
  "document_type": "passport",
  "document_front": "base64_encoded_image",
  "document_back": "base64_encoded_image",
  "selfie": "base64_encoded_image"
}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение статуса KYC верификации</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`GET /customers/{customer_id}/kyc`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle>API счетов</CardTitle>
              <CardDescription>Информация о работе с API счетов</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Создание счета</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`POST /accounts

{
  "customer_id": "cust_001",
  "account_type": "current",
  "currency": "RUB",
  "name": "Основной счет"
}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение информации о счете</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`GET /accounts/{account_id}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение списка счетов клиента</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`GET /customers/{customer_id}/accounts?page=1&per_page=20`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение баланса счета</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`GET /accounts/{account_id}/balance`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение выписки по счету</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`GET /accounts/{account_id}/statement?start_date=2023-01-01&end_date=2023-01-31`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Закрытие счета</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`POST /accounts/{account_id}/close

{
  "reason": "По запросу клиента"
}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение реквизитов счета</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`GET /accounts/{account_id}/details`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение записей главной книги</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`GET /accounts/{account_id}/ledger?page=1&per_page=20`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards">
          <Card>
            <CardHeader>
              <CardTitle>API карт</CardTitle>
              <CardDescription>Информация о работе с API карт</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Создание карты</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`POST /cards

{
  "customer_id": "cust_001",
  "account_id": "acc_001",
  "card_type": "virtual",
  "card_brand": "visa",
  "card_name": "IVAN IVANOV"
}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение информации о карте</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`GET /cards/{card_id}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение списка карт клиента</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`GET /customers/{customer_id}/cards?page=1&per_page=20`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Активация карты</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`POST /cards/{card_id}/activate`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Блокировка карты</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`POST /cards/{card_id}/block

{
  "reason": "Утеря карты"
}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Разблокировка карты</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`POST /cards/{card_id}/unblock`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Установка лимита для карты</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`POST /cards/{card_id}/limits

{
  "limit_type": "daily",
  "amount": 50000,
  "currency": "RUB"
}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение лимитов карты</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`GET /cards/{card_id}/limits`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение PIN-кода карты</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`POST /cards/{card_id}/pin`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>API транзакций</CardTitle>
              <CardDescription>Информация о работе с API транзакций</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Создание транзакции</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`POST /transactions

{
  "source_account_id": "acc_001",
  "destination_account_id": "acc_002",
  "amount": 15000,
  "currency": "RUB",
  "description": "Перевод средств",
  "reference": "REF123456"
}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение информации о транзакции</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`GET /transactions/{transaction_id}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение списка транзакций для счета</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`GET /accounts/{account_id}/transactions?page=1&per_page=20`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Создание платежа</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`POST /payments

{
  "account_id": "acc_001",
  "amount": 15000,
  "currency": "RUB",
  "payment_method": "card",
  "payment_details": {
    "card_id": "card_001"
  },
  "description": "Оплата услуг",
  "reference": "REF123456"
}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение информации о платеже</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`GET /payments/{payment_id}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение списка платежей для счета</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`GET /accounts/{account_id}/payments?page=1&per_page=20`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>API вебхуков</CardTitle>
              <CardDescription>Информация о работе с API вебхуков</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Создание вебхука</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`POST /webhooks

{
  "url": "https://example.com/webhooks",
  "event_types": ["customer.created", "transaction.completed"],
  "description": "Уведомления о клиентах и транзакциях",
  "active": true,
  "secret": "your_webhook_secret"
}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение информации о вебхуке</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`GET /webhooks/{webhook_id}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение списка вебхуков</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`GET /webhooks?page=1&per_page=20`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Обновление вебхука</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`PATCH /webhooks/{webhook_id}

{
  "event_types": ["customer.created", "customer.updated", "transaction.completed"],
  "active": true
}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Удаление вебхука</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`DELETE /webhooks/{webhook_id}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Тестирование вебхука</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`POST /webhooks/{webhook_id}/test

{
  "event_type": "customer.created"
}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение списка доступных типов событий</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`GET /webhooks/event_types`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Получение истории вебхук-событий</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`GET /webhooks/{webhook_id}/events?page=1&per_page=20`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Формат вебхук-событий</h3>
              <p>
                Вебхук-события отправляются в формате JSON и содержат информацию о событии и связанных с ним данных.
                Каждое событие имеет уникальный идентификатор, тип события и временную метку.
              </p>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`{
  "id": "evt_001",
  "type": "customer.created",
  "created_at": "2023-01-15T10:30:00Z",
  "data": {
    "id": "cust_001",
    "first_name": "Иван",
    "last_name": "Иванов",
    "email": "ivan@example.com"
  }
}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mt-6">Проверка подписи вебхука</h3>
              <p>
                Для проверки подлинности вебхук-событий используется подпись, которая передается в заголовке
                X-Railsr-Signature. Подпись создается с использованием алгоритма HMAC-SHA256 и секретного ключа,
                указанного при создании вебхука.
              </p>
              <pre className="bg-secondary p-4 rounded-md overflow-auto">
                <code>{`// Пример проверки подписи на Node.js
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const calculatedSignature = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature, 'hex'),
    Buffer.from(signature, 'hex')
  );
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function DocsPage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Документация</h1>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="customers">Клиенты</TabsTrigger>
          <TabsTrigger value="accounts">Счета</TabsTrigger>
          <TabsTrigger value="cards">Карты</TabsTrigger>
          <TabsTrigger value="transactions">Транзакции</TabsTrigger>
          <TabsTrigger value="webhooks">Вебхуки</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Обзор сервиса</CardTitle>
              <CardDescription>Общая информация о сервисе и его возможностях</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Данный сервис предоставляет полный набор функций для управления финансовыми операциями с использованием
                API Railsr. Сервис позволяет управлять клиентами, счетами, картами, транзакциями и настраивать вебхуки
                для уведомлений о событиях.
              </p>

              <h3 className="text-xl font-semibold mt-6">Основные возможности</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Управление клиентами: создание и управление учетными записями пользователей, включая KYC и верификацию
                </li>
                <li>Управление счетами: создание и управление мультивалютными счетами</li>
                <li>Управление картами: выпуск виртуальных и физических карт, управление лимитами и статусами</li>
                <li>Транзакции и платежи: обработка платежей, переводов и прямых дебетов</li>
                <li>Вебхуки: настройка уведомлений о различных событиях в системе</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">Начало работы</h3>
              <p>
                Для начала работы с сервисом необходимо настроить подключение к API Railsr. Для этого перейдите в раздел
                "Настройки" и введите необходимые параметры подключения: API ключ, ID программы и URL API.
              </p>

              <h3 className="text-xl font-semibold mt-6">Требования</h3>
              <p>
                Для работы сервиса необходимо иметь учетную запись в Railsr и получить API ключ и ID программы.
                Подробную информацию о получении доступа к API Railsr можно найти в официальной документации.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Управление клиентами</CardTitle>
              <CardDescription>Информация о работе с клиентами</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Создание клиента</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      Для создания нового клиента перейдите в раздел "Клиенты" и нажмите кнопку "Создать клиента".
                      Заполните необходимые поля в форме создания клиента:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Имя и фамилия</li>
                      <li>Email</li>
                      <li>Дата рождения</li>
                      <li>Адрес</li>
                      <li>Номер телефона (опционально)</li>
                    </ul>
                    <p>
                      После заполнения всех необходимых полей нажмите кнопку "Создать клиента". Новый клиент будет
                      создан в системе и появится в списке клиентов.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>KYC верификация</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      Для проведения KYC верификации клиента перейдите на страницу клиента и выберите вкладку "KYC".
                      Загрузите необходимые документы для верификации:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Паспорт или другой документ, удостоверяющий личность</li>
                      <li>Селфи с документом</li>
                      <li>Документ, подтверждающий адрес (опционально)</li>
                    </ul>
                    <p>
                      После загрузки всех необходимых документов нажмите кнопку "Отправить на верификацию". Статус KYC
                      верификации можно отслеживать на странице клиента.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Управление клиентами</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>В разделе "Клиенты" вы можете управлять всеми клиентами в системе:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Просматривать список всех клиентов</li>
                      <li>Фильтровать клиентов по различным параметрам</li>
                      <li>Просматривать детальную информацию о клиенте</li>
                      <li>Редактировать информацию о клиенте</li>
                      <li>Управлять KYC статусом клиента</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle>Управление счетами</CardTitle>
              <CardDescription>Информация о работе со счетами</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Создание счета</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      Для создания нового счета перейдите в раздел "Счета" и нажмите кнопку "Создать счет". Заполните
                      необходимые поля в форме создания счета:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Выберите клиента</li>
                      <li>Выберите тип счета (текущий, сберегательный, кредитный)</li>
                      <li>Выберите валюту счета</li>
                      <li>Введите название счета (опционально)</li>
                    </ul>
                    <p>
                      После заполнения всех необходимых полей нажмите кнопку "Создать счет". Новый счет будет создан в
                      системе и появится в списке счетов.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Управление счетами</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>В разделе "Счета" вы можете управлять всеми счетами в системе:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Просматривать список всех счетов</li>
                      <li>Фильтровать счета по различным параметрам</li>
                      <li>Просматривать детальную информацию о счете</li>
                      <li>Просматривать баланс счета</li>
                      <li>Просматривать историю операций по счету</li>
                      <li>Закрывать счета</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Главная книга (Ledger)</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      Главная книга (Ledger) содержит записи о всех финансовых операциях в системе. Для просмотра
                      записей главной книги перейдите в раздел "Счета" и выберите вкладку "Главная книга".
                    </p>
                    <p>В главной книге вы можете:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Просматривать все записи о финансовых операциях</li>
                      <li>Фильтровать записи по различным параметрам</li>
                      <li>Просматривать детальную информацию о каждой записи</li>
                      <li>Экспортировать записи в различных форматах</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards">
          <Card>
            <CardHeader>
              <CardTitle>Управление картами</CardTitle>
              <CardDescription>Информация о работе с картами</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Выпуск виртуальной карты</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      Для выпуска новой виртуальной карты перейдите в раздел "Карты" и нажмите кнопку "Новая виртуальная
                      карта". Заполните необходимые поля в форме выпуска карты:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Выберите клиента</li>
                      <li>Выберите счет</li>
                      <li>Выберите платежную систему (Visa, Mastercard)</li>
                      <li>Введите имя на карте (опционально)</li>
                    </ul>
                    <p>
                      После заполнения всех необходимых полей нажмите кнопку "Создать виртуальную карту". Новая
                      виртуальная карта будет выпущена и появится в списке карт.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Выпуск физической карты</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      Для выпуска новой физической карты перейдите в раздел "Карты" и нажмите кнопку "Новая физическая
                      карта". Заполните необходимые поля в форме выпуска карты:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Выберите клиента</li>
                      <li>Выберите счет</li>
                      <li>Выберите платежную систему (Visa, Mastercard)</li>
                      <li>Введите имя на карте (опционально)</li>
                      <li>Введите адрес доставки</li>
                    </ul>
                    <p>
                      После заполнения всех необходимых полей нажмите кнопку "Создать физическую карту". Новая
                      физическая карта будет выпущена и появится в списке карт.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Управление картами</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>В разделе "Карты" вы можете управлять всеми картами в системе:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Просматривать список всех карт</li>
                      <li>Фильтровать карты по различным параметрам</li>
                      <li>Просматривать детальную информацию о карте</li>
                      <li>Активировать и блокировать карты</li>
                      <li>Устанавливать лимиты для карт</li>
                      <li>Просматривать историю операций по карте</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Транзакции и платежи</CardTitle>
              <CardDescription>Информация о работе с транзакциями и платежами</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Создание транзакции</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      Для создания новой транзакции перейдите в раздел "Транзакции" и нажмите кнопку "Новая транзакция".
                      Заполните необходимые поля в форме создания транзакции:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Выберите счет отправителя</li>
                      <li>Выберите счет получателя или введите IBAN для внешнего перевода</li>
                      <li>Введите сумму и выберите валюту</li>
                      <li>Введите описание транзакции (опционально)</li>
                      <li>Введите референс транзакции (опционально)</li>
                    </ul>
                    <p>
                      После заполнения всех необходимых полей нажмите кнопку "Создать транзакцию". Новая транзакция
                      будет создана и появится в списке транзакций.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Создание платежа</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      Для создания нового платежа перейдите в раздел "Транзакции" и нажмите кнопку "Новый платеж".
                      Заполните необходимые поля в форме создания платежа:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Выберите счет</li>
                      <li>Введите сумму и выберите валюту</li>
                      <li>Выберите метод оплаты (карта, банковский перевод, прямой дебет)</li>
                      <li>Введите детали платежа</li>
                      <li>Введите описание платежа (опционально)</li>
                      <li>Введите референс платежа (опционально)</li>
                    </ul>
                    <p>
                      После заполнения всех необходимых полей нажмите кнопку "Создать платеж". Новый платеж будет создан
                      и появится в списке платежей.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Управление транзакциями и платежами</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>В разделе "Транзакции" вы можете управлять всеми транзакциями и платежами в системе:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Просматривать список всех транзакций и платежей</li>
                      <li>Фильтровать транзакции и платежи по различным параметрам</li>
                      <li>Просматривать детальную информацию о транзакции или платеже</li>
                      <li>Отслеживать статус транзакций и платежей</li>
                      <li>Экспортировать историю транзакций и платежей</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Вебхуки</CardTitle>
              <CardDescription>Информация о работе с вебхуками</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Создание вебхука</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      Для создания нового вебхука перейдите в раздел "Вебхуки" и нажмите кнопку "Создать вебхук".
                      Заполните необходимые поля в форме создания вебхука:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Введите URL вебхука</li>
                      <li>Введите описание вебхука (опционально)</li>
                      <li>Введите секретный ключ для проверки подписи (опционально)</li>
                      <li>Выберите типы событий, о которых вы хотите получать уведомления</li>
                      <li>Выберите, активировать ли вебхук сразу после создания</li>
                    </ul>
                    <p>
                      После заполнения всех необходимых полей нажмите кнопку "Создать вебхук". Новый вебхук будет создан
                      и появится в списке вебхуков.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Управление вебхуками</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>В разделе "Вебхуки" вы можете управлять всеми вебхуками в системе:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Просматривать список всех вебхуков</li>
                      <li>Фильтровать вебхуки по различным параметрам</li>
                      <li>Просматривать детальную информацию о вебхуке</li>
                      <li>Активировать и деактивировать вебхуки</li>
                      <li>Редактировать настройки вебхуков</li>
                      <li>Удалять вебхуки</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Типы событий</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>Вебхуки могут быть настроены для получения уведомлений о различных типах событий:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>События клиентов: создание, обновление, изменение KYC статуса</li>
                      <li>События транзакций: создание, обновление, завершение, ошибка</li>
                      <li>События карт: создание, активация, блокировка, разблокировка</li>
                      <li>События счетов: создание, обновление, закрытие</li>
                      <li>События платежей: создание, обновление, завершение, ошибка</li>
                    </ul>
                    <p>
                      Для каждого вебхука вы можете выбрать один или несколько типов событий, о которых вы хотите
                      получать уведомления.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

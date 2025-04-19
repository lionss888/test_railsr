import { RailsrAPI } from "./railsr-api"

export interface WebhookData {
  url: string
  eventTypes: string[]
  description?: string
  active?: boolean
  secret?: string
}

export class WebhooksAPI extends RailsrAPI {
  // Создание нового вебхука
  async createWebhook(webhookData: WebhookData) {
    return this.fetchAPI("/webhooks", {
      method: "POST",
      body: JSON.stringify({
        url: webhookData.url,
        event_types: webhookData.eventTypes,
        description: webhookData.description,
        active: webhookData.active,
        secret: webhookData.secret,
      }),
    })
  }

  // Получение информации о вебхуке
  async getWebhook(webhookId: string) {
    return this.fetchAPI(`/webhooks/${webhookId}`)
  }

  // Получение списка вебхуков
  async listWebhooks(page = 1, perPage = 20) {
    return this.fetchAPI(`/webhooks?page=${page}&per_page=${perPage}`)
  }

  // Обновление вебхука
  async updateWebhook(webhookId: string, webhookData: Partial<WebhookData>) {
    return this.fetchAPI(`/webhooks/${webhookId}`, {
      method: "PATCH",
      body: JSON.stringify({
        url: webhookData.url,
        event_types: webhookData.eventTypes,
        description: webhookData.description,
        active: webhookData.active,
        secret: webhookData.secret,
      }),
    })
  }

  // Удаление вебхука
  async deleteWebhook(webhookId: string) {
    return this.fetchAPI(`/webhooks/${webhookId}`, {
      method: "DELETE",
    })
  }

  // Тестирование вебхука
  async testWebhook(webhookId: string, eventType: string) {
    return this.fetchAPI(`/webhooks/${webhookId}/test`, {
      method: "POST",
      body: JSON.stringify({
        event_type: eventType,
      }),
    })
  }

  // Получение списка доступных типов событий
  async getEventTypes() {
    return this.fetchAPI("/webhooks/event_types")
  }

  // Получение истории вебхук-событий
  async getWebhookEvents(webhookId: string, page = 1, perPage = 20) {
    return this.fetchAPI(`/webhooks/${webhookId}/events?page=${page}&per_page=${perPage}`)
  }
}

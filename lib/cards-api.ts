import { RailsrAPI } from "./railsr-api"

export interface CardData {
  customerId: string
  accountId: string
  cardType: "virtual" | "physical"
  cardBrand?: "visa" | "mastercard"
  cardName?: string
  shippingAddress?: {
    addressLine1: string
    city: string
    country: string
    postalCode: string
  }
  metadata?: Record<string, any>
}

export interface CardLimitData {
  cardId: string
  limitType: "daily" | "monthly" | "transaction"
  amount: number
  currency: string
}

export class CardsAPI extends RailsrAPI {
  // Создание новой карты
  async createCard(cardData: CardData) {
    return this.fetchAPI("/cards", {
      method: "POST",
      body: JSON.stringify({
        customer_id: cardData.customerId,
        account_id: cardData.accountId,
        card_type: cardData.cardType,
        card_brand: cardData.cardBrand,
        card_name: cardData.cardName,
        shipping_address: cardData.shippingAddress,
        metadata: cardData.metadata,
      }),
    })
  }

  // Получение информации о карте
  async getCard(cardId: string) {
    return this.fetchAPI(`/cards/${cardId}`)
  }

  // Получение списка карт клиента
  async listCards(customerId: string, page = 1, perPage = 20) {
    return this.fetchAPI(`/customers/${customerId}/cards?page=${page}&per_page=${perPage}`)
  }

  // Получение списка всех карт в системе
  async listAllCards(page = 1, perPage = 20, cardType?: string) {
    let url = `/cards?page=${page}&per_page=${perPage}`
    if (cardType) {
      url += `&card_type=${cardType}`
    }
    return this.fetchAPI(url)
  }

  // Активация карты
  async activateCard(cardId: string) {
    return this.fetchAPI(`/cards/${cardId}/activate`, {
      method: "POST",
    })
  }

  // Блокировка карты
  async blockCard(cardId: string, reason: string) {
    return this.fetchAPI(`/cards/${cardId}/block`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    })
  }

  // Разблокировка карты
  async unblockCard(cardId: string) {
    return this.fetchAPI(`/cards/${cardId}/unblock`, {
      method: "POST",
    })
  }

  // Установка лимита для карты
  async setCardLimit(limitData: CardLimitData) {
    return this.fetchAPI(`/cards/${limitData.cardId}/limits`, {
      method: "POST",
      body: JSON.stringify({
        limit_type: limitData.limitType,
        amount: limitData.amount,
        currency: limitData.currency,
      }),
    })
  }

  // Получение лимитов карты
  async getCardLimits(cardId: string) {
    return this.fetchAPI(`/cards/${cardId}/limits`)
  }

  // Получение PIN-кода карты (обычно отправляется по SMS)
  async getCardPin(cardId: string) {
    return this.fetchAPI(`/cards/${cardId}/pin`, {
      method: "POST",
    })
  }
}

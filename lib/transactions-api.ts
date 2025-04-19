import { RailsrAPI } from "./railsr-api"

export interface TransactionData {
  sourceAccountId: string
  destinationAccountId?: string
  destinationIban?: string
  amount: number
  currency: string
  description?: string
  reference?: string
  metadata?: Record<string, any>
}

export interface PaymentData {
  accountId: string
  amount: number
  currency: string
  paymentMethod: "card" | "bank_transfer" | "direct_debit"
  paymentDetails: Record<string, any>
  description?: string
  reference?: string
}

export class TransactionsAPI extends RailsrAPI {
  // Создание транзакции между счетами
  async createTransaction(transactionData: TransactionData) {
    return this.fetchAPI("/transactions", {
      method: "POST",
      body: JSON.stringify({
        source_account_id: transactionData.sourceAccountId,
        destination_account_id: transactionData.destinationAccountId,
        destination_iban: transactionData.destinationIban,
        amount: transactionData.amount,
        currency: transactionData.currency,
        description: transactionData.description,
        reference: transactionData.reference,
        metadata: transactionData.metadata,
      }),
    })
  }

  // Получение информации о транзакции
  async getTransaction(transactionId: string) {
    return this.fetchAPI(`/transactions/${transactionId}`)
  }

  // Получение списка транзакций для счета
  async listTransactions(accountId: string, page = 1, perPage = 20) {
    return this.fetchAPI(`/accounts/${accountId}/transactions?page=${page}&per_page=${perPage}`)
  }

  // Получение списка всех транзакций в системе
  async listAllTransactions(page = 1, perPage = 20) {
    try {
      return await this.fetchAPI(`/transactions?page=${page}&per_page=${perPage}`)
    } catch (error) {
      console.warn("Failed to fetch all transactions, trying alternative endpoint", error)

      try {
        // Пробуем альтернативный эндпоинт, если основной не работает
        return await this.fetchAPI(`/program/transactions?page=${page}&per_page=${perPage}`)
      } catch (fallbackError) {
        console.error("Failed to fetch transactions from alternative endpoint", fallbackError)
        // Возвращаем пустой результат в случае ошибки
        return { data: [], meta: { pagination: { total: 0 } } }
      }
    }
  }

  // Создание платежа
  async createPayment(paymentData: PaymentData) {
    return this.fetchAPI("/payments", {
      method: "POST",
      body: JSON.stringify({
        account_id: paymentData.accountId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        payment_method: paymentData.paymentMethod,
        payment_details: paymentData.paymentDetails,
        description: paymentData.description,
        reference: paymentData.reference,
      }),
    })
  }

  // Получение информации о платеже
  async getPayment(paymentId: string) {
    return this.fetchAPI(`/payments/${paymentId}`)
  }

  // Получение списка платежей для счета
  async listPayments(accountId: string, page = 1, perPage = 20) {
    return this.fetchAPI(`/accounts/${accountId}/payments?page=${page}&per_page=${perPage}`)
  }

  // Получение списка всех платежей в системе
  async listAllPayments(page = 1, perPage = 20) {
    return this.fetchAPI(`/payments?page=${page}&per_page=${perPage}`)
  }
}

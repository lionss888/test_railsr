import { RailsrAPI } from "./railsr-api"

export interface CustomerData {
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  address: {
    addressLine1: string
    city: string
    country: string
    postalCode: string
  }
  phoneNumber?: string
  metadata?: Record<string, any>
}

export interface KYCData {
  customerId: string
  documentType: "passport" | "driving_license" | "identity_card"
  documentFront: string // base64 encoded image
  documentBack?: string // base64 encoded image
  selfie?: string // base64 encoded image
}

export class CustomersAPI extends RailsrAPI {
  // Создание нового клиента
  async createCustomer(customerData: CustomerData) {
    return this.fetchAPI("/customers", {
      method: "POST",
      body: JSON.stringify(customerData),
    })
  }

  // Получение информации о клиенте
  async getCustomer(customerId: string) {
    return this.fetchAPI(`/customers/${customerId}`)
  }

  // Обновление информации о клиенте
  async updateCustomer(customerId: string, customerData: Partial<CustomerData>) {
    return this.fetchAPI(`/customers/${customerId}`, {
      method: "PATCH",
      body: JSON.stringify(customerData),
    })
  }

  // Получение списка клиентов
  async listCustomers(page = 1, perPage = 20) {
    return this.fetchAPI(`/customers?page=${page}&per_page=${perPage}`)
  }

  // Отправка документов для KYC верификации
  async submitKYC(kycData: KYCData) {
    return this.fetchAPI(`/customers/${kycData.customerId}/kyc`, {
      method: "POST",
      body: JSON.stringify({
        document_type: kycData.documentType,
        document_front: kycData.documentFront,
        document_back: kycData.documentBack,
        selfie: kycData.selfie,
      }),
    })
  }

  // Получение статуса KYC верификации
  async getKYCStatus(customerId: string) {
    return this.fetchAPI(`/customers/${customerId}/kyc`)
  }
}

export interface EmailPaymentBodyData {
  customerName: string
  eventTitle: string
  eventSchedule: string
  eventLocation: string
  transactionId: string
  transactionDateTime: string
  totalPrice: string
}

export interface EmailPasswordResetBodyData {
  name: string
  token: string
}

export interface EmailRegisterVerificationBodyData {
  email: string
  token: string
}

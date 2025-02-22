export interface Province {
  id: number
  name: string
}

export interface ProvincesJson {
  message: string
  error?: {
    message: string
  }
  data: Province[]
}

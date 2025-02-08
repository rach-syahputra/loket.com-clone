export interface Category {
  id: number
  name: string
}

export interface CategoriesJson {
  message: string
  error?: {
    message: string
  }
  data: Category[]
}

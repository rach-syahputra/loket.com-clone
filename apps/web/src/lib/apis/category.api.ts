import { API_BASE_URL } from '../constants'
import { CategoriesJson } from '../interfaces/category.interface'

export async function fetchGetCategories(): Promise<CategoriesJson> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'GET'
  })

  return await response.json()
}

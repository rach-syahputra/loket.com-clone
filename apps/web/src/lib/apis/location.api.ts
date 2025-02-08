import { BASE_URL } from '../constants'
import { ProvincesJson } from '../interfaces/location.interface'

export async function fetchGetProvinces(): Promise<ProvincesJson> {
  const response = await fetch(`${BASE_URL}/provinces`, {
    method: 'GET'
  })

  return await response.json()
}

import { LoginFormSchemaType } from '../interfaces/auth.interface'

const BASE_URL = 'http://localhost:8000'

export async function fetchLogin(data: LoginFormSchemaType) {
  const user = await fetch(`${BASE_URL}/auth`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  return await user.json()
}

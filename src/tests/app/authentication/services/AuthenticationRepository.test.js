import { test } from 'vitest'

import { signIn } from '@/app/authentication/services'

test('POST /login should return data', async () => {
  try {
    const userData = {
      username: 'test@test.com',
      password: 'test@123'
    }

    const response = await signIn(userData)

    console.log(response)
  } catch (e) {
    console.log(e)
  }

  // Ajusta las expectativas según la respuesta real de tu API
  // expect(response.body).toHaveProperty('token')
})

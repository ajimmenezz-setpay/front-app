import { describe, expect, it } from 'vitest'

import Login from '@/app/authentication/pages/Login'
import { render } from '@/tests/testUtils'

describe('Pagina Inicio de Sesión', () => {
  it('Debería mostrar la pagina de inicio de sesión', async () => {
    const { container } = render(<Login />)
    expect(container).toMatchSnapshot()
  })
})

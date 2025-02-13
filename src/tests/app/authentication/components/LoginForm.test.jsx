import { cleanup, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { LoginForm } from '@/app/authentication/components'
import { render, screen, user } from '@/tests/testUtils'

const mockLogin = vi.fn()
let mockError = null
let wrapper

vi.mock('../../../hooks', () => ({
  useSignIn: () => ({
    isLoading: false,
    mutate: mockLogin,
    error: mockError,
    isSuccess: Boolean(!mockError),
    setCustomError: vi.fn()
  })
}))

describe('Formulario de Inicio de Sesión', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
    mockError = null
  })

  test('Debería mostrar el formulario de inicio de sesión', () => {
    wrapper = render(<LoginForm />)
    const userInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Contraseña/i)
    const button = screen.getByRole('button', { name: /Accesar a mi cuenta/i })

    expect(wrapper.container).toMatchSnapshot()
    expect(userInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(button).toBeInTheDocument()
  })

  test('Debería enviarse el formulario con la información de inicio de sesión', async () => {
    wrapper = render(<LoginForm />)
    const userInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Contraseña/i)
    const button = screen.getByRole('button', { name: /Accesar a mi cuenta/i })

    await user.type(userInput, 'test@test.com')
    await user.type(passwordInput, 'test123')
    await user.click(button)

    await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(1))
  })

  test('Debería enviarse el formulario con la información de inicio de sesión y mostrar alerta de error', async () => {
    wrapper = render(<LoginForm />)
    const userInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Contraseña/i)
    const button = screen.getByRole('button', { name: /Accesar a mi cuenta/i })
    mockError = true
    const scrollIntoViewMock = vi.fn()
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock

    await user.type(userInput, 'test@test.com')
    await user.type(passwordInput, 'test123')
    await user.click(button)

    await waitFor(() => {
      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
    })
  })
})

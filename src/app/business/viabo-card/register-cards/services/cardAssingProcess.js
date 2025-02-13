import { lazy } from 'react'

const FormDemoCardValidation = lazy(() =>
  import('@/app/business/viabo-card/register-cards/components/FormDemoCardValidation')
)
const FormRegisterDemoUserCard = lazy(() =>
  import('@/app/business/viabo-card/register-cards/components/FormRegisterDemoUserCard')
)
const FormUserCardValidation = lazy(() =>
  import('@/app/business/viabo-card/register-cards/components/FormDemoUserValidation')
)
const FormCardRegister = lazy(() => import('@/app/business/viabo-card/register-cards/components/FormCardRegister'))
const FormSuccessAssignCard = lazy(() =>
  import('@/app/business/viabo-card/register-cards/components/FormSuccessAssignCard')
)

export const CARD_ASSIGN_PROCESS_LIST = {
  CARD_VALIDATION: 'VALIDACION TARJETA',
  USER_REGISTER: 'REGISTRO USUARIO',
  USER_VALIDATION: 'VALIDACIÓN USUARIO',
  CARD_REGISTER: 'REGISTRO TARJETA',
  CARD_ASSIGNED: 'TARJETA ASIGNADA'
}

export const CARD_ASSIGN_STEPS = [
  { name: CARD_ASSIGN_PROCESS_LIST.CARD_VALIDATION, step: 1, content: FormDemoCardValidation },
  { name: CARD_ASSIGN_PROCESS_LIST.USER_REGISTER, step: 2, content: FormRegisterDemoUserCard },
  { name: CARD_ASSIGN_PROCESS_LIST.USER_VALIDATION, step: 3, content: FormUserCardValidation },
  { name: CARD_ASSIGN_PROCESS_LIST.CARD_REGISTER, step: 4, content: FormCardRegister },
  { name: CARD_ASSIGN_PROCESS_LIST.CARD_ASSIGNED, step: 5, content: FormSuccessAssignCard }
]

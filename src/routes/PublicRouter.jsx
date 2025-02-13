import { lazy } from 'react'

import { PUBLIC_PATHS } from './paths'

import { LoadableRoute } from '@/routes/LoadableRoute'

const ChargePaymentLink = LoadableRoute(
  lazy(() => import('@/app/business/viabo-pay/terminal-charge-payment-link/pages/ChargePaymentLink'))
)
const CommerceRegister = LoadableRoute(lazy(() => import('@/app/business/commerce/pages/CommerceRegister')))
const RegisterCards = LoadableRoute(lazy(() => import('@/app/business/viabo-card/register-cards/pages/RegisterCards')))
const Privacy = LoadableRoute(lazy(() => import('@/app/public/privacy/pages/Privacy')))
const Policies = LoadableRoute(lazy(() => import('@/app/public/privacy/pages/Policies')))
const PublicPayments = LoadableRoute(lazy(() => import('@/app/public/payments/pages/PublicPayments')))
const RegisterCardOfCardCloud = LoadableRoute(lazy(() => import('@/app/public/card/pages/RegisterCardOfCardCloud')))
const RecoverPassword = LoadableRoute(lazy(() => import('@/app/authentication/recovery-account/pages/RecoverPassword')))
export const PublicRouter = [
  {
    path: '/cobro/:paymentId',
    Component: ChargePaymentLink
  },
  {
    path: '/comercio/registro',
    Component: CommerceRegister
  },
  {
    path: '/registro',
    Component: RegisterCards
  },
  {
    path: PUBLIC_PATHS.privacy,
    Component: Privacy
  },
  {
    path: PUBLIC_PATHS.policies,
    Component: Policies
  },
  {
    path: PUBLIC_PATHS.payments,
    Component: PublicPayments
  },
  {
    path: PUBLIC_PATHS.card,
    Component: RegisterCardOfCardCloud
  },
  {
    path: PUBLIC_PATHS.recover_password,
    Component: RecoverPassword
  }
]

import { Stack } from '@mui/material'
import { useParams } from 'react-router-dom'

import { ChargePaymentForm, ChargePaymentLinkDetails } from '../components'
import { useFindPaymentLinkInfo } from '../hooks'

import { Page } from '@/shared/components/containers'
import { RequestLoadingComponent } from '@/shared/components/loadings'
import PublicLayout from '@/shared/layout/PublicLayout'

const ChargePaymentLink = () => {
  const origin = typeof window === 'undefined' ? '' : window.location.origin

  const { paymentId } = useParams()

  const { data, isLoading } = useFindPaymentLinkInfo(paymentId, {
    enabled: !!paymentId
  })

  return (
    <PublicLayout>
      <Page
        title="Cobro"
        meta={
          <>
            <meta name="description" content={`Liga de Pago para el servicio Viabo Pay`} />
            <meta
              name="keywords"
              content={`viabo pay, liga de pago, pago en linea,servició de pago,paypal,viabo card`}
            />
            <meta property="og:title" content={`Liga de Pago Generada de Viabo Pay de un monto de : ${data?.amount}`} />
            <meta
              property="og:description"
              content={`Esta es la página sobre  el cobro mediante una liga de pago generada para el servició viabo pay`}
            />
            <meta property="og:image" content={`/landingPage/img/instagram-3.jpg`} />
          </>
        }
      >
        <Stack p={4} alignItems={'center'} justifyContent={'center'} minHeight={'100dvH'}>
          {isLoading && <RequestLoadingComponent />}
          {!isLoading && data && (
            <Stack width={{ xs: 1, sm: 0.5, md: '0.4' }} spacing={3} maxWidth={data?.status?.id === '7' ? 400 : 'sm'}>
              <ChargePaymentLinkDetails details={data} />
              {['6', '8'].includes(data?.status?.id) && <ChargePaymentForm details={data} />}
            </Stack>
          )}
        </Stack>
      </Page>
    </PublicLayout>
  )
}

export default ChargePaymentLink

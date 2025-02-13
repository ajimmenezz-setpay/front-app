import PropTypes from 'prop-types'

import { CheckCircle } from '@mui/icons-material'
import { Divider, Link, Stack, Typography } from '@mui/material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'react-toastify'

import { ButtonViaboSpei } from '@/app/business/viabo-spei/shared/components'
import { Scrollbar } from '@/shared/components/scroll'
import { downloadFile, MIME_TYPES } from '@/shared/utils'

const SpeiOutSuccess = ({ transactions = [], onFinish }) => {
  const handleDownloadFile = async transaction => {
    const promise = downloadFile(transaction?.url, `Comprobante Spei Out - ${transaction?.account}`, MIME_TYPES.pdf)
    toast.promise(promise, {
      pending: 'Generando archivo ...',
      success: 'Comienza la descarga del archivo',
      error: 'No se puede realizar esta operación en este momento. Intente nuevamente o reporte a sistemas'
    })
  }

  return (
    <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
      <Stack flexDirection="column" alignItems={'center'} justifyContent={'center'} spacing={2} p={3}>
        <Stack flexDirection="column" alignItems={'center'} spacing={2}>
          <CheckCircle sx={{ width: 50, height: 50 }} color={'success'} />
          <Stack alignItems={'center'} spacing={1}>
            <Typography variant="h6">{`Operación Exitosa`}</Typography>
            <Typography variant="caption" color={'text.disabled'}>
              {format(new Date(), 'dd MMM yyyy hh:mm a', { locale: es })}
            </Typography>
          </Stack>
        </Stack>

        <Typography variant="caption" textAlign={'center'}>
          Resumen de las Operaciones Generadas.
        </Typography>
        <Stack flex={1} divider={<Divider orientation="horizontal" flexItem sx={{ borderStyle: 'dashed' }} />}>
          {transactions?.map((transaction, index) => (
            <Stack
              key={transaction?.url}
              justifyContent={'space-between'}
              flexDirection={'row'}
              alignItems={'center'}
              flexGrow={1}
              gap={1}
              py={2}
              divider={<span>-</span>}
            >
              <Stack spacing={1} direction={'row'}>
                <Typography variant="subtitle1">{transaction?.account}</Typography>
              </Stack>
              <Link
                component={Typography}
                variant="subtitle2"
                underline="always"
                onClick={() => handleDownloadFile(transaction)}
                color="info.main"
              >
                Obtener Comprobante
              </Link>
            </Stack>
          ))}
        </Stack>

        <Stack sx={{ px: 9, pt: 3 }}>
          <ButtonViaboSpei
            type="button"
            size="large"
            variant="contained"
            sx={{ fontWeight: 'bold' }}
            onClick={onFinish}
          >
            Finalizar
          </ButtonViaboSpei>
        </Stack>
      </Stack>
    </Scrollbar>
  )
}

SpeiOutSuccess.propTypes = {
  onFinish: PropTypes.any,
  transactions: PropTypes.array
}

export default SpeiOutSuccess

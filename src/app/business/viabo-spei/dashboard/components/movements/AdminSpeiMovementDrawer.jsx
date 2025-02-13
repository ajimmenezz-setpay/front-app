import { Close, ReceiptLongOutlined } from '@mui/icons-material'
import { alpha, Avatar, Box, Drawer, Link, Stack, styled, Typography } from '@mui/material'
import { toast } from 'react-toastify'

import { useAdminDashboardSpeiStore } from '../../store'

import { ButtonViaboSpei } from '@/app/business/viabo-spei/shared/components'
import { IconButtonAnimate } from '@/shared/components/animate'
import { Label } from '@/shared/components/form'
import { Scrollbar } from '@/shared/components/scroll'
import { downloadFile, MIME_TYPES } from '@/shared/utils'
import { useResponsive } from '@/theme/hooks'
import { stringAvatar } from '@/theme/utils'

const OverlayStyle = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  position: 'absolute',
  backgroundColor:
    theme.palette.mode === 'light' ? alpha(theme.palette.primary.main, 0.7) : alpha(theme.palette.secondary.main, 0.5)
}))

const AdminSpeiMovementDrawer = () => {
  const setOpenDetailsTransaction = useAdminDashboardSpeiStore(state => state.setOpenDetailsTransaction)
  const setTransaction = useAdminDashboardSpeiStore(state => state.setTransaction)
  const transaction = useAdminDashboardSpeiStore(state => state.transaction)
  const isOpenDetailsTransaction = useAdminDashboardSpeiStore(state => state.isOpenDetailsTransaction)

  const handleClose = () => {
    setOpenDetailsTransaction(false)
    setTransaction(null)
  }
  const matches = useResponsive('down', 'md')

  const handleDrawerClose = event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    handleClose()
  }
  const avatar = stringAvatar(transaction?.beneficiary?.name || '')

  const handleDownloadFile = async () => {
    const promise = downloadFile(
      transaction?.receipt,
      `Comprobante Spei Cloud - #${transaction?.stpId || transaction?.reference}`,
      MIME_TYPES.pdf
    )
    toast.promise(promise, {
      pending: 'Generando archivo ...',
      success: 'Comienza la descarga del archivo',
      error: 'No se puede realizar esta operación en este momento. Intente nuevamente o reporte a sistemas'
    })
  }

  return (
    <Drawer
      keepMounted={false}
      anchor={matches ? 'bottom' : 'right'}
      sx={{
        '& .MuiPaper-root.MuiDrawer-paper': {
          borderRadius: `${!matches ? '10px 0px 0px 10px' : 'none'}`,
          width: { sm: '100%', lg: '40%', xl: '30%' }
        }
      }}
      open={isOpenDetailsTransaction}
      onClose={handleDrawerClose}
      ModalProps={{
        keepMounted: false
      }}
    >
      <Stack position={'relative'} sx={{ minHeight: 150, mb: 3 }}>
        <OverlayStyle />
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ zIndex: 11, px: 2.5, py: 2 }}>
          <Typography variant="h6" color={'white'}>
            Detalle Transacción
          </Typography>

          <div>
            <IconButtonAnimate aria-label="close" size="medium" onClick={handleClose}>
              <Close width={20} height={20} fontSize="inherit" color="primary" sx={{ color: 'white' }} />
            </IconButtonAnimate>
          </div>
        </Stack>
        <Box
          component="span"
          sx={{
            width: 144,
            height: 62,
            zIndex: 10,
            left: 0,
            right: 0,
            bottom: -26,
            mx: 'auto',
            position: 'absolute',
            display: 'inline-block',

            color: theme => theme.palette.background.paper
          }}
        >
          <svg height="62" viewBox="0 0 144 62" width="144" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m111.34 23.88c-10.62-10.46-18.5-23.88-38.74-23.88h-1.2c-20.24 0-28.12 13.42-38.74 23.88-7.72 9.64-19.44 11.74-32.66 12.12v26h144v-26c-13.22-.38-24.94-2.48-32.66-12.12z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        </Box>

        <Avatar
          alt={'example'}
          {...avatar}
          sx={{
            width: 60,
            height: 60,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -30,
            mx: 'auto',
            position: 'absolute',
            ...avatar?.sx
          }}
        />
      </Stack>
      <Stack justifyContent={'center'} alignItems={'center'} p={3} pb={0}>
        <Typography variant="h4" fontWeight={'bold'}>
          {transaction?.amount?.format} MXN
        </Typography>
        <Typography variant="subtitle1">{transaction?.movement}</Typography>
        <Typography variant="subtitle2" color={'text.secondary'}>
          {transaction?.date?.dateTime}
        </Typography>
        <Label variant={'ghost'} color={transaction?.status?.color} sx={{ mt: 2 }}>
          {transaction?.status?.name}
        </Label>
      </Stack>
      <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
        <Stack spacing={3} p={3}>
          <Stack spacing={2}>
            <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} spacing={0.5} flex={1}>
              <Typography paragraph variant="caption" sx={{ color: 'text.disabled' }}>
                Movimiento:
              </Typography>
              <Typography variant="body2">#{transaction?.stpId || transaction?.reference}</Typography>
            </Stack>
            <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} spacing={0.5} flex={1}>
              <Typography paragraph variant="caption" sx={{ color: 'text.disabled' }}>
                Enviado a:
              </Typography>
              <Typography variant="body2">{transaction?.beneficiary?.name ?? '-'}</Typography>
            </Stack>
            <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} spacing={0.5} flex={1}>
              <Typography paragraph variant="caption" sx={{ color: 'text.disabled' }}>
                Cuenta origen:
              </Typography>
              <Typography variant="body2">{transaction?.source?.account ?? '-'}</Typography>
            </Stack>
            <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} spacing={0.5} flex={1}>
              <Typography paragraph variant="caption" sx={{ color: 'text.disabled' }}>
                Cuenta destino:
              </Typography>
              <Typography variant="body2">{transaction?.beneficiary?.account ?? '-'}</Typography>
            </Stack>
            <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} spacing={0.5} flex={1}>
              <Typography paragraph variant="caption" sx={{ color: 'text.disabled' }}>
                Monto:
              </Typography>
              <Typography variant="body2">
                {transaction?.commissions?.total_with_commissions?.replace('-', '') ?? '-'}
              </Typography>
            </Stack>
            <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} spacing={0.5} flex={1}>
              <Typography paragraph variant="caption" sx={{ color: 'text.disabled' }}>
                Comisión por SPEI Out:
              </Typography>
              <Typography variant="body2" color={'error'}>
                {transaction?.commissions?.speiOut ?? '-'}
              </Typography>
            </Stack>
            <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} spacing={0.5} flex={1}>
              <Typography paragraph variant="caption" sx={{ color: 'text.disabled' }}>
                Fee STP:
              </Typography>
              <Typography variant="body2" color={'error'}>
                {transaction?.commissions?.fee ?? '-'}
              </Typography>
            </Stack>
            <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} spacing={0.5} flex={1}>
              <Typography paragraph variant="caption" sx={{ color: 'text.disabled' }}>
                Comisión por Operación Interna:
              </Typography>
              <Typography variant="body2" color={'error'}>
                {transaction?.commissions?.internalCompany ?? '-'}
              </Typography>
            </Stack>
            <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} spacing={0.5} flex={1}>
              <Typography paragraph variant="caption" sx={{ color: 'text.disabled' }}>
                Comisión por SPEI In:
              </Typography>
              <Typography variant="body2" color={'error'}>
                {transaction?.commissions?.speiIn ?? '-'}
              </Typography>
            </Stack>
            <Stack
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
              spacing={1}
              flex={1}
              flexWrap={'wrap'}
            >
              <Typography paragraph variant="caption" sx={{ color: 'text.disabled' }}>
                Clave Rastreo:
              </Typography>
              <Typography variant="body2">{transaction?.banxicoKey ?? '-'}</Typography>
            </Stack>
          </Stack>

          <Box sx={{ py: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <ButtonViaboSpei onClick={handleDownloadFile} startIcon={<ReceiptLongOutlined />}>
                Ver Comprobante
              </ButtonViaboSpei>
            </Box>
            {transaction?.fileCEP && (
              <Box>
                <ButtonViaboSpei
                  component={Link}
                  target="_blank"
                  href={transaction?.fileCEP}
                  startIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-receipt-2"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2" />
                      <path d="M14 8h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5m2 0v1.5m0 -9v1.5" />
                    </svg>
                  }
                >
                  Comprobante CEP
                </ButtonViaboSpei>
              </Box>
            )}
          </Box>
        </Stack>
      </Scrollbar>
    </Drawer>
  )
}

export default AdminSpeiMovementDrawer

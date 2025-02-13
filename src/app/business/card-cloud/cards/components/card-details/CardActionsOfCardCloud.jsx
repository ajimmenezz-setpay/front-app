import { CurrencyExchangeOutlined } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { BsCreditCard2FrontFill } from 'react-icons/bs'
import { CgScrollH } from 'react-icons/cg'
import { PiPasswordDuotone } from 'react-icons/pi'

import { useCardsOfCardCloudStore } from '../../store'

import { Scrollbar } from '@/shared/components/scroll'
import { useConfirm } from '@/shared/hooks'

const CardActionsOfCardCloud = ({ transferPermission = true, changeNipPermission = false, actions }) => {
  const setOpenTransfer = useCardsOfCardCloudStore(state => state.setOpenTransfer)
  const selectedCard = useCardsOfCardCloudStore(state => state.selectedCard)
  const setOpenChangeNIP = useCardsOfCardCloudStore(state => state.setOpenChangeNIP)
  const { setOpenSecurityDetails } = useCardsOfCardCloudStore()
  const [ConfirmDialog, confirm] = useConfirm(
    '¿Desea Cambiar su NIP?',
    <Box>
      <Typography>
        1. El cambio de NIP se completará realizando una consulta de saldo en el cajero automático.
      </Typography>
      <Typography>
        2. Tenga en cuenta que esta consulta de saldo puede tener un costo que será establecido por el banco.
      </Typography>
      <Typography>
        3. El costo puede variar según las políticas del banco, por lo que se recomienda informarse previamente.
      </Typography>
    </Box>
  )

  const handleConfirmChangeNIP = async () => {
    const result = await confirm()
    if (!result) {
      return
    }
    setOpenChangeNIP(true)
  }

  return (
    <>
      <ConfirmDialog />
      <Box position={'relative'}>
        <Scrollbar>
          <Stack
            flexDirection="row"
            justifyContent={'space-evenly'}
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
            sx={{ py: 3 }}
            gap={3}
          >
            <Stack minWidth={170}>
              <LoadingButton
                variant={'outlined'}
                onClick={() => {
                  setOpenSecurityDetails(true)
                }}
                startIcon={<BsCreditCard2FrontFill />}
              >
                Ver Información
              </LoadingButton>
            </Stack>
            {transferPermission && (
              <Stack>
                <LoadingButton
                  disabled={selectedCard?.balance?.number <= 0}
                  startIcon={<CurrencyExchangeOutlined />}
                  variant={'outlined'}
                  onClick={() => setOpenTransfer(true)}
                >
                  Transferir
                </LoadingButton>
              </Stack>
            )}
            {actions}
            {changeNipPermission && selectedCard?.type?.isPhysical && (
              <Stack>
                <LoadingButton
                  sx={{ whiteSpace: 'nowrap' }}
                  startIcon={<PiPasswordDuotone />}
                  variant={'outlined'}
                  onClick={handleConfirmChangeNIP}
                >
                  Cambiar NIP
                </LoadingButton>
              </Stack>
            )}
          </Stack>
        </Scrollbar>

        <Stack
          position={'absolute'}
          color={'text.secondary'}
          bottom={-5}
          right={'47%'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <CgScrollH fontSize={24} />
        </Stack>
      </Box>
    </>
  )
}

export default CardActionsOfCardCloud

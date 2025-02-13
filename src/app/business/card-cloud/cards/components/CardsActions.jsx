import { lazy, Suspense, useMemo, useState } from 'react'

import { FileDownload, FileUpload, KeyboardArrowDown, WarningAmberOutlined } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Divider, ListItemIcon, ListItemText, MenuItem, Stack, styled, Typography } from '@mui/material'
import { BsPersonBadge } from 'react-icons/bs'
import { SiMicrosoftexcel } from 'react-icons/si'
import { TbCreditCardPay } from 'react-icons/tb'
import { toast } from 'react-toastify'

import { useCardCloudSharedStore } from '../../shared/store'
import { useAssignCardsToCardHolderWithExcelFileOfCardCloud, useCardsExcelFileOfCardCloud } from '../hooks'
import { useCardsOfCardCloudStore } from '../store'

import { StyledMenu } from '@/shared/components/containers'
import { ModalAlert } from '@/shared/components/modals'
import { jsonHighlight } from '@/shared/utils'

const GoogleAuth2FAModal = lazy(() => import('@/app/shared/components/GoogleAuth2FAModal'))

const ActionStyle = styled(MenuItem)(({ theme }) => ({
  typography: 'body2',
  py: 1,
  px: 2.5
}))

export const CardsActions = ({ loading, cardsQuery }) => {
  const { setOpenAssignCards } = useCardsOfCardCloudStore()
  const { isListView } = useCardsOfCardCloudStore()
  const selectedCompany = useCardCloudSharedStore(state => state.selectedCompany)
  const setOpenTransfer = useCardCloudSharedStore(state => state.setOpenTransfer)

  const {
    uploadLayout,
    downloadLayout,
    file,
    loading: loadingFile,
    setFile,
    downloadErrorLayout
  } = useCardsExcelFileOfCardCloud()
  const { mutate, isLoading } = useAssignCardsToCardHolderWithExcelFileOfCardCloud()
  const [responseFile, setResponseFile] = useState(null)

  const availableCards = useMemo(
    () => cardsQuery?.data?.filter(card => card?.isAssigned === false) ?? [],
    [cardsQuery?.data]
  )

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleAssignCards = () => {
    handleClose()
    setOpenAssignCards(true)
  }

  const handleDownloadTemplate = () => {
    handleClose()

    if (availableCards?.length <= 0) {
      return toast.warning('No hay tarjetas disponibles para asignar')
    }

    return downloadLayout(availableCards)
  }

  const handleUploadTemplate = () => {
    handleClose()
    if (availableCards?.length <= 0) {
      return toast.warning('No hay tarjetas disponibles para asignar')
    }

    return uploadLayout()
  }

  const handleSubmitFile = code => {
    if (code) {
      return mutate(
        {
          file,
          companyId: selectedCompany?.id,
          subAccountId: selectedCompany?.subAccountId,
          googleAuthenticatorCode: code
        },
        {
          onSuccess: data => {
            setResponseFile(data)
            setFile(null)
          },
          onError: () => {
            setFile(null)
            setResponseFile(null)
          }
        }
      )
    }
    return toast.warning('No existe el código o es incorrecto')
  }

  const handleCancelSubmitFile = () => {
    setFile(null)
    setResponseFile(null)
  }

  const highlightedJson = useMemo(() => {
    if (responseFile) {
      return jsonHighlight(
        responseFile?.map(card => ({
          'Bin Tarjeta': card.bin,
          Mensaje: card.message
        })),
        'Mensaje',
        'red'
      )
    }
    return null
  }, [responseFile])

  return (
    <>
      <LoadingButton
        variant="contained"
        size="large"
        disabled={!!loading}
        color="secondary"
        loading={isLoading}
        onClick={handleClick}
        aria-controls={open ? 'cards-assign-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        endIcon={<KeyboardArrowDown />}
      >
        Acciones
      </LoadingButton>

      <StyledMenu
        open={Boolean(open)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {!isListView && (
          <ActionStyle onClick={handleAssignCards}>
            <ListItemIcon>
              <BsPersonBadge width={24} height={24} />
            </ListItemIcon>
            <ListItemText>Asignar Tarjetas</ListItemText>
          </ActionStyle>
        )}

        <Box sx={{ py: 1, px: 2.5, background: theme => theme.palette.background.neutral }}>
          <Typography variant="overline" fontWeight={'bold'} sx={{ verticalAlign: 'middle', color: 'text.secondary' }}>
            Asignación Masiva{' '}
            <Box component={'span'}>
              <SiMicrosoftexcel style={{ fontSize: 18 }} />
            </Box>
          </Typography>
        </Box>
        <ActionStyle onClick={handleDownloadTemplate}>
          <ListItemIcon>
            <FileDownload width={24} height={24} />
          </ListItemIcon>
          <ListItemText>Descargar Plantilla</ListItemText>
        </ActionStyle>

        <ActionStyle onClick={handleUploadTemplate}>
          <ListItemIcon>
            <FileUpload width={24} height={24} />
          </ListItemIcon>
          <ListItemText>Cargar Plantilla</ListItemText>
        </ActionStyle>

        <Divider sx={{ margin: '0px !important' }} />

        <ActionStyle
          onClick={() => {
            setOpenTransfer(true)
            handleClose()
          }}
        >
          <ListItemIcon>
            <TbCreditCardPay style={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText>Dispersar</ListItemText>
        </ActionStyle>
      </StyledMenu>

      <ModalAlert
        title={
          <Stack alignItems={'center'} justifyContent={'space-between'} flexDirection={'row'}>
            <Typography variant="h6">Asignación de tarjetas</Typography>
            <WarningAmberOutlined color="warning" />
          </Stack>
        }
        textButtonSuccess="Descargar Archivo"
        textButtonCancel="Cerrar"
        onClose={() => setResponseFile(null)}
        open={Boolean(responseFile?.length > 0)}
        actionsProps={{ sx: { justifyContent: 'center' } }}
        description={
          <Stack gap={2}>
            <Stack flexDirection={'row'} justifyContent={'center'}>
              <SiMicrosoftexcel style={{ fontSize: 48 }} />
            </Stack>
            <Typography variant="body1">
              Algunas tarjetas no se pudieron asignar. Descarga el Archivo para conocer los detalles.
            </Typography>
            <Box component={'details'}>
              <Box component={'summary'} fontSize={14} sx={{ typography: 'caption' }}>
                Detalles
              </Box>
              <code>
                <Box
                  component={'pre'}
                  sx={{
                    typography: 'body2',
                    backgroundColor: 'background.neutral',
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word'
                  }}
                  dangerouslySetInnerHTML={{ __html: highlightedJson }}
                />
              </code>
            </Box>
          </Stack>
        }
        onSuccess={() => {
          downloadErrorLayout(responseFile)
          setResponseFile(null)
        }}
        fullWidth
        maxWidth="xs"
      />
      <Suspense fallback={null}>
        <GoogleAuth2FAModal
          isLoading={isLoading}
          open={!!file}
          handleSubmit={handleSubmitFile}
          handleClose={handleCancelSubmitFile}
        />
      </Suspense>
    </>
  )
}

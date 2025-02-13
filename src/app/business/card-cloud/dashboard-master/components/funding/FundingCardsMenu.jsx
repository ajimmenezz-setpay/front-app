import { lazy, useState } from 'react'

import { FileDownload, FileUpload, KeyboardArrowDown } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { MenuItem } from '@mui/material'
import { SiMicrosoftexcel } from 'react-icons/si'
import { toast } from 'react-toastify'

import { useFundingCardsOfCardCloudFromFile } from '../../../shared/hooks'
import { useFundingCardsFromExcelFileOfCardCloud } from '../../hooks'

import { StyledMenu } from '@/shared/components/containers'
import { Lodable } from '@/shared/components/lodables'

const GoogleAuth2FAModal = Lodable(lazy(() => import('@/app/shared/components/GoogleAuth2FAModal')))

export const FundingCardsMenu = ({ subAccount }) => {
  const { mutate, isLoading } = useFundingCardsOfCardCloudFromFile()
  const { downloadFundingCardsLayoutExcel, uploadFundingCardsLayoutExcel, loading, error, cards, file, setFile } =
    useFundingCardsFromExcelFileOfCardCloud(subAccount)

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDownloadTemplate = () => {
    handleClose()

    if (cards?.length <= 0) {
      return toast.info('Esta empresa no tiene asignada tarjetas')
    }

    return downloadFundingCardsLayoutExcel()
  }

  const handleUploadTemplate = () => {
    handleClose()
    uploadFundingCardsLayoutExcel()
  }

  const handleSubmitFile = code => {
    if (code) {
      return mutate(
        { file, subAccount: subAccount?.subAccountId, googleAuthenticatorCode: code },
        {
          onSuccess: () => {
            setFile(null)
          },
          onError: () => {
            setFile(null)
          }
        }
      )
    }
    return toast.warning('No existe el código o es incorrecto')
  }

  const handleCancelSubmitFile = () => {
    setFile(null)
  }

  return (
    <>
      <LoadingButton
        loading={isLoading}
        variant="outlined"
        size="large"
        disabled={loading}
        sx={{ color: 'text.primary' }}
        onClick={handleClick}
        aria-controls={open ? 'card-funding-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        startIcon={<SiMicrosoftexcel style={{ fontSize: 18 }} />}
        endIcon={<KeyboardArrowDown />}
      >
        Dispersión Masiva
      </LoadingButton>
      <StyledMenu
        open={Boolean(open)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MenuItem onClick={handleDownloadTemplate} sx={{ color: 'text.secondary' }}>
          <FileDownload width={24} height={24} />
          Descargar Plantilla Tarjetas
        </MenuItem>

        <MenuItem onClick={handleUploadTemplate} sx={{ color: 'text.secondary' }}>
          <FileUpload width={24} height={24} />
          Cargar Plantilla Tarjetas
        </MenuItem>
      </StyledMenu>
      <GoogleAuth2FAModal
        isLoading={isLoading}
        open={!!file}
        handleSubmit={handleSubmitFile}
        handleClose={handleCancelSubmitFile}
      />
    </>
  )
}

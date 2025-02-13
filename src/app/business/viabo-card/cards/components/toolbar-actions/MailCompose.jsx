import { useMemo, useState } from 'react'

import PropTypes from 'prop-types'

import { Close, CloseFullscreen, OpenInFull } from '@mui/icons-material'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Alert,
  Avatar,
  Backdrop,
  Box,
  Chip,
  Divider,
  IconButton,
  Input,
  Paper,
  Stack,
  Tooltip,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useResponsive } from '@theme/hooks'
import { stringAvatar } from '@theme/utils'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { SendMessageCardsAdapter } from '@/app/business/viabo-card/cards/adapters'
import { useSendMessageCards } from '@/app/business/viabo-card/cards/hooks'
import { useCommerceDetailsCard } from '@/app/business/viabo-card/cards/store'
import { Editor } from '@/shared/components/editor'
import { FormProvider } from '@/shared/components/form'

const RootStyle = styled(Paper)(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 2000,
  minHeight: 440,
  outline: 'none',
  display: 'flex',
  position: 'fixed',
  overflow: 'hidden',
  flexDirection: 'column',
  margin: theme.spacing(3),
  boxShadow: theme.customShadows.z20,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.paper
}))

const InputStyle = styled(Input)(({ theme }) => ({
  padding: theme.spacing(0.5, 3),
  borderBottom: `solid 1px ${theme.palette.divider}`
}))

MailCompose.propTypes = {
  isOpenCompose: PropTypes.bool,
  onCloseCompose: PropTypes.func
}

export default function MailCompose({ isOpenCompose, onCloseCompose }) {
  const [fullScreen, setFullScreen] = useState(false)
  const selectedCards = useCommerceDetailsCard(state => state?.selectedCards)
  const { mutate, isLoading } = useSendMessageCards()

  const filterSelectedCards = useMemo(
    () =>
      selectedCards.filter(
        (card, index, self) => index === self.findIndex(o => o?.assignUser?.id === card?.assignUser?.id)
      ),
    [selectedCards]
  )

  const isDesktop = useResponsive('up', 'sm')

  const handleChangeMessage = value => {
    setFieldValue('message', value)
  }

  const handleExitFullScreen = () => {
    setFullScreen(false)
  }

  const handleEnterFullScreen = () => {
    setFullScreen(true)
  }

  const MailSchema = Yup.object().shape({
    message: Yup.string().test('not-empty', 'El mensaje es requerido', value => {
      const strippedText = value?.replace(/<[^>]+>/g, '') || ''
      return strippedText.trim().length > 0
    }),
    subject: Yup.string().min(5, 'El asunto debe tener más de 5 caracteres').required('El asunto es requerido')
  })

  const formik = useFormik({
    initialValues: {
      message: '',
      subject: ''
    },
    validationSchema: MailSchema,
    onSubmit: values => {
      const data = SendMessageCardsAdapter(filterSelectedCards, values)
      mutate(data, {
        onSuccess: () => {
          onCloseCompose()
          setSubmitting(false)
          resetForm()
        },
        onError: () => {
          setSubmitting(false)
        }
      })
    }
  })

  const { setFieldValue, errors, touched, values, isSubmitting, setSubmitting, resetForm } = formik
  const error = Boolean((touched.message && errors.message) || (touched.subject && errors.subject))
  const errorText =
    errors.message && errors.subject ? ' El asunto y el mensaje son requeridos' : errors.message || errors.subject

  const loading = isLoading || isSubmitting

  const handleClose = () => {
    onCloseCompose()
    setFullScreen(false)
    resetForm()
  }

  if (!isOpenCompose) {
    return null
  }

  return (
    <>
      <Backdrop open={fullScreen || !isDesktop} sx={{ zIndex: 1998 }} />
      <FormProvider formik={formik}>
        <RootStyle
          sx={theme => ({
            ...(fullScreen && {
              top: 0,
              left: 0,
              zIndex: 2000,
              margin: 'auto',
              width: {
                xs: `calc(100% - 24px)`,
                md: `calc(100% - 80px)`
              },
              height: {
                xs: `calc(100% - 24px)`,
                md: `calc(100% - 80px)`
              }
            })
          })}
        >
          <Box
            sx={{
              pl: 3,
              pr: 1,
              height: 60,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6">Nuevo Mensaje</Typography>
            <Box sx={{ flexGrow: 1 }} />

            <IconButton onClick={fullScreen ? handleExitFullScreen : handleEnterFullScreen}>
              {fullScreen ? (
                <CloseFullscreen sx={{ width: 20, height: 20 }} />
              ) : (
                <OpenInFull sx={{ width: 20, height: 20 }} />
              )}
            </IconButton>

            <IconButton onClick={handleClose}>
              <Close sx={{ width: 20, height: 20 }} />
            </IconButton>
          </Box>
          {error && (
            <Alert sx={{ borderRadius: 0 }} severity={'warning'}>
              {errorText}
            </Alert>
          )}

          <Divider />
          <Stack p={3}>
            <Stack flexDirection={'row'} flexWrap={'wrap'} flexGrow={1} gap={1}>
              {filterSelectedCards?.map(card => (
                <Tooltip
                  key={card?.id}
                  title={card?.cardNumberHidden || ''}
                  arrow
                  followCursor
                  PopperProps={{ style: { zIndex: 2001 } }}
                >
                  <Chip
                    avatar={<Avatar {...stringAvatar(card?.assignUser?.name ?? '')} />}
                    label={card?.assignUser?.name}
                  />
                </Tooltip>
              ))}
            </Stack>
          </Stack>

          <Divider />
          <InputStyle
            disableUnderline
            placeholder="Asunto"
            name={'subject'}
            value={values.subject || ''}
            onChange={e => {
              setFieldValue('subject', e?.target?.value || '')
            }}
          />

          <Editor
            simple
            isValidation={true}
            id="compose-mail"
            name={'message'}
            value={values.message}
            onChange={handleChangeMessage}
            error={Boolean(touched.message && errors.message)}
            placeholder="Escribe tu mensaje ..."
            sx={{
              borderColor: 'transparent',
              position: 'relative',
              flexGrow: 1,
              minWidth: 400,
              overflow: 'hidden'
            }}
          />

          <Divider />

          <Box sx={{ py: 2, px: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <LoadingButton loading={loading} type={'submit'} variant="contained">
              Enviar
            </LoadingButton>
          </Box>
        </RootStyle>
      </FormProvider>
    </>
  )
}

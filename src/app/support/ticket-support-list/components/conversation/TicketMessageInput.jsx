import { memo, useRef } from 'react'

import PropTypes from 'prop-types'

import { AttachFileSharp, SendOutlined } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Divider, IconButton, Input, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Form, FormikProvider } from 'formik'

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: 56,
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  paddingLeft: theme.spacing(2)
}))

const TicketMessageInput = ({ formik, handleAddMessage, handleFileChange, isLoading }) => {
  const fileInputRef = useRef(null)

  const handleAttach = () => {
    fileInputRef.current?.click()
  }

  const { handleSubmit, isSubmitting, values, setFieldValue, touched, errors, validateForm } = formik

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleAddMessage} className="animate__animated animate__fadeIn">
        <Box>
          <RootStyle>
            <Input
              name="message"
              disabled={isLoading}
              fullWidth
              value={values.message}
              disableUnderline
              multiline
              rows={4}
              error={Boolean(touched.message && errors.message)}
              sx={{ pt: 2 }}
              onChange={event => setFieldValue('message', event.target.value)}
              placeholder="Escribe tu mensaje ..."
              autoFocus
              // startAdornment={
              //   <InputAdornment position="start">
              //     {/* <EmojiPicker disabled={disabled} value={message} setValue={setMessage} /> */}
              //   </InputAdornment>
              // }
              endAdornment={
                <Stack direction="row" spacing={1} sx={{ flexShrink: 0, mr: 1.5 }}>
                  <IconButton disabled={isLoading} size="small" onClick={handleAttach}>
                    <AttachFileSharp icon="eva:attach-2-fill" width={22} height={22} />
                  </IconButton>
                </Stack>
              }
            />
            <Divider orientation="vertical" flexItem />
            <LoadingButton
              type="submit"
              loading={isLoading}
              color="primary"
              disabled={values?.message === ''}
              sx={{ mx: 1 }}
            >
              <SendOutlined width={22} height={22} />
            </LoadingButton>
          </RootStyle>
          <input
            name="attachments"
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            multiple
          />
        </Box>
      </Form>
    </FormikProvider>
  )
}

TicketMessageInput.propTypes = {
  formik: PropTypes.shape({
    errors: PropTypes.any,
    handleSubmit: PropTypes.any,
    isSubmitting: PropTypes.any,
    setFieldValue: PropTypes.func,
    touched: PropTypes.any,
    validateForm: PropTypes.any,
    values: PropTypes.any
  }),
  handleAddMessage: PropTypes.any,
  handleFileChange: PropTypes.any,
  isLoading: PropTypes.any
}

export default memo(TicketMessageInput)

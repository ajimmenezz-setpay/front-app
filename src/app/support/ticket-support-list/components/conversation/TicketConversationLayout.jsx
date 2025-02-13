import { lazy, useMemo, useState } from 'react'

import PropTypes from 'prop-types'

import { Divider, LinearProgress, Stack } from '@mui/material'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { AddMessageToTicketAdapter } from '../../adapters'
import { useAddNewMessageToTicket } from '../../hooks'

import { Lodable } from '@/shared/components/lodables'
import { useUser } from '@/shared/hooks'

const TicketMessages = Lodable(lazy(() => import('./TicketMessages')))
const TicketAddAttachmentFiles = Lodable(lazy(() => import('./TicketAddAttachmentFiles')))
const TicketMessageInput = Lodable(lazy(() => import('./TicketMessageInput')))

const TicketConversationLayout = ({ ticket, queryTicketConversation }) => {
  const { mutate, isLoading: isLoadingNewMessage } = useAddNewMessageToTicket()
  const user = useUser()
  const [scroll, setScroll] = useState(false)

  const RegisterSchema = Yup.object().shape({
    message: Yup.string().required('El mensaje es requerido'),
    attachments: Yup.array()
  })

  const formik = useFormik({
    validateOnChange: false,
    enableReinitialize: false,
    initialValues: {
      message: '',
      attachments: []
    },
    validationSchema: RegisterSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const message = AddMessageToTicketAdapter(ticket?.id, values, user)
      mutate(message, {
        onSuccess: () => {
          setSubmitting(false)
          resetForm()
        },
        onError: () => {
          setSubmitting(false)
        }
      })
    }
  })

  const { handleSubmit, isSubmitting, values, setFieldValue, validateForm } = formik

  const isLoading = isSubmitting || isLoadingNewMessage

  const handleFileChange = event => {
    const files = Array.from(event.target.files)
    setFieldValue('attachments', [...files, ...values.attachments])
  }

  const handleRemoveFile = selectedFile => {
    setFieldValue(
      'attachments',
      values?.attachments?.filter(file => file !== selectedFile)
    )
  }

  const handleAddMessage = async e => {
    e.preventDefault()
    setScroll(true)
    const validate = await validateForm()

    if (validate && Object.keys(validate)?.length > 0) {
      window.scrollTo(0, 0)
      toast.warn('Verifique todos los campos obligatorios')
    }

    handleSubmit()
  }
  const files = useMemo(() => values?.attachments, [values?.attachments])

  return (
    <>
      {queryTicketConversation?.isFetching && <LinearProgress />}
      <Stack sx={{ overflow: 'hidden' }}>
        <TicketMessages queryTicketConversation={queryTicketConversation} scroll={scroll} setScroll={setScroll} />
      </Stack>

      <Stack flex={1} justifyContent={'flex-end'}>
        {queryTicketConversation?.isFetching && <LinearProgress />}
        <Divider />
        {!isLoading && (
          <TicketAddAttachmentFiles files={files} isLoading={isLoading} handleRemoveFile={handleRemoveFile} />
        )}
        {ticket?.status?.id !== '3' && (
          <TicketMessageInput
            formik={formik}
            isLoading={isLoading}
            handleAddMessage={handleAddMessage}
            handleFileChange={handleFileChange}
          />
        )}
      </Stack>
    </>
  )
}

TicketConversationLayout.propTypes = {
  queryTicketConversation: PropTypes.shape({
    isFetching: PropTypes.any
  }),
  ticket: PropTypes.shape({
    id: PropTypes.any,
    status: PropTypes.shape({
      id: PropTypes.string
    })
  })
}

export default TicketConversationLayout

import { useMemo } from 'react'

import PropTypes from 'prop-types'

import { LoadingButton } from '@mui/lab'
import { Alert, Box, Card, Grid, Link, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { useSnackbar } from 'notistack'

import { CommerceUploadDocumentsAdapter } from '@/app/business/commerce/adapters'
import { CommerceUpdateAdapter } from '@/app/business/commerce/adapters/commerceUpdateAdapter'
import DocumentDropzone from '@/app/business/commerce/components/process/documentation/DocumentDropZone'
import { useDeleteDocuments, useUpdateCommerceProcess, useUploadDocuments } from '@/app/business/commerce/hooks'
import { documentList, documentTypes, PROCESS_LIST } from '@/app/business/commerce/services'
import { propTypesStore } from '@/app/business/commerce/store'

CommerceDocumentation.propTypes = {
  store: PropTypes.shape(propTypesStore)
}
export default function CommerceDocumentation({ store }) {
  const { resume, setActualProcess, setLastProcess } = store
  const { files, fiscalTypePerson } = resume
  const { enqueueSnackbar } = useSnackbar()
  const { mutate: uploadDocuments, isLoading: uploadingDocuments } = useUploadDocuments()
  const { mutate: deleteDocuments, isLoading: deletingDocuments } = useDeleteDocuments()
  const { mutate: updateInfoCommerce, isLoading: isUpdatingCommerce } = useUpdateCommerceProcess()

  const formik = useFormik({
    initialValues: Object.keys(documentTypes).reduce(
      (acc, type) => {
        acc[type] = files?.find(file => file?.Name === type)?.storePath || null
        return acc
      },
      { moralPerson: fiscalTypePerson === '' ? '1' : fiscalTypePerson }
    ),
    enableReinitialize: true,
    onSubmit: values => {
      const { moralPerson, ...documents } = values
      const someFile = filterDocuments?.some(fieldName => values[fieldName] !== null)
      if (someFile) {
        const { deleteDocumentsForm, uploadDocumentsForm } = CommerceUploadDocumentsAdapter(
          documents,
          resume?.id,
          moralPerson
        )

        uploadDocuments(uploadDocumentsForm, {
          onSuccess: () => {
            const allDocumentsFilled = filterDocuments?.every(fieldName => values[fieldName] !== null)
            const resumeAdapter = CommerceUpdateAdapter(resume, allDocumentsFilled ? 4 : 3)
            const dataAdapted = { ...resumeAdapter, fiscalPersonType: moralPerson }
            updateInfoCommerce(dataAdapted, {
              onSuccess: () => {
                if (allDocumentsFilled) {
                  setActualProcess(PROCESS_LIST.FINISHED_PROCESS)
                  setLastProcess({ info: null, name: PROCESS_LIST.COMMERCE_DOCUMENTATION })
                }
              }
            })
          }
        })
        deleteDocuments(deleteDocumentsForm)
      } else {
        enqueueSnackbar('Se debe subir al menos un archivo!', {
          variant: 'warning'
        })
      }

      setSubmitting(false)
    }
  })

  const { handleSubmit, values, setSubmitting, isSubmitting, setFieldValue } = formik

  const filterDocuments = useMemo(
    () =>
      Object.keys(documentList).filter(document => {
        if (values.moralPerson === '1') {
          return document
        }
        return documentList[document].moralPerson === false || documentList[document].moralPerson === 'all'
      }),
    [values.moralPerson]
  )

  const loading = uploadingDocuments || isSubmitting || isUpdatingCommerce || deletingDocuments

  return (
    <>
      <Stack direction="column" width={1} spacing={1}>
        <Typography variant="h4" color="textPrimary" align="center">
          Documentación del Comercio
        </Typography>
        <Typography paragraph align="center" variant="body1" color={'text.secondary'} whiteSpace="pre-line">
          Ingrese los documentos necesarios del comercio para continuar con el proceso
        </Typography>
      </Stack>
      <Box width={1} py={4} component={'form'} onSubmit={handleSubmit}>
        <Stack spacing={4} justifyContent={'center'} alignItems={'center'}>
          <ToggleButtonGroup
            color="primary"
            value={values?.moralPerson}
            exclusive
            onChange={(event, newValue) => {
              setFieldValue('moralPerson', newValue)
            }}
            aria-label="Platform"
          >
            <ToggleButton value={'1'}>Persona Moral</ToggleButton>
            <ToggleButton value={'2'}>Persona Física</ToggleButton>
          </ToggleButtonGroup>
          <Grid container spacing={2}>
            {filterDocuments?.map(name => (
              <Grid item key={name} xs={12} md={6} lg={4} xl={4}>
                <Card sx={{ p: 0, borderRadius: 1 }}>
                  <Typography pt={2} variant="subtitle2" color="textPrimary" align="center">
                    {documentTypes[name]}
                  </Typography>
                  {values[name] && typeof values[name] === 'object' && (
                    <Stack sx={{ textAlign: 'center', align: 'center' }}>
                      <Typography variant="caption" color="textPrimary" align="center">
                        {values[name]?.path}
                      </Typography>
                    </Stack>
                  )}

                  {values[name] && !(typeof values[name] === 'object') && (
                    <Stack sx={{ textAlign: 'center', align: 'center' }}>
                      <Link href={values[name]} target="_blank">
                        Ver | Descargar
                      </Link>
                    </Stack>
                  )}
                  {documentList[name].expiration && (
                    <Alert
                      sx={{
                        borderRadius: 0,
                        textAlign: 'center',
                        width: '100%',
                        justifyContent: 'center',
                        display: 'flex'
                      }}
                      variant={'standard'}
                      icon={false}
                      color={'warning'}
                    >
                      <Typography variant="caption" color="textSecondary" align="center">
                        {documentList[name].expiration}
                      </Typography>
                    </Alert>
                  )}
                  <DocumentDropzone
                    name={name}
                    accept={documentList[name].accept}
                    setFieldValue={setFieldValue}
                    file={values[name]}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>

          <LoadingButton
            loading={loading}
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{ textTransform: 'uppercase' }}
          >
            Guardar
          </LoadingButton>
          {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
        </Stack>
      </Box>
    </>
  )
}

import { useMemo } from 'react'

import PropTypes from 'prop-types'

import { EmailOutlined, Lock, Phone } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { InputAdornment, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { SpeiNewThirdAccountAdapter } from '../../adapters'
import { useCreateNewSpeiThirdAccount } from '../../hooks'

import { FormLabelTypography, FormProvider, RFTextField } from '@/shared/components/form'

const NewSpeiThirdAccountForm = ({ account, catalogBanks, onSuccess }) => {
  const { mutate, isLoading } = useCreateNewSpeiThirdAccount()

  const ValidationSchema = Yup.object().shape({
    clabe: Yup.string()
      .trim()
      .max(18, 'Máximo 18 caracteres')
      .matches(/^\S{18}$/, 'La cuenta clabe debe contener 18 caracteres y no puede contener espacios en blanco')
      .required('Es necesario la cuenta clabe'),
    name: Yup.string()
      .trim()
      .max(100, 'Máximo 100 caracteres')
      .matches(/^[a-zA-Z0-9\s]+$/, 'El nombre no debe contener caracteres especiales, acentos, ni la letra ñ')
      .required('Es necesario el beneficiario'),
    rfc: Yup.string(),
    alias: Yup.string().trim().max(100, 'Máximo 100 caracteres'),
    bank: Yup.object().nullable().required('Es necesario el banco'),
    email: Yup.string().trim().email('Ingrese un correo valido'),
    phone: Yup.string().trim(),
    googleCode: Yup.string()
      .trim()
      .matches(/^0*\d{6}$/, 'El código de Google debe contener exactamente 6 dígitos')
      .required('Es necesario el código de 6 dígitos')
  })

  const formik = useFormik({
    initialValues: {
      clabe: account?.clabe || '',
      name: account?.beneficiary || '',
      alias: account?.alias || '',
      rfc: account?.rfc || '',
      bank: catalogBanks?.find(bank => bank?.id === account?.bank?.id) || null,
      email: account?.email || '',
      phone: account?.phone || '',
      googleCode: ''
    },
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    onSubmit: (values, { setSubmitting, setFieldValue }) => {
      const account = SpeiNewThirdAccountAdapter(values)
      mutate(account, {
        onSuccess: () => {
          setSubmitting(false)
          onSuccess()
        },
        onError: () => {
          setSubmitting(false)
        }
      })
    }
  })

  const { isSubmitting, setFieldValue, values, errors } = formik

  const loading = isSubmitting || isLoading

  const handleClabeChange = e => {
    const newClabe = e?.target?.value
    setFieldValue('clabe', newClabe)

    if (newClabe.length >= 3) {
      const abmCode = newClabe?.slice(0, 3)
      const selectedBank = catalogBanks?.find(bank => bank?.abmCode === abmCode)
      setFieldValue('bank', selectedBank ?? null)
    } else {
      setFieldValue('bank', null)
    }
  }

  const bankText = useMemo(() => {
    if (values?.clabe?.length >= 3 && values?.bank) {
      return values?.bank?.name
    }

    if (values?.clabe?.length === 18 && !values?.bank) {
      return 'Cuenta clabe no valida'
    }

    if (values?.clabe?.length >= 3 && !values?.bank) {
      return 'Verifique su cuenta clabe'
    }

    if (values?.clabe?.length < 3) {
      return 'Es necesario la cuenta clabe para obtener el banco'
    }

    return errors?.bank
  }, [values?.clabe, values?.bank, errors?.bank])

  const colorBankText = useMemo(() => {
    if (values?.bank?.name) {
      return 'text.primary'
    }
    if (errors?.bank && values?.clabe?.length === 18) {
      return 'error.main'
    }
    return 'warning.main'
  }, [values?.clabe, values?.bank, errors?.bank])

  return (
    <FormProvider formik={formik}>
      <Stack spacing={2}>
        <Stack spacing={1}>
          <FormLabelTypography variant="overline" required>
            Cuenta CLABE
          </FormLabelTypography>

          <RFTextField
            inputProps={{ maxLength: '18' }}
            required
            name={'clabe'}
            size={'small'}
            disabled={loading}
            placeholder={'18 dígitos...'}
            onChange={handleClabeChange}
          />
        </Stack>

        <Stack spacing={1} mb={2}>
          <FormLabelTypography variant="overline" required>
            Banco
          </FormLabelTypography>
          <Typography
            border={1}
            sx={theme => ({
              py: 1.1,
              verticalAlign: 'center',
              px: 1.5,
              borderColor: colorBankText === 'text.primary' ? theme.palette.grey[500_32] : colorBankText,
              borderRadius: 1
            })}
            color={colorBankText}
            variant="overline"
          >
            {bankText}
          </Typography>
        </Stack>

        <Stack spacing={1}>
          <FormLabelTypography variant="overline" required>
            Beneficiario
          </FormLabelTypography>

          <RFTextField
            required
            name={'name'}
            size={'small'}
            placeholder={'Nombre del titular de la cuenta...'}
            disabled={loading}
          />
        </Stack>

        <Stack spacing={1}>
          <FormLabelTypography variant="overline">RFC</FormLabelTypography>
          <RFTextField name={'rfc'} size={'small'} placeholder={'RFC del beneficiario...'} disabled={loading} />
        </Stack>

        <Stack spacing={1}>
          <FormLabelTypography variant="overline">Alias</FormLabelTypography>

          <RFTextField name={'alias'} size={'small'} placeholder={'Alias de la cuenta...'} disabled={loading} />
        </Stack>

        <Stack flexDirection={{ md: 'row' }} gap={2}>
          <Stack spacing={1} flex={1}>
            <FormLabelTypography variant="overline">Correo</FormLabelTypography>

            <RFTextField
              name={'email'}
              size={'small'}
              placeholder={'beneficiario@domino.com...'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined />
                  </InputAdornment>
                )
              }}
              disabled={loading}
            />
          </Stack>

          <Stack spacing={1}>
            <FormLabelTypography variant="overline">Teléfono</FormLabelTypography>

            <RFTextField
              name={'phone'}
              type={'tel'}
              size={'small'}
              placeholder={'55 5555 5555'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
                )
              }}
              disabled={loading}
            />
          </Stack>
        </Stack>

        <Stack spacing={1}>
          <FormLabelTypography required variant="overline">
            Token de Google
          </FormLabelTypography>

          <RFTextField
            name={'googleCode'}
            type={'text'}
            size={'small'}
            placeholder={'000000'}
            inputProps={{ maxLength: '6' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              )
            }}
            disabled={loading}
          />
        </Stack>

        <Stack sx={{ pt: 1 }}>
          <LoadingButton size={'large'} loading={loading} variant="contained" color="primary" fullWidth type="submit">
            Crear
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  )
}

NewSpeiThirdAccountForm.propTypes = {
  account: PropTypes.shape({
    alias: PropTypes.string,
    bank: PropTypes.shape({
      id: PropTypes.any
    }),
    beneficiary: PropTypes.string,
    clabe: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    rfc: PropTypes.string
  }),
  catalogBanks: PropTypes.array,
  onSuccess: PropTypes.func
}

export default NewSpeiThirdAccountForm

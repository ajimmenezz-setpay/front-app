import { useEffect, useState } from 'react'

import { Lock, ShoppingCart } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { AlertTitle, Avatar, Box, Button, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { useFindVirtualCardPrice, usePayVirtualCard } from '../../hooks'

import { AlertWithFocus } from '@/shared/components/alerts'
import { FormLabelTypography, FormProvider, RFSelect, RFTextField } from '@/shared/components/form'
import { MasterCardLogo } from '@/shared/components/images'
import { CircularLoading } from '@/shared/components/loadings'
import { fCurrency } from '@/shared/utils'

const CardCloudBuyVirtualCardForm = ({ cards = [], selectedCard, onCancel, onSuccess }) => {
  const [MONTHS, setMonths] = useState([])
  const { mutate, isLoading, isError, data: dataPrice, reset } = useFindVirtualCardPrice()
  const { mutate: payCard, isLoading: isLoadingPayCard } = usePayVirtualCard()

  const RegisterSchema = Yup.object().shape({
    card: Yup.object().nullable().required('Es necesario la tarjeta para comprar'),
    months: Yup.object().nullable().required('Es necesario los meses a contratar'),
    googleCode: Yup.string()
      .trim()
      .matches(/^0*\d{6}$/, 'El código de Google debe contener exactamente 6 dígitos')
      .required('Es necesario el código de 6 dígitos')
  })

  const formik = useFormik({
    initialValues: {
      card: cards?.find(card => card?.id === selectedCard?.id) || null,
      months: null,
      googleCode: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (values, { setFieldValue, setSubmitting }) => {
      const data = {
        source_card: values?.card?.id,
        months: parseInt(values?.months?.value, 10) || 0,
        auth_code: values?.googleCode
      }

      payCard(data, {
        onSuccess: data => {
          onSuccess({ request: { ...values, monthlyPrice: dataPrice?.price }, newCard: data })
          setSubmitting(false)
        },
        onError: () => {
          setSubmitting(false)
        }
      })
    }
  })

  const { setFieldValue, values, errors, isSubmitting } = formik

  const loadingTransaction = isSubmitting || isLoadingPayCard
  const loading = isLoading || loadingTransaction

  useEffect(() => {
    if (values?.card?.id) {
      setMonths([])
      setFieldValue('months', null)
      mutate(values?.card, {
        onSuccess: data => {
          const pricePerMonth = data?.price?.number || 0
          const balance = values?.card?.balance?.number || 0

          let monthsCanAfford = pricePerMonth > 0 ? Math.floor(balance / pricePerMonth) : 12
          monthsCanAfford = Math.min(Math.max(monthsCanAfford, 1), 12)

          const monthsByPrice = Array.from({ length: monthsCanAfford }, (_, index) => {
            const monthNumber = index + 1
            const priceNumber = (pricePerMonth * monthNumber).toFixed(2) || 0
            const price = {
              number: priceNumber,
              format: fCurrency(priceNumber)
            }

            return {
              label: `${monthNumber} ${monthNumber > 1 ? 'meses' : 'mes'} - ${price.format}`,
              value: monthNumber,
              price
            }
          })
          setMonths(monthsByPrice)
        },
        onError: () => {
          setMonths([])
        }
      })
    }
  }, [values?.card])

  const insufficient = dataPrice?.price?.number > values.card?.balance?.number

  return (
    <FormProvider formik={formik}>
      <Stack gap={2}>
        {!isLoading && insufficient && !isError && (
          <AlertWithFocus listenElement={insufficient} severity={'warning'} sx={{ width: 1 }}>
            <AlertTitle>Saldo Insuficiente</AlertTitle>
            <Typography variant="body2">
              El saldo de la tarjeta es insuficiente para cubrir al menos el precio de un mes:{' '}
              <b>{dataPrice?.price?.format}</b>
            </Typography>
          </AlertWithFocus>
        )}

        {!isLoading && isError && (
          <AlertWithFocus listenElement={isError} severity={'error'} sx={{ width: 1 }}>
            <AlertTitle>Precio Tarjeta Virtual</AlertTitle>
            <Typography variant="body2">
              No se puede obtener el precio de la tarjeta virtual. Intente nuevamente o reporte a sistemas
            </Typography>
          </AlertWithFocus>
        )}

        <Stack gap={0.5}>
          <Stack>
            <FormLabelTypography variant="overline" required fontWeight={'bold'}>
              Tarjeta para realizar compra de tarjeta virtual
            </FormLabelTypography>
            {values?.card && (
              <FormLabelTypography variant="caption">
                Saldo: <b>{values?.card?.balance?.format}</b>
              </FormLabelTypography>
            )}
          </Stack>
          <RFSelect
            name={'card'}
            disabled={loading}
            textFieldParams={{
              placeholder: 'Seleccionar ...',
              size: 'large',
              required: true
            }}
            onChange={(e, value) => {
              setFieldValue('card', value)
              setMonths([])
              setFieldValue('months', null)
              reset()
            }}
            options={cards || []}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={props.key}>
                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                  <Avatar
                    sx={theme => ({
                      width: 25,
                      height: 25,
                      m: 0,
                      color: theme.palette.primary.contrastText,
                      backgroundColor: theme.palette.primary.light
                    })}
                  >
                    <MasterCardLogo sx={{ width: 15 }} />
                  </Avatar>
                  <span>{option.label}</span>
                </Stack>
              </Box>
            )}
            renderInput={params => (
              <TextField
                {...params}
                size="large"
                placeholder="Seleccionar ..."
                required
                inputProps={{
                  ...params.inputProps
                }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Avatar
                        sx={theme => ({
                          width: 25,
                          height: 25,
                          m: 0,
                          color: theme.palette.primary.contrastText,
                          backgroundColor: theme.palette.primary.light
                        })}
                      >
                        <MasterCardLogo sx={{ width: 15 }} />
                      </Avatar>
                    </InputAdornment>
                  )
                }}
                error={Boolean(errors.card)}
                helperText={errors.card}
              />
            )}
          />
        </Stack>

        {!insufficient && !isError && (
          <>
            <Stack gap={0.5}>
              <Stack>
                <FormLabelTypography variant="overline" required fontWeight={'bold'}>
                  Meses Para Contratar Tarjeta Virtual
                </FormLabelTypography>
                {dataPrice?.price?.number > 0 && (
                  <FormLabelTypography variant="caption">
                    Precio x Mes: <b>{dataPrice?.price?.format}</b>
                  </FormLabelTypography>
                )}
              </Stack>
              {!isError && isLoading && (
                <Stack gap={0.5} alignItems={'center'} flexDirection={'row'}>
                  <CircularLoading size={20} containerProps={{ display: 'flex' }} />
                  <Typography variant="caption">Obteniendo precio de la tarjeta ...</Typography>
                </Stack>
              )}
              <RFSelect
                name={'months'}
                options={MONTHS}
                disabled={loading}
                textFieldParams={{
                  placeholder: 'Seleccionar ...',
                  size: 'large',
                  required: true
                }}
              />
            </Stack>

            <Stack spacing={0.5}>
              <FormLabelTypography required variant="overline">
                Token de Google
              </FormLabelTypography>

              <RFTextField
                name={'googleCode'}
                type={'text'}
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
          </>
        )}

        <Stack sx={{ pt: 2 }} gap={3}>
          <LoadingButton
            size="large"
            disabled={!!insufficient || loading}
            type="submit"
            loading={!!loadingTransaction}
            variant={'contained'}
            startIcon={<ShoppingCart />}
          >
            Comprar
          </LoadingButton>

          <Button disabled={loadingTransaction} size="large" variant="outlined" onClick={onCancel}>
            Cancelar
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  )
}
export default CardCloudBuyVirtualCardForm

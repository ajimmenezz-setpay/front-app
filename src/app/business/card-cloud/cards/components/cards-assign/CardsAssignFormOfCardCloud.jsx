import { EmailOutlined, Phone } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Avatar,
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  Typography
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { CardCloudAssignCardsToCardHolderAdapter, METHODS_ASSIGN_CARDS_TO_USERS } from '../../adapters'
import { useAssignCardsToCardHolderOfCardCloud } from '../../hooks'

import { FormProvider, RFSelect, RFTextField } from '@/shared/components/form'
import { MasterCardLogo } from '@/shared/components/images'

const CardsAssignFormOfCardCloud = ({ cardHolders, cards, onSuccess, company, initialCards }) => {
  const { mutate, isLoading } = useAssignCardsToCardHolderOfCardCloud()

  const ValidationSchema = Yup.object().shape({
    cards: Yup.array()
      .min(1, 'Es necesario al menos una tarjeta para asignar')
      .required('Es necesario una tarjeta para asignar'),
    cardUser: Yup.object()
      .nullable()
      .when('method', {
        is: METHODS_ASSIGN_CARDS_TO_USERS.CARD_USERS,
        then: schema => schema.required('Es necesario un tarjetahabiente'),
        otherwise: schema => Yup.object().nullable()
      }),
    userName: Yup.string()
      .trim()
      .when('method', {
        is: METHODS_ASSIGN_CARDS_TO_USERS.NEW_CARD_USER,
        then: schema => schema.required('Es necesario el nombre del tarjetahabiente'),
        otherwise: schema => Yup.string().trim()
      }),
    userLastName: Yup.string()
      .trim()
      .when('method', {
        is: METHODS_ASSIGN_CARDS_TO_USERS.NEW_CARD_USER,
        then: schema => schema.required('Es necesario los apellidos del tarjetahabiente'),
        otherwise: schema => Yup.string().trim()
      }),
    userEmail: Yup.string()
      .trim()
      .email('Ingrese un correo valido')
      .when('method', {
        is: METHODS_ASSIGN_CARDS_TO_USERS.NEW_CARD_USER,
        then: schema => schema.required('Es necesario el correo del tarjetahabiente'),
        otherwise: schema => Yup.string().trim().email('Ingrese un correo valido')
      }),
    userPhone: Yup.string().trim()
  })

  const formik = useFormik({
    initialValues: {
      method: METHODS_ASSIGN_CARDS_TO_USERS.CARD_USERS,
      cards: initialCards || [],
      cardUser: null,
      userName: '',
      userLastName: '',
      userEmail: '',
      userPhone: ''
    },
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      const cardsAdapted = CardCloudAssignCardsToCardHolderAdapter(values, company)
      mutate(cardsAdapted, {
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

  const { isSubmitting, setFieldValue, values, setTouched } = formik

  const loading = isLoading || isSubmitting

  return (
    <FormProvider formik={formik}>
      <Stack spacing={2} p={3}>
        <Stack spacing={1}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Tarjetas Disponibles{' '}
            <Box component={'span'} color={'error.main'} ml={0.5}>
              *
            </Box>
          </Typography>

          <RFSelect
            multiple
            name={'cards'}
            textFieldParams={{ placeholder: 'Seleccionar ...', size: 'small' }}
            options={cards || []}
            disabled={loading}
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
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index })
                return (
                  <Chip
                    avatar={
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
                    }
                    key={index}
                    label={option.label}
                    {...tagProps}
                  />
                )
              })
            }
          />
        </Stack>

        <Stack>
          <FormControl disabled={loading}>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Seleccione al usuario asignado a las tarjetas:
            </FormLabel>
            <RadioGroup
              value={values.method}
              onChange={e => {
                setFieldValue('userName', '')
                setFieldValue('userLastName', '')
                setFieldValue('userEmail', '')
                setFieldValue('userPhone', '')
                setFieldValue('method', e.target.value)
                setTouched({}, false)
              }}
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value={METHODS_ASSIGN_CARDS_TO_USERS.CARD_USERS}
                control={<Radio />}
                label="Tarjetahabientes Existentes"
              />
              <FormControlLabel
                value={METHODS_ASSIGN_CARDS_TO_USERS.NEW_CARD_USER}
                control={<Radio />}
                label="Nuevo Tarjetahabiente"
              />
            </RadioGroup>
          </FormControl>
        </Stack>
        {values.method === METHODS_ASSIGN_CARDS_TO_USERS.CARD_USERS ? (
          <Stack spacing={1}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Usuarios Tarjetahabientes
              <Box component={'span'} color={'error.main'} ml={0.5}>
                *
              </Box>
            </Typography>

            <RFSelect
              name={'cardUser'}
              textFieldParams={{ placeholder: 'Seleccionar ...', size: 'small' }}
              options={cardHolders || []}
              disabled={loading}
            />
          </Stack>
        ) : (
          <>
            <Stack spacing={1}>
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Nombre (s)
                <Box component={'span'} color={'error.main'} ml={0.5}>
                  *
                </Box>
              </Typography>

              <RFTextField
                name={'userName'}
                size={'small'}
                required
                placeholder={'Nombre del Tarjetahabiente...'}
                disabled={loading}
              />
            </Stack>

            <Stack spacing={1}>
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Apellido (s)
                <Box component={'span'} color={'error.main'} ml={0.5}>
                  *
                </Box>
              </Typography>

              <RFTextField
                name={'userLastName'}
                size={'small'}
                required
                placeholder={'Apellidos del Tarjetahabiente...'}
                disabled={loading}
              />
            </Stack>

            <Stack flexDirection={{ md: 'row' }} gap={2}>
              <Stack spacing={1} flex={1}>
                <Typography type={'email'} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Correo
                  <Box component={'span'} color={'error.main'} ml={0.5}>
                    *
                  </Box>
                </Typography>

                <RFTextField
                  name={'userEmail'}
                  size={'small'}
                  required
                  placeholder={'user@domino.com...'}
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
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Teléfono
                </Typography>
                <RFTextField
                  name={'userPhone'}
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
          </>
        )}

        <Stack sx={{ pt: 2 }}>
          <LoadingButton size={'large'} loading={loading} variant="contained" color="primary" fullWidth type="submit">
            Asignar Tarjetas
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  )
}

export default CardsAssignFormOfCardCloud

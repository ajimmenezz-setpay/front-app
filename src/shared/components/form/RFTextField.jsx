import { TextField, styled } from '@mui/material'
import { useField } from 'formik'

const MyTextField = styled(TextField)(({ theme }) => ({
  // '& input:-webkit-autofill': {
  //   WebkitBoxShadow: `0 0 0px 1000px ${alpha(theme.palette.primary.main, 0.1)} inset!important`
  // }
}))

export function RFTextField({ name, ...rest }) {
  const [field, meta, helpers] = useField(name)

  return (
    <MyTextField
      {...field}
      {...rest}
      error={Boolean(meta.touched && meta.error)}
      helperText={meta.touched && meta.error}
    />
  )
}

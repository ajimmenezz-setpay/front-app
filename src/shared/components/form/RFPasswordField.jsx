import { useState } from 'react'

import { IconButton, InputAdornment, TextField } from '@mui/material'
import { Field } from 'formik'
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi'

export function RFPasswordField({ name, InputProps, ...rest }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Field name={name}>
      {({ field, meta }) => (
        <TextField
          {...field}
          {...rest}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            ...InputProps,
            endAdornment: (
              <InputAdornment position="end" sx={{ mr: 0.5 }}>
                <IconButton size={'small'} edge="end" onClick={() => setShowPassword(prev => !prev)}>
                  {showPassword ? <PiEyeBold /> : <PiEyeClosedBold />}
                </IconButton>
              </InputAdornment>
            )
          }}
          error={Boolean(meta.touched && meta.error)}
          helperText={meta.touched && meta.error}
        />
      )}
    </Field>
  )
}

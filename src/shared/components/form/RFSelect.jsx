import { Autocomplete, TextField } from '@mui/material'
import { useField } from 'formik'

export function RFSelect({ options, label, name, textFieldParams = {}, ...props }) {
  const [field, meta, helpers] = useField(name)

  const handleChange = (_, value) => {
    helpers.setValue(value)
  }

  return (
    <Autocomplete
      options={options}
      value={field.value}
      onChange={handleChange}
      getOptionLabel={option => option?.label || ''}
      getOptionDisabled={option => option?.isDisabled}
      isOptionEqualToValue={(option, current) => option?.value === current?.value}
      renderInput={params => (
        <TextField {...params} label={label} error={Boolean(meta.error)} helperText={meta.error} {...textFieldParams} />
      )}
      {...props}
    />
  )
}

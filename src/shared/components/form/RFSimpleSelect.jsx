import PropTypes from 'prop-types'

import { FormHelperText, Select } from '@mui/material'
import { useField } from 'formik'

export const RFSimpleSelect = ({ name, children, ...rest }) => {
  const [field, meta, helpers] = useField(name)
  return (
    <>
      <Select {...field} {...rest} error={Boolean(meta.touched && meta.error)}>
        {children}
      </Select>
      {Boolean(meta.touched && meta.error) && (
        <FormHelperText color="error">{meta.touched && meta.error}</FormHelperText>
      )}
    </>
  )
}

RFSimpleSelect.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string.isRequired
}

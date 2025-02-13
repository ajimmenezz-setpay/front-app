import { useCallback } from 'react'

import PropTypes from 'prop-types'

import { FormHelperText } from '@mui/material'
import { Field, useField } from 'formik'

import { UploadAvatar, UploadMultiFile, UploadSingleFile } from '../upload'

RFUploadAvatar.propTypes = {
  name: PropTypes.string
}

export function RFUploadAvatar({ name, ...other }) {
  return (
    <Field name={name}>
      {({ field, meta }) => (
        <div>
          <UploadAvatar error={Boolean(meta.touched && meta.error)} {...other} file={field.value} />
          {Boolean(meta.touched && meta.error) && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {meta.touched && meta.error}
            </FormHelperText>
          )}
        </div>
      )}
    </Field>
  )
}

RFUploadSingleFile.propTypes = {
  name: PropTypes.string
}

export function RFUploadSingleFile({ name, ...other }) {
  const [field, meta, helpers] = useField(name)
  const checkError = Boolean(meta.touched && meta.error)

  const handleDrop = useCallback(
    acceptedFiles => {
      const file = acceptedFiles[0]

      if (file) {
        helpers.setValue(
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      }
    },
    [helpers]
  )
  const handleRemove = useCallback(() => helpers.setValue(null), [helpers])

  return (
    <UploadSingleFile
      accept="image/*"
      file={field.value}
      error={checkError}
      helperText={
        checkError && (
          <FormHelperText error sx={{ px: 2 }}>
            {meta.error}
          </FormHelperText>
        )
      }
      onDrop={handleDrop}
      onRemove={handleRemove}
      {...other}
    />
  )
}

RFUploadMultiFile.propTypes = {
  name: PropTypes.string
}

export function RFUploadMultiFile({ name, ...other }) {
  const [field, meta, helpers] = useField(name)
  const checkError = Boolean(meta.touched && meta.error)

  const handleDrop = acceptedFiles => {
    const files = [...field.value, ...acceptedFiles]
    helpers.setValue(
      files.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    )
  }

  const handleRemoveAll = () => {
    helpers.setValue([])
  }

  const handleRemove = file => {
    const filteredItems = field.value?.filter(_file => _file !== file)
    helpers.setValue(filteredItems)
  }

  return (
    <UploadMultiFile
      accept="image/*"
      files={field.value || []}
      error={checkError}
      helperText={
        checkError && (
          <FormHelperText error sx={{ px: 2 }}>
            {meta.error}
          </FormHelperText>
        )
      }
      onDrop={handleDrop}
      onRemove={handleRemove}
      onRemoveAll={handleRemoveAll}
      {...other}
    />
  )
}

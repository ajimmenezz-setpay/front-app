import PropTypes from 'prop-types'

import { Close } from '@mui/icons-material'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import isString from 'lodash/isString'
import { useDropzone } from 'react-dropzone'

import RejectionFiles from './RejectionFiles'

import pdf from '@/shared/assets/img/pdf.png'
import { Image } from '@/shared/components/images'

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5, 1),
  borderRadius: `0px 0px ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' }
}))

UploadSingleFile.propTypes = {
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onRemove: PropTypes.func,
  helperText: PropTypes.node,
  sx: PropTypes.object
}

const isImage = url => /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url)

export default function UploadSingleFile({ error = false, file, helperText, onRemove, sx, height = 10, ...other }) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    ...other
  })

  let srcImage = null
  if (isString(file)) {
    srcImage = isImage(file) ? file : pdf
  } else if (file) {
    srcImage = isImage(file.name) ? file.preview : pdf
  }

  return (
    <Stack sx={{ width: '100%', height: '100%', position: 'relative', ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter'
          }),
          ...(file && {
            padding: '12% 0'
          })
        }}
      >
        <input {...getInputProps()} />

        {!file ? (
          <Stack
            spacing={2}
            alignItems="center"
            justifyContent="center"
            direction={{ xs: 'column', md: 'row' }}
            sx={{ height, textAlign: { xs: 'center', md: 'left' } }}
          >
            <Box
              sx={{ p: 3 }}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              flexDirection={'column'}
            >
              <Typography gutterBottom variant="subtitle1" fontWeight={'bold'}>
                Arrastra ó Selecciona el archivo
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Arrastra el archivo aquí o haz clic para&nbsp;
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ color: 'primary.main', textDecoration: 'underline' }}
                >
                  buscar
                </Typography>
                &nbsp;en tu equipo
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Box width={1} height={{ lg: 165, xl: 155, md: 180, xs: 250, sm: 250 }} />
        )}

        {file && (
          <Image
            alt="file preview"
            src={srcImage}
            sx={{
              top: 8,
              left: 8,
              borderRadius: 1,
              position: 'absolute',
              width: 'calc(100% - 16px)',
              height: 'calc(100% - 16px)'
            }}
          />
        )}
      </DropZoneStyle>
      {file && (
        <IconButton
          aria-label="remove-file"
          size="small"
          onClick={() => onRemove(file)}
          sx={{
            top: '16px',
            right: '16px',
            zIndex: 9,
            position: 'absolute',
            padding: '5px',
            color: 'common.white',
            bgcolor: theme => alpha(theme.palette.grey[900], 0.72),
            '&:hover': {
              bgcolor: theme => alpha(theme.palette.grey[900], 0.48)
            },
            borderRadius: '50%'
          }}
        >
          <Close fontSize="inherit" />
        </IconButton>
      )}

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}

      {helperText && helperText}
    </Stack>
  )
}

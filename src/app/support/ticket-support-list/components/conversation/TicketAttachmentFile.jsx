import { memo, useMemo } from 'react'

import PropTypes from 'prop-types'

import { DeleteOutline, FilePresentRounded } from '@mui/icons-material'
import { Box, IconButton, Stack, Tooltip } from '@mui/material'

import { Image } from '@/shared/components/images'
import { getFileURL } from '@/shared/utils'

const TicketAttachmentFile = ({ isLoading, file, handleRemoveFile }) => {
  const url = useMemo(() => getFileURL(file, false), [file])

  return (
    <Stack direction="column" alignItems="center" spacing={1}>
      {!isLoading && (
        <IconButton title="Borrar" color="error" size="small" onClick={() => handleRemoveFile(file)}>
          <DeleteOutline />
        </IconButton>
      )}
      <Tooltip title={file?.name}>
        <Box
          sx={{
            width: 80,
            height: 80,
            flexShrink: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {url === 'image' && (
            <Image
              src={URL.createObjectURL(file)}
              alt={file?.name}
              sx={{ width: 80, height: 80, borderRadius: 2 }}
              ratio="1/1"
            />
          )}
          {url && url !== 'image' && (
            <Image src={url} alt={file.name} sx={{ width: 80, height: 80, borderRadius: 2 }} />
          )}
          {!url && <FilePresentRounded sx={{ width: 80, height: 80 }} />}
        </Box>
      </Tooltip>
    </Stack>
  )
}

TicketAttachmentFile.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.any
  }),
  handleRemoveFile: PropTypes.func,
  isLoading: PropTypes.any
}

export default memo(TicketAttachmentFile)

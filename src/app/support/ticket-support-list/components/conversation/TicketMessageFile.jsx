import { useMemo } from 'react'

import PropTypes from 'prop-types'

import { FilePresentRounded } from '@mui/icons-material'
import { isString } from 'lodash'

import { FileThumbStyle } from './TicketMessageItemStyles'

import { Image } from '@/shared/components/images'
import { getFileURL } from '@/shared/utils'

const TicketMessageFile = ({ file, isURL = true }) => {
  const fileURL = useMemo(() => getFileURL(file, isURL), [file])
  const src = useMemo(() => (isString(file) ? file : URL.createObjectURL(file)), [file])
  const alt = useMemo(() => (isString(file) ? file : file.name), [file])
  const sx = { width: 60, height: 60 }

  return (
    <FileThumbStyle
      onClick={e => {
        e.stopPropagation()
        window.open(file, '_blank')
      }}
    >
      {fileURL === 'image' && <Image src={src} alt={alt} sx={{ height: 1 }} ratio="1/1" />}
      {fileURL && fileURL !== 'image' && <Image src={fileURL} alt={file} sx={sx} />}
      {!fileURL && <FilePresentRounded sx={sx} />}
    </FileThumbStyle>
  )
}

TicketMessageFile.propTypes = {
  file: PropTypes.any,
  isURL: PropTypes.bool
}

export default TicketMessageFile

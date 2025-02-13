import PropTypes from 'prop-types'

import { Close, InsertDriveFile } from '@mui/icons-material'
import { Button, IconButton, List, ListItem, ListItemText, Stack } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { AnimatePresence, m } from 'framer-motion'
import isString from 'lodash/isString'

import { varFade } from '../animate'

import { Image } from '@/shared/components/images'
import { fData } from '@/shared/utils'

const getFileData = file => {
  if (typeof file === 'string') {
    return {
      key: file
    }
  }
  return {
    key: file.name,
    name: file.name,
    size: file.size,
    preview: file.preview
  }
}

MultiFilePreview.propTypes = {
  files: PropTypes.array,
  showPreview: PropTypes.bool,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func
}

export default function MultiFilePreview({ showPreview = false, files, onRemove, onRemoveAll }) {
  const hasFile = files.length > 0

  return (
    <>
      <List disablePadding sx={{ ...(hasFile && { my: 2 }) }}>
        <AnimatePresence>
          {files.map((file, index) => {
            const { key, name, size, preview } = getFileData(file)

            if (showPreview) {
              return (
                <ListItem
                  key={`${key}_${index}`}
                  component={m.div}
                  {...varFade().inRight}
                  sx={{
                    p: 0,
                    m: 0.5,
                    width: 80,
                    height: 80,
                    borderRadius: 1.25,
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'inline-flex',
                    border: theme => `solid 1px ${theme.palette.divider}`
                  }}
                >
                  <Image alt="preview" src={isString(file) ? file : preview} ratio="1/1" />
                  <IconButton
                    size="small"
                    onClick={() => onRemove(file)}
                    sx={{
                      top: 6,
                      p: '2px',
                      right: 6,
                      position: 'absolute',
                      color: 'common.white',
                      bgcolor: theme => alpha(theme.palette.grey[900], 0.72),
                      '&:hover': {
                        bgcolor: theme => alpha(theme.palette.grey[900], 0.48)
                      }
                    }}
                  >
                    <Close />
                  </IconButton>
                </ListItem>
              )
            }

            return (
              <ListItem
                key={`${key}_${index}`}
                component={m.div}
                {...varFade().inRight}
                sx={{
                  my: 1,
                  px: 2,
                  py: 0.75,
                  borderRadius: 0.75,
                  border: theme => `solid 1px ${theme.palette.divider}`
                }}
              >
                <InsertDriveFile sx={{ width: 28, height: 28, color: 'text.secondary', mr: 2 }} />

                <ListItemText
                  primary={isString(file) ? file : name}
                  secondary={isString(file) ? '' : fData(size || 0)}
                  primaryTypographyProps={{ variant: 'subtitle2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />

                <IconButton edge="end" size="small" onClick={() => onRemove(file)}>
                  <Close />
                </IconButton>
              </ListItem>
            )
          })}
        </AnimatePresence>
      </List>

      {hasFile && (
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button color="inherit" variant={'outlined'} size="small" onClick={onRemoveAll}>
            Borrar Todos
          </Button>
        </Stack>
      )}
    </>
  )
}

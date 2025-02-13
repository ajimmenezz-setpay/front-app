import PropTypes from 'prop-types'

import { InsertDriveFile } from '@mui/icons-material'
import { CardHeader, Link, List, ListItem, Stack, Typography } from '@mui/material'
import { AnimatePresence, m } from 'framer-motion'

import { DetailsCardLayout } from './DetailsCardLayout'

import { varFade } from '@/shared/components/animate'

Documents.propTypes = {
  documents: PropTypes.array,
  expanded: PropTypes.string,
  handleChange: PropTypes.func,
  status: PropTypes.shape({
    step: PropTypes.string
  })
}

export function Documents({ documents, expanded, handleChange, status }) {
  const available = Boolean(documents?.length > 0)

  return (
    <DetailsCardLayout
      step={status?.step}
      headerText={'Documentos'}
      available={available}
      handleChange={handleChange}
      expandedText={'documents'}
      expanded={expanded}
      alertText={'No se han cargado documentos legales del comercio!'}
    >
      <>
        <CardHeader
          title=""
          subheader={`${documents?.length} archivos`}
          sx={{
            p: 0,
            my: 3,
            '& .MuiCardHeader-action': { alignSelf: 'center' }
          }}
        />
        <List disablePadding sx={{ my: 3 }}>
          <AnimatePresence>
            {documents?.map(file => (
              <FileItem key={file?.id} file={file} />
            ))}
          </AnimatePresence>
        </List>
      </>
    </DetailsCardLayout>
  )
}

FileItem.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string,
    path: PropTypes.string
  })
}

function FileItem({ file }) {
  return (
    <ListItem
      component={m.div}
      {...varFade().inRight}
      sx={{
        my: 2,
        px: 2,
        py: 0.75,
        borderRadius: 0.75,
        border: theme => `solid 1px ${theme.palette.divider}`
      }}
    >
      <InsertDriveFile sx={{ width: 28, height: 28, color: 'text.secondary', mr: 2 }} />
      <Stack>
        <Typography variant={'subtitle2'}>
          {' '}
          <Link href={file?.path} target="_blank">
            {file?.name}
          </Link>
        </Typography>
        {/* <Stack direction={'row'} spacing={1} alignItems={'center'} sx={{ fontWeight: 400 }}> */}
        {/*  <Typography variant={'caption'} color={'text.secondary'}> */}
        {/*    20MB */}
        {/*  </Typography> */}
        {/*  <Box sx={{ width: '2px', height: '2px', borderRadius: '50%', bgcolor: 'text.secondary' }} /> */}
        {/*  <Typography variant={'caption'} color={'text.secondary'}> */}
        {/*    {fDateTime(new Date())} */}
        {/*  </Typography> */}
        {/* </Stack> */}
      </Stack>
    </ListItem>
  )
}

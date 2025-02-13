import PropTypes from 'prop-types'

import { Paper, Typography } from '@mui/material'

import { EmptyDataIllustration } from '@/shared/components/illustrations'

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string
}

export function SearchNotFound({ searchQuery = '', widthImage = '60%', ...other }) {
  return searchQuery ? (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        Sin Resultados
      </Typography>
      <Typography variant="body2" align="center">
        No se encontraron resultados para &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>. Verifica tus datos.
      </Typography>
      <EmptyDataIllustration sx={{ width: widthImage }} />
    </Paper>
  ) : (
    <Typography variant="body2"> Por favor escribe tú búsqueda</Typography>
  )
}

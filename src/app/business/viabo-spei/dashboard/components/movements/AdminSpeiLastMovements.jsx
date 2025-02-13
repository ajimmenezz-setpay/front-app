import PropTypes from 'prop-types'

import { Alert, List, ListSubheader, Typography } from '@mui/material'

import { AdminSpeiMovementItem } from './AdminSpeiMovementItem'
import { AdminSpeiMovementSkeleton } from './AdminSpeiMovementSkeleton'

export const AdminSpeiLastMovements = ({ movementsGrouped, isLoading, ...others }) => (
  <List
    disablePadding
    {...others}
    sx={{
      width: '100%',
      position: 'relative',
      overflow: 'auto',
      maxHeight: 600,
      '& ul': { padding: 0 }
    }}
    subheader={<li />}
  >
    {!isLoading &&
      movementsGrouped &&
      Object.entries(movementsGrouped)?.map(([dateKey, movements]) => (
        <li key={`section-${dateKey}`}>
          <ul>
            <ListSubheader
              sx={{
                backgroundColor: theme => (theme.palette.mode === 'dark' ? theme.palette.background.paper : '#EBF0F0'),
                backdropFilter: `blur(10px)`,
                WebkitBackdropFilter: `blur(10px)`,
                fontWeight: 'bold',
                color: 'text.primary',
                py: 1
              }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                {dateKey}
              </Typography>
            </ListSubheader>
            {movements?.map(movement => (
              <AdminSpeiMovementItem key={movement?.id} movement={movement} />
            ))}
          </ul>
        </li>
      ))}

    {!isLoading && movementsGrouped && Object.entries(movementsGrouped)?.length === 0 && (
      <Alert severity="info" sx={{ m: 2 }}>
        No hay movimientos recientes
      </Alert>
    )}

    {isLoading && [...Array(20)]?.map((number, index) => <AdminSpeiMovementSkeleton key={index} />)}
  </List>
)

AdminSpeiLastMovements.propTypes = {
  isLoading: PropTypes.any,
  movementsGrouped: PropTypes.any
}

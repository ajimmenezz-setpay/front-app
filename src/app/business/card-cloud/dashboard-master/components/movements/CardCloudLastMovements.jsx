import PropTypes from 'prop-types'

import {
  Alert,
  Box,
  Card,
  CardHeader,
  Divider,
  LinearProgress,
  List,
  ListSubheader,
  Stack,
  Typography
} from '@mui/material'

import { CardCloudMovementItem, CardCloudMovementSkeleton } from '../../../shared/components'
import { useCardCloudSharedStore } from '../../../shared/store'

import { isEmpty } from '@/shared/utils'

const CardCloudLastMovements = ({ loading, movements, isFetching }) => {
  const { selectedCompany, companySubAccountInfo } = useCardCloudSharedStore()

  const isEmptyAccount = !companySubAccountInfo?.subAccountId
  const isEmptyCompany = !selectedCompany

  return (
    <Box
      component={Card}
      variant="outlined"
      sx={theme => ({
        backdropFilter: `blur(10px)`,
        WebkitBackdropFilter: `blur(10px)`,
        background: 'inherit'
      })}
    >
      <CardHeader sx={{ p: 2 }} title="Últimos Movimientos" />
      <Divider />
      <Stack>
        {isFetching && <LinearProgress />}

        {!loading && isEmptyCompany && (
          <Stack p={3}>
            <Alert severity="info">No hay una empresa asignada</Alert>
          </Stack>
        )}

        {!isEmptyCompany && (
          <Stack flexDirection={'row'} sx={{ height: '100%', display: 'flex', flexGrow: 1 }}>
            <CardCloudListMovements isLoading={loading} movementsGrouped={movements?.groupByDay} />
          </Stack>
        )}
        {isFetching && <LinearProgress />}
      </Stack>
    </Box>
  )
}

CardCloudLastMovements.propTypes = {
  isFetching: PropTypes.any,
  loading: PropTypes.any,
  movements: PropTypes.shape({
    groupByDay: PropTypes.any
  })
}

function CardCloudListMovements({ isLoading, movementsGrouped, ...others }) {
  return (
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
      {!isLoading && isEmpty(movementsGrouped) && (
        <Stack flex={1} justifyContent={'center'} p={3}>
          <Alert severity="info">No existen movimientos en esta cuenta</Alert>
        </Stack>
      )}

      {!isLoading &&
        movementsGrouped &&
        Object.entries(movementsGrouped)?.map(([dateKey, movements]) => (
          <li key={`section-${dateKey}`}>
            <ul>
              <ListSubheader
                sx={{
                  backgroundColor: theme =>
                    theme.palette.mode === 'dark' ? theme.palette.background.paper : '#EBF0F0',
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
                <CardCloudMovementItem key={movement?.id} movement={movement} />
              ))}
            </ul>
          </li>
        ))}

      {isLoading && [...Array(20)]?.map((number, index) => <CardCloudMovementSkeleton key={index} />)}
    </List>
  )
}

CardCloudListMovements.propTypes = {
  isLoading: PropTypes.any,
  movementsGrouped: PropTypes.any
}

export default CardCloudLastMovements

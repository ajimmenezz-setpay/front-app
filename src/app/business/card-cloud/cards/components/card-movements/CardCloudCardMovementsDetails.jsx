import { useMemo, useState } from 'react'

import { Alert, Divider, LinearProgress, List, ListSubheader, Pagination, Stack, Typography } from '@mui/material'
import { AnimatePresence, m } from 'framer-motion'

import { CardCloudMovementItem, CardCloudMovementSkeleton } from '../../../shared/components'

import { varFade } from '@/shared/components/animate'
import { usePagination } from '@/shared/hooks'

const CardCloudCardMovementsDetails = ({ queryMovements }) => {
  const { isLoading, refetch, isRefetching: isFetching } = queryMovements

  const [page, setPage] = useState(1)

  const movements = queryMovements?.data?.originalAdapted || []

  const PER_PAGE = 10
  const source = useMemo(() => movements || [], [movements])
  const _DATA = usePagination(source || [], PER_PAGE)
  const length = source?.length || 0
  const count = Math.ceil(length / PER_PAGE)
  const paginatedMovements = _DATA.currentData()

  const handleChange = (e, p) => {
    setPage(p)
    _DATA.jump(p)
  }

  const loading = isLoading
  return (
    <>
      <Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
        {isFetching && <LinearProgress />}
        <List>
          <AnimatePresence>
            {paginatedMovements.map((movement, index) => (
              <div key={index}>
                {(index === 0 || paginatedMovements[index - 1]?.date?.groupBy !== movement.date?.groupBy) && (
                  <ul>
                    <ListSubheader
                      component={m.div}
                      {...varFade().inRight}
                      sx={{ backgroundColor: 'transparent', pt: 2 }}
                    >
                      <Typography variant="subtitle1" color="text.secondary">
                        {movement?.date?.groupBy}
                      </Typography>
                    </ListSubheader>
                  </ul>
                )}
                <CardCloudMovementItem
                  component={m.div}
                  {...varFade().inRight}
                  key={movement?.id}
                  movement={movement}
                />
              </div>
            ))}
          </AnimatePresence>
        </List>
      </Stack>
      {movements?.length === 0 && !loading && (
        <Stack sx={{ px: 3 }}>
          <Alert severity="info">No hay movimientos en este rango de fechas</Alert>
        </Stack>
      )}

      {loading && [...Array(10)]?.map((number, index) => <CardCloudMovementSkeleton key={index} />)}

      {movements?.length > 0 && !isLoading && (
        <Stack alignItems={'center'} justifyContent={'center'}>
          <Pagination count={count} page={page} onChange={handleChange} variant="outlined" shape="rounded" />
        </Stack>
      )}
    </>
  )
}

export default CardCloudCardMovementsDetails

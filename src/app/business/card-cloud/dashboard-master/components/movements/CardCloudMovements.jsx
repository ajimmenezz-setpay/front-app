import { useMemo, useState } from 'react'

import { Alert, Box, Divider, List, ListSubheader, Pagination, Stack, Typography } from '@mui/material'
import { AnimatePresence, m } from 'framer-motion'

import { CardCloudMovementItem, CardCloudMovementSkeleton } from '../../../shared/components'
import { useCardCloudSubAccountFilterMovements } from '../../hooks'

import { searchByTerm } from '@/app/shared/utils'
import { varFade } from '@/shared/components/animate'
import { InputDateRange } from '@/shared/components/form'
import { SearchNotFound } from '@/shared/components/notifications'
import { usePagination } from '@/shared/hooks'

const CardCloudMovements = () => {
  const { queryMovements, setEndDate, setStartDate, startDate, endDate } = useCardCloudSubAccountFilterMovements()

  const movements = queryMovements?.data?.originalAdapted || []

  const { isLoading } = queryMovements

  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchFocused, setSearchFocused] = useState(false)
  const [searchResult, setSearchResult] = useState([])

  const PER_PAGE = 10
  const source = useMemo(
    () => (searchTerm !== '' ? searchResult : movements) || [],
    [searchTerm, movements, searchResult]
  )
  const _DATA = usePagination(source || [], PER_PAGE)
  const length = source?.length || 0
  const count = Math.ceil(length / PER_PAGE)
  const paginatedMovements = _DATA.currentData()

  const handleChange = (e, p) => {
    setPage(p)
    _DATA.jump(p)
  }

  const handleClickAwaySearch = () => {
    setSearchFocused(false)
  }

  const handleChangeSearch = async event => {
    const { value } = event.target
    setSearchTerm(value)
    if (value) {
      const filterCards = searchByTerm(movements, searchTerm)
      setSearchResult(filterCards)
    } else {
      setSearchResult(movements)
    }
  }

  const handleSearchFocus = () => {
    setSearchFocused(true)
  }

  const handleDateRange = range => {
    const { startDate, endDate } = range
    if (endDate !== null && startDate !== null) {
      setEndDate(endDate)
      setStartDate(startDate)
    }
  }
  const displayResults = searchTerm && isSearchFocused
  const loading = isLoading

  return (
    <Stack gap={3}>
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }}>
        <InputDateRange startDate={startDate} endDate={endDate} onSubmit={handleDateRange} />
        <Box sx={{ flex: '2 2 auto', mb: { xs: 3 } }} />
      </Box>
      <Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
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
        {displayResults && paginatedMovements?.length === 0 && movements?.length > 0 && (
          <SearchNotFound
            widthImage="15%"
            sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            searchQuery={searchTerm}
          />
        )}
      </Stack>
      {movements?.length === 0 && !loading && (
        <Stack>
          <Alert severity="info">No hay movimientos en este rango de fechas</Alert>
        </Stack>
      )}

      {loading && [...Array(10)]?.map((number, index) => <CardCloudMovementSkeleton key={index} />)}

      {movements?.length > 0 && !isLoading && (
        <Stack alignItems={'center'} justifyContent={'center'}>
          <Pagination count={count} page={page} onChange={handleChange} variant="outlined" shape="rounded" />
        </Stack>
      )}
    </Stack>
  )
}

export default CardCloudMovements

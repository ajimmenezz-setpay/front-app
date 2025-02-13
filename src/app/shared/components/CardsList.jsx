import { createElement, useEffect, useMemo, useState } from 'react'

import { Search } from '@mui/icons-material'
import { Box, InputAdornment, Pagination, TextField } from '@mui/material'
import { useCollapseDrawer, useResponsive } from '@theme/hooks'

import { StockCard, StockCardSkeleton } from '@/app/management/stock-cards/components/stock-card'
import { searchByTerm } from '@/app/shared/utils'
import { ErrorRequestPage } from '@/shared/components/notifications'
import EmptyList from '@/shared/components/notifications/EmptyList'
import { usePagination } from '@/shared/hooks'

export function CardsList({
  cards,
  emptyMessage = 'No hay tarjetas disponibles en stock',
  cardComponent = StockCard,
  ...others
}) {
  const isDesktop = useResponsive('up', 'xl')
  const { isCollapse } = useCollapseDrawer()
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const { data, isLoading, isError, error, isSuccess: isSuccessCards, refetch } = cards

  const cardList = data || []
  const loadingCards = isLoading

  const PER_PAGE = isDesktop ? 12 : 9
  const source = useMemo(
    () => (searchTerm !== '' ? searchResult : cardList) || [],
    [searchTerm, cardList, searchResult]
  )
  const length = source.length || 0
  const count = Math.ceil(length / PER_PAGE)
  const _DATA = usePagination(source || [], PER_PAGE)

  const handleChange = (e, p) => {
    setPage(p)
    _DATA.jump(p)
  }

  useEffect(() => {
    if (searchTerm) {
      const filterCards = searchByTerm(cardList, searchTerm)
      setSearchResult(filterCards)
    } else {
      setSearchResult([])
    }
  }, [searchTerm, cardList])

  return (
    <>
      {isSuccessCards && cardList?.length > 0 && (
        <Box
          display="flex"
          mb={3}
          flexDirection={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'center' }}
          {...others}
        >
          <Box>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar ..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ color: 'text.disabled' }}>
                      <Search sx={{ marginTop: 1 }} />
                    </Box>
                  </InputAdornment>
                )
              }}
            />
          </Box>
          <Box sx={{ flex: '1 1 auto', mb: { xs: 3 } }} />
          <Pagination count={count} page={page} onChange={handleChange} />
        </Box>
      )}

      {!loadingCards && isSuccessCards && cardList.length === 0 && (
        <EmptyList widthImage={'30%'} message={emptyMessage} />
      )}

      {!loadingCards && isError && <ErrorRequestPage widthImage={'30%'} errorMessage={error} handleButton={refetch} />}

      {!isError && (
        <Box
          mb={3}
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: isCollapse ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
              xl: 'repeat(4, 1fr)'
            }
          }}
        >
          {(loadingCards ? [...Array(PER_PAGE)] : _DATA.currentData() || []).map((card, index) =>
            card ? createElement(cardComponent, { card, key: index }) : <StockCardSkeleton key={index} />
          )}
        </Box>
      )}

      {cardList.length > 0 && length === 0 && (
        <EmptyList widthImage={'30%'} message="No hay tarjetas que coincidan con la búsqueda" />
      )}
    </>
  )
}

import { useEffect, useMemo, useState } from 'react'

import PropTypes from 'prop-types'

import { Search } from '@mui/icons-material'
import { Box, ClickAwayListener, Divider, InputAdornment, Stack } from '@mui/material'

import { SidebarButtonStyle } from '../../../shared/components'
import { useCardsOfCardCloudStore } from '../../store'

import { searchByTerm } from '@/app/shared/utils'
import { arrowIcon } from '@/shared/assets/icons'
import { InputStyle } from '@/shared/components/form'
import { SearchNotFound } from '@/shared/components/notifications'
import { useResponsive } from '@/theme/hooks'

export const CardsSearchOfCardCloud = ({ cardsQuery }) => {
  const { data: companyCards } = cardsQuery

  const { setCollapse, setFilterCards } = useCardsOfCardCloudStore()

  const isCollapseList = useCardsOfCardCloudStore(state => state.isCollapse)
  const isOpenSidebar = useCardsOfCardCloudStore(state => state.isOpenSidebar)
  const filterCards = useCardsOfCardCloudStore(state => state.filterCards)

  const isDesktop = useResponsive('up', 'md')

  const [searchQuery, setSearchQuery] = useState('')

  const [isSearchFocused, setSearchFocused] = useState(false)

  const displayResults = searchQuery && isSearchFocused

  const isCollapse = useMemo(
    () => (isDesktop ? isCollapseList : !isOpenSidebar),
    [isCollapseList, isOpenSidebar, isDesktop]
  )

  const handleChangeSearch = async event => {
    try {
      const { value } = event.target
      setSearchQuery(value)
      if (value) {
        const results = searchByTerm(companyCards, value) || []

        setFilterCards(results)
      } else {
        setFilterCards(companyCards)
      }
    } catch (error) {
      setFilterCards(companyCards)
    }
  }

  const handleToggleList = () => {
    setCollapse(!isCollapseList)
  }

  const handleSearchFocus = () => {
    setSearchFocused(true)
  }

  const handleClickAwaySearch = () => {
    setSearchFocused(false)
  }

  useEffect(() => {
    if (isCollapse) {
      setSearchFocused(false)
    }
  }, [isCollapse])

  useEffect(() => {
    if (companyCards && Array.isArray(companyCards)) {
      setFilterCards(companyCards)
      setSearchQuery('')
    }
  }, [companyCards])

  return (
    <>
      <Stack p={2} sx={{ background: theme => theme.palette.background.neutral }}>
        <Box>
          <Stack direction="row" justifyContent={!isCollapse ? 'flex-end' : 'center'} alignItems={'center'} spacing={2}>
            {!isCollapse && (
              <ClickAwayListener onClickAway={handleClickAwaySearch}>
                <InputStyle
                  fullWidth
                  size="small"
                  value={searchQuery}
                  onFocus={handleSearchFocus}
                  onChange={handleChangeSearch}
                  placeholder="Buscar Tarjetas..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                      </InputAdornment>
                    )
                  }}
                />
              </ClickAwayListener>
            )}
            {isDesktop && (
              <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}>
                <SidebarButtonStyle
                  size={'small'}
                  sx={{
                    ...(isCollapseList && {
                      transform: 'rotate(180deg)'
                    })
                  }}
                  onClick={handleToggleList}
                >
                  {arrowIcon}
                </SidebarButtonStyle>
              </Stack>
            )}
          </Stack>
        </Box>
      </Stack>
      <Divider />
      {filterCards?.length === 0 && companyCards?.length > 0 && !isCollapse && (
        <SearchNotFound
          sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          searchQuery={searchQuery}
        />
      )}
    </>
  )
}

CardsSearchOfCardCloud.propTypes = {
  cardsQuery: PropTypes.shape({
    data: PropTypes.array
  })
}

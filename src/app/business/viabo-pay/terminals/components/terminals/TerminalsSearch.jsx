import { useEffect, useState } from 'react'

import PropTypes from 'prop-types'

import { Search } from '@mui/icons-material'
import { Box, ClickAwayListener, InputAdornment, Stack } from '@mui/material'

import { useTerminals } from '../../store'

import { SidebarButtonStyle } from '@/app/business/viabo-card/cards/components/sidebar/SidebarStyles'
import { arrowIcon } from '@/shared/assets/icons'
import { InputStyle } from '@/shared/components/form'
import { SearchNotFound } from '@/shared/components/notifications'
import { useResponsive } from '@/theme/hooks'

export const TerminalsSearch = ({ commerceTerminals = [] }) => {
  const { setOpenList: setOpenSidebar, setCollapse, setTerminals } = useTerminals()

  const openSidebar = useTerminals(state => state.isOpenList)
  const isCollapse = useTerminals(state => state.isCollapse)
  const terminals = useTerminals(state => state.terminals)

  const isDesktop = useResponsive('up', 'md')

  const [searchQuery, setSearchQuery] = useState('')

  const [isSearchFocused, setSearchFocused] = useState(false)

  const displayResults = searchQuery && isSearchFocused

  const handleChangeSearch = async event => {
    try {
      const { value } = event.target
      setSearchQuery(value)
      if (value) {
        const results =
          commerceTerminals?.filter(
            item => item?.name && item?.name?.toLowerCase().indexOf(value.toLowerCase()) !== -1
          ) || []

        setTerminals(results)
      } else {
        setTerminals(commerceTerminals)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleToggleSidebar = () => {
    const sentence = isDesktop && openSidebar
    setCollapse(sentence)
    if (openSidebar) {
      setSearchQuery('')
      setTerminals(commerceTerminals)
    }
    setOpenSidebar(!openSidebar)
  }

  const handleSearchFocus = () => {
    setSearchFocused(true)
  }

  const handleClickAwaySearch = () => {
    setSearchFocused(false)
  }

  useEffect(() => {
    if (commerceTerminals) {
      setTerminals(commerceTerminals)
    }
  }, [commerceTerminals])

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!openSidebar) {
      return setSearchFocused(false)
    }
  }, [openSidebar])

  return (
    <>
      <Box sx={{ p: 2, px: 0 }}>
        <Stack direction="row" justifyContent={openSidebar ? 'flex-end' : 'center'} alignItems={'center'} spacing={2}>
          {(!isCollapse || !isDesktop) && (
            <ClickAwayListener onClickAway={handleClickAwaySearch}>
              <InputStyle
                fullWidth
                size="small"
                value={searchQuery}
                onFocus={handleSearchFocus}
                onChange={handleChangeSearch}
                placeholder="Buscar Terminales..."
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
                  ...(!openSidebar && {
                    transform: 'rotate(180deg)'
                  })
                }}
                onClick={handleToggleSidebar}
              >
                {arrowIcon}
              </SidebarButtonStyle>
            </Stack>
          )}
        </Stack>
      </Box>
      {terminals?.length === 0 && commerceTerminals?.length > 0 && (
        <SearchNotFound
          sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          searchQuery={searchQuery}
        />
      )}
    </>
  )
}

TerminalsSearch.propTypes = {
  commerceTerminals: PropTypes.array
}

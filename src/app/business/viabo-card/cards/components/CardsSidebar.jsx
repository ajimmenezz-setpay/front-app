import { useEffect, useState } from 'react'

import { CreditCard, Search } from '@mui/icons-material'
import { Box, ClickAwayListener, Drawer, InputAdornment, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useResponsive } from '@theme/hooks'

import { BUSINESS_PERMISSIONS } from '@/app/business/shared/routes'
import { CardList, CommerceCardTypes } from '@/app/business/viabo-card/cards/components/sidebar'
import {
  SIDEBAR_COLLAPSE_WIDTH,
  SIDEBAR_WIDTH,
  SidebarButtonMobileStyle,
  SidebarButtonStyle
} from '@/app/business/viabo-card/cards/components/sidebar/SidebarStyles'
import { useFindCommerceCards } from '@/app/business/viabo-card/cards/hooks'
import { useFindCommerceCardTypes } from '@/app/business/viabo-card/cards/hooks/useFindCommerceCardTypes'
import { useFindMainCard } from '@/app/business/viabo-card/cards/hooks/useFindMainCard'
import { useCommerceDetailsCard } from '@/app/business/viabo-card/cards/store'
import { searchByTerm } from '@/app/shared/utils'
import { arrowIcon } from '@/shared/assets/icons/CustomIcons'
import { InputStyle } from '@/shared/components/form'
import { ErrorRequestPage, SearchNotFound } from '@/shared/components/notifications'
import EmptyList from '@/shared/components/notifications/EmptyList'
import { Scrollbar } from '@/shared/components/scroll'
import { useUser } from '@/shared/hooks'

export function CardsSidebar() {
  const selectedCardId = useCommerceDetailsCard(state => state.card?.id)
  const cardTypeSelected = useCommerceDetailsCard(state => state.cardTypeSelected)

  const {
    data: cardTypes,
    isLoading: isLoadingCardTypes,
    isError: isErrorCardTypes,
    refetch: refetchCardTypes
  } = useFindCommerceCardTypes()

  const {
    data: commerceCards,
    isLoading: isLoadingCommerces,
    isRefetching: isRefetchingCommerces,
    isError,
    error,
    refetch,
    isSuccess
  } = useFindCommerceCards(cardTypeSelected, {
    enabled: false
  })

  const {
    data,
    refetch: refetchMainCard,
    isLoading: isLoadingMainCard
  } = useFindMainCard(cardTypeSelected, {
    enabled: false
  })

  const user = useUser()
  const userActions = user?.permissions ?? []

  const loadingCommerces = isLoadingCommerces || isRefetchingCommerces

  const theme = useTheme()

  const [openSidebar, setOpenSidebar] = useState(true)

  const [searchQuery, setSearchQuery] = useState('')

  const [searchResults, setSearchResults] = useState(commerceCards || [])

  const [isSearchFocused, setSearchFocused] = useState(false)

  const isDesktop = useResponsive('up', 'md')

  const displayResults = searchQuery && isSearchFocused

  const isCollapse = isDesktop && !openSidebar

  useEffect(() => {
    if (cardTypeSelected) {
      refetch()
    }

    if (cardTypeSelected && userActions.includes(BUSINESS_PERMISSIONS.COMMERCE_CARDS)) {
      refetchMainCard()
    }
  }, [cardTypeSelected])

  useEffect(() => {
    if (!isDesktop) {
      return handleCloseSidebar()
    }
  }, [isDesktop, selectedCardId])

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!openSidebar) {
      return setSearchFocused(false)
    }
  }, [openSidebar])

  useEffect(() => {
    if (commerceCards) {
      setSearchResults(commerceCards)
    }
  }, [commerceCards])

  const handleCloseSidebar = () => {
    setOpenSidebar(false)
  }

  const handleToggleSidebar = () => {
    setOpenSidebar(prev => {
      if (prev) {
        setSearchQuery('')
        setSearchResults(commerceCards)
      }
      return !prev
    })
  }

  const handleClickAwaySearch = () => {
    setSearchFocused(false)
  }

  const handleChangeSearch = async event => {
    try {
      const { value } = event.target
      setSearchQuery(value)
      if (value) {
        const results = searchByTerm(commerceCards, value) || []
        setSearchResults(results)
      } else {
        setSearchResults(commerceCards)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSearchFocus = () => {
    setSearchFocused(true)
  }

  const renderContent = (
    <>
      <Stack>
        {openSidebar && (
          <CommerceCardTypes
            cardTypes={cardTypes}
            isLoading={isLoadingCardTypes}
            isError={isErrorCardTypes}
            refetch={refetchCardTypes}
          />
        )}
        {!cardTypeSelected && openSidebar && !isLoadingCardTypes && (
          <EmptyList pt={2.5} message={'Seleccione un tipo de tarjeta para obtener la lista de tarjetas'} />
        )}
      </Stack>

      {cardTypeSelected && !isLoadingCardTypes && !isErrorCardTypes && (
        <>
          <Box sx={{ p: 2, px: 0 }}>
            <Stack
              direction="row"
              justifyContent={openSidebar ? 'flex-end' : 'center'}
              alignItems={'center'}
              spacing={2}
            >
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
            </Stack>
          </Box>

          {isError && openSidebar && !commerceCards && !loadingCommerces && (
            <ErrorRequestPage errorMessage={error} handleButton={refetch} />
          )}

          {commerceCards && openSidebar && commerceCards?.length === 0 && !loadingCommerces && (
            <EmptyList pt={2.5} message={'No hay tarjetas activas en este tipo de tarjeta'} />
          )}

          <Scrollbar
            sx={{
              height: 0.98
            }}
          >
            <>
              <CardList
                isOpenSidebar={openSidebar}
                cards={searchResults || []}
                isLoading={loadingCommerces}
                onOpenDetails={handleCloseSidebar}
              />
              {displayResults && searchResults?.length === 0 && commerceCards?.length > 0 && (
                <SearchNotFound
                  sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  searchQuery={searchQuery}
                />
              )}
            </>
          </Scrollbar>
        </>
      )}
    </>
  )

  return (
    <>
      {!isDesktop && !openSidebar && (
        <SidebarButtonMobileStyle onClick={handleToggleSidebar}>
          <CreditCard
            sx={{
              width: 16,
              height: 16
            }}
          />
        </SidebarButtonMobileStyle>
      )}

      {isDesktop ? (
        <Drawer
          open={openSidebar}
          variant="persistent"
          PaperProps={{
            sx: {
              height: 1,
              borderRightStyle: 'none',
              bgcolor: 'background.default'
            }
          }}
          sx={{
            height: 1,
            width: SIDEBAR_WIDTH,
            transition: theme.transitions.create('width'),
            '& .MuiDrawer-paper': {
              position: 'static',
              backgroundColor: 'transparent!important',
              width: SIDEBAR_WIDTH
            },
            ...(isCollapse && {
              width: SIDEBAR_COLLAPSE_WIDTH,
              '& .MuiDrawer-paper': {
                width: SIDEBAR_COLLAPSE_WIDTH,
                backgroundColor: 'transparent!important',
                position: 'static',
                transform: 'none !important',
                visibility: 'visible !important'
              }
            })
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          ModalProps={{ keepMounted: true }}
          open={openSidebar}
          onClose={handleCloseSidebar}
          sx={{
            height: 1,
            '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, p: 2 }
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </>
  )
}

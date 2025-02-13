import PropTypes from 'prop-types'

import { ContactlessSharp } from '@mui/icons-material'
import { Box, Card, Drawer, LinearProgress, Stack, useTheme } from '@mui/material'
import { useResponsive } from '@theme/hooks'

import { CardsList } from './CardsList'
import { CardsSearchOfCardCloud } from './CardsSearchOfCardCloud'

import { SIDEBAR_COLLAPSE_WIDTH, SIDEBAR_WIDTH, SidebarButtonMobileStyle } from '../../../shared/components'
import { useCardsOfCardCloudStore } from '../../store'

import { Scrollbar } from '@/shared/components/scroll'

const CardListDrawer = ({ cardsQuery }) => {
  const openSidebar = useCardsOfCardCloudStore(state => state.isOpenSidebar)
  const isCollapse = useCardsOfCardCloudStore(state => state.isCollapse)
  const { setOpenSidebar, setCollapse } = useCardsOfCardCloudStore()

  const theme = useTheme()

  const isDesktop = useResponsive('up', 'md')

  const handleCloseSidebar = () => {
    setOpenSidebar(false)
  }

  const handleToggleSidebar = () => {
    setOpenSidebar(!openSidebar)
    if (isCollapse) {
      setCollapse(false)
    }
  }

  const isFetching = cardsQuery?.isFetching

  const renderContent = (
    <Box
      component={isDesktop ? Card : 'div'}
      variant="outlined"
      sx={{
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'inherit',
        backdropFilter: `blur(10px)`,
        WebkitBackdropFilter: `blur(10px)`,
        mb: isDesktop ? 3 : 0
      }}
    >
      {isFetching && <LinearProgress />}

      <CardsSearchOfCardCloud cardsQuery={cardsQuery} />

      <Scrollbar
        sx={{
          height: 1
        }}
      >
        <Stack>
          <CardsList cardsQuery={cardsQuery} />
        </Stack>
      </Scrollbar>
      {isFetching && <LinearProgress />}
    </Box>
  )

  return (
    <>
      {!isDesktop && !openSidebar && (
        <SidebarButtonMobileStyle onClick={handleToggleSidebar}>
          <ContactlessSharp sx={{ width: 20, height: 20 }} />
        </SidebarButtonMobileStyle>
      )}

      {isDesktop ? (
        <Drawer
          open={!isCollapse}
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
          ModalProps={{ keepMounted: false }}
          open={openSidebar}
          onClose={handleCloseSidebar}
          sx={{
            height: 1,
            '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </>
  )
}

CardListDrawer.propTypes = {
  cardsQuery: PropTypes.shape({
    isFetching: PropTypes.any
  })
}

export default CardListDrawer

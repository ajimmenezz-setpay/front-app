import { lazy, useEffect } from 'react'

import { Box } from '@mui/material'
import { m } from 'framer-motion'

import { useSharedViaboSpeiStore } from '../../shared/store'

import { AdminDashboardSpeiResume } from '@/app/business/viabo-spei/dashboard/pages/AdminDashboardSpeiResume'
import { AdminDashboardSpeiTransactionsPage } from '@/app/business/viabo-spei/dashboard/pages/AdminDashboardSpeiTransactionsPage'
import { useAdminDashboardSpeiStore } from '@/app/business/viabo-spei/dashboard/store'
import { MotionContainer, varFade } from '@/shared/components/animate'
import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'
import { Lodable } from '@/shared/components/lodables'

const AdminSpeiMovementDrawer = Lodable(lazy(() => import('../components/movements/AdminSpeiMovementDrawer')))

export const AdminDashboardViaboSpei = () => {
  const title = useSharedViaboSpeiStore(state => state.dashboardTitle)
  const isOpenTransactions = useAdminDashboardSpeiStore(state => state.isOpenTransactions)
  const setDashboardTitle = useSharedViaboSpeiStore(state => state.setDashboardTitle)

  useEffect(() => {
    if (isOpenTransactions) {
      return setDashboardTitle('Transacciones')
    }
    return setDashboardTitle('Dashboard')
  }, [isOpenTransactions])

  return (
    <Page title={title}>
      <ContainerPage sx={{ pb: 3 }}>
        {isOpenTransactions && <HeaderPage name={title} links={[]} />}
        <Box component={MotionContainer}>
          {!isOpenTransactions && (
            <m.div variants={varFade().in}>
              <AdminDashboardSpeiResume />
            </m.div>
          )}
          {isOpenTransactions && (
            <m.div variants={varFade().in}>
              <AdminDashboardSpeiTransactionsPage />
            </m.div>
          )}
        </Box>
        <AdminSpeiMovementDrawer />
      </ContainerPage>
    </Page>
  )
}

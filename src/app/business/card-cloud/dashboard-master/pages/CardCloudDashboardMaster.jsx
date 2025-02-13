import { lazy, useEffect } from 'react'

import { Autocomplete, Box, Stack, TextField } from '@mui/material'
import { m } from 'framer-motion'

import { useFindCardCloudCompanies, useFindCardCloudSubAccountInfo } from '../../shared/hooks'
import { useCardCloudSharedStore } from '../../shared/store'
import { useCardCloudDashboardStore } from '../store'

import { MotionLazyContainer, varFade } from '@/shared/components/animate'
import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'
import { Lodable } from '@/shared/components/lodables'

const CardCloudDashboardMasterResume = Lodable(lazy(() => import('./CardCloudDashboardMasterResume')))
const CardCloudDashboardMovements = Lodable(lazy(() => import('./CardCloudDashboardMovements')))
const CardCloudMovementSupportTicketDrawer = Lodable(
  lazy(() => import('../../shared/components/ticket-support/CardCloudMovementSupportTicketDrawer'))
)

export const CardCloudDashboardMaster = () => {
  const title = useCardCloudDashboardStore(state => state.dashboardTitle)
  const isOpenMovements = useCardCloudDashboardStore(state => state.isOpenMovements)
  const { selectedCompany } = useCardCloudSharedStore()
  const { setSelectedCompany, setCompanySubAccountInfo } = useCardCloudSharedStore()

  const { setDashboardTitle, setEnableTransferSubAccounts } = useCardCloudDashboardStore()

  const queryCardCloudCompanies = useFindCardCloudCompanies()

  const queryCardCloudSubAccountInfo = useFindCardCloudSubAccountInfo(selectedCompany?.subAccountId, {
    enabled: false
  })

  useEffect(() => {
    if (selectedCompany?.subAccountId) {
      queryCardCloudSubAccountInfo?.refetch()
    }
  }, [selectedCompany])

  useEffect(() => {
    if (queryCardCloudSubAccountInfo?.data) {
      setCompanySubAccountInfo(queryCardCloudSubAccountInfo?.data)
    } else {
      setCompanySubAccountInfo(null)
    }
  }, [queryCardCloudSubAccountInfo.data])

  useEffect(() => {
    if (isOpenMovements) {
      return setDashboardTitle('Movimientos')
    }
    return setDashboardTitle('Dashboard Master')
  }, [isOpenMovements])

  const handleChangeCompany = (e, newValue) => {
    setSelectedCompany(newValue)
  }

  const data = queryCardCloudCompanies?.data

  useEffect(() => {
    if (data && data?.length >= 1 && !selectedCompany) {
      setSelectedCompany(data?.[0])
    }
    if (data?.length > 1) {
      setEnableTransferSubAccounts(true)
    } else {
      setEnableTransferSubAccounts(false)
    }
  }, [data])

  return (
    <Page title={`${title} | Card Cloud`}>
      <ContainerPage sx={{ pb: 3 }}>
        <HeaderPage
          name={title}
          links={[]}
          buttons={
            <>
              {data?.length > 1 && (
                <Stack flex={1}>
                  <Autocomplete
                    disableClearable
                    options={data || []}
                    fullWidth
                    size="small"
                    value={selectedCompany}
                    disabled={queryCardCloudCompanies?.loading}
                    onChange={handleChangeCompany}
                    getOptionLabel={option => option?.label || ''}
                    getOptionDisabled={option => option?.isDisabled}
                    isOptionEqualToValue={(option, current) => option?.value === current?.value}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label={'Empresas'}
                        placeholder="Seleccionar"
                        InputProps={{
                          ...params.InputProps
                        }}
                      />
                    )}
                  />
                </Stack>
              )}
            </>
          }
        />

        <Box component={MotionLazyContainer} sx={{ height: 1 }}>
          {!isOpenMovements && (
            <m.div variants={varFade().in}>
              <CardCloudDashboardMasterResume
                queryCardCloudSubAccountInfo={queryCardCloudSubAccountInfo}
                queryCardCloudCompanies={queryCardCloudCompanies}
              />
            </m.div>
          )}
          {isOpenMovements && (
            <m.div variants={varFade().in}>
              <CardCloudDashboardMovements />
            </m.div>
          )}
        </Box>
        <CardCloudMovementSupportTicketDrawer />
      </ContainerPage>
    </Page>
  )
}

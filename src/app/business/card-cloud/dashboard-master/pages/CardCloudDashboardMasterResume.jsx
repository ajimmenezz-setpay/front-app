import { lazy } from 'react'

import PropTypes from 'prop-types'

import { Grid } from '@mui/material'

import { Lodable } from '@/shared/components/lodables'

const CardCloudSubAccounts = Lodable(lazy(() => import('../components/CardCloudSubAccounts')))
const CardCloudLastMovements = Lodable(lazy(() => import('../components/movements/CardCloudLastMovements')))
const TransferSubAccountsCardCloudDrawer = Lodable(
  lazy(() => import('../../shared/components/TransferSubAccountsCardCloudDrawer'))
)

const CardCloudDashboardMasterResume = ({ queryCardCloudCompanies, queryCardCloudSubAccountInfo }) => {
  const movements = queryCardCloudSubAccountInfo?.data?.wallet?.lastMovements

  const isLoading = queryCardCloudCompanies.isLoading || queryCardCloudSubAccountInfo.isLoading

  const isEmptyCompanies = queryCardCloudCompanies?.data?.length === 0

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={5} xl={4}>
          <CardCloudSubAccounts
            queryCardCloudSubAccountInfo={queryCardCloudSubAccountInfo}
            isEmptyCompanies={isEmptyCompanies}
            isLoadingCompanies={!!queryCardCloudCompanies?.isLoading}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={7} xl={8}>
          <CardCloudLastMovements
            loading={isLoading}
            isFetching={!!queryCardCloudSubAccountInfo?.isFetching}
            movements={movements}
          />
        </Grid>
      </Grid>
      <TransferSubAccountsCardCloudDrawer />
    </>
  )
}

CardCloudDashboardMasterResume.propTypes = {
  queryCardCloudCompanies: PropTypes.shape({
    data: PropTypes.array,
    isLoading: PropTypes.any
  })
}

export default CardCloudDashboardMasterResume

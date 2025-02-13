import { redirect } from 'react-router-dom'

export const CardCloudRouter = {
  path: 'card-cloud',
  children: [
    { index: true, path: 'card-cloud', loader: async () => redirect('dashboard-master') },
    {
      path: 'dashboard-master',
      lazy: async () => {
        const { CardCloudDashboardMaster } = await import('../../dashboard-master/pages')
        return { Component: CardCloudDashboardMaster }
      }
    },
    {
      path: 'cards',
      lazy: async () => {
        const { CardsOfCardCloud } = await import('../../cards/pages/CardsOfCardCloud')
        return { Component: CardsOfCardCloud }
      }
    },
    {
      path: 'cards/:cardId',
      lazy: async () => {
        const { CompanyCardOfCardCloud } = await import('../../cards/pages/CompanyCardOfCardCloud')
        return { Component: CompanyCardOfCardCloud }
      }
    },
    {
      path: 'stock-cards',
      lazy: async () => {
        const { CardCloudStockCards } = await import('../../stock-cards/pages')
        return { Component: CardCloudStockCards }
      }
    },
    {
      path: 'user-cards',
      lazy: async () => {
        const { CardCloudUserCards } = await import('../../user-cards/pages')
        return { Component: CardCloudUserCards }
      }
    },
    {
      path: 'daily-report',
      lazy: async () => {
        const CardCloudDailyReport = await import('../../daily-report/pages/CardCloudDailyReport')
        return { Component: CardCloudDailyReport.default }
      }
    },
    {
      path: 'cards-report',
      lazy: async () => {
        const CardCloudCardsReport = await import('../../cards-report/pages/CardCloudCardsReport')
        return { Component: CardCloudCardsReport.default }
      }
    },
    {
      path: 'funding-report',
      lazy: async () => {
        const CardCloudFundingReport = await import('../../funding-report/pages/CardCloudFundingReport')
        return { Component: CardCloudFundingReport.default }
      }
    }
  ]
}

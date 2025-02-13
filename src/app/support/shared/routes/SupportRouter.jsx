import { SUPPORT_PATHS, SUPPORT_ROUTES_NAMES } from './support-paths'

export const SupportRouter = {
  path: SUPPORT_PATHS.root,
  lazy: async () => {
    const Support = await import('../../tickets-V2/pages/TicketsSupportV2')
    return { Component: Support.default }
  },
  children: [
    {
      path: SUPPORT_ROUTES_NAMES.incidences.route,
      lazy: async () => {
        const { SupportIncidences } = await import('../../ticket-support-list/pages/SupportIncidences')
        return { Component: SupportIncidences }
      }
    }
  ]
}

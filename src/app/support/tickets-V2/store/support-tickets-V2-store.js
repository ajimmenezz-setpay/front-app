import { createStore } from '@/app/shared/store'

const initialState = {
  selectedTicket: null,
  openTicketDetails: false
}
const supportTicketsStore = (set, get) => ({
  ...initialState,
  setOpenTicketDetails: open => {
    set(
      state => ({
        openTicketDetails: open
      }),
      false,
      'SUPPORT_V2:OPEN_TICKET_DETAILS'
    )
  },
  setSelectedTicket: ticket => {
    set(
      state => ({
        selectedTicket: ticket
      }),
      false,
      'SUPPORT_V2:SET_SELECTED_TICKET'
    )
  }
})

export const useSupportTicketsV2Store = createStore(supportTicketsStore)

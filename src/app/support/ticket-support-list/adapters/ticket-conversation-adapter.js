import { fToNowStrict } from '@/shared/utils'
import { getNameAvatar } from '@/theme/utils'

export const TicketConversationAdapter = (data, pageParam) => {
  const { total, page, limit } = data

  const participants =
    data?.participants?.map((participant, index) => {
      const { name, initials, photo } = participant
      return {
        id: index,
        name,
        initials,
        avatar: photo && photo !== '' ? photo : '/'
      }
    }) || []

  const messages =
    data?.messages?.map((message, index) => ({
      id: message?.id,
      name: message?.userName,
      initials: getNameAvatar(message?.userName || ''),
      message: message?.description,
      createDate: {
        fToNow: message?.createDate ? fToNowStrict(message?.createDate) : '',
        original: message?.createDate
      },
      my: !!message?.isUserSentMessage,
      attachment: message?.files || [],
      avatar: message?.photo && message?.photo !== '' ? message?.photo : '/',
      isSent: true
    })) || []

  return {
    results: {
      participants,
      messages
    },
    next: Number(total) > Number(page) * Number(limit) ? pageParam + 1 : undefined,
    canCloseTicket: !!data?.userCanCloseTicket
  }
}

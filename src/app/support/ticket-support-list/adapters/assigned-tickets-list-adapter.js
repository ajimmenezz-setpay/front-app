import { fDateTime } from '@/shared/utils'

export const AssignedTicketsListAdapter = tickets =>
  tickets?.map(ticket => ({
    id: ticket?.id,
    attendant: ticket?.assignedName,
    requester: ticket?.applicantName,
    description: ticket?.description,
    cause: {
      id: ticket?.supportReasonId,
      name: ticket?.supportReasonName
    },
    date: {
      original: ticket?.createDate,
      dateTime: ticket?.createDate ? fDateTime(ticket?.createDate) : ''
    },
    status: {
      id: ticket?.statusId,
      name: ticket?.statusName
    },
    createdBy: {
      id: ticket?.createdByUser
    }
  }))

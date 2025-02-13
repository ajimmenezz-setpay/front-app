const CATALOG_CARD_STATUS = [
  {
    id: 4,
    name: 'Sin Asignar',
    color: 'info'
  },
  {
    id: 5,
    name: 'Asignado',
    color: 'primary'
  }
]

const FUNDING_ORDER_STATUS = [
  {
    id: 6,
    name: 'PENDIENTE',
    color: 'warning'
  },
  {
    id: 7,
    name: 'PAGADA',
    color: 'primary'
  },
  {
    id: 8,
    name: 'CANCELADA',
    color: 'error'
  },
  {
    id: 9,
    name: 'LIQUIDADA',
    color: 'success'
  }
]

const getColorCardStatusById = id =>
  CATALOG_CARD_STATUS.find(status => status.id.toString() === id.toString())?.color || 'info'

const getColorFundingOrderStatusByName = name =>
  FUNDING_ORDER_STATUS.find(status => status.name === name?.toLowerCase()?.toUpperCase())?.color || 'info'

export { getColorCardStatusById, getColorFundingOrderStatusByName }

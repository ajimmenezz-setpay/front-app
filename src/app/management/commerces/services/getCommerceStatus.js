export const getColorStatusCommerce = name => {
  let colorText
  switch (name.toUpperCase()) {
    case 'REGISTRO':
      colorText = 'info'
      break
    case 'VALIDACION':
      colorText = 'warning'
      break
    case 'AFILIACION':
      colorText = 'primary'
      break
    case 'CONCLUIDO':
      colorText = 'success'
      break
    case 'CANCELADO':
      colorText = 'error'
      break
    default:
      colorText = 'secondary'
      break
  }
  return colorText
}

const CATALOG_STATUS_COMMERCE = [
  {
    id: 1,
    name: 'Registro',
    color: 'info'
  },
  {
    id: 2,
    name: 'Validacion',
    color: 'warning'
  },
  {
    id: 3,
    name: 'Afiliacion',
    color: 'primary'
  },
  {
    id: 4,
    name: 'Cancelado',
    color: 'error'
  }
]

export const getColorStatusCommerceById = id =>
  CATALOG_STATUS_COMMERCE.find(status => status.id.toString() === id.toString())?.color || 'info'

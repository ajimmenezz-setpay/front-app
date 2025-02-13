import { useState } from 'react'

import { read, utils, write, writeFile } from 'xlsx'

export const useFundingCardsExcel = initialCards => {
  const [cards, setCards] = useState(initialCards)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const columns = ['Tarjetahabiente', 'BIN Tarjeta', 'Monto']

  const downloadFundingCardsLayoutExcel = () => {
    const workbook = utils.book_new()

    const rows = cardsAdaptedToFile(cards)

    const worksheet = utils.aoa_to_sheet([columns, ...rows])

    utils.book_append_sheet(workbook, worksheet, 'Fondeo Tarjetas')

    const buf = write(workbook, { bookType: 'xlsx', type: 'buffer' })

    const currentDate = new Date()
    const formattedDate = currentDate
      .toLocaleString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      .replace(/,\s*/g, '_')

    const nameFile = `Fondeo_de_Tarjetas_${formattedDate}.xlsx`

    // Descargar el archivo
    writeFile(workbook, nameFile)
  }

  const uploadFundingCardsLayoutExcel = () => {
    setLoading(false)
    setError(null)
    setData(null)
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.csv, .xls, .xlsx'
    fileInput.webkitdirectory = false
    fileInput.onchange = ({ target: { files } }) => {
      try {
        setLoading(true)

        if (!validateFileSelection(files)) return
        if (!validateFileExtension(files[0])) return

        const reader = new FileReader()
        reader.readAsBinaryString(files[0])
        reader.onload = async ({ target: { result } }) => {
          const data = getDataFromFile(result)
          setLoading(false)
          setData(data)
          if (data?.length === 0) {
            setError({ message: 'No se encontró ningún registro para cargar.', severity: 'warning' })
          }
        }
      } catch (e) {
        console.log(e)
        setError({ message: 'Error al intentar leer el archivo.', severity: 'error' })
      }
    }
    fileInput.click()
  }

  const cardsAdaptedToFile = cards =>
    // Adaptar las tarjetas al formato deseado
    cards?.map(card => [card?.assignUser?.fullName, card?.binCard, 0.0])

  const validateFileSelection = files => {
    if (!files || files.length === 0) {
      setError({ message: 'No se seleccionó ningún archivo', severity: 'warning' })
      setLoading(false)
      return false
    }
    return true
  }

  const validateFileExtension = file => {
    if (!/(.csv|.xls|.xlsx)$/i.test(file.name)) {
      setError({ message: 'El archivo no es compatible con .csv, .xls o .xlsx', severity: 'warning' })
      setLoading(false)
      return false
    }
    return true
  }

  const getDataFromFile = file => {
    const workbook = read(file, { type: 'binary' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = utils.sheet_to_json(sheet, { header: 1 })
    const header = data[0]?.filter(headerValue => headerValue !== '' && headerValue !== null)

    if (validateColumns(header)) {
      if (data.slice(1).length === 0) {
        setError({ message: 'El layout esta vació', severity: 'warning' })
        return null
      }
      return validateRows(data)
    }

    return null
  }

  const validateColumns = header => {
    // Verificar que todas las columnas estén presentes en el archivo de Excel
    const missingColumns = columns.filter(column => !header.includes(column))

    if (missingColumns?.length > 0) {
      setError({ message: 'El archivo de excel no coincide con el layout', severity: 'error' })
      return null
    }

    // Verificar orden de las columnas correctamente
    const headerOrderMatches = columns.every((column, index) => header[index] === column)

    if (!headerOrderMatches) {
      setError({ message: 'El archivo de excel no coincide con el layout (orden incorrecto)', severity: 'error' })
      return null
    }

    return true
  }

  const validateRows = rows => {
    const updatedCards = [...cards]
    const crypto = window.crypto || window.msCrypto

    const array = new Uint32Array(1)

    const data = rows
      .slice(1)
      .filter(row => row.some(field => field?.toString().trim() !== ''))
      .map(row => {
        const binCard = row[1]
        const amount = row[2] ? parseFloat(row[2]) : null

        const fundingCard = updatedCards.find(card => card?.binCard === binCard?.toString())

        if (amount && !isNaN(amount) && amount > 0 && binCard && fundingCard) {
          fundingCard.isDisabled = true
          const random = crypto.getRandomValues(array)[0]

          return {
            id: random,
            card: { value: fundingCard.value, label: fundingCard.label, ...fundingCard },
            amount: amount.toString()
          }
        }

        return undefined
      })
      .filter(e => e !== undefined)

    setCards(updatedCards)

    return data
  }

  return { downloadFundingCardsLayoutExcel, uploadFundingCardsLayoutExcel, loading, error, data, cards }
}

import { useState } from 'react'

import { toast } from 'react-toastify'
import { utils, write, writeFile } from 'xlsx'

export const useCardsExcelFileOfCardCloud = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [file, setFile] = useState(null)

  const columns = ['Client ID', 'Tarjeta', 'Nombre', 'Apellidos', 'Teléfono', 'Correo Electrónico']
  const columnsErrors = ['Client ID', 'Tarjeta', 'Nombre', 'Apellidos', 'Teléfono', 'Correo Electrónico', 'Mensaje']

  const cardsAdaptedToFile = cards =>
    // Adaptar las tarjetas al formato deseado
    cards?.map(card => [card?.clientId, card?.number?.hidden, '', '', '', ''])

  const downloadLayout = cards => {
    try {
      setLoading(true)
      const workbook = utils.book_new()

      const rows = cardsAdaptedToFile(cards)

      const worksheet = utils.aoa_to_sheet([columns, ...rows])

      // Ajustar el ancho de las columnas para ocupar todo el ancho necesario
      const minimumWidth = 10 // Ancho mínimo para la columna "Monto"
      const columnWidths = columns.map((col, index) => ({
        wch: Math.max(minimumWidth, col.length, ...rows.map(row => (row[index] ? row[index].toString().length : 0)))
      }))
      worksheet['!cols'] = columnWidths

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

      const nameFile = `Plantilla_Asignar_Tarjetas_Disponibles_${formattedDate}.xlsx`

      // Descargar el archivo
      writeFile(workbook, nameFile)
      setError(null)
      setLoading(false)
    } catch (e) {
      const customError = {
        message: 'Por el momento no se puede descargar la plantilla. Intente nuevamente o reporte a sistemas',
        severity: 'error'
      }
      setLoading(false)
      setError(customError)
      toast.error(customError?.message, {
        type: customError?.severity
      })
    }
  }

  const validateFileSelection = files => {
    if (!files || files?.length === 0) {
      const customError = { message: 'No se seleccionó ningún archivo', severity: 'warning' }
      toast.error(customError?.message, {
        type: customError?.severity
      })
      setError(customError)
      setLoading(false)
      return false
    }
    return true
  }

  const validateFileExtension = file => {
    if (!/(.xls|.xlsx)$/i.test(file.name)) {
      const customError = {
        message: 'El archivo no es compatible con archivos Excel (.xls o .xlsx)',
        severity: 'warning'
      }
      toast.error(customError?.message, {
        type: customError?.severity
      })
      setError(customError)
      setLoading(false)
      return false
    }
    return true
  }

  const uploadLayout = () => {
    setLoading(false)
    setError(null)
    setFile(null)
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.xls, .xlsx'
    fileInput.webkitdirectory = false
    fileInput.onchange = ({ target: { files } }) => {
      try {
        setLoading(true)

        if (!validateFileSelection(files)) return
        if (!validateFileExtension(files[0])) return

        setLoading(false)
        setFile(files?.[0])
      } catch (e) {
        const customError = { message: 'Error al intentar leer el archivo.', severity: 'error' }
        toast.error(customError?.message, {
          type: customError?.severity
        })
        setError(customError)
      }
    }
    fileInput.click()
  }

  const downloadErrorLayout = cards => {
    try {
      setLoading(true)
      const workbook = utils.book_new()

      const rows = cards?.map(card => [
        card?.clientId,
        card?.bin,
        card?.name,
        card?.lastname,
        card?.phone,
        card?.email,
        card?.message
      ])

      const worksheet = utils.aoa_to_sheet([columnsErrors, ...rows])

      // Ajustar el ancho de las columnas para ocupar todo el ancho necesario
      const minimumWidth = 10 // Ancho mínimo para la columna "Monto"
      const columnWidths = columnsErrors.map((col, index) => ({
        wch: Math.max(minimumWidth, col.length, ...rows.map(row => (row[index] ? row[index].toString().length : 0)))
      }))
      worksheet['!cols'] = columnWidths

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

      const nameFile = `Errores_Asignar_Tarjetas_${formattedDate}.xlsx`

      // Descargar el archivo
      writeFile(workbook, nameFile)
      setError(null)
      setLoading(false)
    } catch (e) {
      const customError = {
        message:
          'Por el momento no se puede descargar la plantilla de errores. Intente nuevamente o reporte a sistemas',
        severity: 'error'
      }
      setLoading(false)
      setError(customError)
      toast.error(customError?.message, {
        type: customError?.severity
      })
    }
  }

  return {
    downloadLayout,
    uploadLayout,
    downloadErrorLayout,
    loading,
    error,
    file,
    setFile
  }
}

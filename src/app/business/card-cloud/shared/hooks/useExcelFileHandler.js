import { useState } from 'react'

import { toast } from 'react-toastify'
import { utils, writeFile } from 'xlsx'

export const useExcelFileHandler = (columns, rowsGenerator) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [file, setFile] = useState(null)

  const downloadExcelFile = fileNamePrefix => {
    try {
      setLoading(true)

      const workbook = utils.book_new()
      const rows = rowsGenerator()

      const worksheet = utils.aoa_to_sheet([columns, ...rows])

      // Aplicar formato a la columna "Monto"
      const range = utils.decode_range(worksheet['!ref'])
      for (let row = range.s.r + 1; row <= range.e.r; ++row) {
        const cellRef = utils.encode_cell({ r: row, c: 3 })
        const cell = worksheet[cellRef]

        if (!cell || isNaN(cell.v)) {
          worksheet[cellRef] = { t: 'n', v: 0.0 }
        }

        worksheet[cellRef].z = '0.00'
      }

      // Ajustar el ancho de las columnas
      const columnWidths = columns.map((col, index) => ({
        wch: Math.max(10, col.length, ...rows.map(row => (row[index] ? row[index].toString().length : 0)))
      }))
      worksheet['!cols'] = columnWidths

      utils.book_append_sheet(workbook, worksheet, 'Datos')

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

      const fileName = `${fileNamePrefix}_${formattedDate}.xlsx`
      writeFile(workbook, fileName)

      setError(null)
      setLoading(false)
    } catch (e) {
      const customError = {
        message: 'Error al descargar el archivo. Intente nuevamente.',
        severity: 'error'
      }
      setLoading(false)
      setError(customError)
      toast.error(customError.message)
    }
  }

  const uploadExcelFile = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.xls, .xlsx'
    fileInput.onchange = ({ target: { files } }) => {
      try {
        setLoading(true)

        if (!files || files.length === 0) {
          throw new Error('No se seleccionó ningún archivo.')
        }

        const selectedFile = files[0]
        if (!/(.xls|.xlsx)$/i.test(selectedFile.name)) {
          throw new Error('El archivo no es compatible (solo .xls o .xlsx).')
        }

        setFile(selectedFile)
        setError(null)
      } catch (e) {
        const customError = { message: e.message, severity: 'warning' }
        toast.error(customError.message)
        setError(customError)
      } finally {
        setLoading(false)
      }
    }

    fileInput.click()
  }

  return {
    downloadExcelFile,
    uploadExcelFile,
    loading,
    error,
    file,
    setFile
  }
}

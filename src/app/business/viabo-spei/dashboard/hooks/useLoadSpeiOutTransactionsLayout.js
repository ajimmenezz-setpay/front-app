import { useEffect, useState } from 'react'

import { toast } from 'react-toastify'
import { read, utils, write, writeFile } from 'xlsx'

export const useLoadSpeiOutTransactionsLayout = () => {
  const [updatedAccounts, setUpdatedAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const columns = ['Beneficiario', 'Cuenta', 'Monto']

  const downloadTransactionsLayout = isCompanies => {
    const workbook = utils.book_new()

    const rows = transactionsAdaptedToFile(updatedAccounts)

    const worksheet = utils.aoa_to_sheet([columns, ...rows])

    utils.book_append_sheet(workbook, worksheet, 'Transacciones Spei Out')

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

    const nameFile = isCompanies
      ? `Transacciones_Spei_Out_Empresas_${formattedDate}.xlsx`
      : `Transacciones_Spei_Out_${formattedDate}.xlsx`

    // Descargar el archivo
    writeFile(workbook, nameFile)
  }

  const uploadTransactionsLayout = () => {
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

  const transactionsAdaptedToFile = accounts => accounts?.map(account => [account?.name, account?.clabe, 0.0])

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
    const crypto = window.crypto || window.msCrypto

    const array = new Uint32Array(1)

    const data = rows
      .slice(1)
      .filter(row => row.some(field => field?.toString().trim() !== ''))
      .map(row => {
        const clabe = row[1]
        const amount = row[2] ? parseFloat(row[2]) : null

        const account = updatedAccounts.find(account => account?.clabe === clabe?.toString() && !account?.isDisabled)

        if (amount && !isNaN(amount) && amount > 0 && clabe && account) {
          account.isDisabled = true
          const random = crypto.getRandomValues(array)[0]
          const amountFormat = new Intl.NumberFormat('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount)

          return {
            id: random,
            account,
            amount: amountFormat
          }
        }

        return undefined
      })
      .filter(e => e !== undefined)

    setUpdatedAccounts(updatedAccounts)

    return data
  }

  useEffect(() => {
    if (error) {
      toast.warning(error?.message, {
        type: error?.severity || 'error'
      })
    }
  }, [error])

  return {
    downloadTransactionsLayout,
    uploadTransactionsLayout,
    loading,
    error,
    data,
    setData,
    accounts: updatedAccounts,
    setAccounts: setUpdatedAccounts
  }
}

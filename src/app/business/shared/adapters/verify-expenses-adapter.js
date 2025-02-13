export const VerifyExpensesAdapter = (data, movements) => {
  const { files, note, method, singleFile } = data

  const isInvoice = method === 'invoice'
  const formData = new FormData()

  if (isInvoice) {
    files?.forEach(file => {
      formData.append('files[]', file)
    })
  }

  if (!isInvoice && singleFile) {
    formData.append('files[]', singleFile)
  }

  const movementsAdapted =
    movements?.map(movement => ({
      ...movement?.original
    })) || []

  formData.append('movements', JSON.stringify(movementsAdapted))
  formData.append('note', note)
  formData.append('isInvoice', isInvoice)

  return formData
}

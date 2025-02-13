export const CommerceUploadDocumentsAdapter = (documents, commerceId, fiscalPersonType) => {
  let documentsAdapted = documents
  if (fiscalPersonType === '2') {
    documentsAdapted = {
      ...documents,
      ACTA_CONSTITUTIVA: null,
      DOCUMENTO_PODER: null,
      CEDULA_FISCAL_EMPRESA: null
    }
  }
  const formUpload = new FormData()
  const formUploadToDelete = new FormData()
  for (const [key, value] of Object.entries(documentsAdapted)) {
    if (value !== null) {
      formUpload.append(key, value)
    } else {
      const contenido = ''
      const archivo = new File([contenido], `${key}.txt`, {
        type: 'text/plain'
      })
      formUploadToDelete.append(key, archivo)
    }
  }
  formUpload.append('commerceId', commerceId)
  formUploadToDelete.append('commerceId', commerceId)
  return { uploadDocumentsForm: formUpload, deleteDocumentsForm: formUploadToDelete }
}

function isHTML(str) {
  const doc = new DOMParser().parseFromString(str, 'text/html')
  return Array.from(doc.body.childNodes).some(node => node.nodeType === 1)
}

const MIME_TYPES = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  png: 'image/png',
  json: 'application/json',
  html: 'text/html'
  // Agrega más tipos MIME según sea necesario
}

async function downloadFile(dataURL, filename, expectedMimeType, newTab = false) {
  const response = await fetch(dataURL)

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`)
  }

  const contentType = response.headers.get('Content-Type')

  if (contentType !== expectedMimeType) {
    throw new Error(`Unexpected file type. Expected ${expectedMimeType}, but received ${contentType}.`)
  }

  const blob = await response.blob()

  if (newTab) {
    const fileURL = URL.createObjectURL(blob)
    window.open(fileURL, '_blank')
    URL.revokeObjectURL(fileURL)
  } else {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    // Cleanup URL object
    URL.revokeObjectURL(link.href)
  }
}

async function generateResponseFile(response, expectedMimeType, filename, newTab = false, fetch = true) {
  const contentType = response.headers.get('Content-Type')

  if (contentType !== expectedMimeType) {
    throw new Error(`Unexpected file type. Expected ${expectedMimeType}, but received ${contentType}.`)
  }

  const blob = fetch ? await response.blob() : response?.data

  if (newTab) {
    const fileURL = URL.createObjectURL(blob)
    window.open(fileURL, '_blank')
    URL.revokeObjectURL(fileURL)
  } else {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    // Cleanup URL object
    URL.revokeObjectURL(link.href)
  }
}

const copyToClipboard = text => {
  if (isMobile) {
    // Crea un elemento de texto temporal
    const tempTextArea = document.createElement('textarea')
    tempTextArea.value = text
    document.body.appendChild(tempTextArea)

    // Selecciona el texto en el elemento de texto
    tempTextArea.select()

    try {
      // Copia el texto al portapapeles
      document.execCommand('copy')
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err)
    } finally {
      // Elimina el elemento de texto temporal
      document.body.removeChild(tempTextArea)
    }
  } else {
    navigator.clipboard
      .writeText(text)
      .then(() => {})
      .catch(err => {
        console.error('Error al copiar al portapapeles:', err)
      })
  }
}

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

export { MIME_TYPES, copyToClipboard, downloadFile, generateResponseFile, isHTML, isMobile }

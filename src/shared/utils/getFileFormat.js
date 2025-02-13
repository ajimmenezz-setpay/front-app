const FORMAT_IMG = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'webp']
const FORMAT_VIDEO = ['m4v', 'avi', 'mpg', 'mp4', 'webm']
const FORMAT_WORD = ['doc', 'docx']
const FORMAT_EXCEL = ['xls', 'xlsx']
const FORMAT_POWERPOINT = ['ppt', 'pptx']
const FORMAT_PDF = ['pdf']
const FORMAT_PHOTOSHOP = ['psd']
const FORMAT_ILLUSTRATOR = ['ai', 'esp']

const isImage = url => /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url)

export function getFileType(fileUrl = '') {
  return (fileUrl && fileUrl.split('.').pop()) || ''
}

export function getFileName(fileUrl) {
  return fileUrl.substring(fileUrl.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, '')
}

export function getFileFullName(fileUrl) {
  return fileUrl.split('/').pop()
}

export function getFileFormat(fileUrl) {
  let format
  const fileType = getFileType(fileUrl)

  switch (fileUrl.includes(fileType)) {
    case FORMAT_IMG.includes(fileType):
      format = 'image'
      break
    case FORMAT_VIDEO.includes(fileType):
      format = 'video'
      break
    case FORMAT_WORD.includes(fileType):
      format = 'word'
      break
    case FORMAT_EXCEL.includes(fileType):
      format = 'excel'
      break
    case FORMAT_POWERPOINT.includes(fileType):
      format = 'powerpoint'
      break
    case FORMAT_PDF.includes(fileType):
      format = 'pdf'
      break
    case FORMAT_PHOTOSHOP.includes(fileType):
      format = 'photoshop'
      break
    case FORMAT_ILLUSTRATOR.includes(fileType):
      format = 'illustrator'
      break
    default:
      format = fileType
  }

  return format
}

const getURLIcon = name => `https://minimal-assets-api.vercel.app/assets/icons/file/${name}.svg`

export function getFileURL(file, isUrl = true) {
  let thumb
  switch (getFileFormat(isUrl ? file : file?.name)) {
    case 'video':
      thumb = getURLIcon('format_video')
      break
    case 'word':
      thumb = getURLIcon('format_word')
      break
    case 'excel':
      thumb = getURLIcon('format_excel')
      break
    case 'powerpoint':
      thumb = getURLIcon('format_powerpoint')
      break
    case 'pdf':
      thumb = getURLIcon('format_pdf')
      break
    case 'photoshop':
      thumb = getURLIcon('format_photoshop')
      break
    case 'illustrator':
      thumb = getURLIcon('format_ai')
      break
    case 'image':
      thumb = 'image'
      break
    default:
      thumb = null
  }
  return thumb
}

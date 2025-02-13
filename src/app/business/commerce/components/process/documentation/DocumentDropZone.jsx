import { UploadSingleFile } from '@/shared/components/upload'

const DocumentDropzone = ({ name, accept, setFieldValue, file }) => {
  const handleDrop = acceptedFiles => {
    const file = acceptedFiles[0]

    if (file) {
      setFieldValue(
        name,
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    }
  }

  const handleRemove = () => {
    setFieldValue(name, null)
  }

  return (
    <>
      <UploadSingleFile
        file={file}
        accept={accept}
        onDrop={handleDrop}
        onRemove={handleRemove}
        maxSize={3145728}
        height={40}
      />
    </>
  )
}

export default DocumentDropzone

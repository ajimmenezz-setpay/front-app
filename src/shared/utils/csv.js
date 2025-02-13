import { download, generateCsv, mkConfig } from 'export-to-csv'

const generateCSVFile = (columns, data, fileName = 'archivo') => {
  const fileNameFormatted = `${fileName}_${new Date().toISOString()}`

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    title: fileName,
    filename: fileNameFormatted,
    columnHeaders: columns
  })

  const csv = generateCsv(csvConfig)(data)
  return download(csvConfig)(csv)
}

export { generateCSVFile }

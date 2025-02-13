import { hexToRgb, useTheme } from '@mui/material'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import { generateCSVFile } from '../utils'

import { rgbStringToArray } from '@/theme/utils'

export const useExportMaterialTable = (table, columns) => {
  const theme = useTheme()

  const exportToCSV = fileName => {
    const filterData =
      table.getSortedRowModel().rows.map(row => {
        const obj = {}
        columns?.forEach(c => {
          obj[c.header] = row.getValue(c.accessorKey)
        })
        return obj
      }) ?? []
    generateCSVFile(columns?.map(c => c.header) || [], filterData, fileName)
  }

  const exportToPDF = (fileName = 'archivo', pdfConfig) => {
    const base64Img = null

    const totalPagesExp = '{total_pages_count_string}'
    const fileNameAdapted = `${fileName}_${new Date().toISOString()}`
    // eslint-disable-next-line new-cap
    const doc = new jsPDF(pdfConfig)
    const tableData =
      table.getSortedRowModel().rows.map(row => columns?.map(c => row.getValue(c.accessorKey)) || []) ?? []
    const tableHeaders = columns.map(c => c.header)

    const stringColor = hexToRgb(
      theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.secondary.main
    )
    const color = rgbStringToArray(stringColor)

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      rowPageBreak: 'auto',
      bodyStyles: { valign: 'top' },
      headStyles: {
        fillColor: color
      },
      columnStyles: pdfConfig?.columnStyles || {},
      willDrawPage: function (data) {
        // Header
        // doc.setFontSize(20)
        // doc.setTextColor(40)
        // doc.text('Report', data.settings.margin.left + 15, 22)
      },
      didDrawPage: function (data) {
        // Footer
        let str = 'Página ' + doc.internal.getNumberOfPages()
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
          str = str + ' de ' + totalPagesExp
        }
        doc.setFontSize(10)

        // jsPDF 1.4+ uses getHeight, <1.4 uses .height
        const { pageSize } = doc.internal
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
        doc.text(str, data.settings.margin.left, pageHeight - 10)
      }
    })

    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp)
    }

    doc.save(`${fileNameAdapted}.pdf`)
  }

  return { exportToCSV, exportToPDF }
}

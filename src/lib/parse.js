// Parse an .xlsx ArrayBuffer into plain array-of-arrays rows per sheet.
import * as XLSX from 'xlsx'

export function parseWorkbook(arrayBuffer, fileName = '') {
  const wb = XLSX.read(arrayBuffer, { type: 'array', cellDates: true })
  const sheets = wb.SheetNames.map((name) => {
    const ws = wb.Sheets[name]
    const rows = XLSX.utils.sheet_to_json(ws, {
      header: 1,
      raw: true,
      blankrows: true,
      defval: null,
    })
    return { name, rows }
  })
  return { fileName, sheets }
}

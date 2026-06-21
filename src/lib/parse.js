// Parse an .xlsx ArrayBuffer into plain array-of-arrays rows per sheet.
import * as XLSX from 'xlsx'

export function parseWorkbook(arrayBuffer, fileName = '', modifiedTime = null) {
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
  // `modifiedTime` (the Drive file's last-modified ISO string) flows through to
  // each holding as `asOf` — the sheet's snapshot date, used to derive live MF
  // units from the stale "Current value" (see classify.js / navs.js).
  return { fileName, modifiedTime, sheets }
}

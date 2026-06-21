// Fetch INDmoney report files from a public Google Drive folder using the
// Drive API v3 with an API key. Works from the browser (no backend) as long as
// the folder + files are shared "Anyone with the link – Viewer".
import { DRIVE } from '../config.js'
import { parseWorkbook } from './parse.js'

const API = 'https://www.googleapis.com/drive/v3'
const GSHEET_MIME = 'application/vnd.google-apps.spreadsheet'
const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const HTML_MIME = 'text/html'

const isGoogleSheet = (f) => f.mimeType === GSHEET_MIME
const isHtml = (f) => f.mimeType === HTML_MIME
const isSpreadsheet = (f) => isGoogleSheet(f) || /\.(xlsx|xls)$/i.test(f.name)

// List the relevant files inside the configured folder, newest first. Includes
// uploaded .xlsx/.xls files, native Google Sheets (which have no extension), and
// any uploaded .html report (detected by mimeType, since it may have no extension).
export async function listFolder() {
  const q = `'${DRIVE.folderId}' in parents and trashed=false`
  const params = new URLSearchParams({
    q,
    key: DRIVE.apiKey,
    fields: 'files(id,name,modifiedTime,mimeType)',
    orderBy: 'modifiedTime desc',
    pageSize: '100',
  })
  const res = await fetch(`${API}/files?${params}`)
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Drive list failed (${res.status}). ${detail.slice(0, 200)}`)
  }
  const data = await res.json()
  return (data.files || []).filter((f) => isSpreadsheet(f) || isHtml(f))
}

async function downloadFile(file) {
  // Native Google Sheets can't be fetched with alt=media — they must be exported.
  const url = isGoogleSheet(file)
    ? `${API}/files/${file.id}/export?${new URLSearchParams({ mimeType: XLSX_MIME, key: DRIVE.apiKey })}`
    : `${API}/files/${file.id}?${new URLSearchParams({ alt: 'media', key: DRIVE.apiKey })}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed for ${file.name} (${res.status})`)
  const buf = await res.arrayBuffer()
  return parseWorkbook(buf, file.name, file.modifiedTime)
}

// Download a public file's raw text (used for the .html analysis report).
async function downloadText(file) {
  const url = `${API}/files/${file.id}?${new URLSearchParams({ alt: 'media', key: DRIVE.apiKey })}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed for ${file.name} (${res.status})`)
  return res.text()
}

// Fetch + parse every report file in the Drive folder. The newest .html file (if
// any) is fetched as raw text and returned as `analysisHtml` for the Analysis tab.
export async function fetchDriveWorkbooks() {
  const files = await listFolder()
  if (files.length === 0) throw new Error('No report files found in the Drive folder.')
  const sheets = files.filter(isSpreadsheet)
  const htmlFile = files.find(isHtml) // listFolder is newest-first
  const parsed = await Promise.all(sheets.map(downloadFile))
  const analysisHtml = htmlFile ? await downloadText(htmlFile) : null
  return { parsed, files, analysisHtml }
}

import { processSheetRows } from '../utils/dataProcessor'

export async function getPeopleFromSheet(accessToken) {
  const spreadsheetId = import.meta.env.VITE_SPREADSHEET_ID
  const sheetName = import.meta.env.VITE_SHEET_NAME
  if (!spreadsheetId || !sheetName) throw new Error('Spreadsheet configuration is incomplete.')
  const range = `${sheetName}!A1:F201`
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`, { headers: { Authorization: `Bearer ${accessToken}` } })
  if (!response.ok) { const detail = await response.json().catch(() => ({})); throw new Error(detail.error?.message || 'Google Sheets could not be read.') }
  const { values } = await response.json()
  return processSheetRows(values)
}

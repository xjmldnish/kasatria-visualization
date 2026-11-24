const requiredHeaders = ['Name', 'Photo', 'Age', 'Country', 'Interest', 'Net Worth']

function parseNetWorth(value) {
  const parsed = Number(String(value).replace(/[$,]/g, ''))
  if (!Number.isFinite(parsed)) throw new Error(`Invalid net-worth value: ${value}`)
  return parsed
}

export function processSheetRows(rows) {
  if (!Array.isArray(rows) || rows.length < 2) throw new Error('The People sheet has no data rows.')
  const headers = rows[0].map((header) => String(header).trim())
  const missing = requiredHeaders.filter((header) => !headers.includes(header))
  if (missing.length) throw new Error(`Missing required column(s): ${missing.join(', ')}`)
  const index = Object.fromEntries(headers.map((header, position) => [header, position]))
  const people = rows.slice(1).map((row, rowIndex) => {
    const name = row[index.Name]?.trim()
    const age = Number(row[index.Age])
    if (!name || !Number.isInteger(age)) throw new Error(`Invalid data in spreadsheet row ${rowIndex + 2}.`)
    return { id: rowIndex + 1, name, photo: row[index.Photo]?.trim(), age, country: row[index.Country]?.trim(), interest: row[index.Interest]?.trim(), netWorth: parseNetWorth(row[index['Net Worth']]) }
  })
  if (people.length !== 200) throw new Error(`Expected 200 people, but received ${people.length}.`)
  return people
}

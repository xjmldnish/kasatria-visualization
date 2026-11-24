import { useState } from 'react'
import { requestSheetsAccessToken } from './services/googleAuth'
import { getPeopleFromSheet } from './services/googleSheets'
import TableVisualization from './components/TableVisualization'
import './App.css'

function App() {
  const [people, setPeople] = useState([])
  const [status, setStatus] = useState('Connect your Google account to load the People sheet.')
  const [isLoading, setIsLoading] = useState(false)
  async function handleGoogleConnect() {
    setIsLoading(true); setStatus('Waiting for Google authorization…')
    try { const token = await requestSheetsAccessToken(); setStatus('Reading and validating the People sheet…'); const loaded = await getPeopleFromSheet(token); setPeople(loaded); setStatus(`Connected successfully. ${loaded.length} people are ready for visualization.`) }
    catch (error) { setPeople([]); setStatus(error instanceof Error ? error.message : 'Google connection failed.') }
    finally { setIsLoading(false) }
  }
  return <main><section className="intro"><p className="eyebrow">Kasatria assignment</p><h1>People visualization</h1><p className="lead">Authorize Google access to load the 200 people from your shared spreadsheet.</p><button type="button" onClick={handleGoogleConnect} disabled={isLoading}>{isLoading ? 'Connecting…' : 'Continue with Google'}</button><p className="status" role="status">{status}</p></section>{people.length > 0 && <TableVisualization people={people} />}</main>
}
export default App

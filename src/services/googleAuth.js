const GOOGLE_IDENTITY_SCRIPT = 'https://accounts.google.com/gsi/client'
const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly'

function loadGoogleIdentityServices() {
  if (window.google?.accounts?.oauth2) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GOOGLE_IDENTITY_SCRIPT}"]`)
    if (existing) { existing.addEventListener('load', resolve, { once: true }); existing.addEventListener('error', () => reject(new Error('Google Identity Services could not load.')), { once: true }); return }
    const script = document.createElement('script')
    script.src = GOOGLE_IDENTITY_SCRIPT; script.async = true; script.defer = true
    script.onload = resolve; script.onerror = () => reject(new Error('Google Identity Services could not load.'))
    document.head.appendChild(script)
  })
}

export async function requestSheetsAccessToken() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId) throw new Error('VITE_GOOGLE_CLIENT_ID is not configured.')
  await loadGoogleIdentityServices()
  return new Promise((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({ client_id: clientId, scope: `${SHEETS_SCOPE} openid email profile`, callback: (response) => response.error ? reject(new Error(response.error_description || response.error)) : resolve(response.access_token) })
    client.requestAccessToken({ prompt: '' })
  })
}

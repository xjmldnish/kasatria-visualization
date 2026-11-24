# Kasatria People Visualization

## Current milestone

Google authorization, read-only Sheets access, schema validation, and a 200-person preview are implemented. Three.js layouts come next.

## Run locally

Run `npm run dev`, open `http://localhost:5173`, then select **Continue with Google**. Use the Google account added as a test user in Google Cloud.

## Configuration

`.env.local` holds the OAuth Client ID, spreadsheet ID, and `People` tab name. It is Git-ignored. Do not put a client secret in this browser application.

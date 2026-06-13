// App configuration. Drive credentials come from Vite env vars (see .env.example).
export const DRIVE = {
  folderId: import.meta.env.VITE_GDRIVE_FOLDER_ID || '',
  apiKey: import.meta.env.VITE_GDRIVE_API_KEY || '',
}

export const driveConfigured = () => Boolean(DRIVE.folderId && DRIVE.apiKey)

// Asset class labels + display order used across the UI.
export const ASSET_TYPES = {
  stock: { key: 'stock', label: 'Stocks' },
  etf: { key: 'etf', label: 'ETFs' },
  mf: { key: 'mf', label: 'Mutual Funds' },
}

export const ASSET_COLORS = {
  stock: '#5b8cff',
  etf: '#22c7a9',
  mf: '#b07cff',
}

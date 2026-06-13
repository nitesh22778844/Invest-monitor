# Invest Monitor

Personal portfolio dashboard that tracks INDmoney holdings & transactions
(stocks, mutual funds, ETFs) so daily trades can be verified and reconciled.

## Stack
- Vite + React 19 (JS, no TypeScript)
- Plain modern CSS (CSS variables, dark theme) — no Tailwind
- SheetJS (`xlsx`) for in-browser .xlsx parsing
- Hand-rolled SVG/CSS charts (no chart library)
- No backend; data is fetched client-side from Google Drive

## Data source
INDmoney `.xlsx` reports are uploaded to a **Google Drive folder** (shared
"Anyone with the link – Viewer"). The app lists the folder and downloads files
via the **Drive API v3 with an API key** (CORS-friendly for public files), then
parses them in the browser. A drag-and-drop fallback (`FileDropzone`) accepts
the same files locally and runs the identical pipeline — so the app works before
Drive is configured and during dev.

Config (`.env`, see `.env.example`):
- `VITE_GDRIVE_FOLDER_ID` — the shared Drive folder ID
- `VITE_GDRIVE_API_KEY` — API key restricted to the Drive API

The data source is **4 native Google Sheets** in the Drive folder, each a
copy-paste of an INDmoney web page. They are auto-detected by **content/structure**
(not filename) in `classify.js`; each parser returns `null` if its shape isn't
present. Native Google Sheets are fetched via the Drive **export** endpoint (not
`alt=media`) — see `drive.js`. (The old `.xlsx` parsers remain as harmless
fallbacks.)

1. **My Stocks** — current stocks **+ ETFs** portfolio. A real table, header
   `Stock Name | Market Price | Invested (Qty/Price) | Current value | Total PnL`.
   `parseMyStocks` splits `Name\nSYMBOL` and the `₹invested / "N Qty" / "₹avg Avg."`
   cell; P&L = current − invested (the sheet's Total PnL cell is often `#ERROR!`).
   → holdings with real **current value + P&L**.
2. **My MFs** — current MF portfolio. Concatenated rows under a `Gain/ Loss`
   marker: `<Fund>Invested₹<v>Current Value₹<v>Gain/ Loss₹<v>▲/▼<pct>%`. Values
   are **compact** (`₹4.14L`, `₹-3.04K`). `parseMyMfs`. No units/folio available.
3. **Stocks Transactions** — stock/ETF orders. Grouped under ordinal date headers
   (`8th Jun'26`, `30th Sept'25`); rows have `N Qty` (col 1) and `Buy/Sell Executed`
   (col 4). `parseStockTransactions` → equity `transactions` (carry `type`).
4. **MF Transactions** — `Buy/Sell` marker + `<Fund>Buy SuccessfulOrder Date<DD Mon
   YYYY>Units<u> (Nav <n>)Amount₹<amt>`. `parseMfTransactions` → `mfTransactions`
   (amount = units×nav). Feeds the **Monthly** tab.

`resources/others/` is intentionally ignored.

## Asset classification (Stock vs ETF)
No ISIN in these sheets — classify by name/symbol keywords (`classifyEquity` in
classify.js): ETF if it contains any of `etf, nasdaq, nifty, bees, sensex, next50,
setf, mon100, n100, beta`, else stock. MF rows are always `mf`.

## Key rules
- Use only values present in the sheets. Do NOT fetch live market prices.
- All holdings now have current value + P&L (Stocks/ETFs from My Stocks, MF from
  My MFs) — show real P&L; don't fabricate.
- Holdings and orders name the same scrip differently and have no ISIN, so
  `reconcile.js` joins them with a fuzzy first-two-significant-tokens `nameKey`.
- A hardcoded ₹10k/month Edelweiss Mid Cap SIP is injected into the Monthly MF
  calc (`RECURRING_SIPS` in `monthly.js`) — it's absent from the MF Buy/Sell sheet
  (lives under INDmoney's SIP tab); a same-day guard prevents double counting.

## Project layout
- `src/config.js` — Drive env config, asset-type labels & colors
- `src/lib/` — `drive` (fetch), `parse` (SheetJS → rows), `classify` (detect +
  normalize → `{holdings, transactions, meta}`), `portfolio` (totals/allocation),
  `reconcile` (txns vs holdings), `format` (INR/number/date helpers)
- `src/components/` — `Dashboard` (loads data, owns tabs) + `AppBar`,
  `SummaryCard`, `AllocationDonut`, `HoldingsTable` (generic sortable),
  `AssetTab` (generic Stocks/ETFs/MF), `ConsolidatedTab`, `TransactionsTab`,
  `ReconcilePanel`, `FileDropzone`, `StateViews`
- `resources/` — sample INDmoney exports for local dev/testing

## Normalized shapes
- holding: `{ name, isin, type:'stock'|'etf'|'mf', qty, avgPrice, invested,
  current|null, pnl|null, pnlPct|null, folio|null, source }`
- transaction: `{ date:Date, name, symbol, isin, side:'BUY'|'SELL', qty, price,
  status }`

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — eslint

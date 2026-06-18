// Renders the self-contained "Portfolio Analysis" HTML report fetched from Drive.
// The report carries its own <style> + scripts (Chart.js, Google Fonts), so it's
// embedded in a sandboxed iframe: allow-scripts runs its charts, and the lack of
// allow-same-origin keeps its global CSS isolated from the app.
//
// We inject a small block before </head> so it looks good on phones:
//  - a responsive <style> that fixes the bits the report's own @media misses
//    (an inline 3-col grid, and wide tables that overflow);
//  - a <script> that posts the document height to the parent, so the iframe can
//    auto-size to its content (one natural page scroll instead of a nested one).
import { useEffect, useState } from 'react'
import { EmptyState } from './StateViews.jsx'

const INJECT = `
<style>
  body{min-height:0}
  @media (max-width:768px){
    .container{padding:0 14px !important}
    [style*="1fr 1fr 1fr"]{grid-template-columns:1fr !important}
    .card{overflow-x:auto}
    .fund-table,.action-table{min-width:540px}
  }
</style>
<script>
  (function(){
    function post(){parent.postMessage({__analysisHeight:document.documentElement.scrollHeight},'*')}
    function init(){
      post()
      window.addEventListener('resize',post)
      if(window.ResizeObserver) new ResizeObserver(post).observe(document.body)
      setTimeout(post,400);setTimeout(post,1500);setTimeout(post,3000)
    }
    if(document.readyState!=='loading') init()
    else window.addEventListener('DOMContentLoaded',init)
    window.addEventListener('load',post)
  })()
</script>
`

function withMobileTweaks(html) {
  return html.includes('</head>') ? html.replace('</head>', `${INJECT}</head>`) : INJECT + html
}

export default function AnalysisTab({ html }) {
  // Auto-size the iframe to its content height (reported via postMessage) so the
  // whole page scrolls naturally — no cramped nested scroll area on mobile.
  const [height, setHeight] = useState(900)

  useEffect(() => {
    function onMessage(e) {
      const h = e.data && e.data.__analysisHeight
      if (typeof h === 'number' && h > 0) setHeight(h)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  if (!html) {
    return (
      <EmptyState title="No analysis yet">
        Upload a “Portfolio Analysis.html” report to the Drive folder, then Refresh data.
      </EmptyState>
    )
  }

  return (
    <iframe
      className="analysis-frame"
      title="Portfolio Analysis"
      srcDoc={withMobileTweaks(html)}
      sandbox="allow-scripts"
      scrolling="no"
      style={{ height }}
    />
  )
}

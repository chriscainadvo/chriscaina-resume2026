import { gsap } from 'gsap'

// AI tool tiles — the stack Chris uses
const TOOLS = [
  { name: 'Claude',     text: 'Cl',  tint: '218 119 86' },
  { name: 'ChatGPT',    text: 'GPT', tint: '16 163 127' },
  { name: 'Notion',     text: 'N',   tint: '245 241 232' },
  { name: 'Apollo',     text: 'Apl', tint: '124 58 237' },
  { name: 'Vercel',     text: '▲',   tint: '245 241 232' },
  { name: 'Gmail',      text: 'G',   tint: '234 67 53' },
  { name: 'Zapier',     text: 'Z',   tint: '255 79 0' },
  { name: 'Make',       text: 'mk',  tint: '124 58 237' },
  { name: 'Slack',      text: 'Sl',  tint: '210 50 210' },
  { name: 'LinkedIn',   text: 'in',  tint: '10 102 194' },
  { name: 'GSheets',    text: 'GS',  tint: '15 157 88' },
  { name: 'Airtable',   text: 'at',  tint: '255 184 0' },
  { name: 'n8n',        text: 'n8',  tint: '255 79 79' },
  { name: 'Perplexity', text: 'Px',  tint: '32 156 238' },
  { name: 'Cursor',     text: 'Cr',  tint: '180 180 200' },
  { name: 'Loom',       text: 'Lm',  tint: '103 56 225' },
  { name: 'Runway',     text: 'Rw',  tint: '200 200 200' },
  { name: 'HubSpot',    text: 'Hs',  tint: '255 122 89' },
  { name: 'Webflow',    text: 'Wf',  tint: '68 106 249' },
  { name: 'Figma',      text: 'Fg',  tint: '255 82 82' },
  { name: 'Canva',      text: 'Cv',  tint: '0 196 177' },
  { name: 'GDrive',     text: 'Dr',  tint: '66 133 244' },
  { name: 'Calendar',   text: 'Cal', tint: '234 67 53' },
  { name: 'Zoom',       text: 'Zm',  tint: '45 140 255' },
  { name: 'GitHub',     text: 'GH',  tint: '180 180 200' },
  { name: 'Luma',       text: 'Lu',  tint: '200 100 255' },
  { name: 'Kling',      text: 'Kl',  tint: '255 200 0' },
  { name: 'ElevenLabs', text: 'EL',  tint: '180 180 200' },
  { name: 'Heygen',     text: 'Hg',  tint: '103 56 225' },
  { name: 'Typeform',   text: 'Tf',  tint: '36 236 116' },
  { name: 'SalesNav',   text: 'SN',  tint: '10 102 194' },
  { name: 'Clearbit',   text: 'Cb',  tint: '45 140 255' },
  { name: 'Anthropic',  text: 'Ant', tint: '218 119 86' },
  { name: 'Descript',   text: 'Dp',  tint: '128 100 255' },
  { name: 'OpenAI',     text: 'OAI', tint: '245 241 232' },
  { name: 'Twilio',     text: 'Tw',  tint: '245 22 65' },
]

function buildTileGrid() {
  const COLS = 14, ROWS = 10
  const total = COLS * ROWS
  const tiles = []
  while (tiles.length < total) tiles.push(...TOOLS)
  tiles.length = total

  return `<div class="gw-tiles" aria-hidden="true">${
    tiles.map((t, i) => {
      const dur  = (3.2 + (i % 7) * 0.28).toFixed(2)
      const del  = (-(i * 0.22) % 4).toFixed(2)
      const lift = (7 + (i % 5) * 2)
      return `<div class="gw-tile" style="
        --tint:${t.tint};
        animation-duration:${dur}s;
        animation-delay:${del}s;
        --lift:${lift}px
      "><span class="gw-tile-abbr">${t.text}</span><span class="gw-tile-name">${t.name}</span></div>`
    }).join('')
  }</div>`
}

export function initGateway() {
  // Once per session
  if (sessionStorage.getItem('caina-gw')) return

  // Reduced-motion: skip entirely, straight into the site
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    sessionStorage.setItem('caina-gw', '1')
    return
  }

  // Iris-wipe cover geometry (Terminal-style lens reveal).
  // The cover is a cream sheet with a pointed-lens hole cut out of it
  // (fill-rule evenodd) — the hole scales from nothing to past the corners.
  const VW = window.innerWidth
  const VH = window.innerHeight
  const lensPath = (w, h) => {
    const cx = VW / 2, cy = VH / 2
    return `M${cx - w} ${cy} C${cx - w * 0.45} ${cy - h} ${cx + w * 0.45} ${cy - h} ${cx + w} ${cy} C${cx + w * 0.45} ${cy + h} ${cx - w * 0.45} ${cy + h} ${cx - w} ${cy}Z`
  }
  const coverPath = (w, h) => `M0 0H${VW}V${VH}H0Z ${lensPath(w, h)}`

  // Inject gateway DOM immediately — covers screen before Three.js first frame
  const el = document.createElement('div')
  el.id = 'gateway'
  el.setAttribute('aria-label', 'Site intro — click or scroll to enter')
  el.innerHTML = `
    ${buildTileGrid()}
    <div class="gw-inner">
      <div class="gw-mark">
        <span class="gw-slash">//</span>
        <span class="gw-wordmark">AUGMENTED</span>
      </div>
      <div class="gw-rule"></div>
      <div class="gw-meta">
        <span class="gw-counter"><span id="gwCount">00</span></span>
        <span class="gw-sep">—</span>
        <span class="gw-status" id="gwStatus">LOADING</span>
      </div>
    </div>
    <div class="gw-prompt">
      <span class="gw-prompt-line"></span>
      <span>SCROLL TO ENTER</span>
      <span class="gw-prompt-line"></span>
    </div>
    <div class="gw-cover" aria-hidden="true">
      <svg class="gw-cover-svg" viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="none">
        <path class="gw-cover-mask" d="${coverPath(0.001, 0.001)}" fill="#f5f1e8" fill-rule="evenodd"/>
        <g class="gw-cover-traces" fill="none" stroke="rgba(10,8,4,0.07)" stroke-width="1.2">
          <path d="M-2 ${VH * 0.26} H${VW * 0.14} Q${VW * 0.20} ${VH * 0.26} ${VW * 0.20} ${VH * 0.19} V-2"/>
          <path d="M${VW + 2} ${VH * 0.20} H${VW * 0.80} Q${VW * 0.74} ${VH * 0.20} ${VW * 0.74} ${VH * 0.27} V${VH * 0.42} Q${VW * 0.74} ${VH * 0.49} ${VW * 0.80} ${VH * 0.49} H${VW + 2}"/>
          <path d="M-2 ${VH * 0.62} H${VW * 0.10} Q${VW * 0.16} ${VH * 0.62} ${VW * 0.16} ${VH * 0.69} V${VH + 2}"/>
          <path d="M${VW * 0.86} ${VH + 2} V${VH * 0.78} Q${VW * 0.86} ${VH * 0.71} ${VW * 0.80} ${VH * 0.71} H${VW * 0.55}"/>
        </g>
      </svg>
      <div class="gw-cover-logo">
        <span class="gw-cover-slash">//</span>
        <span class="gw-cover-word">AUGMENTED</span>
      </div>
    </div>
  `
  document.body.appendChild(el)
  sessionStorage.setItem('caina-gw', '1')

  const mark   = el.querySelector('.gw-mark')
  const wmark  = el.querySelector('.gw-wordmark')
  const rule   = el.querySelector('.gw-rule')
  const meta   = el.querySelector('.gw-meta')
  const count  = el.querySelector('#gwCount')
  const status = el.querySelector('#gwStatus')
  const prompt = el.querySelector('.gw-prompt')
  const cover     = el.querySelector('.gw-cover')
  const coverLogo = el.querySelector('.gw-cover-logo')
  const coverMask = el.querySelector('.gw-cover-mask')
  const traces    = el.querySelector('.gw-cover-traces')
  const lens = { w: 0.001, h: 0.001 }
  const setLens = () => coverMask.setAttribute('d', coverPath(lens.w, lens.h))
  const proxy  = { v: 0 }
  let dismissed = false

  // ── Dismiss: wipe the curtain upward ─────────────────────────────────────
  function dismiss() {
    if (dismissed) return
    dismissed = true
    cleanup()

    gsap.killTweensOf([mark, wmark, rule, meta, prompt, coverLogo, lens, traces])

    // Inner fades quickly, panel rises
    gsap.to('.gw-inner, .gw-prompt', { opacity: 0, duration: 0.18, ease: 'none' })
    gsap.to(el, {
      yPercent: -100,
      duration: 1.1,
      delay: 0.08,
      ease: 'power3.inOut',
      onComplete: () => el.remove(),
    })
  }

  function onInteract(e) {
    // Don't trap keyboard navigation
    if (e.type === 'keydown' && e.key === 'Tab') return
    dismiss()
  }

  function cleanup() {
    window.removeEventListener('wheel', onInteract)
    window.removeEventListener('touchstart', onInteract)
    el.removeEventListener('click', onInteract)
    window.removeEventListener('keydown', onInteract)
  }

  // ── Main animation timeline ───────────────────────────────────────────────
  const tl = gsap.timeline()

  /* Phase 1 — cream preloader: AUGMENTED logo card (Terminal-style) */
  // 0.15s — cover logo rises in
  tl.fromTo(coverLogo,
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
    0.15
  )

  // 1.5s — cover logo lifts away
  tl.to(coverLogo, { opacity: 0, y: -10, duration: 0.35, ease: 'power1.in' }, 1.5)

  /* Phase 2 — iris wipe: pointed lens opens, peeks the tile grid, then
     stretches past the corners to reveal the full gateway scene */
  // 1.75s — lens opens to a narrow slit (first glimpse of the tiles)
  tl.to(lens, { w: 210, h: 48, duration: 0.6, ease: 'power3.inOut', onUpdate: setLens }, 1.75)

  // 2.55s — lens blows open past the viewport corners
  tl.to(lens, { w: VW * 1.5, h: VH * 1.45, duration: 1.0, ease: 'power3.inOut', onUpdate: setLens }, 2.55)
  tl.to(traces, { opacity: 0, duration: 0.4 }, 2.6)
  tl.add(() => cover.remove(), 3.6)

  /* Phase 3 — gateway scene proper (tile grid + wordmark) */
  // 2.6s — mark slides up as the lens is opening (revealed mid-wipe)
  tl.fromTo(mark,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' },
    2.6
  )

  // 2.75s — wordmark letter-spacing compresses: wide → tight (cinematic reveal)
  tl.fromTo(wmark,
    { letterSpacing: '0.48em' },
    { letterSpacing: '0.06em', duration: 1.2, ease: 'power3.out' },
    2.75
  )

  // 3.3s — rule draws from center
  tl.fromTo(rule,
    { scaleX: 0 },
    { scaleX: 1, duration: 0.7, ease: 'power2.inOut' },
    3.3
  )

  // 3.4s — meta row fades in
  tl.fromTo(meta,
    { opacity: 0 },
    { opacity: 1, duration: 0.4 },
    3.4
  )

  // 3.4s — counter ticks 00 → 100 (visual preloader)
  tl.to(proxy, {
    v: 100,
    duration: 1.0,
    ease: 'none',
    onUpdate() {
      count.textContent = String(Math.round(proxy.v)).padStart(2, '0')
    },
    onComplete() {
      count.textContent = '100'
      status.textContent = 'READY'
    },
  }, 3.4)

  // 4.5s — prompt fades in
  tl.fromTo(prompt,
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' },
    4.5
  )

  // 5.2s — prompt breathes (subtle pulse)
  tl.to(prompt, {
    opacity: 0.32,
    duration: 1.1,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  }, 5.2)

  // 3.8s — attach interaction listeners (after the wipe completes)
  tl.add(() => {
    window.addEventListener('wheel',      onInteract, { once: true, passive: true })
    window.addEventListener('touchstart', onInteract, { once: true, passive: true })
    el.addEventListener('click',          onInteract, { once: true })
    window.addEventListener('keydown',    onInteract, { once: true })
  }, 3.8)

  // Auto-advance at 8s if user does nothing
  tl.add(() => { dismiss() }, 8.0)

  // dev-only handle so the intro can be scrubbed/verified from the console
  if (import.meta.env?.DEV) window.__gwTl = tl
}

import { gsap } from 'gsap'

export function initGateway() {
  // Once per session
  if (sessionStorage.getItem('caina-gw')) return

  // Reduced-motion: skip entirely, straight into the site
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    sessionStorage.setItem('caina-gw', '1')
    return
  }

  // Inject gateway DOM immediately — covers screen before Three.js first frame
  const el = document.createElement('div')
  el.id = 'gateway'
  el.setAttribute('aria-label', 'Site intro — click or scroll to enter')
  el.innerHTML = `
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
  const proxy  = { v: 0 }
  let dismissed = false

  // ── Dismiss: wipe the curtain upward ─────────────────────────────────────
  function dismiss() {
    if (dismissed) return
    dismissed = true
    cleanup()

    gsap.killTweensOf([mark, wmark, rule, meta, prompt])

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

  // 0.4s — mark slides up from below, fades in
  tl.fromTo(mark,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' },
    0.4
  )

  // 0.6s — wordmark letter-spacing compresses: wide → tight (cinematic reveal)
  tl.fromTo(wmark,
    { letterSpacing: '0.48em' },
    { letterSpacing: '0.06em', duration: 1.2, ease: 'power3.out' },
    0.6
  )

  // 1.05s — rule draws from center
  tl.fromTo(rule,
    { scaleX: 0 },
    { scaleX: 1, duration: 0.7, ease: 'power2.inOut' },
    1.05
  )

  // 1.15s — meta row fades in
  tl.fromTo(meta,
    { opacity: 0 },
    { opacity: 1, duration: 0.4 },
    1.15
  )

  // 1.15s — counter ticks 00 → 100 (visual preloader)
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
  }, 1.15)

  // 2.3s — prompt fades in
  tl.fromTo(prompt,
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' },
    2.3
  )

  // 2.3s — prompt breathes (subtle pulse)
  tl.to(prompt, {
    opacity: 0.32,
    duration: 1.1,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  }, 3.0)

  // 2.1s — attach interaction listeners
  tl.add(() => {
    window.addEventListener('wheel',      onInteract, { once: true, passive: true })
    window.addEventListener('touchstart', onInteract, { once: true, passive: true })
    el.addEventListener('click',          onInteract, { once: true })
    window.addEventListener('keydown',    onInteract, { once: true })
  }, 2.1)

  // Auto-advance at 5.5s if user does nothing
  tl.add(() => { dismiss() }, 5.5)
}

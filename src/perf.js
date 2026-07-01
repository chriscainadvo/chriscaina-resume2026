/* Phase 6 — runtime performance pass */

export function initPerf() {
  pauseOffscreenVideos()
}

// ── Pause background videos when scrolled out of view ─────────────────────
// Saves GPU/CPU on long pages — videos only decode when visible.
function pauseOffscreenVideos() {
  const videos = document.querySelectorAll('.c-sec-vid')
  if (!videos.length || !('IntersectionObserver' in window)) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          target.play().catch(() => {}) // silently handle autoplay policy
        } else {
          target.pause()
        }
      })
    },
    { rootMargin: '200px 0px', threshold: 0 } // start 200px before entering view
  )

  videos.forEach((v) => observer.observe(v))
}

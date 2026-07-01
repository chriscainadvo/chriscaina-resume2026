import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initReveals(lenis) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // Keep ScrollTrigger in sync with Lenis smooth scroll
  lenis.on('scroll', ScrollTrigger.update)
  ScrollTrigger.refresh()

  // ── 1. Stat counters ──────────────────────────────────────────────────────
  document.querySelectorAll('.c-stat-num').forEach((el) => {
    const raw = el.textContent.trim()
    const { prefix, value, suffix } = parseStatNum(raw)
    const proxy = { v: 0 }

    gsap.fromTo(proxy,
      { v: 0 },
      {
        v: value,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        onUpdate() {
          el.textContent = prefix + Math.round(proxy.v) + suffix
        },
        onComplete() {
          el.textContent = raw // snap to exact original string
        },
      }
    )
  })

  // ── 2. Section eyebrows + headings — fade up individually ─────────────────
  document.querySelectorAll('.c-section-head .c-eyebrow').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 18 },
      {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    )
  })

  document.querySelectorAll('.c-section-head .c-heading').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 32 },
      {
        opacity: 1, y: 0, duration: 0.95, ease: 'power3.out', delay: 0.1,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    )
  })

  // ── 3. Mission statement dim → full reveal ────────────────────────────────
  const statementDim = document.querySelector('.c-statement-dim')
  if (statementDim) {
    gsap.fromTo(statementDim,
      { color: 'rgba(15,12,8,0.15)' },
      {
        color: 'rgba(15,12,8,1)',
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.c-statement',
          start: 'top 72%',
          toggleActions: 'play none none none',
        },
      }
    )
  }

  // ── 4. Service rows — Terminal Industries-style color-scrub reveal ─────────
  // Names start at 11% grey → scrub to full black as they enter active zone.
  // Descriptions + links ghost in alongside.
  document.querySelectorAll('.c-svc-row').forEach((row) => {
    const name = row.querySelector('.c-svc-name')
    const num  = row.querySelector('.c-svc-num')
    const desc = row.querySelector('.c-svc-desc')
    const link = row.querySelector('.c-svc-link')

    ScrollTrigger.create({
      trigger: row,
      start: 'top 68%',
      toggleActions: 'play none none none',
      onEnter: () => {
        // Name: grey → full black
        gsap.to(name, {
          color: 'rgba(15,12,8,1)',
          duration: 0.65,
          ease: 'power2.inOut',
        })
        // Number: subtler reveal
        gsap.to(num, {
          color: 'rgba(15,12,8,0.55)',
          duration: 0.5,
          ease: 'power2.out',
        })
        // Desc slides up and fades in
        if (desc) gsap.to(desc, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.12,
        })
        // Link appears
        if (link) gsap.to(link, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.2,
        })
      },
    })
  })

  // ── 4. Hire columns — slide up with slight stagger ────────────────────────
  const hireCols = document.querySelectorAll('.c-hire-col')
  if (hireCols.length) {
    gsap.set(hireCols, { opacity: 0, y: 36 })
    gsap.to(hireCols, {
      opacity: 1, y: 0,
      duration: 0.85,
      ease: 'power3.out',
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.c-hire-split',
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
    })
  }

  // ── 5. Contact section — eyebrow, heading, details, form cascade ──────────
  const contactTrigger = {
    trigger: '.c-contact',
    start: 'top 78%',
    toggleActions: 'play none none none',
  }

  const contactEyebrow = document.querySelector('.c-contact .c-eyebrow')
  if (contactEyebrow) {
    gsap.fromTo(contactEyebrow,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: contactTrigger }
    )
  }

  const contactHeading = document.querySelector('.c-contact-heading')
  if (contactHeading) {
    gsap.fromTo(contactHeading,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.05, ease: 'power3.out', delay: 0.1, scrollTrigger: contactTrigger }
    )
  }

  const contactDetails = document.querySelector('.c-contact-details')
  if (contactDetails) {
    gsap.fromTo(contactDetails,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.28, scrollTrigger: contactTrigger }
    )
  }

  const contactForm = document.querySelector('.c-form')
  if (contactForm) {
    gsap.fromTo(contactForm,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out', delay: 0.42, scrollTrigger: contactTrigger }
    )
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────
function parseStatNum(str) {
  let prefix = ''
  let numStr = str

  if (numStr.startsWith('$')) {
    prefix = '$'
    numStr = numStr.slice(1)
  }

  const match = numStr.match(/^(\d+)(.*)$/)
  if (!match) return { prefix, value: 0, suffix: str }
  return { prefix, value: parseInt(match[1], 10), suffix: match[2] }
}

/* Builds the normal HTML content that scrolls in after the cinematic stage.
   Phase 3 redesign: full-bleed rows, no cards, no boxes. */
const FORMSPREE = 'https://formspree.io/f/xlgkrgwp'

const STATS = [
  ['10+',    'YEARS',     'EXPERIENCE'],
  ['200+',   'COMPANIES', 'RESEARCHED'],
  ['10hrs+', 'SAVED',     'PER WEEK'],
  ['$10K+',  'TRAVEL',    'SAVINGS'],
  ['6',      'AI SYSTEMS','DEPLOYED'],
]

const SERVICES = [
  ['Executive Operations',  'Calendar, inbox, travel, and day-to-day coordination run like clockwork — so leadership stays focused on the work that matters.'],
  ['AI Workflow Automation','Custom agents and pipelines that remove repetitive work — research, follow-ups, reporting — running quietly in the background.'],
  ['Lead Generation',       'Targeted prospect databases built with LinkedIn Sales Navigator, Apollo, and AI enrichment. 600+ qualified contacts and counting.'],
  ['Cold Calling',          'Scripted outreach calls handled end-to-end — targeting, dialing, follow-up, and pipeline handoff. No hand-holding required.'],
  ['Website Creation',      'Custom-designed business sites built in days — not months. Landing pages to full multi-page builds, AI-accelerated and deployed.', '/websites'],
  ['App & Tool Deployment', 'Internal dashboards, automations, and custom tools shipped end-to-end with Claude Code and Vercel — no dev team required.'],
  ['Project Coordination',  'Multi-stakeholder projects kept on track with clear systems, status visibility, and proactive follow-through.'],
  ['Travel & Logistics',    'Complex international itineraries planned and optimized — $10K+ in travel costs saved through smart booking.'],
]

const HIRE_ME = [
  'Calendar, inbox, and travel — always handled',
  'Custom AI agents built to your workflow',
  'Lead research and AI-enriched prospect lists',
  'Cold calling and outreach execution',
  'Website and internal tool deployment',
  'Project coordination end-to-end',
  'Async-first — systems run without hand-holding',
]

const HIRE_TEAM = [
  'Everything in the Solo plan, fully covered',
  'Dedicated project managers per client account',
  'Cold calling team — scripted, dialing, following up',
  'Chris handles hiring, training, and quality control',
  'Payroll and management stay completely off your plate',
  'White-label option available',
  'Scale up or down on your timeline',
  'Single point of contact — no committee, no delay',
]

export function buildContent() {
  const main = document.getElementById('content')

  main.innerHTML = `

    <!-- ── Stats — full-width horizontal strip ─────────────────────── -->
    <section class="c-stats" id="stats">
      <video class="c-sec-vid" src="/videos/vid-bokeh.mp4" autoplay muted loop playsinline preload="none"></video>
      <div class="c-sec-overlay"></div>
      ${STATS.map(([n, l1, l2]) => `
        <div class="c-stat">
          <span class="c-stat-num">${n}</span>
          <span class="c-stat-label">${l1}<br>${l2}</span>
        </div>`).join('')}
    </section>

    <!-- ── Mission statement ────────────────────────────────────────── -->
    <div class="c-statement" id="statement">
      <p class="c-statement-line">
        Not your average<br>
        <span class="c-statement-dim">executive assistant.</span>
      </p>
    </div>

    <!-- ── Services — numbered full-width rows ─────────────────────── -->
    <section class="c-section" id="services">
      <video class="c-sec-vid" src="/videos/vid-hands.mp4" autoplay muted loop playsinline preload="none"></video>
      <div class="c-sec-overlay"></div>
      <div class="c-section-head">
        <p class="c-eyebrow">// WHAT I DO</p>
        <h2 class="c-heading">Services.</h2>
      </div>
      <ul class="c-svc-list">
        ${SERVICES.map(([t, d, url], i) => `
          <li class="c-svc-row">
            <span class="c-svc-num">0${i + 1}</span>
            <div class="c-svc-body">
              <h3 class="c-svc-name">${t}</h3>
              <p class="c-svc-desc">${d}</p>
            </div>
            ${url
              ? `<a href="${url}" class="c-svc-link">See packages&nbsp;→</a>`
              : `<span></span>`
            }
          </li>`).join('')}
      </ul>
    </section>

    <!-- ── Hire — two-column split, no cards ───────────────────────── -->
    <section class="c-section c-hire" id="hire">
      <video class="c-sec-vid" src="/videos/vid-bokeh.mp4" autoplay muted loop playsinline preload="none"></video>
      <div class="c-sec-overlay"></div>
      <div class="c-section-head">
        <p class="c-eyebrow">// TWO WAYS TO WORK TOGETHER</p>
        <h2 class="c-heading">You pick<br>the model.</h2>
      </div>
      <div class="c-hire-split">

        <div class="c-hire-col">
          <p class="c-hire-tag">// HIRE ME</p>
          <h3 class="c-hire-title">Solo. Fully<br>AI-augmented.</h3>
          <p class="c-hire-desc">Direct access to Chris. One person doing the work of three — every task runs through AI systems built for your workflow.</p>
          <ul class="c-hire-list">
            ${HIRE_ME.map(f => `<li>${f}</li>`).join('')}
          </ul>
          <a href="#contact" class="c-hire-cta">Get in touch&nbsp;→</a>
        </div>

        <div class="c-hire-col">
          <p class="c-hire-tag">// HIRE MY TEAM</p>
          <h3 class="c-hire-title">Full team.<br>One contact.</h3>
          <p class="c-hire-desc">Chris leads. The team executes. Everything in the solo plan — plus dedicated staff trained on your systems, managed end-to-end.</p>
          <ul class="c-hire-list">
            ${HIRE_TEAM.map(f => `<li>${f}</li>`).join('')}
          </ul>
          <a href="#contact" class="c-hire-cta">Let's talk scope&nbsp;→</a>
        </div>

      </div>
    </section>

    <!-- ── Contact — dark full-bleed ───────────────────────────────── -->
    <section class="c-contact" id="contact">
      <video class="c-sec-vid" src="/videos/vid-ink.mp4" autoplay muted loop playsinline preload="none"></video>
      <div class="c-sec-overlay"></div>
      <div class="c-contact-inner">

        <div class="c-contact-left">
          <p class="c-eyebrow c-eyebrow--light">// LET'S TALK</p>
          <h2 class="c-contact-heading">Work<br>with me.</h2>
          <div class="c-contact-details">
            <span class="c-contact-name">Chris Bernard Caiña</span>
            <span>AI-Augmented Executive Assistant</span>
            <span>&amp; Operations Specialist</span>
            <a href="mailto:kris@multiply.marketing">kris@multiply.marketing</a>
            <span>+63 956 089 7582</span>
            <span>Davao City, Philippines</span>
            <a href="https://www.linkedin.com/in/chris-perez-17951934b/" target="_blank" rel="noopener" class="c-linkedin">LinkedIn&nbsp;→</a>
          </div>
        </div>

        <form class="c-form" id="contactForm" novalidate>
          <div class="c-field">
            <input type="text" name="name" placeholder="Your name" required />
          </div>
          <div class="c-field">
            <input type="email" name="email" placeholder="Your email" required />
          </div>
          <div class="c-field">
            <select name="service">
              <option value="">Select a service…</option>
              ${SERVICES.map(([t]) => `<option>${t}</option>`).join('')}
            </select>
          </div>
          <div class="c-field c-field--msg">
            <textarea name="message" placeholder="Tell me about your project…" required></textarea>
          </div>
          <button class="c-submit" type="submit">Send inquiry&nbsp;→</button>
          <div class="c-form-status" id="contactStatus"></div>
        </form>

      </div>
    </section>

    <footer class="c-footer">
      <span>© 2026 Chris Bernard Caiña — CAIÑA.OPS</span>
      <span>Davao City, PH · Built with AI, zero developers.</span>
    </footer>
  `

  wireForms()
}

function wireForms() {
  const contactForm = document.getElementById('contactForm')
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const status = document.getElementById('contactStatus')
    status.textContent = 'Sending…'
    const fd = new FormData(contactForm)
    fd.append('_subject', 'New Inquiry — CAIÑA.OPS')
    try {
      const res = await fetch(FORMSPREE, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fd,
      })
      status.textContent = res.ok
        ? '✓ Sent — I\'ll be in touch shortly.'
        : 'Something went wrong. Email me directly.'
      if (res.ok) contactForm.reset()
    } catch (_) {
      status.textContent = 'Network error. Email me directly.'
    }
  })
}

/* Builds the normal HTML content that scrolls in after the cinematic stage. */
const FORMSPREE = 'https://formspree.io/f/xlgkrgwp'

const SERVICES = [
  ['Executive Operations', 'Calendar, inbox, travel, and day-to-day coordination run like clockwork — so leadership stays focused on the work that matters.'],
  ['AI Workflow Automation', 'Custom agents and pipelines that remove repetitive work — research, follow-ups, reporting — running quietly in the background.'],
  ['Lead Generation', 'Targeted prospect databases built with LinkedIn Sales Navigator, Apollo, and AI enrichment. 600+ qualified contacts and counting.'],
  ['Web & Tool Deployment', 'Sites, dashboards, and internal tools shipped end-to-end with Claude Code and Vercel — no dev team required.'],
  ['Project Coordination', 'Multi-stakeholder projects kept on track with clear systems, status visibility, and proactive follow-through.'],
  ['Travel & Logistics', 'Complex international itineraries planned and optimized — $10K+ in travel costs saved through smart booking.'],
]

const EXP_PREVIEW = [
  { role: 'Executive Assistant & AI Ops', meta: 'Marketing Agency · 2024 — Present', body: 'Building Jarvis, the AI Chief of Staff. Running per-client agents, automations, and live dashboards for the founder.', locked: false },
  { role: 'Operations & Research Lead', meta: 'Confidential · 2022 — 2024', body: '200+ companies researched and qualified. Deployed AI email follow-up systems saving 10+ hours weekly.', locked: false },
  { role: 'Senior EA — Locked', meta: '•••••• · ••••', body: 'Unlock the full timeline to view the complete 10-year track record across executive and operations roles.', locked: true },
  { role: 'Coordinator — Locked', meta: '•••••• · ••••', body: 'Unlock the full timeline to view earlier roles, references, and detailed scope.', locked: true },
]

const TIMELINE = [
  ['Executive Assistant & AI Operations', 'Marketing Agency · Jan 2024 — Present', 'Designed and deployed 6 live AI systems including Jarvis, an AI Chief of Staff. Per-client agents, iMessage sync, and a 24/7 Mac Mini dashboard.'],
  ['Operations & Research Lead', 'Remote · 2022 — 2024', 'Led prospect research across 200+ companies. Built AI-assisted email follow-up workflows that recovered 10+ hours per week.'],
  ['Executive Assistant', 'Remote · 2020 — 2022', 'Full executive support: calendar, inbox, travel, and project coordination for senior leadership.'],
  ['Operations Coordinator', 'On-site · 2018 — 2020', 'Coordinated cross-functional projects and vendor logistics; introduced lightweight automation to manual processes.'],
  ['Administrative Specialist', 'On-site · 2017 — 2018', 'Owned scheduling, documentation, and reporting workflows for a multi-team department.'],
  ['Office & Logistics Associate', 'On-site · 2016 — 2017', 'Managed logistics, supplier coordination, and day-to-day office operations.'],
  ['Administrative Assistant', 'On-site · Oct 2015 — 2016', 'First operations role — built the foundation in scheduling, records, and stakeholder communication.'],
]

export function buildContent() {
  const main = document.getElementById('content')

  main.innerHTML = `
    <!-- Stats strip -->
    <section class="stats" id="stats">
      ${[
        ['10+', 'Years Experience'],
        ['200+', 'Companies Researched'],
        ['10hrs+', 'Saved Per Week'],
        ['$10K+', 'Travel Saved'],
        ['6', 'AI Systems Built'],
      ].map(([n, l]) => `<div class="stat"><div class="num">${n}</div><div class="label">${l}</div></div>`).join('')}
    </section>

    <!-- Agency teaser -->
    <section class="agency-teaser">
      <div>
        <p class="at-eyebrow">// SCALE OPTION</p>
        <h2 class="at-title">Not just one person.<br/><span>A full team.</span></h2>
        <p class="at-body">Need more than one operator? Chris leads a hand-picked team of project managers and specialists — trained on your systems, managed end-to-end, and delivered through a single point of contact. You pay once. The infrastructure is already built.</p>
      </div>
      <div class="at-cta">
        <a href="/services">See the team model →</a>
      </div>
    </section>

    <!-- Services -->
    <section class="section" id="services">
      <p class="section-eyebrow">// WHAT I DO</p>
      <h2 class="section-title">Services</h2>
      <div class="cards-3">
        ${SERVICES.map(([t, d], i) => `
          <div class="svc-card">
            <span class="svc-num">0${i + 1}</span>
            <h3>${t}</h3>
            <p>${d}</p>
          </div>`).join('')}
      </div>
    </section>

    <!-- Experience -->
    <section class="section" id="experience" style="background:rgba(201,147,77,0.03)">
      <p class="section-eyebrow">// TRACK RECORD</p>
      <h2 class="section-title">Experience</h2>
      <div class="exp-grid">
        ${EXP_PREVIEW.map((e) => `
          <div class="exp-card ${e.locked ? 'locked' : ''}">
            <div class="lock-inner">
              <div class="role">${e.role}</div>
              <div class="meta">${e.meta}</div>
              <p>${e.body}</p>
            </div>
          </div>`).join('')}
      </div>

      <div class="email-gate" id="emailGate">
        <h3>Unlock the full timeline</h3>
        <p>Enter your email to reveal the complete 10-year track record — 7 roles from 2015 to today.</p>
        <form class="gate-form" id="gateForm">
          <input type="email" name="email" placeholder="you@company.com" required />
          <button class="btn btn-fill" type="submit">Unlock →</button>
        </form>
        <div class="form-status" id="gateStatus"></div>
      </div>

      <div class="timeline" id="timeline" style="margin-top:36px">
        ${TIMELINE.map(([r, m, b]) => `
          <div class="timeline-item">
            <div class="role">${r}</div>
            <div class="meta">${m}</div>
            <p>${b}</p>
          </div>`).join('')}
      </div>
    </section>

    <!-- Contact -->
    <section class="section contact" id="contact">
      <p class="section-eyebrow">// GET IN TOUCH</p>
      <h2 class="section-title">Work with me</h2>
      <div class="contact-wrap">
        <div class="contact-info">
          <p><strong>Chris Bernard Caiña</strong><br/>AI-Augmented Executive Assistant<br/>&amp; Operations Specialist</p>
          <p style="margin-top:28px">
            <a href="mailto:chriscaina.dvo@gmail.com">chriscaina.dvo@gmail.com</a><br/>
            +63 956 089 7582<br/>
            Davao City, Philippines
          </p>
          <p style="margin-top:16px">
            <a href="https://www.linkedin.com/in/chris-perez-17951934b/" target="_blank" rel="noopener">LinkedIn →</a>
          </p>
        </div>
        <form class="contact-form" id="contactForm">
          <input type="text" name="name" placeholder="Your name" required />
          <input type="email" name="email" placeholder="Your email" required />
          <select name="service">
            <option value="">Select a service…</option>
            ${SERVICES.map(([t]) => `<option>${t}</option>`).join('')}
          </select>
          <textarea name="message" placeholder="Tell me about your project…" required></textarea>
          <button class="btn btn-fill" type="submit">Send inquiry →</button>
          <div class="form-status" id="contactStatus"></div>
        </form>
      </div>
    </section>

    <footer class="footer">
      <span>© 2026 Chris Bernard Caiña — CAIÑA.OPS</span>
      <span>Davao City, PH · Built with AI, zero developers.</span>
    </footer>
  `

  wireForms()
}

function wireForms() {
  // Email gate → unlock timeline
  const gateForm = document.getElementById('gateForm')
  gateForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const status = document.getElementById('gateStatus')
    status.textContent = 'Unlocking…'
    try {
      await fetch(FORMSPREE, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(gateForm),
      })
    } catch (_) {}
    document.getElementById('emailGate').style.display = 'none'
    document.getElementById('timeline').classList.add('open')
    document.querySelectorAll('.exp-card.locked').forEach((c) => {
      c.classList.remove('locked')
    })
  })

  // Contact form
  const contactForm = document.getElementById('contactForm')
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const status = document.getElementById('contactStatus')
    status.textContent = 'Sending…'
    const fd = new FormData(contactForm)
    fd.append('_subject', 'New Inquiry')
    try {
      const res = await fetch(FORMSPREE, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fd,
      })
      status.textContent = res.ok ? '✓ Sent — I’ll be in touch shortly.' : 'Something went wrong. Email me directly.'
      if (res.ok) contactForm.reset()
    } catch (_) {
      status.textContent = 'Network error. Email me directly.'
    }
  })
}

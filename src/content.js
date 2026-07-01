/* Builds the normal HTML content that scrolls in after the cinematic stage. */
const FORMSPREE = 'https://formspree.io/f/xlgkrgwp'

const SERVICES = [
  ['Executive Operations', 'Calendar, inbox, travel, and day-to-day coordination run like clockwork — so leadership stays focused on the work that matters.'],
  ['AI Workflow Automation', 'Custom agents and pipelines that remove repetitive work — research, follow-ups, reporting — running quietly in the background.'],
  ['Lead Generation', 'Targeted prospect databases built with LinkedIn Sales Navigator, Apollo, and AI enrichment. 600+ qualified contacts and counting.'],
  ['Cold Calling', 'Scripted outreach calls handled end-to-end — targeting, dialing, follow-up, and pipeline handoff. No hand-holding required.'],
  ['Website Creation', 'Custom-designed business sites built in days — not months. Landing pages to full multi-page builds, AI-accelerated and deployed.', '/websites'],
  ['App & Tool Deployment', 'Internal dashboards, automations, and custom tools shipped end-to-end with Claude Code and Vercel — no dev team required.'],
  ['Project Coordination', 'Multi-stakeholder projects kept on track with clear systems, status visibility, and proactive follow-through.'],
  ['Travel & Logistics', 'Complex international itineraries planned and optimized — $10K+ in travel costs saved through smart booking.'],
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

    <!-- Services -->
    <section class="section" id="services">
      <p class="section-eyebrow">// WHAT I DO</p>
      <h2 class="section-title">Services</h2>
      <div class="cards-3">
        ${SERVICES.map(([t, d, url], i) => `
          <div class="svc-card">
            <span class="svc-num">0${i + 1}</span>
            <h3>${t}</h3>
            <p>${d}</p>
            ${url ? `<a href="${url}" class="svc-link">See packages →</a>` : ''}
          </div>`).join('')}
      </div>
    </section>

    <!-- Hire section -->
    <section class="hire-section" id="hire">
      <p class="hire-eyebrow">// TWO WAYS TO WORK TOGETHER</p>
      <h2 class="hire-intro">You pick the model.</h2>
      <div class="hire-grid">

        <div class="hire-card team">
          <p class="hire-badge">// HIRE MY TEAM</p>
          <h3 class="hire-title">Full team.<br/>One contact.</h3>
          <p class="hire-sub">Chris leads. The team executes. Everything in the solo plan — plus dedicated staff trained on your systems, managed end-to-end.</p>
          <ul class="hire-features">
            <li>Everything in the Solo plan, fully covered</li>
            <li>Dedicated project managers per client account</li>
            <li>Cold calling team — scripted, dialing, following up</li>
            <li>Chris handles hiring, training, and quality control</li>
            <li>Payroll and management stay completely off your plate</li>
            <li>White-label option available</li>
            <li>Scale up or down on your timeline</li>
            <li>Single point of contact — no committee, no delay</li>
          </ul>
          <a href="#contact" class="hire-cta">Let's talk scope →</a>
        </div>

        <div class="hire-card solo">
          <p class="hire-badge">// HIRE ME</p>
          <h3 class="hire-title">Solo. Fully<br/>AI-augmented.</h3>
          <p class="hire-sub">Direct access to Chris. One person doing the work of three — every task runs through AI systems built for your workflow.</p>
          <ul class="hire-features">
            <li>Calendar, inbox, and travel — always handled</li>
            <li>Custom AI agents built to your workflow</li>
            <li>Lead research and AI-enriched prospect lists</li>
            <li>Cold calling and outreach execution</li>
            <li>Website and internal tool deployment</li>
            <li>Project coordination end-to-end</li>
            <li>Async-first — systems run without hand-holding</li>
          </ul>
          <a href="#contact" class="hire-cta">Get in touch →</a>
        </div>

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

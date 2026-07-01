// Minimal shared JS for subpages (no Three.js)
// Marks the active nav link based on current path
const path = window.location.pathname
document.querySelectorAll('.page-nav .nav-links a').forEach(a => {
  if (a.getAttribute('href') === path || a.getAttribute('href') === path.replace(/\/$/, '')) {
    a.classList.add('active')
  }
})

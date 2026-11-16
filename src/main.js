import './style.css';

// Light / dark theme toggle. The initial theme is set by an inline script in
// index.html so the page doesn't flash; this only handles clicks.
const root = document.documentElement;
const toggle = document.getElementById('theme-toggle');

const syncLabel = () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  toggle.setAttribute('aria-label', `Switch to ${next} mode`);
};

if (toggle) {
  syncLabel();
  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Storage can be blocked (private mode); the toggle still works for this visit.
    }
    syncLabel();
  });
}

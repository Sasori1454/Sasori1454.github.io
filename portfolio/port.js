// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
        const open = siteNav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(open));
    });
}

// Smooth scroll for internal links
document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // close nav on mobile after navigating
    if (siteNav && siteNav.classList.contains('open')) {
        siteNav.classList.remove('open');
        navToggle?.setAttribute('aria-expanded', 'false');
    }
});

// Copy email
const copyBtn = document.getElementById('copyEmail');
if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
        const value = copyBtn.getAttribute('data-copy') || '';
        try {
            await navigator.clipboard.writeText(value);
            const prev = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => (copyBtn.textContent = prev), 1200);
        } catch (_) {
            alert('Email: ' + value);
        }
    });
}

// Dynamic year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

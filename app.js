const clock = document.querySelector('#clock');
const today = document.querySelector('#today');
const searchToggle = document.querySelector('#search-toggle');
const searchPanel = document.querySelector('#service-search');
const searchInput = document.querySelector('#service-query');
const searchClear = document.querySelector('#search-clear');
const searchEmpty = document.querySelector('#search-empty');
const services = [...document.querySelectorAll('.service-row')];
const accountName = document.querySelector('#account-name');
const logoutButton = document.querySelector('#logout-button');

async function initializePortal() {
  try {
    const response = await fetch('/api/session', { credentials: 'same-origin', cache: 'no-store' });
    if (!response.ok) return window.location.replace('/login');
    const session = await response.json();
    accountName.textContent = session.username;
  } catch {
    window.location.replace('/login');
  }
}

logoutButton.addEventListener('click', async () => {
  logoutButton.disabled = true;
  try {
    await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
  } finally {
    window.location.replace('/login');
  }
});

function updateClock() {
  const now = new Date();
  clock.textContent = new Intl.DateTimeFormat('fr-BE', { hour: '2-digit', minute: '2-digit' }).format(now);
  today.textContent = new Intl.DateTimeFormat('fr-BE', { weekday: 'short', day: '2-digit', month: 'short' }).format(now).toUpperCase();
}

function filterServices() {
  const query = searchInput.value.trim().toLocaleLowerCase('fr');
  let visible = 0;
  for (const service of services) {
    const match = `${service.dataset.search} ${service.textContent}`.toLocaleLowerCase('fr').includes(query);
    service.hidden = !match;
    if (match) visible += 1;
  }
  searchEmpty.hidden = visible > 0;
}

searchToggle.addEventListener('click', () => {
  const open = searchToggle.getAttribute('aria-expanded') !== 'true';
  searchToggle.setAttribute('aria-expanded', String(open));
  searchPanel.hidden = !open;
  if (open) searchInput.focus();
});
searchInput.addEventListener('input', filterServices);
searchClear.addEventListener('click', () => {
  searchInput.value = '';
  filterServices();
  searchInput.focus();
});
updateClock();
window.setInterval(updateClock, 30_000);
initializePortal();

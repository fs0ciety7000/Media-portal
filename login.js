const form = document.querySelector('#login-form');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const submit = document.querySelector('#login-submit');
const error = document.querySelector('#login-error');

async function checkExistingSession() {
  try {
    const response = await fetch('/api/session', { credentials: 'same-origin', cache: 'no-store' });
    if (response.ok) window.location.replace('/');
  } catch {
    // Keep the login form available when Jellyfin or the network is temporarily down.
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  error.hidden = true;
  error.textContent = '';
  if (!username.value.trim() || !password.value) {
    error.textContent = 'Renseignez votre nom d’utilisateur et votre mot de passe.';
    error.hidden = false;
    return;
  }

  submit.disabled = true;
  submit.querySelector('span').textContent = 'Vérification…';
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value.trim(), password: password.value }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Connexion refusée. Réessayez.');
    password.value = '';
    window.location.replace('/');
  } catch (failure) {
    error.textContent = failure instanceof TypeError
      ? 'Le portail ne répond pas. Vérifiez votre connexion puis réessayez.'
      : failure.message;
    error.hidden = false;
    password.focus();
  } finally {
    submit.disabled = false;
    submit.querySelector('span').textContent = 'Entrer dans l’antre';
  }
});

checkExistingSession();

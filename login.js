let accountType = 'Patient';
const notice = document.querySelector('#form-notice');
const loginForm = document.querySelector('#login-form');

document.querySelectorAll('.account-option').forEach(button => button.addEventListener('click', () => {
  accountType = button.dataset.account;
  document.querySelectorAll('.account-option').forEach(option => {
    const selected = option === button;
    option.classList.toggle('selected', selected);
    option.setAttribute('aria-pressed', String(selected));
  });
  document.querySelector('#login-submit').textContent = `Log In as ${accountType}`;
  notice.textContent = '';
  notice.classList.remove('error');
}));

document.querySelector('#toggle-password').addEventListener('click', event => {
  const password = document.querySelector('#password');
  const showing = password.type === 'password';
  password.type = showing ? 'text' : 'password';
  event.currentTarget.textContent = showing ? 'Hide' : 'Show';
  event.currentTarget.setAttribute('aria-label', showing ? 'Hide password' : 'Show password');
  event.currentTarget.setAttribute('aria-pressed', String(showing));
});

document.querySelector('#forgot-password').addEventListener('click', () => {
  const email = document.querySelector('#email');
  notice.classList.remove('error');
  if (!email.value.trim()) {
    notice.textContent = 'Enter your email address to request a password reset.';
    email.focus();
    return;
  }
  if (!email.checkValidity()) {
    notice.textContent = 'Enter a valid email address first.';
    notice.classList.add('error');
    email.focus();
    return;
  }
  notice.textContent = 'Password reset will be available when account services are connected.';
});

loginForm.addEventListener('submit', event => {
  event.preventDefault();
  notice.classList.remove('error');
  if (!loginForm.reportValidity()) return;
  notice.textContent = `Sign-in for ${accountType.toLowerCase()} accounts is not connected yet.`;
});

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('#nav-links');
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navLinks.classList.toggle('open', !isOpen);
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}));

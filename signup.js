const signupForm = document.querySelector('#signup-form');
const formNotice = document.querySelector('#form-notice');
const isProviderSignup = window.location.pathname.toLowerCase().endsWith('provider-signup.html');

document.querySelector('#toggle-password').addEventListener('click', event => {
  const password = document.querySelector('#password');
  const showing = password.type === 'password';
  password.type = showing ? 'text' : 'password';
  event.currentTarget.textContent = showing ? 'Hide' : 'Show';
  event.currentTarget.setAttribute('aria-label', showing ? 'Hide password' : 'Show password');
  event.currentTarget.setAttribute('aria-pressed', String(showing));
});

signupForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!signupForm.reportValidity()) return;
  formNotice.classList.remove('error');
  formNotice.textContent = isProviderSignup
    ? 'Provider registration is not connected yet. Your details have not been submitted.'
    : 'Account creation is not connected yet. Your details have not been submitted.';
});

signupForm.querySelectorAll('input').forEach(input => input.addEventListener('input', () => {
  formNotice.textContent = '';
  formNotice.classList.remove('error');
}));

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

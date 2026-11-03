const journey = [
  { title: 'Tell us what you need', description: "Answer a few quick questions about your goals, preferences, and what you're going through. There are no wrong answers.", duration: 'Takes about 2 minutes' },
  { title: 'Explore your matches', description: 'See verified professionals who fit your needs, preferred language, location, and budget.', duration: 'Browse at your own pace' },
  { title: 'Choose a time that works', description: 'Compare availability and session formats, then pick a time that fits your schedule.', duration: 'Evenings and weekends available' },
  { title: 'Begin your care', description: 'Book securely and meet your therapist online or in person. Your care starts on your terms.', duration: 'You are in control' }
];

const tabs = [...document.querySelectorAll('.step-tab')];
const stepNumber = document.querySelector('#step-number');
const stepTitle = document.querySelector('#step-title');
const stepDescription = document.querySelector('#step-description');
const stepDuration = document.querySelector('#step-duration');
const dots = [...document.querySelectorAll('.step-dots i')];
let activeStep = 0;

function showStep(index) {
  activeStep = (index + journey.length) % journey.length;
  const step = journey[activeStep];
  stepNumber.textContent = String(activeStep + 1);
  stepTitle.textContent = step.title;
  stepDescription.textContent = step.description;
  stepDuration.textContent = step.duration;
  tabs.forEach((tab, i) => {
    const active = i === activeStep;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  dots.forEach((dot, i) => dot.classList.toggle('current', i === activeStep));
  document.querySelector('#next-step').textContent = activeStep === journey.length - 1 ? 'Start over' : 'Next';
}

tabs.forEach(tab => tab.addEventListener('click', () => showStep(Number(tab.dataset.step))));
document.querySelector('#next-step').addEventListener('click', () => showStep(activeStep + 1));

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

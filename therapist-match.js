const questions = [
  { key:'concerns', title:'What brings you here?', subtitle:'Select all that apply', type:'multi', options:['Anxiety','Depression','Stress','Trauma','Relationships','Grief','Burnout','Personal growth','Other'] },
  { key:'gender', title:'Therapist gender preference', subtitle:'This helps us find the right fit for you', type:'single', options:['Male','Female','Non-binary','No preference'] },
  { key:'approaches', title:'Therapy approach', subtitle:'Select what resonates with you', type:'single', options:['CBT (Cognitive Behavioral)','DBT (Dialectical Behavioral)','Psychodynamic','Humanistic','Trauma-Informed','Mindfulness-Based','No preference'] },
  { key:'format', title:'How would you prefer to meet?', subtitle:'You can change this anytime', type:'single', options:['Video / Teletherapy','In-person','Phone','No preference'] },
  { key:'budget', title:'Budget & payment', subtitle:"We'll show therapists that fit your budget and payment preference", type:'budget' },
  { key:'availability', title:'When are you available?', subtitle:'Select your preferred times', type:'availability' }
];
const initialAnswers = { concerns:[], gender:'', approaches:'', format:'', payment:'', outOfPocket:true, budget:2500, days:[], times:[], frequency:'Weekly' };
let answers = { ...initialAnswers };
try {
  const saved = JSON.parse(sessionStorage.getItem('mindbridgeMatchAnswers') || 'null');
  if (saved) answers = { ...initialAnswers, ...saved };
} catch {}
let currentStep = 0;

const panel = document.querySelector('#question-panel');
const backButton = document.querySelector('#back-button');
const continueButton = document.querySelector('#continue-button');
const paymentOptions = ['Self-pay','Corporate / employer','NGO referral','University referral','Not sure yet'];
const dayOptions = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const timeOptions = ['Early morning (6–9 AM)','Morning (9 AM–12 PM)','Afternoon (12–5 PM)','Evening (5–9 PM)'];
const frequencies = ['Weekly','Every 2 weeks','Monthly','Not sure yet'];

function choiceButtons(key, options, selectedValues, multi=false, extraClass='') {
  return `<div class="options-grid ${extraClass}">${options.map(option => {
    const selected = multi ? selectedValues.includes(option) : selectedValues === option;
    return `<button type="button" class="choice${selected ? ' selected' : ''}" aria-pressed="${selected}" data-key="${key}" data-value="${option}" data-multi="${multi}">${option}</button>`;
  }).join('')}</div>`;
}

function renderQuestion() {
  const question = questions[currentStep];
  const pct = Math.round((currentStep + 1) / questions.length * 100);
  document.querySelector('#step-label').textContent = `Step ${currentStep + 1} of ${questions.length}`;
  document.querySelector('#progress-percent').textContent = `${pct}% complete`;
  document.querySelector('.progress-track').setAttribute('aria-valuenow', String(pct));
  document.querySelector('#progress-bar').style.width = `${pct}%`;
  backButton.disabled = currentStep === 0;
  continueButton.textContent = currentStep === questions.length - 1 ? 'See my matches' : 'Continue →';
  let content = `<h1 class="question-title" id="match-title">${question.title}</h1><p class="question-subtitle">${question.subtitle}</p>`;

  if (question.type === 'multi') content += choiceButtons(question.key, question.options, answers.concerns, true);
  if (question.key === 'gender') content += choiceButtons(question.key, question.options, answers.gender);
  if (question.key === 'approaches') content += choiceButtons(question.key, question.options, answers.approaches);
  if (question.key === 'format') content += choiceButtons(question.key, question.options, answers.format);
  if (question.type === 'budget') {
    content += `<div class="budget-section"><label for="payment-choice">How will you pay?</label><select id="payment-choice"><option value="">Select a payment option...</option>${paymentOptions.map(option => `<option ${answers.payment === option ? 'selected' : ''}>${option}</option>`).join('')}</select><label class="out-of-pocket"><input id="out-of-pocket" type="checkbox" ${answers.outOfPocket ? 'checked' : ''}> I plan to pay out of pocket</label><p class="budget-title">Maximum session budget: <strong id="budget-output">৳${Number(answers.budget).toLocaleString('en-US')}</strong></p><input class="budget-range" id="budget-range" type="range" min="500" max="5000" step="100" value="${answers.budget}" aria-label="Maximum session budget"><div class="budget-bounds"><span>৳500</span><span>৳5,000+</span></div></div>`;
  }
  if (question.type === 'availability') {
    content += `<div class="option-section"><h3>Preferred days</h3>${choiceButtons('days', dayOptions, answers.days, true, 'days')}</div><div class="option-section"><h3>Preferred times</h3>${choiceButtons('times', timeOptions, answers.times, true)}</div><div class="option-section"><h3>Session frequency</h3>${choiceButtons('frequency', frequencies, answers.frequency, false, 'frequency')}</div>`;
  }
  content += '<p class="question-error" aria-live="polite"></p>';
  panel.innerHTML = content;
  panel.querySelectorAll('.choice').forEach(button => button.addEventListener('click', () => {
    const { key, value, multi } = button.dataset;
    if (multi === 'true') {
      const current = answers[key];
      answers[key] = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
    } else answers[key] = answers[key] === value ? '' : value;
    renderQuestion();
  }));
  const paymentSelect = document.querySelector('#payment-choice');
  if (paymentSelect) paymentSelect.addEventListener('change', event => { answers.payment = event.target.value; });
  const outOfPocket = document.querySelector('#out-of-pocket');
  if (outOfPocket) outOfPocket.addEventListener('change', event => { answers.outOfPocket = event.target.checked; });
  const range = document.querySelector('#budget-range');
  if (range) range.addEventListener('input', event => {
    answers.budget = Number(event.target.value);
    document.querySelector('#budget-output').textContent = `৳${answers.budget.toLocaleString('en-US')}`;
  });
}

backButton.addEventListener('click', () => { if (currentStep > 0) { currentStep--; renderQuestion(); } });
continueButton.addEventListener('click', () => {
  if (currentStep < questions.length - 1) {
    currentStep++;
    try { sessionStorage.setItem('mindbridgeMatchAnswers', JSON.stringify(answers)); } catch {}
    renderQuestion();
    return;
  }
  try { sessionStorage.setItem('mindbridgeMatchAnswers', JSON.stringify(answers)); } catch {}
  window.location.href = 'therapist-search.html?matched=1';
});
renderQuestion();

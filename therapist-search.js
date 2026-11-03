const therapists = [
  { id:'nusrat', name:'Dr. Nusrat Jahan', credential:'MPhil, Clinical Psychologist', rating:4.9, reviews:128, match:94, price:2500, photo:'photo-1551836022-d5d88e9218df', specialties:['Anxiety','Depression','Trauma'], approaches:['CBT','Trauma-Informed'], payment:['Self-pay','Corporate'], location:'Dhanmondi, Dhaka', next:'Tomorrow, 10:00 AM', formats:['online'], languages:['Bangla','English'] },
  { id:'sharmeen', name:'Sharmeen Sultana', credential:'MPhil, Clinical Psychologist', rating:4.8, reviews:83, match:91, price:1500, photo:'photo-1551836022-d5d88e9218df', specialties:['Depression','Cultural identity','Trauma'], approaches:['Psychodynamic','CBT'], payment:['Self-pay','NGO referral'], location:'Rajshahi', next:'Fri, 9:00 AM', formats:['online'], languages:['Bangla','English'] },
  { id:'sajid', name:'Sajid Rahman', credential:'MSc, Counselling Psychologist', rating:4.8, reviews:94, match:88, price:2000, photo:'photo-1612349317150-e413f6a5b16d', specialties:['Stress','Relationships','Burnout'], approaches:['DBT','Humanistic'], payment:['Self-pay','Health card'], location:'Gulshan, Dhaka', next:'Today, 4:00 PM', formats:['online','in-person'], languages:['Bangla','English'] },
  { id:'farzana', name:'Dr. Farzana Karim', credential:'MBBS, MD (Psychiatry)', rating:4.9, reviews:67, match:82, price:3000, photo:'photo-1594824476967-48c8b964273f', specialties:['Personal growth','Grief','Anxiety'], approaches:['Psychodynamic','Mindfulness'], payment:['Self-pay','Corporate'], location:'Uttara, Dhaka', next:'Thu, 11:00 AM', formats:['online'], languages:['Bangla','English'] },
  { id:'tanvir', name:'Tanvir Ahmed', credential:'MSc, Counselling Psychologist', rating:4.7, reviews:51, match:79, price:1800, photo:'photo-1500648767791-00dcc994a43e', specialties:['Anxiety',"Men's issues",'LGBTQ+'], approaches:['CBT','Humanistic'], payment:['Self-pay','University referral'], location:'Chattogram', next:'Wed, 2:00 PM', formats:['in-person'], languages:['Bangla','English'] },
  { id:'mahmudul', name:'Mahmudul Hasan', credential:'MSc, Clinical Psychology', rating:4.6, reviews:39, match:75, price:2200, photo:'photo-1507003211169-0a1dd7228f2d', specialties:['Relationships','Couples','Stress'], approaches:['Emotionally Focused','CBT'], payment:['Self-pay','Corporate'], location:'Sylhet', next:'Mon, 6:00 PM', formats:['online','in-person'], languages:['Bangla','English','Sylheti'] }
];

const resultList = document.querySelector('#therapist-results');
const count = document.querySelector('#result-count');
const noResults = document.querySelector('#no-results');
const mapView = document.querySelector('#map-view');
const resultView = document.querySelector('#therapist-results');
let visibleTherapists = [...therapists];
let viewMode = 'list';
const isMatchFlow = new URLSearchParams(window.location.search).get('matched') === '1';
let matchPreferences = null;
try { matchPreferences = isMatchFlow ? JSON.parse(sessionStorage.getItem('mindbridgeMatchAnswers') || 'null') : null; } catch {}

if (matchPreferences) {
  const preferredBudget = Math.max(500, Math.min(5000, Number(matchPreferences.budget) || 5000));
  document.querySelector('#max-price').value = String(preferredBudget);
  document.querySelector('#price-label').textContent = preferredBudget >= 5000 ? '৳5,000+' : `৳${preferredBudget.toLocaleString('en-US')}`;
  const summary = document.querySelector('#match-summary');
  const focus = matchPreferences.concerns?.length ? ` for ${matchPreferences.concerns.join(', ').toLowerCase()}` : '';
  summary.textContent = `Your therapist matches${focus}, sorted by your preferences.`;
  summary.hidden = false;
}

const photoUrl = therapist => `https://images.unsplash.com/${therapist.photo}?auto=format&fit=crop&w=180&q=80`;
const tagMarkup = therapist => [...therapist.specialties, ...therapist.approaches].map(tag => `<span>${tag}</span>`).join('');
function matchScore(therapist) {
  if (!matchPreferences) return therapist.match;
  let score = therapist.match * .66;
  const concerns = (matchPreferences.concerns || []).map(item => item.toLowerCase());
  const profileConcerns = therapist.specialties.map(item => item.toLowerCase());
  score += concerns.filter(item => profileConcerns.includes(item)).length * 9;
  const wantedApproach = (matchPreferences.approaches || '').toLowerCase();
  if (wantedApproach && !wantedApproach.includes('no preference')) {
    const approach = wantedApproach.startsWith('cbt') ? 'cbt' : wantedApproach.startsWith('dbt') ? 'dbt' : wantedApproach.replace('-based','');
    if (therapist.approaches.some(item => item.toLowerCase().includes(approach))) score += 8;
  }
  const wantedFormat = (matchPreferences.format || '').toLowerCase();
  if (wantedFormat.startsWith('video') && therapist.formats.includes('online')) score += 5;
  if (wantedFormat === 'in-person' && therapist.formats.includes('in-person')) score += 5;
  if (wantedFormat === 'phone') score += 2;
  const wantedPayment = (matchPreferences.payment || '').toLowerCase();
  const paymentMatch = wantedPayment.includes('corporate') ? 'corporate' : wantedPayment.includes('ngo') ? 'ngo referral' : wantedPayment.includes('university') ? 'university referral' : wantedPayment === 'self-pay' ? 'self-pay' : '';
  if (paymentMatch && therapist.payment.some(item => item.toLowerCase() === paymentMatch)) score += 4;
  const gender = { nusrat:'female', sharmeen:'female', sajid:'male', farzana:'female', tanvir:'male', mahmudul:'male' }[therapist.id];
  const wantedGender = (matchPreferences.gender || '').toLowerCase();
  if (wantedGender && wantedGender !== 'no preference' && wantedGender === gender) score += 4;
  return Math.min(99, Math.round(score));
}

function cardMarkup(therapist) {
  return `<article class="result-card">
    <div class="result-main"><div class="result-avatar-wrap"><img class="result-avatar" src="${photoUrl(therapist)}" alt="${therapist.name}" loading="lazy"><span class="avatar-check" aria-label="Verified">✓</span></div>
      <div class="result-person"><h2 class="result-name">${therapist.name}</h2><p class="result-credential">${therapist.credential}</p><p class="result-rating">⭐ ${therapist.rating} <span>(${therapist.reviews})</span></p><div class="result-tags">${tagMarkup(therapist)}</div></div>
    </div>
    <div class="match-price"><span class="match-score">${matchScore(therapist)}% Match</span><strong>৳${therapist.price.toLocaleString('en-US')}/session</strong></div>
    <div class="result-meta"><span>Payment: ${therapist.payment.join(', ')}</span><span>${therapist.location}</span><span><i class="meta-icon">▦</i>Next: <b>${therapist.next}</b></span><span><i class="meta-icon">▣</i>${therapist.formats.includes('in-person') ? 'Online & In-person' : 'Online'}</span><span><i class="meta-icon">🌐</i>${therapist.languages.join(', ')}</span></div>
    <div class="result-actions"><a class="button" href="therapist-profile.html?id=${therapist.id}">View Profile</a><a class="button book-button" href="therapist-profile.html?id=${therapist.id}#booking-title">Book Session</a></div>
  </article>`;
}

function render() {
  const query = document.querySelector('#therapist-search').value.trim().toLowerCase();
  const specialty = document.querySelector('#specialty').value.toLowerCase();
  const approach = document.querySelector('#approach').value.toLowerCase();
  const payment = document.querySelector('#payment').value.toLowerCase();
  const maxPrice = Number(document.querySelector('#max-price').value);
  const format = document.querySelector('input[name="format"]:checked').value;

  visibleTherapists = therapists.filter(person => {
    const searchable = [person.name, person.credential, person.location, ...person.specialties, ...person.approaches].join(' ').toLowerCase();
    return (!query || searchable.includes(query)) &&
      (!specialty || person.specialties.some(value => value.toLowerCase() === specialty)) &&
      (!approach || person.approaches.some(value => value.toLowerCase() === approach)) &&
      (!payment || person.payment.some(value => value.toLowerCase() === payment)) &&
      person.price <= maxPrice && (!format || person.formats.includes(format));
  });

  const sort = document.querySelector('#sort-order').value;
  if (sort === 'price-low') visibleTherapists.sort((a,b) => a.price-b.price);
  if (sort === 'price-high') visibleTherapists.sort((a,b) => b.price-a.price);
  if (sort === 'rating') visibleTherapists.sort((a,b) => b.rating-a.rating);
  if (sort === 'match') visibleTherapists.sort((a,b) => matchScore(b)-matchScore(a));

  count.textContent = visibleTherapists.length;
  resultList.innerHTML = visibleTherapists.map(cardMarkup).join('');
  noResults.hidden = visibleTherapists.length > 0;
  resultView.hidden = viewMode === 'map' || visibleTherapists.length === 0;
  mapView.hidden = viewMode !== 'map' || visibleTherapists.length === 0;
  document.querySelectorAll('.map-pin').forEach(pin => {
    const person = therapists[Number(pin.dataset.card)];
    pin.hidden = !visibleTherapists.includes(person);
  });
  document.querySelector('#map-selected').innerHTML = 'Choose a marker on the map to see therapist details.';
}

['therapist-search','specialty','approach','payment','max-price','sort-order'].forEach(id => {
  document.querySelector(`#${id}`).addEventListener(id === 'therapist-search' ? 'input' : 'change', () => {
    if (id === 'max-price') document.querySelector('#price-label').textContent = Number(document.querySelector('#max-price').value) >= 5000 ? '৳5,000+' : `৳${Number(document.querySelector('#max-price').value).toLocaleString('en-US')}`;
    render();
  });
});
document.querySelectorAll('input[name="format"]').forEach(radio => radio.addEventListener('change', render));

function clearFilters() {
  document.querySelector('#therapist-search').value = '';
  document.querySelector('#specialty').value = '';
  document.querySelector('#approach').value = '';
  document.querySelector('#payment').value = '';
  document.querySelector('#max-price').value = '5000';
  document.querySelector('#price-label').textContent = '৳5,000+';
  document.querySelector('input[name="format"][value=""]').checked = true;
  document.querySelector('#sort-order').value = 'match';
  render();
}
document.querySelector('#clear-filters').addEventListener('click', clearFilters);
document.querySelector('#reset-from-empty').addEventListener('click', clearFilters);

document.querySelectorAll('.view-switch button').forEach(button => button.addEventListener('click', () => {
  viewMode = button.dataset.view;
  document.querySelectorAll('.view-switch button').forEach(item => item.classList.toggle('selected', item === button));
  render();
}));
document.querySelectorAll('.map-pin').forEach(pin => pin.addEventListener('click', () => {
  const person = therapists[Number(pin.dataset.card)];
  document.querySelectorAll('.map-pin').forEach(item => item.classList.toggle('active', item === pin));
  document.querySelector('#map-selected').innerHTML = `<h3>${person.name}</h3><p>${person.credential}</p><p>⭐ ${person.rating} · ${person.location}</p><p>৳${person.price.toLocaleString('en-US')} / session · ${person.formats.includes('in-person') ? 'Online & In-person' : 'Online'}</p><a class="button" href="therapist-profile.html?id=${person.id}">View profile</a>`;
}));

const filterPanel = document.querySelector('#filters');
const filterScrim = document.querySelector('#filter-scrim');
function closeFilters() { filterPanel.classList.remove('open'); filterScrim.classList.remove('visible'); }
document.querySelector('#open-filters').addEventListener('click', () => { filterPanel.classList.add('open'); filterScrim.classList.add('visible'); });
document.querySelector('.filter-close').addEventListener('click', closeFilters);
filterScrim.addEventListener('click', closeFilters);

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
render();

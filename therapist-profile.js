const profileDirectory = {
  nusrat: { name:'Dr. Nusrat Jahan', credential:'MPhil, Clinical Psychologist', rating:'4.9', reviews:128, match:94, price:2500, photo:'photo-1551836022-d5d88e9218df', experience:'12 years', languages:'BN, EN', focus:'anxiety and stress', specialties:['Anxiety','Depression','Trauma'], approaches:['CBT','Trauma-Informed','Mindfulness'], about:'Dr. Nusrat Jahan is a clinical psychologist with over 12 years of experience helping people navigate anxiety, depression, trauma, and life transitions. She creates a warm, non-judgmental space where clients feel safe to explore their thoughts and feelings.', approach:'Her approach is collaborative and goal-oriented, drawing primarily from Cognitive Behavioral Therapy (CBT) and trauma-informed principles. She works with adults and adolescents (16+) and has extensive experience with multicultural clients.', degrees:[['MPhil in Clinical Psychology','University of Dhaka, 2014'],['MSc in Clinical Psychology','University of Dhaka, 2012'],['BSc in Psychology','University of Dhaka, 2010']] },
  sharmeen: { name:'Sharmeen Sultana', credential:'MPhil, Clinical Psychologist', rating:'4.8', reviews:83, match:91, price:1500, photo:'photo-1551836022-d5d88e9218df', experience:'9 years', languages:'BN, EN', focus:'depression and trauma', specialties:['Depression','Cultural identity','Trauma'], approaches:['Psychodynamic','CBT'], about:'Sharmeen Sultana is a clinical psychologist who supports people working through depression, trauma, and questions of identity. She offers a thoughtful, culturally responsive space for clients to make sense of their experiences.', approach:'Her work draws on psychodynamic and cognitive behavioral approaches, shaped around each client’s goals and personal background. She works with adults and young people.', degrees:[['MPhil in Clinical Psychology','University of Rajshahi'],['MSc in Psychology','University of Dhaka'],['BSc in Psychology','University of Rajshahi']] },
  sajid: { name:'Sajid Rahman', credential:'MSc, Counselling Psychologist', rating:'4.8', reviews:94, match:88, price:2000, photo:'photo-1612349317150-e413f6a5b16d', experience:'8 years', languages:'BN, EN', focus:'stress and relationships', specialties:['Stress','Relationships','Burnout'], approaches:['DBT','Humanistic'], about:'Sajid Rahman is a counselling psychologist who helps clients manage stress, relationship challenges, and burnout. His practice centers on building a comfortable, respectful space where clients can explore change at their own pace.', approach:'Sajid combines DBT skills with a humanistic approach, helping clients identify practical ways to navigate difficult emotions and strengthen relationships.', degrees:[['MSc in Counselling Psychology','University of Dhaka'],['BSc in Psychology','University of Dhaka']] },
  farzana: { name:'Dr. Farzana Karim', credential:'MBBS, MD (Psychiatry)', rating:'4.9', reviews:67, match:82, price:3000, photo:'photo-1594824476967-48c8b964273f', experience:'10 years', languages:'BN, EN', focus:'anxiety and grief', specialties:['Personal growth','Grief','Anxiety'], approaches:['Psychodynamic','Mindfulness'], about:'Dr. Farzana Karim is a psychiatrist who supports people experiencing anxiety, grief, and periods of personal change. She takes time to understand each person’s circumstances and discuss care options clearly.', approach:'Her approach combines psychodynamic therapy and mindfulness practices. She works collaboratively with clients to develop a plan that reflects their needs and preferences.', degrees:[['MD in Psychiatry','Bangladesh Medical University'],['MBBS','Dhaka Medical College']] },
  tanvir: { name:'Tanvir Ahmed', credential:'MSc, Counselling Psychologist', rating:'4.7', reviews:51, match:79, price:1800, photo:'photo-1500648767791-00dcc994a43e', experience:'6 years', languages:'BN, EN', focus:'anxiety and identity', specialties:['Anxiety',"Men's issues",'LGBTQ+'], approaches:['CBT','Humanistic'], about:'Tanvir Ahmed is a counselling psychologist who works with anxiety, identity, and the challenges people face in relationships and everyday life. He aims to make sessions welcoming and affirming.', approach:'Tanvir draws on CBT and humanistic principles, adapting sessions to each client’s priorities and pace. He works with adults in a confidential and respectful setting.', degrees:[['MSc in Counselling Psychology','University of Chittagong'],['BSc in Psychology','University of Chittagong']] },
  mahmudul: { name:'Mahmudul Hasan', credential:'MSc, Clinical Psychology', rating:'4.6', reviews:39, match:75, price:2200, photo:'photo-1507003211169-0a1dd7228f2d', experience:'7 years', languages:'BN, EN, SYL', focus:'relationships and stress', specialties:['Relationships','Couples','Stress'], approaches:['Emotionally Focused','CBT'], about:'Mahmudul Hasan is a clinical psychologist who supports individuals and couples with relationship concerns, stress, and communication challenges. He values a calm, collaborative approach to care.', approach:'His practice draws on Emotionally Focused Therapy and CBT to help clients better understand patterns, communicate needs, and build practical coping strategies.', degrees:[['MSc in Clinical Psychology','Shahjalal University of Science and Technology'],['BSc in Psychology','University of Dhaka']] }
};

const profileId = new URLSearchParams(window.location.search).get('id') || 'nusrat';
const profile = profileDirectory[profileId] || profileDirectory.nusrat;
const displayPrice = `৳${profile.price.toLocaleString('en-US')}`;

document.title = `${profile.name} — Therapist Profile | MindBridge`;
document.querySelector('#profile-photo').src = `https://images.unsplash.com/${profile.photo}?auto=format&fit=crop&w=360&q=85`;
document.querySelector('#profile-photo').alt = profile.name;
document.querySelector('#profile-name').textContent = profile.name;
document.querySelector('#message-name').textContent = profile.name;
document.querySelector('#profile-credential').textContent = `${profile.credential} · Qualifications verified`;
document.querySelector('#profile-rating').textContent = profile.rating;
document.querySelector('#profile-reviews').textContent = profile.reviews;
document.querySelector('#profile-price').textContent = displayPrice;
document.querySelector('#profile-experience').textContent = profile.experience;
document.querySelector('#profile-languages').textContent = profile.languages;
document.querySelector('#match-score').textContent = `${profile.match}%`;
document.querySelector('#match-specialties').textContent = profile.focus;

const tabPanel = document.querySelector('#tab-panel');
function renderTab(name) {
  if (name === 'specialties') {
    tabPanel.innerHTML = `<h2>Areas of support</h2><p>Explore the concerns and therapy approaches ${profile.name} works with.</p><div class="specialty-content">${profile.specialties.map(item => `<article class="specialty-item"><h3>${item}</h3><p>Personalized support shaped around your experiences, needs, and goals.</p></article>`).join('')}${profile.approaches.map(item => `<article class="specialty-item"><h3>${item}</h3><p>A therapeutic approach used in collaboration with you and your care goals.</p></article>`).join('')}</div>`;
    return;
  }
  if (name === 'reviews') {
    tabPanel.innerHTML = `<h2>Client reviews</h2><div class="review-summary"><strong>${profile.rating}</strong><div><span>★★★★★</span><p>Based on ${profile.reviews} reviews</p></div></div><article class="review-item"><header><h3>A thoughtful and supportive experience</h3><time>Recent client</time></header><div class="review-stars">★★★★★</div><p>“I felt listened to and supported throughout the session. We discussed practical next steps at a pace that felt comfortable.”</p></article><article class="review-item"><header><h3>Warm and professional</h3><time>Recent client</time></header><div class="review-stars">★★★★★</div><p>“The session was welcoming, clear, and helpful. I appreciated having space to talk openly.”</p></article><p class="review-note">Reviews are shared anonymously to protect client privacy.</p>`;
    return;
  }
  tabPanel.innerHTML = `<h2>About ${profile.name.replace(/^Dr\. /,'Dr. ')}</h2><p>${profile.about}</p><p>${profile.approach}</p><h2 class="education-title">Education</h2><ul class="education-list">${profile.degrees.map(([degree,school]) => `<li>${degree}<small>${school}</small></li>`).join('')}</ul><div class="profile-bottom-info"><div><h3>Payment accepted</h3><div class="info-tags"><span>bKash</span><span>Nagad</span><span>Card</span><span>Cash</span></div></div><div><h3>Session format</h3><div class="info-tags"><span class="format-tag">Video</span><span class="format-tag">In-person</span></div></div></div>`;
}
renderTab('about');
document.querySelectorAll('.profile-tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.profile-tab').forEach(item => {
    const selected = item === tab;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-selected', String(selected));
  });
  renderTab(tab.dataset.tab);
}));

document.querySelectorAll('.day-option').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.day-option').forEach(item => item.classList.toggle('selected', item === button));
  document.querySelector('#booking-feedback').textContent = '';
}));
document.querySelectorAll('.time-option').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.time-option').forEach(item => item.classList.toggle('selected', item === button));
  document.querySelector('#booking-feedback').textContent = '';
}));
document.querySelector('#book-appointment').addEventListener('click', () => {
  const time = document.querySelector('.time-option.selected');
  if (!time) {
    document.querySelector('#booking-feedback').textContent = 'Choose an available time to continue.';
    return;
  }
  const day = document.querySelector('.day-option.selected').dataset.day;
  document.querySelector('#booking-feedback').textContent = `${day} at ${time.dataset.time} selected. Sign in to complete your booking.`;
});

const messageDialog = document.querySelector('#message-dialog');
document.querySelector('#open-message').addEventListener('click', () => messageDialog.showModal());
document.querySelector('#send-message').addEventListener('click', event => {
  const message = messageDialog.querySelector('textarea');
  if (!message.value.trim()) { event.preventDefault(); message.focus(); return; }
  document.querySelector('#booking-feedback').textContent = 'Your message is ready. Sign in to send it securely.';
  message.value = '';
});
messageDialog.addEventListener('click', event => { if (event.target === messageDialog) messageDialog.close(); });

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

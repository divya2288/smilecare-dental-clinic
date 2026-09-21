/**
 * SmileCare — Modern Patient-First Dental Clinic Interactive Platform
 * Pure Vanilla JavaScript: State Management, Interactive Features & LocalStorage
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initClinicStatus();
  initSmileCheck();
  initDentalScore();
  initBookingWizard();
  initToothGuide();
  initDentalJourney();
  initServicesFilter();
  initTestimonialCarousel();
  initContactForm();
  initBackToTop();
  updateMyAppointmentsBadge();
});

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem('smilecare_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  applyTheme(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('smilecare_theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }
}

/* ==========================================================================
   2. Live Clinic Open / Closed Status
   ========================================================================== */
function initClinicStatus() {
  const statusElement = document.getElementById('liveClinicStatus');
  if (!statusElement) return;

  const now = new Date();
  const day = now.getDay(); // 0 is Sunday, 6 is Saturday
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTimeInMinutes = hour * 60 + minute;

  let isOpen = false;

  // Monday to Saturday: 8:00 AM (480 min) to 8:00 PM (1200 min)
  // Sunday: 9:00 AM (540 min) to 2:00 PM (840 min)
  if (day >= 1 && day <= 6) {
    isOpen = currentTimeInMinutes >= 480 && currentTimeInMinutes <= 1200;
  } else if (day === 0) {
    isOpen = currentTimeInMinutes >= 540 && currentTimeInMinutes <= 840;
  }

  if (isOpen) {
    statusElement.innerHTML = `<span class="badge-pulse text-success fw-bold">● Open Now</span> <span class="text-muted">| Welcoming Patients Today</span>`;
  } else {
    statusElement.innerHTML = `<span class="text-warning fw-bold"><i class="fa-regular fa-clock me-1"></i> Closed Now</span> <span class="text-muted">| Opens 8:00 AM Tomorrow</span>`;
  }
}

/* ==========================================================================
   3. Toast Notification Engine
   ========================================================================== */
function showToast(message, type = 'info', duration = 3800) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container-custom';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `custom-toast toast-${type}`;

  let icon = 'fa-circle-info text-primary';
  if (type === 'success') icon = 'fa-circle-check text-success';
  if (type === 'warning') icon = 'fa-triangle-exclamation text-warning';
  if (type === 'danger') icon = 'fa-circle-xmark text-danger';

  toast.innerHTML = `
    <i class="fa-solid ${icon} fs-5"></i>
    <div class="flex-grow-1">
      <p class="mb-0 fw-medium small">${message}</p>
    </div>
    <button type="button" class="btn-close btn-close-sm" aria-label="Close"></button>
  `;

  const closeBtn = toast.querySelector('.btn-close');
  closeBtn.addEventListener('click', () => {
    toast.remove();
  });

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ==========================================================================
   4. UNIQUE FEATURE 1: SmileCheck™ Interactive Symptom Guide
   ========================================================================== */
const symptomDatabase = {
  'tooth-pain': {
    title: 'Tooth Pain or Ache',
    question: 'How would you characterize the pain sensation?',
    options: [
      { text: 'Sharp & intense when chewing/biting', tag: 'Bite Pressure' },
      { text: 'Constant dull throbbing ache', tag: 'Deep Pulp Ache' },
      { text: 'Lingering pain after hot/cold drinks', tag: 'Nerve Response' },
      { text: 'Sudden spontaneous pain at night', tag: 'Acute Flare-up' }
    ],
    evaluate: (optionIndex) => {
      if (optionIndex === 3 || optionIndex === 1) {
        return {
          urgency: 'high',
          urgencyText: 'Prompt Evaluation Advised',
          recommendation: 'Persistent or nocturnal throbbing often suggests inflammation or infection within the inner pulp of the tooth. An immediate clinical evaluation can relieve pain and prevent further progression.',
          serviceId: 'root-canal',
          serviceName: 'Root Canal & Pulp Therapy',
          serviceCategory: 'Restorative'
        };
      }
      return {
        urgency: 'medium',
        urgencyText: 'Schedule Routine Visit',
        recommendation: 'Pain triggered upon biting or temperature shifts commonly indicates early enamel decay, a micro-fracture, or a loose filling that warrants professional restorative attention.',
        serviceId: 'dental-fillings',
        serviceName: 'Composite Tooth Restoration',
        serviceCategory: 'Restorative'
      };
    }
  },
  'gum-bleeding': {
    title: 'Bleeding or Sensitive Gums',
    question: 'When do you primarily observe gum bleeding?',
    options: [
      { text: 'Occasional light bleeding when flossing', tag: 'Flossing Spot' },
      { text: 'Bleeds consistently during gentle brushing', tag: 'Brushing Trigger' },
      { text: 'Gums appear red, tender, or puffy', tag: 'Inflammation' },
      { text: 'Spontaneous bleeding without irritation', tag: 'Active Bleed' }
    ],
    evaluate: (optionIndex) => {
      const isUrgent = optionIndex >= 2;
      return {
        urgency: isUrgent ? 'medium' : 'low',
        urgencyText: isUrgent ? 'Attention Recommended' : 'Preventive Care',
        recommendation: 'Bleeding gums are the hallmark sign of gingival inflammation caused by plaque buildup along the gumline. Professional ultrasonic scaling and periodontal therapy can swiftly restore gum tissue health.',
        serviceId: 'deep-cleaning',
        serviceName: 'Periodontal Therapy & Scaling',
        serviceCategory: 'Preventive'
      };
    }
  },
  'tooth-sensitivity': {
    title: 'Tooth Sensitivity',
    question: 'What triggers your tooth sensitivity most intensely?',
    options: [
      { text: 'Ice-cold water or cold air', tag: 'Cold Stimuli' },
      { text: 'Hot coffee, tea, or warm soups', tag: 'Thermal Heat' },
      { text: 'Sweet confectionery or citrus fruits', tag: 'Osmotic / Acid' },
      { text: 'Brushing bristles touching the gumline', tag: 'Cervical Wear' }
    ],
    evaluate: (optionIndex) => {
      return {
        urgency: optionIndex === 1 ? 'medium' : 'low',
        urgencyText: optionIndex === 1 ? 'Schedule Checkup' : 'Routine Care',
        recommendation: 'Sensitivity occurs when protective enamel wears down or gums recede, exposing the microscopic tubules of the underlying dentin. Specialized in-office desensitizers and remineralizing therapies effectively seal these pathways.',
        serviceId: 'fluoride-treatment',
        serviceName: 'Enamel Remineralization & Sealant',
        serviceCategory: 'Preventive'
      };
    }
  },
  'broken-tooth': {
    title: 'Broken, Chipped, or Damaged Tooth',
    question: 'What is the current condition of the damaged tooth?',
    options: [
      { text: 'Minor cosmetic chip on front edge', tag: 'Cosmetic Chip' },
      { text: 'Lost large filling or jagged corner', tag: 'Lost Filling' },
      { text: 'Significant fracture with sharp edges', tag: 'Structural Crack' },
      { text: 'Cracked tooth with sharp nerve pain', tag: 'Exposed Nerve' }
    ],
    evaluate: (optionIndex) => {
      const isHigh = optionIndex >= 2;
      return {
        urgency: isHigh ? 'high' : 'medium',
        urgencyText: isHigh ? 'Priority Attention' : 'Schedule Repair',
        recommendation: 'A fractured tooth compromises the structural barrier against oral bacteria and can irritate the soft tongue and cheek tissues. Modern composite bonding, ceramic onlays, or crowns restore complete aesthetics and chewing capability.',
        serviceId: 'dental-crowns',
        serviceName: 'Ceramic Crowns & Cosmetic Bonding',
        serviceCategory: 'Cosmetic'
      };
    }
  },
  'bad-breath': {
    title: 'Persistent Bad Breath (Halitosis)',
    question: 'How long has the persistent odor or unusual taste lasted?',
    options: [
      { text: 'Noticeable only after waking up', tag: 'Morning Odor' },
      { text: 'Persists all day despite brushing & mouthwash', tag: 'Chronic Odor' },
      { text: 'Accompanied by a strange metallic taste', tag: 'Metallic Taste' },
      { text: 'Accompanied by dry mouth sensation', tag: 'Xerostomia' }
    ],
    evaluate: (optionIndex) => {
      return {
        urgency: 'low',
        urgencyText: 'Preventive Guidance',
        recommendation: 'Chronic halitosis often originates from anaerobic bacteria sheltering in deep gum pockets, tongue crevices, or hidden interdental spaces. A comprehensive hygiene detox and microbial evaluation will resolve the root cause.',
        serviceId: 'routine-checkup',
        serviceName: 'Comprehensive Oral Hygiene & Detox',
        serviceCategory: 'Preventive'
      };
    }
  },
  'swelling': {
    title: 'Oral or Facial Swelling',
    question: 'Where is the swelling located and how severe is it?',
    options: [
      { text: 'Small localized pimple/bubble on gum', tag: 'Gum Pimple' },
      { text: 'Swollen cheek or jawline noticeably tender', tag: 'Facial Swelling' },
      { text: 'Swelling with fever or general fatigue', tag: 'Systemic Symptom' },
      { text: 'Swollen wisdom tooth area at back', tag: 'Pericoronitis' }
    ],
    evaluate: (optionIndex) => {
      return {
        urgency: 'high',
        urgencyText: 'Urgent Care Recommended',
        recommendation: 'Swelling in the gums or facial tissue can signify an active bacterial infection or abscess that requires timely clinical drainage and targeted antibiotic or dental intervention to prevent systemic spread.',
        serviceId: 'emergency-care',
        serviceName: 'Emergency Oral Infection Care',
        serviceCategory: 'Emergency'
      };
    }
  }
};

let currentSelectedSymptom = null;

function initSmileCheck() {
  const symptomButtons = document.querySelectorAll('.symptom-btn');
  const followupContainer = document.getElementById('smilecheckFollowup');
  const resultContainer = document.getElementById('smilecheckResult');

  if (!symptomButtons.length || !followupContainer || !resultContainer) return;

  symptomButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      symptomButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      const symptomKey = btn.getAttribute('data-symptom');
      currentSelectedSymptom = symptomKey;
      renderFollowup(symptomKey);
    });
  });

  function renderFollowup(symptomKey) {
    const data = symptomDatabase[symptomKey];
    if (!data) return;

    resultContainer.innerHTML = '';
    resultContainer.classList.add('d-none');

    followupContainer.innerHTML = `
      <div class="followup-box">
        <h5 class="fw-bold mb-2 text-primary-custom">
          <i class="fa-solid fa-circle-question me-2"></i> Follow-up for ${data.title}
        </h5>
        <p class="text-muted mb-3">${data.question}</p>
        <div class="followup-options" id="followupOptions">
          ${data.options.map((opt, idx) => `
            <button type="button" class="followup-chip" data-index="${idx}">
              <span class="badge bg-light text-dark me-1">${opt.tag}</span> ${opt.text}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    followupContainer.classList.remove('d-none');

    const chips = followupContainer.querySelectorAll('.followup-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const optIndex = parseInt(chip.getAttribute('data-index'), 10);
        renderResult(symptomKey, optIndex);
      });
    });
  }

  function renderResult(symptomKey, optionIndex) {
    const data = symptomDatabase[symptomKey];
    const evaluation = data.evaluate(optionIndex);

    let badgeClass = 'urgency-low';
    let iconClass = 'fa-circle-check';
    if (evaluation.urgency === 'medium') {
      badgeClass = 'urgency-medium';
      iconClass = 'fa-clock';
    } else if (evaluation.urgency === 'high') {
      badgeClass = 'urgency-high';
      iconClass = 'fa-triangle-exclamation';
    }

    resultContainer.innerHTML = `
      <div class="smilecheck-result-card">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <div class="urgency-badge ${badgeClass}">
            <i class="fa-solid ${iconClass}"></i> ${evaluation.urgencyText}
          </div>
          <span class="badge bg-secondary-subtle text-secondary-custom px-3 py-2 rounded-pill fw-semibold">
            Educational Assessment
          </span>
        </div>

        <h4 class="fw-bold mb-2">Guidance & Next Steps</h4>
        <p class="text-muted mb-4">${evaluation.recommendation}</p>

        <div class="p-3 rounded-3 bg-surface border mb-4">
          <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div>
              <span class="text-muted small text-uppercase fw-bold">Recommended Clinical Service:</span>
              <h5 class="fw-bold mb-0 text-primary-custom">${evaluation.serviceName}</h5>
            </div>
            <button type="button" class="btn-custom-primary btn-custom-sm" id="btnBookFromCheck" data-service="${evaluation.serviceId}">
              <i class="fa-solid fa-calendar-check me-1"></i> Book This Service
            </button>
          </div>
        </div>

        <div class="disclaimer-alert">
          <i class="fa-solid fa-triangle-exclamation text-warning fs-5 flex-shrink-0"></i>
          <div>
            <strong>Important Medical Notice:</strong>
            <p class="mb-0">This tool provides general educational guidance and is not a medical diagnosis. Please consult a qualified dental professional for personal clinical advice.</p>
          </div>
        </div>
      </div>
    `;

    resultContainer.classList.remove('d-none');
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const bookBtn = document.getElementById('btnBookFromCheck');
    if (bookBtn) {
      bookBtn.addEventListener('click', () => {
        const serviceId = bookBtn.getAttribute('data-service');
        prefillBookingService(serviceId);
      });
    }
  }
}

/* ==========================================================================
   5. UNIQUE FEATURE 2: Dental Health Score Questionnaire
   ========================================================================== */
const quizQuestions = [
  {
    question: 'How often do you brush your teeth each day?',
    subtitle: 'Optimal brushing cleans food particles and disrupts bacterial biofilm.',
    options: [
      { text: 'Twice daily or more for 2 full minutes', points: 20, feedback: 'Great brushing consistency!' },
      { text: 'Once daily (usually mornings)', points: 10, feedback: 'Add a bedtime brushing routine to protect enamel overnight.' },
      { text: 'Irregularly or quickly under 1 minute', points: 0, feedback: 'Commit to 2 minutes twice a day using a soft-bristled brush.' }
    ]
  },
  {
    question: 'How consistently do you clean between your teeth (floss / interdental)?',
    subtitle: 'Brushing only reaches 60% of tooth surfaces; flossing cleans the rest.',
    options: [
      { text: 'Every single day without fail', points: 20, feedback: 'Superb interdental hygiene!' },
      { text: '2 to 3 times per week', points: 12, feedback: 'Try placing floss next to your toothbrush to make it daily.' },
      { text: 'Rarely or never', points: 0, feedback: 'Start with gentle floss picks or water flosser once per day.' }
    ]
  },
  {
    question: 'Do your gums bleed when you brush or floss?',
    subtitle: 'Healthy gums never bleed from standard brushing.',
    options: [
      { text: 'Never — firm, pink, and comfortable', points: 20, feedback: 'Healthy gingival tissue!' },
      { text: 'Occasionally during vigorous brushing', points: 10, feedback: 'Gentle circular brushing prevents micro-abrasions.' },
      { text: 'Frequently or spontaneously', points: 0, feedback: 'Frequent bleeding is an early sign of gingivitis requiring cleaning.' }
    ]
  },
  {
    question: 'When did you last visit a dentist for a checkup & professional cleaning?',
    subtitle: 'Plaque hardens into tartar (calculus) that only dental tools can remove.',
    options: [
      { text: 'Within the last 6 months', points: 20, feedback: 'Perfect preventive routine!' },
      { text: 'Between 6 to 12 months ago', points: 12, feedback: 'You are due for your routine 6-month wellness checkup.' },
      { text: 'Over a year ago (or only when in pain)', points: 0, feedback: 'Schedule an exam to catch hidden issues before they cause pain.' }
    ]
  },
  {
    question: 'Do you experience sharp sensitivity to hot, cold, or sweet treats?',
    subtitle: 'Sensitivity indicates microscopic exposure in your dentin tubules.',
    options: [
      { text: 'None at all — no discomfort', points: 20, feedback: 'Strong protective enamel layer!' },
      { text: 'Mild occasional sensitivity with iced drinks', points: 10, feedback: 'Try a potassium nitrate remineralizing toothpaste.' },
      { text: 'Severe or lingering sensitivity', points: 0, feedback: 'Clinical evaluation can seal exposed roots or fix hidden micro-cracks.' }
    ]
  }
];

let currentQuizIndex = 0;
let userQuizAnswers = [];

function initDentalScore() {
  const container = document.getElementById('quizStepContainer');
  const resultsContainer = document.getElementById('quizResultContainer');
  const progressBar = document.getElementById('quizProgressBar');
  const questionNumber = document.getElementById('quizQuestionNum');

  if (!container || !resultsContainer) return;

  renderQuestion();

  function renderQuestion() {
    if (currentQuizIndex >= quizQuestions.length) {
      showScoreResults();
      return;
    }

    const q = quizQuestions[currentQuizIndex];
    if (progressBar) {
      progressBar.style.width = `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%`;
    }
    if (questionNumber) {
      questionNumber.innerText = `Question ${currentQuizIndex + 1} of ${quizQuestions.length}`;
    }

    container.innerHTML = `
      <div class="animate-fade-in">
        <h4 class="fw-bold mb-2">${q.question}</h4>
        <p class="text-muted mb-4">${q.subtitle}</p>
        <div class="quiz-options">
          ${q.options.map((opt, i) => `
            <div class="quiz-option-card" data-idx="${i}">
              <div class="d-flex align-items-center">
                <span class="step-circle me-3 fs-6" style="width: 32px; height: 32px;">${String.fromCharCode(65 + i)}</span>
                <span class="text-main">${opt.text}</span>
              </div>
              <i class="fa-regular fa-circle text-muted"></i>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const cards = container.querySelectorAll('.quiz-option-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const selectedIdx = parseInt(card.getAttribute('data-idx'), 10);
        userQuizAnswers[currentQuizIndex] = q.options[selectedIdx];

        card.classList.add('selected');
        const icon = card.querySelector('i');
        if (icon) {
          icon.className = 'fa-solid fa-circle-check text-primary-custom';
        }

        setTimeout(() => {
          currentQuizIndex++;
          renderQuestion();
        }, 350);
      });
    });
  }

  function showScoreResults() {
    container.classList.add('d-none');
    resultsContainer.classList.remove('d-none');

    const totalScore = userQuizAnswers.reduce((sum, item) => sum + item.points, 0);

    let statusTitle = 'Optimal Dental Health';
    let statusClass = 'text-success';
    let strokeColor = '#10b981';
    let summaryText = 'Outstanding! Your oral care habits protect your teeth and gums exceptionally well.';

    if (totalScore < 50) {
      statusTitle = 'High Care Required';
      statusClass = 'text-danger';
      strokeColor = '#ef4444';
      summaryText = 'Your habits show significant vulnerabilities to tooth decay and gum disease. Professional care is strongly advised.';
    } else if (totalScore < 75) {
      statusTitle = 'Needs Improvement';
      statusClass = 'text-warning';
      strokeColor = '#f59e0b';
      summaryText = 'You have decent basics, but a few critical consistency gaps leave your smile vulnerable.';
    } else if (totalScore < 90) {
      statusTitle = 'Good Dental Foundation';
      statusClass = 'text-primary-custom';
      strokeColor = '#0284c7';
      summaryText = 'Great job! With just a couple of small habit tweaks, you can achieve comprehensive protection.';
    }

    resultsContainer.innerHTML = `
      <div class="animate-fade-in text-center">
        <div class="score-gauge-wrapper">
          <svg viewBox="0 0 36 36" class="circular-chart">
            <path class="circle-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path class="circle"
              id="scoreAnimatedCircle"
              stroke="${strokeColor}"
              stroke-dasharray="0, 100"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="19" class="percentage">${totalScore}%</text>
            <text x="18" y="24" class="score-label">CARE SCORE</text>
          </svg>
        </div>

        <h3 class="fw-bold ${statusClass} mb-2">${statusTitle}</h3>
        <p class="text-muted max-w-500 mx-auto mb-4">${summaryText}</p>

        <h5 class="fw-bold text-start mb-3">Customized Action Items for You:</h5>
        <div class="tips-grid text-start mb-4">
          ${userQuizAnswers.map((ans, idx) => `
            <div class="tip-card">
              <i class="fa-solid fa-tooth"></i>
              <div>
                <strong class="d-block mb-1 small text-primary-custom">Tip #${idx + 1}</strong>
                <p class="mb-0 small text-muted">${ans.feedback}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="d-flex flex-wrap justify-content-center gap-3 mb-3">
          <button type="button" class="btn-custom-secondary" id="btnRetakeQuiz">
            <i class="fa-solid fa-rotate-left me-1"></i> Retake Scorecard
          </button>
          <a href="#appointment" class="btn-custom-primary">
            <i class="fa-solid fa-calendar-check me-1"></i> Book Checkup & Cleaning
          </a>
        </div>

        <div class="disclaimer-alert text-start">
          <i class="fa-solid fa-circle-info text-primary-custom fs-5 flex-shrink-0"></i>
          <div>
            <strong>Educational Wellness Disclaimer:</strong>
            <p class="mb-0 small">This score is an educational wellness estimate based on patient self-reported habits and does not represent a clinical examination or diagnosis.</p>
          </div>
        </div>
      </div>
    `;

    // Trigger stroke animation smoothly
    setTimeout(() => {
      const circle = document.getElementById('scoreAnimatedCircle');
      if (circle) {
        circle.setAttribute('stroke-dasharray', `${totalScore}, 100`);
      }
    }, 100);

    const retakeBtn = document.getElementById('btnRetakeQuiz');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => {
        currentQuizIndex = 0;
        userQuizAnswers = [];
        resultsContainer.classList.add('d-none');
        container.classList.remove('d-none');
        renderQuestion();
      });
    }
  }
}

/* ==========================================================================
   6. UNIQUE FEATURE 3: Smart Multi-Step Appointment Booking
   ========================================================================== */
const clinicServices = [
  { id: 'routine-checkup', name: 'Comprehensive Exam & Cleaning', category: 'Preventive', price: '$89', duration: '45 mins', desc: 'Full-mouth exam, digital X-rays, ultrasonic scaling, and personalized hygiene roadmap.' },
  { id: 'deep-cleaning', name: 'Periodontal Deep Scaling', category: 'Preventive', price: '$149', duration: '60 mins', desc: 'Deep subgingival plaque and calculus removal for inflamed or bleeding gums.' },
  { id: 'teeth-whitening', name: 'Laser Teeth Whitening', category: 'Cosmetic', price: '$199', duration: '60 mins', desc: 'Professional clinic power bleaching lightening smiles up to 8 shades in one visit.' },
  { id: 'dental-crowns', name: 'Ceramic Crowns & Bonding', category: 'Cosmetic', price: '$299', duration: '75 mins', desc: 'Natural shade-matched porcelain crowns and veneers to repair chips or gaps.' },
  { id: 'clear-aligners', name: 'Clear Aligners & Ortho Consult', category: 'Orthodontics', price: '$120', duration: '45 mins', desc: '3D digital intraoral scan and computerized orthodontic alignment treatment plan.' },
  { id: 'root-canal', name: 'Painless Root Canal Therapy', category: 'Restorative', price: '$349', duration: '90 mins', desc: 'Gentle, modern rotary endodontic treatment relieving pain and saving natural teeth.' },
  { id: 'dental-fillings', name: 'Composite Tooth-Colored Fillings', category: 'Restorative', price: '$110', duration: '45 mins', desc: 'Mercury-free biocompatible resin fillings matching your tooth shade flawlessly.' },
  { id: 'emergency-care', name: 'Same-Day Emergency Pain Relief', category: 'Emergency', price: '$95', duration: '30 mins', desc: 'Immediate priority triage for severe toothache, swelling, or sudden oral trauma.' }
];

const clinicDoctors = [
  { id: 'doc-sarah', name: 'Dr. Sarah Mitchell, DDS', title: 'Lead Cosmetic & Restorative Dentist', avatar: 'assets/doctor_sarah.jpg' },
  { id: 'doc-david', name: 'Dr. David Chen, DMD', title: 'Specialist Orthodontist & Clear Aligners', avatar: 'assets/doctor_david.jpg' },
  { id: 'doc-elena', name: 'Dr. Elena Rostova, DDS', title: 'Pediatric & Implant Specialist', avatar: 'assets/doctor_elena.jpg' },
  { id: 'doc-any', name: 'First Available Specialist', title: 'Fastest appointment time slot', avatar: 'assets/hero_dentist.jpg' }
];

const availableTimeSlots = [
  '09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM',
  '01:30 PM', '02:15 PM', '03:00 PM', '03:45 PM',
  '04:30 PM', '05:15 PM', '06:00 PM'
];

let bookingState = {
  currentStep: 1,
  service: null,
  doctor: clinicDoctors[3], // default first available
  date: '',
  time: '',
  patientName: '',
  patientEmail: '',
  patientPhone: '',
  patientNotes: '',
  isFirstTime: true
};

function initBookingWizard() {
  const steps = [1, 2, 3, 4];
  const dateInput = document.getElementById('bookingDateInput');

  // Set min date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
    bookingState.date = today;

    dateInput.addEventListener('change', (e) => {
      bookingState.date = e.target.value;
    });
  }

  renderBookingServices();
  renderBookingDoctors();
  renderBookingTimeSlots();
  setupBookingNavigation();
  loadSavedAppointments();
}

function renderBookingServices() {
  const container = document.getElementById('bookingServicesGrid');
  if (!container) return;

  container.innerHTML = clinicServices.map(svc => `
    <div class="col-md-6 mb-3">
      <div class="booking-service-item ${bookingState.service?.id === svc.id ? 'selected' : ''}" data-service-id="${svc.id}">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <span class="badge bg-primary-subtle text-primary-custom fw-semibold">${svc.category}</span>
          <span class="fw-bold text-secondary-custom">${svc.price}</span>
        </div>
        <h6 class="fw-bold mb-1">${svc.name}</h6>
        <p class="text-muted small mb-2">${svc.desc}</p>
        <div class="d-flex justify-content-between align-items-center text-muted small mt-auto pt-2 border-top">
          <span><i class="fa-regular fa-clock me-1"></i> ${svc.duration}</span>
          <span class="text-primary-custom fw-semibold select-text">Select <i class="fa-solid fa-arrow-right ms-1"></i></span>
        </div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.booking-service-item').forEach(item => {
    item.addEventListener('click', () => {
      container.querySelectorAll('.booking-service-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      const svcId = item.getAttribute('data-service-id');
      bookingState.service = clinicServices.find(s => s.id === svcId);
    });
  });
}

function renderBookingDoctors() {
  const container = document.getElementById('bookingDoctorsGrid');
  if (!container) return;

  container.innerHTML = clinicDoctors.map(doc => `
    <div class="col-md-6 mb-3">
      <div class="doctor-select-card ${bookingState.doctor?.id === doc.id ? 'selected' : ''}" data-doc-id="${doc.id}">
        <img src="${doc.avatar}" alt="${doc.name}" class="doctor-select-avatar" />
        <div>
          <h6 class="fw-bold mb-1">${doc.name}</h6>
          <small class="text-muted d-block">${doc.title}</small>
        </div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.doctor-select-card').forEach(card => {
    card.addEventListener('click', () => {
      container.querySelectorAll('.doctor-select-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const docId = card.getAttribute('data-doc-id');
      bookingState.doctor = clinicDoctors.find(d => d.id === docId);
    });
  });
}

function renderBookingTimeSlots() {
  const container = document.getElementById('bookingTimeSlotsGrid');
  if (!container) return;

  container.innerHTML = availableTimeSlots.map(slot => `
    <div class="col-6 col-md-3 mb-3">
      <div class="time-slot-badge ${bookingState.time === slot ? 'selected' : ''}" data-time="${slot}">
        <i class="fa-regular fa-clock me-1"></i> ${slot}
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.time-slot-badge').forEach(badge => {
    badge.addEventListener('click', () => {
      container.querySelectorAll('.time-slot-badge').forEach(b => b.classList.remove('selected'));
      badge.classList.add('selected');
      bookingState.time = badge.getAttribute('data-time');
    });
  });
}

function setupBookingNavigation() {
  const nextBtn = document.getElementById('bookingNextBtn');
  const prevBtn = document.getElementById('bookingPrevBtn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (validateCurrentStep()) {
        if (bookingState.currentStep < 4) {
          goToStep(bookingState.currentStep + 1);
        } else {
          submitBooking();
        }
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (bookingState.currentStep > 1) {
        goToStep(bookingState.currentStep - 1);
      }
    });
  }
}

function validateCurrentStep() {
  if (bookingState.currentStep === 1) {
    if (!bookingState.service) {
      showToast('Please select a dental service to proceed.', 'warning');
      return false;
    }
    return true;
  }

  if (bookingState.currentStep === 2) {
    const dateInput = document.getElementById('bookingDateInput');
    if (!dateInput || !dateInput.value) {
      showToast('Please pick a preferred appointment date.', 'warning');
      return false;
    }
    bookingState.date = dateInput.value;
    return true;
  }

  if (bookingState.currentStep === 3) {
    if (!bookingState.time) {
      showToast('Please select an available time slot.', 'warning');
      return false;
    }
    return true;
  }

  if (bookingState.currentStep === 4) {
    const nameInput = document.getElementById('patientNameInput');
    const emailInput = document.getElementById('patientEmailInput');
    const phoneInput = document.getElementById('patientPhoneInput');

    if (!nameInput.value.trim()) {
      showToast('Please enter the patient’s full name.', 'warning');
      nameInput.focus();
      return false;
    }
    if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
      showToast('Please provide a valid email address.', 'warning');
      emailInput.focus();
      return false;
    }
    if (!phoneInput.value.trim() || phoneInput.value.length < 7) {
      showToast('Please provide a valid contact phone number.', 'warning');
      phoneInput.focus();
      return false;
    }

    bookingState.patientName = nameInput.value.trim();
    bookingState.patientEmail = emailInput.value.trim();
    bookingState.patientPhone = phoneInput.value.trim();
    bookingState.patientNotes = document.getElementById('patientNotesInput')?.value.trim() || '';
    bookingState.isFirstTime = document.getElementById('patientFirstTimeCheck')?.checked ?? true;

    return true;
  }

  return true;
}

function goToStep(stepNumber) {
  bookingState.currentStep = stepNumber;

  // Update step panes
  document.querySelectorAll('.step-pane').forEach((pane, idx) => {
    pane.classList.toggle('active', idx + 1 === stepNumber);
  });

  // Update stepper UI
  document.querySelectorAll('.booking-step').forEach((stepElem, idx) => {
    const sNum = idx + 1;
    stepElem.classList.remove('active', 'completed');
    if (sNum < stepNumber) {
      stepElem.classList.add('completed');
    } else if (sNum === stepNumber) {
      stepElem.classList.add('active');
    }
  });

  // Update buttons
  const prevBtn = document.getElementById('bookingPrevBtn');
  const nextBtn = document.getElementById('bookingNextBtn');

  if (prevBtn) {
    prevBtn.classList.toggle('d-none', stepNumber === 1);
  }
  if (nextBtn) {
    if (stepNumber === 4) {
      nextBtn.innerHTML = `<i class="fa-solid fa-check me-1"></i> Confirm & Book Appointment`;
    } else {
      nextBtn.innerHTML = `Continue <i class="fa-solid fa-arrow-right ms-1"></i>`;
    }
  }

  // Scroll smoothly to booking card header
  document.getElementById('appointment')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function submitBooking() {
  const appointmentId = 'SMC-' + Math.floor(1000 + Math.random() * 9000);
  const newAppointment = {
    id: appointmentId,
    service: bookingState.service,
    doctor: bookingState.doctor,
    date: bookingState.date,
    time: bookingState.time,
    patientName: bookingState.patientName,
    patientEmail: bookingState.patientEmail,
    patientPhone: bookingState.patientPhone,
    patientNotes: bookingState.patientNotes,
    isFirstTime: bookingState.isFirstTime,
    createdAt: new Date().toISOString()
  };

  // Save to LocalStorage
  const existing = JSON.parse(localStorage.getItem('smilecare_appointments') || '[]');
  existing.unshift(newAppointment);
  localStorage.setItem('smilecare_appointments', JSON.stringify(existing));

  // Render Confirmation Screen
  renderBookingConfirmation(newAppointment);
  updateMyAppointmentsBadge();
  updateDentalJourneyWithAppointment(newAppointment);
  showToast(`Appointment Confirmed! ID: ${newAppointment.id}`, 'success');
}

function renderBookingConfirmation(app) {
  const wizardContainer = document.getElementById('bookingWizardCard');
  if (!wizardContainer) return;

  const formattedDate = new Date(app.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  wizardContainer.innerHTML = `
    <div class="confirmation-card animate-fade-in">
      <div class="conf-check-icon">
        <i class="fa-solid fa-check"></i>
      </div>
      <span class="badge bg-success-subtle text-success fw-bold px-3 py-2 rounded-pill">
        Booking Confirmed & Saved
      </span>
      <h3 class="fw-bold mt-3 mb-1">We’re Excited to See You!</h3>
      <p class="text-muted">A confirmation SMS and calendar invite have been logged to your device profile.</p>

      <div class="my-3">
        <span class="text-muted small d-block">APPOINTMENT REFERENCE</span>
        <span class="booking-ref-badge">#${app.id}</span>
      </div>

      <div class="card p-4 text-start bg-card border my-4 mx-auto" style="max-width: 550px;">
        <div class="conf-detail-row">
          <span class="text-muted">Patient Name:</span>
          <span class="fw-bold">${app.patientName}</span>
        </div>
        <div class="conf-detail-row">
          <span class="text-muted">Service:</span>
          <span class="fw-bold text-primary-custom">${app.service.name} (${app.service.duration})</span>
        </div>
        <div class="conf-detail-row">
          <span class="text-muted">Practitioner:</span>
          <span class="fw-bold">${app.doctor.name}</span>
        </div>
        <div class="conf-detail-row">
          <span class="text-muted">Date:</span>
          <span class="fw-bold">${formattedDate}</span>
        </div>
        <div class="conf-detail-row">
          <span class="text-muted">Time Slot:</span>
          <span class="fw-bold text-success">${app.time}</span>
        </div>
        <div class="conf-detail-row">
          <span class="text-muted">Estimated Fee:</span>
          <span class="fw-bold text-secondary-custom">${app.service.price}</span>
        </div>
      </div>

      <div class="d-flex flex-wrap justify-content-center gap-3">
        <button type="button" class="btn-custom-secondary" id="btnPrintBooking">
          <i class="fa-solid fa-print me-1"></i> Print Summary
        </button>
        <button type="button" class="btn-custom-secondary" id="btnDownloadIcs">
          <i class="fa-solid fa-calendar-plus me-1"></i> Add to Calendar (.ics)
        </button>
        <button type="button" class="btn-custom-primary" data-bs-toggle="offcanvas" data-bs-target="#myAppointmentsDrawer">
          <i class="fa-solid fa-folder-open me-1"></i> View My Bookings
        </button>
      </div>

      <div class="mt-4 pt-3 border-top">
        <button type="button" class="btn btn-link text-decoration-none text-muted" id="btnBookAnother">
          <i class="fa-solid fa-plus-circle me-1"></i> Book Another Appointment
        </button>
      </div>
    </div>
  `;

  document.getElementById('btnPrintBooking')?.addEventListener('click', () => {
    window.print();
  });

  document.getElementById('btnDownloadIcs')?.addEventListener('click', () => {
    downloadIcsFile(app);
  });

  document.getElementById('btnBookAnother')?.addEventListener('click', () => {
    location.reload();
  });
}

function downloadIcsFile(app) {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SmileCare Dental Clinic//EN',
    'BEGIN:VEVENT',
    `SUMMARY:SmileCare Dental Appointment: ${app.service.name}`,
    `DESCRIPTION:Appointment for ${app.patientName} with ${app.doctor.name}. Reference: #${app.id}`,
    'LOCATION:SmileCare Dental Clinic, 742 Evergreen Medical Way, Suite 400',
    `DTSTART:${app.date.replace(/-/g, '')}T100000Z`,
    `DTEND:${app.date.replace(/-/g, '')}T110000Z`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `SmileCare-Appointment-${app.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Calendar event file (.ics) downloaded!', 'success');
}

function prefillBookingService(serviceId) {
  const found = clinicServices.find(s => s.id === serviceId);
  if (found) {
    bookingState.service = found;
  }
  const appSection = document.getElementById('appointment');
  if (appSection) {
    appSection.scrollIntoView({ behavior: 'smooth' });
    renderBookingServices();
    goToStep(2);
    showToast(`Selected "${found ? found.name : 'Service'}". Now pick your doctor & date!`, 'info');
  }
}

/* ==========================================================================
   7. LocalStorage: My Appointments Drawer Management
   ========================================================================== */
function loadSavedAppointments() {
  const container = document.getElementById('myAppointmentsList');
  if (!container) return;

  const appointments = JSON.parse(localStorage.getItem('smilecare_appointments') || '[]');

  if (appointments.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5">
        <i class="fa-regular fa-calendar-xmark text-muted fs-1 mb-3"></i>
        <h6 class="fw-bold">No Scheduled Appointments</h6>
        <p class="text-muted small">You haven't booked any dental appointments yet. Use our smart booking wizard to pick your slot!</p>
        <a href="#appointment" class="btn-custom-primary btn-custom-sm" data-bs-dismiss="offcanvas">
          Book Your First Visit
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = appointments.map((app, index) => `
    <div class="card p-3 mb-3 border bg-card">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="booking-ref-badge fs-6 py-1 px-2 m-0">#${app.id}</span>
        <span class="badge bg-success-subtle text-success">Confirmed</span>
      </div>
      <h6 class="fw-bold mb-1">${app.service.name}</h6>
      <small class="text-muted d-block mb-1">
        <i class="fa-regular fa-user-doctor me-1 text-primary-custom"></i> ${app.doctor.name}
      </small>
      <small class="text-muted d-block mb-2">
        <i class="fa-regular fa-calendar me-1"></i> ${app.date} at <strong>${app.time}</strong>
      </small>
      <div class="d-flex justify-content-between align-items-center pt-2 border-top">
        <span class="fw-bold text-secondary-custom small">${app.service.price}</span>
        <button type="button" class="btn btn-outline-danger btn-sm py-1 px-2" onclick="cancelAppointment('${app.id}')">
          <i class="fa-solid fa-trash-can me-1"></i> Cancel
        </button>
      </div>
    </div>
  `).join('');
}

window.cancelAppointment = function(id) {
  let appointments = JSON.parse(localStorage.getItem('smilecare_appointments') || '[]');
  appointments = appointments.filter(a => a.id !== id);
  localStorage.setItem('smilecare_appointments', JSON.stringify(appointments));

  loadSavedAppointments();
  updateMyAppointmentsBadge();
  showToast(`Appointment #${id} has been cancelled.`, 'warning');
};

function updateMyAppointmentsBadge() {
  const badge = document.getElementById('myAppointmentsBadge');
  const appointments = JSON.parse(localStorage.getItem('smilecare_appointments') || '[]');
  if (badge) {
    badge.innerText = appointments.length;
    badge.classList.toggle('d-none', appointments.length === 0);
  }
}

/* ==========================================================================
   8. UNIQUE FEATURE 4: Interactive Dental Anatomy Guide
   ========================================================================== */
const toothAnatomyData = {
  enamel: {
    title: 'Tooth Enamel',
    category: 'Outer Protective Shield',
    description: 'Enamel is the hardest biological substance in the human body, composed of 96% crystalline hydroxyapatite minerals. It covers the crown and acts as a fortress guarding the living internal tooth structure.',
    function: 'Withstands tremendous masticatory biting pressure and prevents bacterial invasion into sensitive dentin.',
    vulnerability: 'Acidic degradation from soda, citrus, and fermentable carbohydrates causes irreversible demineralization cavities.',
    careTip: 'Brush twice daily with remineralizing fluoride or nano-hydroxyapatite toothpaste and wait 30 mins after acidic meals.'
  },
  dentin: {
    title: 'Dentin Layer',
    category: 'Microscopic Tubule Matrix',
    description: 'Located directly beneath the enamel, dentin makes up the bulk of the tooth. It contains tens of thousands of fluid-filled microscopic tubules directly communicating with the inner nerve endings.',
    function: 'Absorbs daily shock and mechanical forces while safely enclosing the fragile pulp chamber.',
    vulnerability: 'When exposed due to enamel erosion or gum recession, temperature changes cause sharp dental sensitivity.',
    careTip: 'Use soft bristle brushes to avoid abrasive mechanical wear at the cervical margin.'
  },
  pulp: {
    title: 'Dental Pulp Chamber',
    category: 'The Living Core',
    description: 'The vibrant center of the tooth housing vascular capillary networks, connective tissue, and sensory dental nerves.',
    function: 'Nourishes the tooth during developmental stages and provides sensory feedback regarding temperature and bite pressure.',
    vulnerability: 'Deep cavities or traumatic cracks expose the pulp to bacteria, triggering acute pulpitis or abscesses.',
    careTip: 'Routine 6-month checkups detect microscopic decay before it reaches this delicate chamber.'
  },
  gums: {
    title: 'Gingiva (Gums) & Periodontal Ligament',
    category: 'The Structural Anchor',
    description: 'The gingiva provides a tight, protective epithelial seal around the collar of every tooth, while periodontal ligament fibers anchor roots into the alveolar jawbone.',
    function: 'Locks teeth solidly into place and prevents oral micro-flora from penetrating bone sockets.',
    vulnerability: 'Plaque accumulation causes gingivitis, which can silently advance to irreversible bone loss (periodontitis).',
    careTip: 'Daily flossing and biannual professional ultrasonic cleanings remove hardened calculus that brushing cannot budge.'
  },
  root: {
    title: 'Root Canal & Apex',
    category: 'Sub-Gingival Root System',
    description: 'Extending deep below the gumline into the jawbone, the root is shielded by cementum and anchors the tooth securely. Blood vessels and nerves pass through the apical foramen.',
    function: 'Distributes biting forces evenly into the jawbone and conduits vascular nutrition to the tooth.',
    vulnerability: 'Root fractures, bone resorption, or untreated apical cysts require endodontic therapy or surgical apicoectomy.',
    careTip: 'Wear a custom mouthguard during contact sports and nighttime bruxism splints if you clench or grind your teeth.'
  }
};

function initToothGuide() {
  const parts = document.querySelectorAll('.tooth-part');
  const pills = document.querySelectorAll('.anatomy-pill');
  const infoPanel = document.getElementById('anatomyInfoPanel');

  if (!infoPanel) return;

  function selectAnatomyPart(partKey) {
    const data = toothAnatomyData[partKey];
    if (!data) return;

    // Update SVG highlights
    parts.forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-part') === partKey);
    });

    // Update pill buttons
    pills.forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-part') === partKey);
    });

    // Update Info Panel
    infoPanel.innerHTML = `
      <div class="animate-fade-in">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="badge bg-primary-subtle text-primary-custom fw-semibold px-3 py-2 rounded-pill">
            ${data.category}
          </span>
          <span class="text-muted small"><i class="fa-solid fa-microscope me-1"></i> Interactive Dental Explorer</span>
        </div>

        <h3 class="fw-bold mb-2">${data.title}</h3>
        <p class="text-muted mb-4">${data.description}</p>

        <div class="anatomy-feature-row">
          <i class="fa-solid fa-shield-halved anatomy-feature-icon"></i>
          <div>
            <strong class="d-block text-main small">Primary Biological Role:</strong>
            <p class="text-muted small mb-0">${data.function}</p>
          </div>
        </div>

        <div class="anatomy-feature-row">
          <i class="fa-solid fa-triangle-exclamation text-warning anatomy-feature-icon"></i>
          <div>
            <strong class="d-block text-main small">Common Clinical Risks:</strong>
            <p class="text-muted small mb-0">${data.vulnerability}</p>
          </div>
        </div>

        <div class="anatomy-feature-row">
          <i class="fa-solid fa-heart-pulse text-success anatomy-feature-icon"></i>
          <div>
            <strong class="d-block text-main small">Dentist Protection Advice:</strong>
            <p class="text-muted small mb-0">${data.careTip}</p>
          </div>
        </div>

        <div class="mt-4 pt-3 border-top">
          <a href="#appointment" class="btn-custom-primary btn-custom-sm">
            <i class="fa-solid fa-calendar-check me-1"></i> Book a Preventive Checkup
          </a>
        </div>
      </div>
    `;
  }

  parts.forEach(p => {
    p.addEventListener('click', () => {
      const partKey = p.getAttribute('data-part');
      selectAnatomyPart(partKey);
    });
  });

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const partKey = pill.getAttribute('data-part');
      selectAnatomyPart(partKey);
    });
  });

  // Default selection: Enamel
  selectAnatomyPart('enamel');
}

/* ==========================================================================
   9. UNIQUE FEATURE 5: Visual Dental Journey Tracker
   ========================================================================== */
const journeyStages = [
  {
    step: 1,
    title: 'Consultation & Triage',
    icon: 'fa-comments',
    badge: 'Step 1 of 5',
    headline: 'Listening to Your Goals & History',
    details: 'During your welcome visit, your dentist listens to any aesthetic goals, pain history, or medical conditions in a relaxed, zero-pressure atmosphere.',
    checklist: ['Digital medical history review', 'Symptom and lifestyle discussion', 'Comfort preference alignment (pain-free anesthesia options)']
  },
  {
    step: 2,
    title: '3D Examination',
    icon: 'fa-x-ray',
    badge: 'Step 2 of 5',
    headline: 'High-Definition Diagnostics',
    details: 'We take ultra-low-radiation digital intraoral panoramic X-rays and high-resolution 3D photography to inspect tooth roots, bone levels, and hidden decay.',
    checklist: ['3D digital intraoral scan', 'Periodontal pocket depth measurement', 'Complete cosmetic smile analysis']
  },
  {
    step: 3,
    title: 'Personal Treatment',
    icon: 'fa-tooth',
    badge: 'Step 3 of 5',
    headline: 'Gentle, Minimally-Invasive Care',
    details: 'Carried out under warm care with state-of-the-art painless equipment, noise-canceling headphones, and transparent step-by-step communication.',
    checklist: ['Computerized anesthesia delivery', 'High-magnification surgical optics', 'Biocompatible restorations']
  },
  {
    step: 4,
    title: 'Follow-up & Polish',
    icon: 'fa-notes-medical',
    badge: 'Step 4 of 5',
    headline: 'Ensuring Long-Term Stability',
    details: 'We evaluate bite balance, tissue healing, and restorative durability to ensure your new smile feels completely natural when chewing and speaking.',
    checklist: ['Occlusal bite calibration', 'Soft tissue regeneration check', 'Custom nightguard fitting if indicated']
  },
  {
    step: 5,
    title: 'Radiant Smile & Routine',
    icon: 'fa-face-smile-beam',
    badge: 'Step 5 of 5',
    headline: 'Lifelong Smile Confidence',
    details: 'Celebrate your healthy, confident smile! We schedule gentle 6-month reminder checks so your teeth remain stunning for decades.',
    checklist: ['Post-treatment photo comparison', 'Personalized homecare hygiene kit', 'Automated 6-month wellness reminders']
  }
];

function initDentalJourney() {
  const nodes = document.querySelectorAll('.journey-node');
  const progressBar = document.getElementById('journeyTrackProgress');
  const cardContainer = document.getElementById('journeyDetailCard');

  if (!nodes.length || !cardContainer) return;

  function selectJourneyStep(stepNum) {
    const stage = journeyStages[stepNum - 1];
    if (!stage) return;

    nodes.forEach((node, idx) => {
      const s = idx + 1;
      node.classList.remove('active', 'completed');
      if (s < stepNum) {
        node.classList.add('completed');
      } else if (s === stepNum) {
        node.classList.add('active');
      }
    });

    if (progressBar) {
      const pct = ((stepNum - 1) / (journeyStages.length - 1)) * 90;
      progressBar.style.width = `${pct}%`;
    }

    cardContainer.innerHTML = `
      <div class="animate-fade-in">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="badge bg-primary-subtle text-primary-custom fw-semibold px-3 py-2 rounded-pill">
            ${stage.badge}
          </span>
          <span class="text-muted small"><i class="fa-solid fa-route me-1"></i> Patient Care Pathway</span>
        </div>
        <h4 class="fw-bold mb-2 text-main">${stage.headline}</h4>
        <p class="text-muted mb-4">${stage.details}</p>

        <h6 class="fw-bold mb-3 text-secondary-custom">Key Highlights at This Milestone:</h6>
        <div class="row g-2">
          ${stage.checklist.map(item => `
            <div class="col-md-4">
              <div class="p-2 rounded bg-surface border small d-flex align-items-center gap-2">
                <i class="fa-solid fa-circle-check text-success"></i>
                <span>${item}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const step = parseInt(node.getAttribute('data-step'), 10);
      selectJourneyStep(step);
    });
  });

  // Default: Step 1
  selectJourneyStep(1);
}

function updateDentalJourneyWithAppointment(appointment) {
  const node = document.querySelector('.journey-node[data-step="1"]');
  if (node) {
    const subtitle = node.querySelector('small');
    if (subtitle) {
      subtitle.innerHTML = `<span class="text-success fw-bold">${appointment.date}</span>`;
    }
  }
}

/* ==========================================================================
   10. Services Filter & Instant Search
   ========================================================================== */
function initServicesFilter() {
  const pills = document.querySelectorAll('.filter-pill');
  const searchInput = document.getElementById('serviceSearchInput');
  const serviceCards = document.querySelectorAll('.service-grid-col');

  if (!serviceCards.length) return;

  let activeCategory = 'all';
  let currentSearch = '';

  function filterCards() {
    serviceCards.forEach(col => {
      const card = col.querySelector('.service-card');
      const cat = card.getAttribute('data-category')?.toLowerCase();
      const title = card.querySelector('h5')?.innerText?.toLowerCase() || '';
      const desc = card.querySelector('p')?.innerText?.toLowerCase() || '';

      const matchesCat = activeCategory === 'all' || cat === activeCategory;
      const matchesSearch = !currentSearch || title.includes(currentSearch) || desc.includes(currentSearch);

      col.classList.toggle('d-none', !(matchesCat && matchesSearch));
    });
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category')?.toLowerCase() || 'all';
      filterCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim().toLowerCase();
      filterCards();
    });
  }

  // Also connect all "Book This Service" triggers in the service cards
  document.querySelectorAll('.btn-service-book').forEach(btn => {
    btn.addEventListener('click', () => {
      const sId = btn.getAttribute('data-service-id');
      prefillBookingService(sId);
    });
  });
}

/* ==========================================================================
   11. Testimonials Carousel
   ========================================================================== */
const testimonialsData = [
  {
    name: 'Emily Watson',
    role: 'Graphic Designer',
    treatment: 'Porcelain Veneers & Whitening',
    avatar: 'EW',
    rating: 5,
    quote: 'SmileCare completely eliminated my dental anxiety. Dr. Sarah walked me through every micro-step with digital scans. My teeth look stunning and entirely natural!'
  },
  {
    name: 'Marcus Sterling',
    role: 'Financial Analyst',
    treatment: 'Clear Aligners & Ortho',
    avatar: 'MS',
    rating: 5,
    quote: 'The 3D preview made choosing clear aligners so easy. In only 7 months, my lower crowding is perfectly resolved. Best healthcare clinic experience in town.'
  },
  {
    name: 'Sophia Hernandez',
    role: 'University Lecturer',
    treatment: 'Emergency Root Canal',
    avatar: 'SH',
    rating: 5,
    quote: 'I woke up on Saturday with excruciating throbbing tooth pain. The SmileCheck guide flagged urgent care, and SmileCare saw me within two hours. Completely painless!'
  }
];

let currentTestimonialIdx = 0;

function initTestimonialCarousel() {
  const container = document.getElementById('testimonialCarouselContainer');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');

  if (!container) return;

  function renderTestimonial(idx) {
    const t = testimonialsData[idx];
    container.innerHTML = `
      <div class="testimonial-card animate-fade-in">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="stars-rating mb-0">
            ${Array(t.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
          </div>
          <span class="badge bg-secondary-subtle text-secondary-custom px-3 py-1 rounded-pill small fw-semibold">
            <i class="fa-solid fa-shield-check me-1"></i> Verified Patient
          </span>
        </div>
        <p class="testimonial-quote">"${t.quote}"</p>
        <div class="patient-info-row">
          <div class="patient-avatar">${t.avatar}</div>
          <div>
            <h6 class="fw-bold mb-0">${t.name}</h6>
            <small class="text-muted">${t.role} • <strong class="text-primary-custom">${t.treatment}</strong></small>
          </div>
        </div>
      </div>
    `;
  }

  renderTestimonial(currentTestimonialIdx);

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentTestimonialIdx = (currentTestimonialIdx - 1 + testimonialsData.length) % testimonialsData.length;
      renderTestimonial(currentTestimonialIdx);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentTestimonialIdx = (currentTestimonialIdx + 1) % testimonialsData.length;
      renderTestimonial(currentTestimonialIdx);
    });
  }
}

/* ==========================================================================
   12. Contact Form & Feedback
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('clinicContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields before sending.', 'warning');
      return;
    }

    showToast(`Thank you, ${name}! Your inquiry has been transmitted to our front desk.`, 'success');
    form.reset();
  });
}

/* ==========================================================================
   13. Back-to-Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

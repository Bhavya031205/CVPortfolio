// ── AOS init ──
AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });

// ── Theme toggle ──
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('themeLabel').textContent = isDark ? 'Dark mode' : 'Light mode';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}
(function() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const lbl = document.getElementById('themeLabel');
  if (lbl) lbl.textContent = saved === 'dark' ? 'Light mode' : 'Dark mode';
})();

// ── Custom cursor ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx=0, my=0, rx=0, ry=0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx+'px'; cursor.style.top = my+'px'; });
function animateRing() { rx += (mx-rx)*0.12; ry += (my-ry)*0.12; ring.style.left = rx+'px'; ring.style.top = ry+'px'; requestAnimationFrame(animateRing); }
animateRing();
document.querySelectorAll('a,button,.project-card,.service-card,.contact-item,.filter-btn,.nav-links a').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); ring.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); ring.classList.remove('hover'); });
});

// ── Particle canvas ──
(function() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < 60; i++) {
    particles.push({ x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight, vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3, size: Math.random()*1.5+0.3, opacity: Math.random()*0.4+0.1 });
  }
  function draw() {
    ctx.clearRect(0,0,W,H);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const col = isDark ? '0,229,192' : '0,158,135';
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${col},${p.opacity})`;
      ctx.fill();
    });
    // draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${col},${0.08*(1-dist/100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── Scroll progress ──
window.addEventListener('scroll', () => {
  const el = document.getElementById('scrollProgress');
  const total = document.body.scrollHeight - window.innerHeight;
  el.style.transform = `scaleX(${window.scrollY / total})`;
});

// ── Active nav on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[data-section="${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));

// ── Skill bars animate on scroll ──
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%';
      });
    }
  });
}, { threshold: 0.3 });
const skillSection = document.getElementById('skills');
if (skillSection) skillObserver.observe(skillSection);

// ── Typing animation ──
const roles = ['Full-Stack Developer', 'Data Analyst', 'ML Engineer', 'Problem Solver'];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-text');
function type() {
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.substring(0, charIdx+1);
    charIdx++;
    if (charIdx === current.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typedEl.textContent = current.substring(0, charIdx-1);
    charIdx--;
    if (charIdx === 0) { deleting = false; roleIdx = (roleIdx+1) % roles.length; }
  }
  setTimeout(type, deleting ? 55 : 90);
}
type();

// ── Project filter ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? 'block' : 'none';
    });
  });
});

// ── Project data ──
const projects = {
  rotaract: {
    badge: 'Web Development', title: 'Rotaract Club Web Platform',
    emoji: '🌐', grad: 'g-web',
    desc: 'Built as a duo during my Dec 2025–Feb 2026 internship, this is a full production-grade web platform for a live organisation. I designed the entire PostgreSQL schema from scratch, built the REST API layer in Node.js, and delivered a complete responsive Next.js frontend with role-based access control. The handover included full documentation and a walkthrough session with club leadership.',
    metrics: [{val:'3', label:'Months dev time'},{val:'4', label:'Access roles'},{val:'100%', label:'Client satisfaction'}],
    tags: ['Next.js','TypeScript','PostgreSQL','Tailwind CSS','REST APIs','Node.js','Vercel'],
    github: 'https://github.com/Bhavya031205'
  },
  clinicaliq: {
    badge: 'Data Analytics', title: 'ClinicalIQ — Hospital Readmission Analytics',
    emoji: '📊', grad: 'g-data',
    desc: 'A full clinical analytics pipeline built on 85,000+ EHR records. The core deliverable was an XGBoost classification model with AUC-ROC 0.87 for predicting 30-day hospital readmissions. I wrote 14 custom SQL queries for cohort segmentation, built 5 interactive Power BI pages, and created clinician-facing risk dashboards with actionable admission flags.',
    metrics: [{val:'85K+', label:'EHR records'},{val:'0.87', label:'AUC-ROC score'},{val:'14', label:'SQL queries'}],
    tags: ['Python','XGBoost','PostgreSQL','Power BI','Pandas','Scikit-learn','SQL'],
    github: 'https://github.com/Bhavya031205'
  },
  retailiq: {
    badge: 'Data Analytics', title: 'RetailIQ — Sales Intelligence Platform',
    emoji: '🛒', grad: 'g-data',
    desc: 'End-to-end retail analytics pipeline over 120,000+ transaction records. Built a Random Forest sales forecasting model, ran ANOVA statistical validation across product categories, and discovered a significant r=−0.68 discount-to-margin correlation. Delivered a 4-page interactive Power BI dashboard for business stakeholders with drill-through capabilities.',
    metrics: [{val:'120K+', label:'Transactions'},{val:'r=−0.68', label:'Discount-margin corr.'},{val:'4-page', label:'Power BI dashboard'}],
    tags: ['Python','SQL','Scikit-learn','Power BI','Pandas','Random Forest','ANOVA'],
    github: 'https://github.com/Bhavya031205'
  },
  adhd: {
    badge: 'Machine Learning', title: 'ADHD Early Diagnostic Prediction System',
    emoji: '🧠', grad: 'g-ml',
    desc: '🥈 Runner-Up at national academic showcase. An ML system predicting early ADHD markers using behavioural and physiological data. Used ensemble methods (Random Forest + XGBoost) combined with a small neural network. Applied extensive EDA, SMOTE for class imbalance handling, and feature importance analysis to produce clinically meaningful results.',
    metrics: [{val:'2nd', label:'National showcase'},{val:'Ensemble', label:'Model type'},{val:'SMOTE', label:'Imbalance handled'}],
    tags: ['Python','Scikit-learn','TensorFlow','XGBoost','EDA','SMOTE','Random Forest'],
    github: 'https://github.com/Bhavya031205'
  },
  ecom: {
    badge: 'Web Development', title: 'E-Commerce Web Application',
    emoji: '🛍️', grad: 'g-web',
    desc: 'A complete multi-page e-commerce application built during my June 2024 internship. Features include product listing pages, search and filter, cart management, checkout flow, and order confirmation. The MySQL backend handles product inventory, user sessions, and order storage. Built with a mobile-first approach throughout.',
    metrics: [{val:'Multi', label:'Page app'},{val:'MySQL', label:'Backend'},{val:'Mobile', label:'First design'}],
    tags: ['HTML5','CSS3','JavaScript','MySQL','DOM Manipulation','Responsive Design'],
    github: 'https://github.com/Bhavya031205'
  },
  rotaract_static: {
    badge: 'Web Development', title: 'Rotaract Club — Static Website',
    emoji: '🔗', grad: 'g-web',
    desc: 'Built as the club\'s first web presence (Sep–Oct 2025) before the full-stack platform. A fully responsive static website using HTML5, CSS3, JavaScript, and Bootstrap. Integrated Nodemailer for the contact form so club members could reach leadership directly from the site. This served as the live site for several months before the full-stack rebuild.',
    metrics: [{val:'Static', label:'Architecture'},{val:'Bootstrap', label:'Framework'},{val:'Nodemailer', label:'Contact form'}],
    tags: ['HTML5','CSS3','JavaScript','Bootstrap','Nodemailer','Responsive Design'],
    github: 'https://github.com/Bhavya031205'
  },
  robot: {
    badge: 'IoT / Robotics', title: 'Obstacle Avoiding Robot',
    emoji: '🤖', grad: 'g-ml',
    desc: 'Built an autonomous robot (Sep–Nov 2023) that uses ultrasonic distance sensors to detect obstacles and autonomously navigate around them in real time. Programmed the Arduino UNO microcontroller in C++ to process sensor readings, compute motor control decisions, and drive the dual-wheel chassis. This was my first embedded systems project and introduced me to hardware-software integration, circuit design, and real-time control loops.',
    metrics: [{val:'Arduino', label:'Microcontroller'},{val:'Real-time', label:'Obstacle detection'},{val:'C++', label:'Language'}],
    tags: ['Arduino UNO','Arduino IDE','C++','Ultrasonic Sensors','Robotics','Embedded Systems'],
    github: 'https://github.com/Bhavya031205'
  }
};

// ── Contact form (Formspree) ──
// ⚠️  SETUP: Go to https://formspree.io → create a free account → New Form
//     Copy your form endpoint (looks like https://formspree.io/f/xxxxxxxx)
//     and paste it below replacing the placeholder.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdajjqzo';

async function submitContactForm(e) {
  e.preventDefault();

  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value.trim();
  const message = document.getElementById('cf-message').value.trim();

  // Basic validation
  if (!name || !email || !message) {
    const errBox = document.getElementById('formError');
    errBox.textContent = '⚠ Please fill in your name, email, and message.';
    errBox.style.display = 'block';
    return;
  }

  const btn = document.getElementById('cf-submit');
  btn.disabled = true;
  btn.textContent = 'Sending…';
  document.getElementById('formError').style.display = 'none';

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    });

    if (res.ok) {
      // Show success state
      document.getElementById('formFields').style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
    } else {
      throw new Error('Non-OK response');
    }
  } catch (err) {
    document.getElementById('formError').style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Send message →';
  }
}

function openModal(id) {
  const p = projects[id];
  document.getElementById('modalBadge').textContent = p.badge;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalEmoji').textContent = p.emoji;
  document.getElementById('modalGrad').className = 'project-thumb-gradient ' + p.grad;
  document.getElementById('modalDesc').textContent = p.desc;
  document.getElementById('modalMetrics').innerHTML = p.metrics.map(m => `<div class="modal-metric"><div class="modal-metric-val">${m.val}</div><div class="modal-metric-label">${m.label}</div></div>`).join('');
  document.getElementById('modalTags').innerHTML = p.tags.map(t => `<span class="project-tag">${t}</span>`).join('');
  document.getElementById('modalLinks').innerHTML = `<a href="${p.github}" target="_blank" class="btn btn-outline" style="font-size:13px;padding:10px 18px;">⌥ View on GitHub</a>`;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function closeModalOutside(e) { if (e.target === document.getElementById('modalOverlay')) closeModal(); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Mobile sidebar ──
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
  }
}));

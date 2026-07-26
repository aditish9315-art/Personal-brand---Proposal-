// ---------- Load content and build the page ----------
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    buildCover(data.cover, data.meta);
    buildUnderstanding(data.understanding);
    buildObjectives(data.objectives);
    buildPillars(data.pillars);
    buildDeliverables(data.deliverables);
    buildWorkflow(data.workflow, data.workflowNote);
    buildTimeline(data.timeline);
    const total = buildInvestment(data.investment);
    buildRequirements(data.requirements);
    buildTerms(data.terms);
    buildClosing(data.closing, data.meta);

    // once content exists, wire up interactions
    initNavDots();
    initScrollProgress();
    initRevealObserver();
    initCounter(total, data.investment.currency);
  })
  .catch(err => console.error('Could not load data.json', err));

// ---------- Section builders ----------
function buildCover(cover, meta) {
  document.getElementById('agency-tag').textContent = meta.agencyName;
  document.getElementById('cover-date').textContent = meta.date;
  document.getElementById('cover-line1').textContent = cover.clientName;
  document.getElementById('cover-line2').textContent = cover.line2;
  document.getElementById('cover-line3').textContent = cover.line3;
  document.getElementById('cover-left').textContent = cover.leftNote;
  document.getElementById('cover-right').textContent = cover.rightNote;
}

function buildUnderstanding(u) {
  document.getElementById('understanding-heading').textContent = u.heading;
  document.getElementById('understanding-body').textContent = u.body;
}

function buildObjectives(list) {
  const grid = document.getElementById('objectives-grid');
  list.forEach(o => {
    const div = document.createElement('div');
    div.className = 'objective-card';
    div.innerHTML = `<span class="icon">${o.icon}</span><span class="title">${o.title}</span>`;
    grid.appendChild(div);
  });
}

function buildPillars(p) {
  document.getElementById('pillars-heading').textContent = p.heading;
  document.getElementById('pillars-intro').textContent = p.intro;
  const list = document.getElementById('pillars-list');
  p.items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
}

function buildDeliverables(d) {
  const body = document.getElementById('deliverables-body');
  d.rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.format}</td><td>${r.qty}</td><td>${r.purpose}</td>`;
    body.appendChild(tr);
  });
  document.getElementById('deliverables-total-label').textContent = d.totalLabel;
  document.getElementById('deliverables-total-val').textContent = d.total;
}

function buildWorkflow(steps, note) {
  const row = document.getElementById('workflow-row');
  steps.forEach(s => {
    const div = document.createElement('div');
    div.className = 'workflow-step';
    div.innerHTML = `<span class="circle">${s.step}</span><span class="label">${s.title}</span>`;
    row.appendChild(div);
  });
  document.getElementById('workflow-note').textContent = note;
}

function buildTimeline(items) {
  const wrap = document.getElementById('timeline-vertical');
  items.forEach(t => {
    const div = document.createElement('div');
    div.className = 'timeline-item';
    div.innerHTML = `<span class="week">${t.week}</span><span class="title">${t.title}</span>`;
    wrap.appendChild(div);
  });
}

function buildInvestment(inv) {
  const body = document.getElementById('investment-body');
  let total = 0;
  inv.rows.forEach(r => {
    const rowTotal = r.priceUnit * r.qty;
    total += rowTotal;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.format}</td><td>${inv.currency}${r.priceUnit.toLocaleString('en-IN')}</td><td>${r.qty}</td><td>${inv.currency}${rowTotal.toLocaleString('en-IN')}</td>`;
    body.appendChild(tr);
  });
  document.getElementById('investment-note').textContent = inv.note;
  return total;
}

function buildRequirements(list) {
  const ul = document.getElementById('requirements-list');
  list.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });
}

function buildTerms(list) {
  const ul = document.getElementById('terms-list');
  list.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });
}

function buildClosing(c, meta) {
  document.getElementById('closing-line1').textContent = c.line1;
  document.getElementById('closing-line2').textContent = c.line2;
  document.getElementById('closing-line3').textContent = c.line3;
  document.getElementById('closing-body').textContent = c.body;
  document.getElementById('closing-note').textContent = c.note;
  document.getElementById('closing-email').textContent = meta.email;
  document.getElementById('closing-phone').textContent = meta.phone;

  const btn = document.getElementById('cta-button');
  btn.textContent = c.buttonText;
  const subject = encodeURIComponent(`Let's do this — proposal accepted`);
  const body = encodeURIComponent(`Hi ${meta.agencyName},\n\nI've reviewed the proposal and I'd like to move forward.\n\n`);
  btn.href = `mailto:${meta.email}?subject=${subject}&body=${body}`;
}

// ---------- Interactions ----------
function initNavDots() {
  const sections = document.querySelectorAll('.slide');
  const nav = document.getElementById('nav-dots');
  sections.forEach((section, i) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    dot.setAttribute('aria-label', `Go to section ${i + 1}`);
    dot.dataset.target = section.id;
    dot.addEventListener('click', () => {
      section.scrollIntoView({ behavior: 'smooth' });
    });
    nav.appendChild(dot);
  });

  const dots = document.querySelectorAll('.nav-dot');
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        dots.forEach(d => d.classList.remove('active'));
        const match = document.querySelector(`.nav-dot[data-target="${entry.target.id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(s => activeObserver.observe(s));
}

function initScrollProgress() {
  const fill = document.getElementById('progress-fill');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    fill.style.width = pct + '%';
  }, { passive: true });
}

function initRevealObserver() {
  const targets = document.querySelectorAll('.reveal, .stagger');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  targets.forEach(t => observer.observe(t));
}

function initCounter(total, currency) {
  const el = document.getElementById('investment-total');
  const target = total;
  const duration = 1200;
  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        const startTime = performance.now();
        function tick(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.round(target * eased);
          el.textContent = currency + value.toLocaleString('en-IN');
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(el);
}

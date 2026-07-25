fetch('data.json')
  .then(res => res.json())
  .then(data => {
    document.getElementById('agency-eyebrow').textContent = `— from ${data.agencyName} —`;
    document.getElementById('client-name').textContent = data.clientName;
    document.getElementById('tagline').textContent = data.tagline;
    document.getElementById('stamp-date').textContent = data.sentDate;
    document.getElementById('footer-date').textContent = data.sentDate;

    const contactRow = document.getElementById('contact-row');
    const contactItems = [
      { icon: '@', label: data.contact.email },
      { icon: '#', label: data.contact.phone },
      { icon: 'in', label: data.contact.linkedin },
      { icon: 'ig', label: data.contact.instagram }
    ];
    contactItems.forEach(c => {
      const div = document.createElement('div');
      div.className = 'contact-pill';
      div.innerHTML = `<span class="dot">${c.icon}</span>${c.label}`;
      contactRow.appendChild(div);
    });

    document.getElementById('problem-eyebrow').textContent = data.problem.eyebrow;
    document.getElementById('problem-heading').textContent = data.problem.heading;
    document.getElementById('problem-body').textContent = data.problem.body;

    const pillarsEl = document.getElementById('pillars');
    data.pillars.forEach(p => {
      const div = document.createElement('div');
      div.className = 'pillar';
      div.innerHTML = `<h3>${p.title}</h3><p>${p.body}</p>`;
      pillarsEl.appendChild(div);
    });

    const list = document.getElementById('deliverables-list');
    data.deliverables.forEach(d => {
      const li = document.createElement('li');
      li.textContent = d;
      list.appendChild(li);
    });

    const strip = document.getElementById('timeline-strip');
    data.timeline.forEach(t => {
      const div = document.createElement('div');
      div.className = 'timeline-item';
      div.innerHTML = `<span class="week">${t.week}</span>${t.what}`;
      strip.appendChild(div);
    });

    const grid = document.getElementById('pricing-grid');
    data.pricingTiers.forEach(tier => {
      const div = document.createElement('div');
      div.className = 'price-card' + (tier.featured ? ' featured' : '');
      div.innerHTML = `
        <h3>${tier.name}</h3>
        <div class="price">${tier.price}</div>
        <p class="blurb">${tier.blurb}</p>
        <ul>${tier.features.map(f => `<li>${f}</li>`).join('')}</ul>
      `;
      grid.appendChild(div);
    });

    document.getElementById('cta-heading').textContent = data.cta.heading;
    document.getElementById('cta-body').textContent = data.cta.body;
    const btn = document.getElementById('cta-button');
    btn.textContent = data.cta.buttonText + ' →';
    btn.href = `mailto:${data.cta.email}`;
  })
  .catch(err => {
    console.error('Could not load data.json', err);
  });

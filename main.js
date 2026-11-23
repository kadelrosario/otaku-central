(function(){
  /* ---- Header: scrolled state + mobile menu ---- */
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---- Hero video: muted, looping, respects reduced motion ---- */
  const video = document.getElementById('heroVideo');
  video.muted = true;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const playVideo = () => { if (!reduce.matches) video.play().catch(() => {}); else video.pause(); };
  playVideo();
  reduce.addEventListener?.('change', playVideo);

  /* ---- Calendar of events ---- */
  const days = [
    {
      name: 'Day 1',
      title: 'Kickoff Day',
      desc: 'Doors open, cosplay sign-ups and the opening ceremony set the tone for the weekend. Start your morning in the ABC Dome and finish with the Day 1 closing activities on the Main Stage.',
      rows: [
        ['10:00 AM – 11:00 AM', 'Convention Doors Open', 'ABC Dome'],
        ['10:00 AM – 1:00 PM', 'Cosplay Competition Registration', 'Hallway 1'],
        ['11:00 AM – 12:00 PM', 'Opening Ceremony', 'Main Stage'],
        ['12:00 PM – 1:00 PM', 'Anime Dance Showcase', 'Stage 2'],
        ['1:00 PM – 2:00 PM', 'Cosplay Photography Session', 'Hallway 1'],
        ['2:00 PM – 3:00 PM', 'Cosplay Community Showcase', 'Hallway 1'],
        ['3:00 PM – 4:00 PM', 'Anime Trivia Challenge', 'Hallway 2'],
        ['4:00 PM – 5:00 PM', 'Cosplay Workshop', 'Hallway 3'],
        ['5:00 PM – 6:00 PM', 'Special Guest Appearance', 'Main Stage'],
        ['6:00 PM – 7:00 PM', 'Gaming Tournament', 'Stage 2'],
        ['7:00 PM – 8:00 PM', 'Day 1 Closing Activities', 'Main Stage']
      ]
    },
    {
      name: 'Day 2',
      title: 'Competition Day',
      desc: 'The cosplay semi-finals, judging and the gaming finals take over the main stage. Catch voice acting showcases and workshops between the big moments.',
      rows: [
        ['10:00 AM – 11:00 AM', 'Convention Doors Open', 'ABC Dome'],
        ['11:00 AM – 12:00 PM', 'Cosplay Contestant Check-in', 'Hallway 1'],
        ['12:00 PM – 1:00 PM', 'Opening Ceremony', 'Main Stage'],
        ['1:00 PM – 3:00 PM', 'Cosplay Competition: Semi-Finals', 'Main Stage'],
        ['3:00 PM – 4:00 PM', 'Judges\u2019 Deliberation', 'Main Stage'],
        ['4:00 PM – 5:00 PM', 'Anime Voice Acting Showcase', 'Hallway 2'],
        ['4:00 PM – 5:00 PM', 'Cosplay Workshop', 'Hallway 3'],
        ['5:00 PM – 6:00 PM', 'Gaming Tournament Finals', 'Stage 2'],
        ['6:00 PM – 7:00 PM', 'Semi-Finalists Announcement', 'Main Stage'],
        ['7:00 PM – 8:00 PM', 'Cosplay Night Showcase', 'Main Stage']
      ]
    },
    {
      name: 'Day 3',
      title: 'Finale',
      desc: 'The final day brings community showcases, special guests and the gaming tournament. Wrap up the weekend with the closing ceremony on the Main Stage.',
      rows: [
        ['10:00 AM – 11:00 AM', 'Convention Doors Open', 'ABC Dome'],
        ['10:00 AM – 1:00 PM', 'Cosplay Competition Registration', 'Hallway 1'],
        ['11:00 AM – 12:00 PM', 'Opening Ceremony', 'Main Stage'],
        ['12:00 PM – 1:00 PM', 'Anime Dance Showcase', 'Stage 2'],
        ['1:00 PM – 2:00 PM', 'Cosplay Photography Session', 'Hallway 1'],
        ['2:00 PM – 3:00 PM', 'Cosplay Community Showcase', 'Hallway 1'],
        ['3:00 PM – 4:00 PM', 'Anime Trivia Challenge', 'Hallway 2'],
        ['4:00 PM – 5:00 PM', 'Cosplay Workshop', 'Hallway 3'],
        ['5:00 PM – 6:00 PM', 'Special Guest Appearance', 'Main Stage'],
        ['6:00 PM – 7:00 PM', 'Gaming Tournament', 'Stage 2'],
        ['7:00 PM – 8:00 PM', 'Day 3 Closing Ceremony', 'Main Stage']
      ]
    }
  ];

  const tabs = Array.from(document.querySelectorAll('.cal-tab'));
  const rowsEl = document.getElementById('calRows');
  const titleEl = document.getElementById('calDayTitle');
  const descEl = document.getElementById('calDayDesc');
  const statsEl = document.getElementById('calStats');
  const panel = document.getElementById('calPanel');

  function renderDay(i){
    const d = days[i];
    const locations = new Set(d.rows.map(r => r[2])).size;
    const now = d.rows.length;
    titleEl.textContent = `${d.name} · ${d.title}`;
    descEl.textContent = d.desc;
    statsEl.innerHTML = `<span>${now} events</span><span>${locations} locations</span><span>10 AM – 8 PM</span>`;
    rowsEl.classList.add('swap');
    setTimeout(() => {
      rowsEl.innerHTML = d.rows.map(r =>
        `<div class="cal-row"><span class="t">${r[0]}</span><span class="e">${r[1]}</span><span class="loc">${r[2]}</span></div>`
      ).join('');
      rowsEl.classList.remove('swap');
    }, 180);
    tabs.forEach((t, idx) => {
      const active = idx === i;
      t.setAttribute('aria-selected', active);
      t.tabIndex = active ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', `tab-${i}`);
  }

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => renderDay(i));
    t.addEventListener('keydown', e => {
      let n = null;
      if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      if (n !== null) { e.preventDefault(); tabs[n].focus(); renderDay(n); }
    });
  });
  renderDay(0);

  /* ---- Tickets ---- */
  const tiers = {
    platinum: {
      name: 'Platinum Pass', price: '$249', valid: 'All 3 days, all halls',
      desc: 'The complete weekend with VIP perks, guest access and the best seats in the house.',
      list: ['3-day full access, all halls', 'VIP lounge with refreshments', 'Guest meet & greet (one guest)', 'Front-row Main Stage seating', 'Platinum tote bag and poster set']
    },
    gold: {
      name: 'Gold Pass', price: '$149', valid: 'All 3 days, all halls',
      desc: 'Skip the line and get closer to the action with priority entry and reserved seating.',
      list: ['3-day full access, all halls', 'Priority entry lane', 'One cosplay photography session', 'Reserved seating in Stage 2', 'Exclusive Gold enamel pin']
    },
    silver: {
      name: 'Silver Pass', price: '$89', valid: 'All 3 days, general admission',
      desc: 'Our classic all-weekend pass. Everything you need to experience the convention.',
      list: ['3-day general admission', 'Access to all halls and exhibitor floor', 'Main Stage shows', 'Convention program booklet', 'Mobile e-ticket entry']
    }
  };
  const tixName = document.getElementById('tixName');
  const tixPrice = document.getElementById('tixPrice');
  const tixDesc = document.getElementById('tixDesc');
  const tixList = document.getElementById('tixList');
  const tixValid = document.getElementById('tixValid');
  const tierBtns = Array.from(document.querySelectorAll('.tier'));

  function selectTier(key){
    const t = tiers[key];
    tixName.textContent = t.name;
    tixPrice.textContent = t.price;
    tixDesc.textContent = t.desc;
    tixValid.textContent = t.valid;
    tixList.innerHTML = t.list.map(li => `<li>${li}</li>`).join('');
    tierBtns.forEach(b => {
      const on = b.dataset.tier === key;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on);
    });
  }
  tierBtns.forEach(b => b.addEventListener('click', e => {
    if (e.target.closest('[data-buy]')) return;
    selectTier(b.dataset.tier);
  }));
  selectTier('platinum');

  document.querySelectorAll('[data-buy]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      const card = el.closest('.tier');
      if (card) selectTier(card.dataset.tier);
      showToast(`${el.dataset.buy} selected. Checkout is coming soon.`);
    });
  });

  /* ---- Toast ---- */
  const toast = document.getElementById('toast');
  let toastTimer;
  window.showToast = function(msg){
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  };
})();

/* ---- News carousel (phones) ---- */
(function(){
  const grid = document.getElementById('newsGrid');
  if (!grid) return;
  const items = Array.from(grid.querySelectorAll('.news-item'));
  const prev = document.getElementById('carPrev');
  const next = document.getElementById('carNext');
  const dotsWrap = document.getElementById('carDots');
  const mobile = window.matchMedia('(max-width:560px)');
  let current = 0;

  items.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Show news ' + (i + 1));
    b.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);

  function centerOffset(item){
    const gr = grid.getBoundingClientRect();
    const ir = item.getBoundingClientRect();
    return ir.left - gr.left + grid.scrollLeft - (grid.clientWidth - item.offsetWidth) / 2;
  }
  function goTo(i){
    current = Math.max(0, Math.min(items.length - 1, i));
    grid.scrollTo({ left: centerOffset(items[current]), behavior: 'smooth' });
    update();
  }
  function update(){
    dots.forEach((d, i) => d.setAttribute('aria-current', i === current ? 'true' : 'false'));
    prev.disabled = current === 0;
    next.disabled = current === items.length - 1;
  }
  function syncFromScroll(){
    const mid = grid.scrollLeft + grid.clientWidth / 2;
    let best = 0, dist = Infinity;
    items.forEach((it, i) => {
      const c = it.offsetLeft - grid.offsetLeft + it.offsetWidth / 2;
      const d = Math.abs(c - mid);
      if (d < dist) { dist = d; best = i; }
    });
    if (best !== current) { current = best; update(); }
  }

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  grid.addEventListener('keydown', e => {
    if (!mobile.matches) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
  });
  let t;
  grid.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(syncFromScroll, 80); }, { passive: true });
  update();
})();

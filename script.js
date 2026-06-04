/* ── AOS init ── */
AOS.init({once:true, offset:60, easing:'ease-out-cubic'});

/* ══════════════════════════════════════
   NAV — scroll shrink
══════════════════════════════════════ */
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  mainNav.classList.toggle('scrolled', window.scrollY > 60);
}, {passive:true});

/* ══════════════════════════════════════
   NAV — wave chars on hover
   Split every .nl-top & .nl-bot into individual <span class="ch">
══════════════════════════════════════ */
document.querySelectorAll('.nl').forEach(link => {
  ['nl-top','nl-bot'].forEach(cls => {
    const el = link.querySelector('.' + cls);
    if(!el) return;
    const text = el.textContent;
    let wordIdx = 0;
    el.innerHTML = text.split(/(\s+)/).map(part => {
      if (/^\s+$/.test(part)) {
        return part.replace(/ /g, '&nbsp;');
      }
      return `<span class="wc" style="--i:${wordIdx++}">${part}</span>`;
    }).join('');
  });
});

/* ══════════════════════════════════════
   NAV — hamburger
══════════════════════════════════════ */
const ham = document.getElementById('ham');
const navLinks = document.getElementById('navLinks');
ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  ham.classList.remove('open');
  navLinks.classList.remove('open');
}));

/* ══════════════════════════════════════
   NAV — active on scroll
══════════════════════════════════════ */
const secs = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 140) cur = s.id; });
  document.querySelectorAll('.nl').forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + cur);
  });
}, {passive:true});

/* ══════════════════════════════════════
   TEXT ANIMATIONS
   — .txt-anim  → wrap each word in .word span
   — .char-wave → wrap each char in .ch span
   Then IntersectionObserver adds .in-view
══════════════════════════════════════ */
function wrapWords(el) {
  if (el.dataset.wrapped) return;
  el.dataset.wrapped = '1';
  const fragment = document.createDocumentFragment();
  let wordIdx = 0;
  el.childNodes.forEach(node => {
    if (node.nodeType === 3) {
      node.textContent.split(/(\s+)/).forEach(part => {
        if (/^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(part));
        } else if (part) {
          const span = document.createElement('span');
          span.className = 'word';
          span.style.setProperty('--wi', wordIdx++);
          span.textContent = part;
          fragment.appendChild(span);
        }
      });
    } else if (node.nodeType === 1) {
      const span = document.createElement('span');
      span.className = 'word';
      span.style.setProperty('--wi', wordIdx++);
      span.appendChild(node.cloneNode(true));
      fragment.appendChild(span);
    }
  });
  el.innerHTML = '';
  el.appendChild(fragment);
}

function wrapChars(el) {
  if (el.dataset.wrapped) return;
  el.dataset.wrapped = '1';
  const fragment = document.createDocumentFragment();
  let wordIdx = 0;
  el.childNodes.forEach(node => {
    if (node.nodeType === 3) {
      node.textContent.split(/(\s+)/).forEach(part => {
        if (/^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(part));
        } else if (part) {
          const span = document.createElement('span');
          span.className = 'word';
          span.style.setProperty('--wi', wordIdx++);
          span.textContent = part;
          fragment.appendChild(span);
        }
      });
    } else if (node.nodeType === 1) {
      const span = document.createElement('span');
      span.className = 'word';
      span.style.setProperty('--wi', wordIdx++);
      span.appendChild(node.cloneNode(true));
      fragment.appendChild(span);
    }
  });
  el.innerHTML = '';
  el.appendChild(fragment);
}

// Apply to all relevant elements
document.querySelectorAll('.sec-body, .quote-block p, .panel-header p, .vision-point .vp-text, .vcard p, .scard ul li, .wcard p, .contact-sub, .hero-tagline').forEach(el => {
  el.classList.add('txt-anim');
  wrapWords(el);
});

document.querySelectorAll('.sec-title, .panel-header h3, .contact-heading, .sec-title').forEach(el => {
  el.classList.add('char-wave');
  wrapChars(el);
});

// IntersectionObserver triggers .in-view
const txtObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      txtObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.txt-anim, .char-wave').forEach(el => txtObs.observe(el));

/* ══════════════════════════════════════
   TABS
══════════════════════════════════════ */
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => {
      b.classList.remove('active');
      b.style.background = '';
    });
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    btn.style.background = '';
    const panel = document.getElementById('panel-' + btn.dataset.tab);
    panel.classList.add('active');
    // trigger txt animations for newly visible panel
    panel.querySelectorAll('.txt-anim, .char-wave').forEach(el => {
      el.classList.remove('in-view');
      setTimeout(() => { el.classList.add('in-view'); }, 60);
    });
    setTimeout(() => AOS.refresh(), 50);
  });
});

/* ── RIPPLE on buttons ── */
document.querySelectorAll('.btn-primary,.btn-secondary').forEach(btn => {
  btn.addEventListener('click', function(e){
    const r = btn.getBoundingClientRect();
    const rpl = document.createElement('span');
    Object.assign(rpl.style, {
      position:'absolute', borderRadius:'50%',
      background:'rgba(255,255,255,.25)',
      width:'10px', height:'10px',
      left:(e.clientX-r.left-5)+'px',
      top:(e.clientY-r.top-5)+'px',
      pointerEvents:'none',
      animation:'rplout .65s ease-out forwards'
    });
    btn.appendChild(rpl);
    setTimeout(()=>rpl.remove(),700);
  });
});
const rplStyle = document.createElement('style');
rplStyle.textContent='@keyframes rplout{0%{transform:scale(1);opacity:.55}100%{transform:scale(22);opacity:0}}';
document.head.appendChild(rplStyle);

/* ── TAB GLOW TRACKING ── */
document.querySelectorAll('.tab').forEach(tab=>{
  tab.addEventListener('mousemove',e=>{
    if (tab.classList.contains('active')) return;
    const r=tab.getBoundingClientRect();
    tab.style.background=`radial-gradient(circle at ${((e.clientX-r.left)/r.width*100).toFixed(0)}% ${((e.clientY-r.top)/r.height*100).toFixed(0)}%, rgba(46,232,122,.12), transparent 80%)`;
  });
  tab.addEventListener('mouseleave',()=>{
    tab.style.background='';
  });
});

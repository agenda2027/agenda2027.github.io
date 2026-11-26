/* Agenda.2027 — the observatory. Vanilla JS, no dependencies. */
(() => {
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const D = window.A27 || {};
const ROOT = document.body.dataset.root || '';

/* ---------- header + progress ---------- */
const bar = $('.bar'), prog = $('.progress');
const onScroll = () => {
  if (bar) bar.classList.toggle('solid', scrollY > 40);
  if (prog) { const h = document.documentElement; prog.style.width = (100 * scrollY / Math.max(1, h.scrollHeight - innerHeight)) + '%'; }
};
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* ---------- reveal ---------- */
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 }) : null;
$$('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));

/* ---------- glyphs (original line drawings) ---------- */
const G = {
  hourglass: '<path d="M6 3h12M6 21h12M7 3c0 5 10 6.5 10 9s-10 4-10 9M17 3c0 5-10 6.5-10 9s10 4 10 9"/><path d="M10 18.5h4" />',
  chart: '<path d="M3 21h18"/><path d="M3 5l5 5 3-2 4 6 5 5"/><path d="M16 19h4v-4"/>',
  chain: '<path d="M2.5 15h19l-2.5 4.5h-14z"/><path d="M6 15v-4h7v4M13 11l2-2.5h2"/><ellipse cx="5" cy="6" rx="2.2" ry="1.4"/><ellipse cx="9" cy="6" rx="2.2" ry="1.4"/><ellipse cx="13" cy="6" rx="2.2" ry="1.4"/>',
  crescent: '<path d="M14.5 4.2a8 8 0 1 0 0 15.6 6.6 6.6 0 1 1 0-15.6z"/><path d="M18.5 9.5l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z"/>',
  tower: '<path d="M8 21V6l4-3 4 3v15M5 21h14M8 9h8M8 12.5h8M8 16h8M12 3V1.5"/>',
  robot: '<rect x="5" y="7" width="14" height="11" rx="3"/><path d="M12 7V4M9 21v-3M15 21v-3"/><circle cx="12" cy="3.3" r="1"/><circle cx="9.3" cy="12" r="1.2"/><circle cx="14.7" cy="12" r="1.2"/><path d="M10 15.3h4"/>',
  syringe: '<path d="M3.5 20.5l3-3M6 18l10-10 2.5 2.5-10 10zM14 6l4.5 4.5M16.5 3.5l4 4M9.5 14.5l1.5 1.5M12 12l1.5 1.5"/>',
  eiffel: '<path d="M12 1.5v3M9 22l3-17.5L15 22M6.5 22h11M9.6 15h4.8M10.6 9.5h2.8M9 22c1-3 5-3 6 0"/>',
  fire: '<path d="M12 2.5c.8 4 5.5 5.6 5.5 10.6a5.5 5.5 0 0 1-11 0c0-3 1.8-4.2 2.2-6.2 1 1 1.4 2.2 1.6 3.4 1.6-2 1.9-4.6 1.7-7.8z"/><path d="M12 21c-1.5 0-2.6-1.1-2.6-2.6 0-1.7 1.5-2.4 2.6-4 1.1 1.6 2.6 2.3 2.6 4 0 1.5-1.1 2.6-2.6 2.6z"/>',
  rocket: '<path d="M12 2c3 2.8 4.3 6.6 4.2 11l-4.2 3.3L7.8 13C7.7 8.6 9 4.8 12 2z"/><circle cx="12" cy="9" r="1.6"/><path d="M7.9 12.5L4.5 16l3.6.6M16.1 12.5l3.4 3.5-3.6.6M10.3 18.6L12 22l1.7-3.4"/>',
  jets: '<path d="M2 13l9-2 4-6h2l-2 6 5-.8 1.5-2H23l-1 3.8 1 3.2h-1.5l-1.5-2-5-.8 2 6h-2l-4-6-9-2z"/>',
  eye: '<path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"/><ellipse cx="12" cy="12" rx="1.6" ry="4.2"/>',
  pyramid: '<path d="M12 2.5L22 21H2z"/><path d="M8.2 12.5S9.8 10 12 10s3.8 2.5 3.8 2.5-1.6 2.5-3.8 2.5-3.8-2.5-3.8-2.5z"/><circle cx="12" cy="12.5" r=".9"/>'
};
const svg = (k, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${G[k] || G.eye}</svg>`;
$$('[data-glyph]').forEach(el => el.insertAdjacentHTML('afterbegin', svg(el.dataset.glyph)));

/* ---------- hero: eclipse eye shader ---------- */
const sky = $('#sky');
if (sky) {
  const gl = sky.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: true });
  if (!gl) { sky.style.background = 'radial-gradient(circle at 50% 38%, #000 9%, #d9a74a 10%, #8e1c24 16%, #07050a 40%)'; }
  else {
    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = `precision highp float;uniform vec2 R;uniform float T;uniform vec2 M;
    float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
    float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}
    void main(){
      vec2 uv=gl_FragCoord.xy/R; float s=min(R.x,R.y);
      vec2 p=(gl_FragCoord.xy-vec2(.5*R.x,(R.x<R.y?.73:.68)*R.y))/s;
      float r=(R.x<R.y?.17:.135); float d=length(p); vec2 q=p/max(d,1e-4);
      vec3 col=mix(vec3(.027,.02,.04),vec3(.06,.03,.05),uv.y);
      vec2 sp=gl_FragCoord.xy/2.;float st=h(floor(sp));
      if(st>.9965){col+=vec3(.9,.85,.75)*(.4+.6*sin(T*1.5+st*90.))*smoothstep(1.,0.,length(fract(sp)-.5)*2.6);}
      float fl=fbm(q*2.4+vec2(T*.03,d*5.-T*.18))*fbm(q*5.5+vec2(d*9.,-T*.05));
      float halo=exp(-max(d-r,0.)*7.)*(.35+1.6*fl);
      float rays=pow(max(0.,fbm(q*9.+vec2(T*.12,0.))-.35),2.)*exp(-max(d-r,0.)*3.2)*2.2;
      vec3 gold=vec3(.95,.68,.3), blood=vec3(.62,.1,.14);
      col+=mix(blood,gold,smoothstep(.0,.9,fl+.25))*(halo+rays)*smoothstep(r-.004,r+.01,d);
      col+=gold*1.7*exp(-abs(d-r)*160.);
      if(d<r){
        vec2 e=p-M*r*.42;
        float iris=fbm(q*6.+vec2(d*22.-T*.25,0.));
        vec3 ic=mix(vec3(.0),vec3(.32,.05,.07),smoothstep(.35,.9,iris)*smoothstep(r,r*.35,d)*.9);
        float w=r*.085*(1.+.25*sin(T*.7)), hh=r*.78;
        float k=(e.x*e.x)/(w*w)+(e.y*e.y)/(hh*hh);
        float slit=smoothstep(1.,.55,k);
        float glowS=exp(-max(k-1.,0.)*1.4)*.55;
        col=ic+gold*(slit*1.6+glowS*.9)+vec3(1.,.9,.6)*smoothstep(.35,0.,k)*.8;
        col*=smoothstep(r,r-.006,d)*.92+.08;
      }
      col*=1.-.55*pow(length(uv-.5)*1.25,2.2);
      col+=(h(gl_FragCoord.xy+T)-.5)*.035;
      gl_FragColor=vec4(col,1.);
    }`;
    const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr); gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(pr, 'R'), uT = gl.getUniformLocation(pr, 'T'), uM = gl.getUniformLocation(pr, 'M');
    let tm = [0, 0], cm = [0, 0], vis = true, t0 = performance.now();
    const size = () => { const dpr = Math.min(devicePixelRatio || 1, 1.6); sky.width = sky.clientWidth * dpr; sky.height = sky.clientHeight * dpr; gl.viewport(0, 0, sky.width, sky.height); };
    size(); addEventListener('resize', size);
    const aim = (x, y) => { const b = sky.getBoundingClientRect(); tm = [Math.max(-1, Math.min(1, (x - b.width / 2) / (b.width / 2))), Math.max(-1, Math.min(1, -(y - b.height * .33) / (b.height / 2)))]; };
    addEventListener('pointermove', e => aim(e.clientX, e.clientY), { passive: true });
    new IntersectionObserver(es => vis = es[0].isIntersecting).observe(sky);
    const frame = now => {
      if (vis) {
        cm[0] += (tm[0] - cm[0]) * .06; cm[1] += (tm[1] - cm[1]) * .06;
        gl.uniform2f(uR, sky.width, sky.height); gl.uniform1f(uT, RM ? 12 : (now - t0) / 1000); gl.uniform2f(uM, cm[0], cm[1]);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      if (!RM) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    if (RM) addEventListener('pointermove', () => requestAnimationFrame(frame), { passive: true });
  }
}

/* ---------- hero title decode (the one orchestrated moment) ---------- */
const sym = '⟁◬☉△▽◇⌖✶⊙⋈';
const runDecode = () => $$('[data-decode]').forEach((el, idx) => {
  const final = el.textContent; if (RM) return;
  el.setAttribute('aria-label', final);
  const len = final.length, start = performance.now() + 250 + idx * 380, dur = 1300;
  const tick = now => {
    const t = (now - start) / dur; let out = '';
    for (let i = 0; i < len; i++) {
      const c = final[i];
      out += (c === ' ' || t > i / len * .8 + .2) ? c : sym[(Math.random() * sym.length) | 0];
    }
    if (t >= 1) { el.textContent = final; return; }
    el.textContent = out; requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  setTimeout(() => { el.textContent = final; }, 250 + idx * 380 + dur + 400);
});
const html = document.documentElement;
if (html.classList.contains('intro-on') && $('#intro')) addEventListener('a27:intro-done', runDecode, { once: true });
else runDecode();

/* ---------- intro (eye video, once per visit) ---------- */
const intro = $('#intro');
if (intro && html.classList.contains('intro-on')) {
  const v = $('.intro-v', intro), line = $('.intro-line span', intro), enter = $('.intro-enter', intro), skip = $('.intro-skip', intro);
  const portrait = innerWidth / innerHeight < 0.9;
  const src = ROOT + 'media/' + (portrait ? 'intro_mobile.mp4' : 'intro_desktop.mp4');
  const poster = ROOT + 'media/' + (portrait ? 'poster_mobile.webp' : 'poster_desktop.webp');
  let done = false, revealed = false;
  const final = line.textContent;
  const reveal = () => {
    if (revealed) return; revealed = true; intro.classList.add('lit');
    if (!RM) { const t0 = performance.now(), len = final.length;
      const tick = now => { const k = (now - t0) / 1500; let o = '';
        for (let i = 0; i < len; i++) { const c = final[i]; o += (c === ' ' || k > i / len * .8 + .2) ? c : sym[(Math.random() * sym.length) | 0]; }
        line.textContent = k >= 1 ? final : o; if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick); }
    setTimeout(() => { try { enter.focus({ preventScroll: true }); } catch (e) {} }, 900);
  };
  const finish = () => {
    if (done) return; done = true;
    try { sessionStorage.setItem('a27_intro', '1'); } catch (e) {}
    html.classList.add('intro-leaving'); intro.classList.add('out');
    setTimeout(() => dispatchEvent(new Event('a27:intro-done')), 450);
    setTimeout(() => { html.classList.remove('intro-on', 'intro-leaving'); intro.remove(); }, 1500);
  };
  v.poster = poster; v.src = src; v.muted = true; v.defaultMuted = true; v.setAttribute('muted', '');
  intro.classList.add('started');
  const p = v.play();
  if (p && p.catch) p.then(() => intro.classList.add('playing')).catch(() => { v.removeAttribute('src'); v.load(); reveal(); });
  v.addEventListener('timeupdate', () => { if (v.duration && v.currentTime > v.duration - 3.0) reveal(); });
  v.addEventListener('ended', () => { reveal(); setTimeout(finish, 4500); });
  v.addEventListener('error', reveal);
  setTimeout(reveal, 14000);                 // safety net if the video stalls
  enter.addEventListener('click', finish); skip.addEventListener('click', finish);
  addEventListener('keydown', e => { if (!done && (e.key === 'Escape' || (e.key === 'Enter' && revealed))) finish(); });
}
$$('.replay-intro').forEach(a => a.addEventListener('click', e => {
  e.preventDefault(); try { sessionStorage.removeItem('a27_intro'); } catch (er) {}
  location.href = ROOT + 'index.html'; if (/index\.html$|\/$/.test(location.pathname)) location.reload();
}));

/* ---------- orbit of symbols ---------- */
const orbit = $('#orbit'), reading = $('#reading');
if (orbit && D.orbit) {
  const n = D.orbit.length;
  D.orbit.forEach((o, i) => {
    const ang = -Math.PI / 2 + i * 2 * Math.PI / n, R = 43;
    const b = document.createElement('button');
    b.className = 'glyph'; b.type = 'button'; b.setAttribute('aria-pressed', 'false');
    b.setAttribute('aria-label', `Symbol ${i + 1}: ${o.kicker}`);
    b.style.left = (50 + R * Math.cos(ang)) + '%'; b.style.top = (50 + R * Math.sin(ang)) + '%';
    b.innerHTML = svg(o.glyph);
    b.addEventListener('click', () => show(i));
    orbit.appendChild(b);
  });
  const core = $('.core', orbit);
  const show = i => {
    const o = i < 0 ? D.bonus : D.orbit[i];
    $$('.glyph', orbit).forEach((g, k) => g.setAttribute('aria-pressed', String(k === i)));
    reading.classList.remove('swap'); void reading.offsetWidth; reading.classList.add('swap');
    reading.innerHTML = `<p class="n">${i < 0 ? 'The center' : 'Symbol ' + (i + 1) + ' of 10'} · ${o.kicker}</p>
      <h3>${o.title}</h3><p class="hook">${o.hook}</p><p class="body">${o.body}</p>
      ${o.sources.length ? `<p class="src">Sources named: ${o.sources.slice(0, 3).join('; ')}</p>` : ''}
      <a class="textlink" href="${ROOT}posts/${o.id}.html">Read the full decode</a>`;
  };
  core && core.addEventListener('click', () => show(-1));
  show(0);
  orbit.addEventListener('keydown', e => {
    const cur = $$('.glyph', orbit).findIndex(g => g.getAttribute('aria-pressed') === 'true');
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { const k = (cur + 1) % n; show(k); $$('.glyph', orbit)[k].focus(); e.preventDefault(); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { const k = (cur - 1 + n) % n; show(k); $$('.glyph', orbit)[k].focus(); e.preventDefault(); }
  });
}

/* ---------- theory / fact switch ---------- */
$$('.theory').forEach(t => {
  const b = $('.switch button', t);
  b && b.addEventListener('click', () => { const on = t.classList.toggle('is-fact'); b.setAttribute('aria-checked', String(on)); });
});

/* ---------- cards ---------- */
$$('.tcard').forEach(c => {
  c.addEventListener('click', e => { if (e.target.closest('a')) return; c.classList.toggle('flipped'); c.setAttribute('aria-pressed', String(c.classList.contains('flipped'))); });
});

/* ---------- archive filters ---------- */
const arch = $('#archive');
if (arch) {
  let ser = 'all', mode = 'all', q = '';
  const items = $$('.item', arch), empty = $('#empty');
  const apply = () => {
    let shown = 0;
    items.forEach(it => {
      const ok = (ser === 'all' || it.dataset.series === ser) && (mode === 'all' || it.dataset.mode === mode) && (!q || it.dataset.text.includes(q));
      it.hidden = !ok; if (ok) shown++;
    });
    empty.hidden = shown > 0;
  };
  $$('.chip[data-series]').forEach(ch => ch.addEventListener('click', () => {
    ser = ch.dataset.series; $$('.chip[data-series]').forEach(c => c.setAttribute('aria-pressed', String(c === ch))); apply();
  }));
  $$('.chip[data-mode]').forEach(ch => ch.addEventListener('click', () => {
    mode = ch.dataset.mode; $$('.chip[data-mode]').forEach(c => c.setAttribute('aria-pressed', String(c === ch))); apply();
  }));
  const inp = $('#q'); inp && inp.addEventListener('input', () => { q = inp.value.trim().toLowerCase(); apply(); });
}

/* ---------- lightbox ---------- */
const lb = $('.lightbox');
if (lb) {
  const imgs = $$('.gallery img').map(i => i.dataset.full || i.src); let k = 0;
  const im = $('img', lb);
  const open = i => { k = (i + imgs.length) % imgs.length; im.src = imgs[k]; lb.classList.add('open'); $('.x', lb).focus(); };
  const close = () => lb.classList.remove('open');
  $$('.gallery button').forEach((b, i) => b.addEventListener('click', () => open(i)));
  $('.x', lb).onclick = close; $('.pv', lb).onclick = () => open(k - 1); $('.nx', lb).onclick = () => open(k + 1);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') open(k + 1); if (e.key === 'ArrowLeft') open(k - 1); });
}
})();

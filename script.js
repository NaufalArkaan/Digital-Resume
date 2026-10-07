document.documentElement.classList.add('js');
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* Tema gelap/terang (diingat di localStorage) */
const root = document.documentElement;
try {
    root.dataset.theme = localStorage.getItem('tema') ||
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
} catch (e) {}
$('#theme').addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try {
        localStorage.setItem('tema', root.dataset.theme);
    } catch (e) {}
});

/* Menu mobile */
const burger = $('#burger'),
    menu = $('#menu');
burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
});
$$('#menu a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
}));

/* Efek mengetik */
const words = ['Web Developer', 'Front-end Enthusiast', 'UI Designer'];
let w = 0,
    c = 0,
    del = false;
(function type() {
    const t = words[w];
    $('#typed').textContent = t.slice(0, c);
    if (!del && c === t.length) {
        del = true;
        return setTimeout(type, 1500);
    }
    if (del && c === 0) {
        del = false;
        w = (w + 1) % words.length;
    }
    c += del ? -1 : 1;
    setTimeout(type, del ? 40 : 90);
})();

/* Progress scroll, tombol ke atas */
const toTop = $('#top');
addEventListener('scroll', () => {
    const h = document.documentElement;
    $('#progress').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
    toTop.classList.toggle('show', h.scrollTop > 500);
}, {
    passive: true
});
toTop.addEventListener('click', () => scrollTo({
    top: 0
}));

/* Menu aktif sesuai section (scroll spy) */
const links = $$('#menu a');
const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.hash === '#' + e.target.id));
}), {
    rootMargin: '-45% 0px -50% 0px'
});
$$('main section').forEach(s => spy.observe(s));

/* Muncul saat scroll + isi progress bar + hitung angka */
$$('.section h2, .card, .timeline li, .stats div, .skills li, form, address').forEach(el => el.classList.add('reveal'));
const count = el => {
    const to = +el.dataset.to,
        dec = +(el.dataset.dec || 0),
        t0 = performance.now();
    (function f(n) {
        const p = Math.min((n - t0) / 1200, 1);
        el.textContent = (to * p).toFixed(dec);
        if (p < 1) requestAnimationFrame(f);
    })(t0);
};
const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('.fill', e.target).forEach(f => f.style.width = f.dataset.w + '%');
    $$('.count', e.target).forEach(count);
    io.unobserve(e.target);
}), {
    threshold: .2
});
$$('.reveal').forEach(el => io.observe(el));

/* Filter proyek */
$$('.chip').forEach(b => b.addEventListener('click', () => {
    $$('.chip').forEach(x => x.classList.toggle('active', x === b));
    $$('.card').forEach(card => card.classList.toggle('hide', b.dataset.f !== 'all' && card.dataset.c !== b.dataset.f));
}));

/* Efek miring kartu hero (desktop) */
const tilt = $('#tilt');
if (matchMedia('(hover:hover)').matches) {
    tilt.addEventListener('mousemove', e => {
        const r = tilt.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5,
            y = (e.clientY - r.top) / r.height - .5;
        tilt.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
    });
    tilt.addEventListener('mouseleave', () => tilt.style.transform = '');
}

/* Validasi form kontak */
$('#form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target,
        msg = $('#msg');
    let ok = true;
    $$('input,textarea', f).forEach(i => {
        const bad = !i.checkValidity();
        i.classList.toggle('err', bad);
        if (bad) ok = false;
    });
    msg.className = 'msg ' + (ok ? 'ok' : 'bad');
    msg.textContent = ok ? 'Pesan terkirim. Terima kasih, ' + f.nama.value + '!' :
        'Lengkapi nama (min. 3 huruf), email valid, dan pesan (min. 10 huruf).';
    if (ok) f.reset();
});
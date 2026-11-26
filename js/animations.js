/* =========================================================
   THEME "BLACK / ACID" — анимации. Подключать ПОСЛЕ main.js
   ========================================================= */
(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const lerp = (a, b, t) => a + (b - a) * t;
    const $ = (s, root = document) => root.querySelector(s);
    const $$ = (s, root = document) => [...root.querySelectorAll(s)];
    const el = (tag, cls, html = '') => {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        n.innerHTML = html;
        return n;
    };

    /* ---------- Разбивка текста на маски ---------- */
    const splitChars = (node, outlineWordIndex = -1) => {
        const text = node.textContent.trim();
        node.setAttribute('aria-label', text);
        let i = 0;
        node.innerHTML = text.split(/\s+/).map((word, w) => {
            const chars = [...word].map(ch =>
                `<span class="fx-mask" aria-hidden="true"><span class="fx-char" style="--i:${i++}">${ch}</span></span>`
            ).join('');
            return `<span class="fx-word${w === outlineWordIndex ? ' fx-outline' : ''}">${chars}</span>`;
        }).join(' ');
        return text;
    };

    const splitWords = node => {
        const text = node.textContent.trim();
        node.setAttribute('aria-label', text);
        node.classList.add('fx-words');
        node.innerHTML = text.split(/\s+/).map((word, i) =>
            `<span class="fx-mask" aria-hidden="true"><span class="fx-char" style="--i:${i * 2}">${word}</span></span>`
        ).join(' ');
    };

    /* ---------- Прелоадер: счётчик 0 → 100 ---------- */
    const preloader = el('div', 'fx-preloader',
        '<div class="fx-preloader__top"><span>iPhone 14 Pro</span><span>Loading</span><span>©2026</span></div>' +
        '<div class="fx-preloader__count">000</div>');
    document.body.prepend(preloader);
    const countEl = $('.fx-preloader__count', preloader);

    let loaded = document.readyState === 'complete';
    let counted = reduceMotion;
    window.addEventListener('load', () => { loaded = true; maybeHide(); });

    const t0 = performance.now();
    const DURATION = reduceMotion ? 0 : 1400;
    const count = now => {
        const p = DURATION ? Math.min(1, (now - t0) / DURATION) : 1;
        const eased = 1 - Math.pow(1 - p, 3);
        countEl.textContent = String(Math.round(eased * 100)).padStart(3, '0');
        if (p < 1) requestAnimationFrame(count);
        else { counted = true; maybeHide(); }
    };
    requestAnimationFrame(count);

    let hidden = false;
    function maybeHide(force) {
        if (hidden || (!force && !(loaded && counted))) return;
        hidden = true;
        preloader.classList.add('is-done');
        setTimeout(() => preloader.remove(), 1200);
        setTimeout(() => document.dispatchEvent(new Event('fx:ready')), 350);
    }
    setTimeout(() => maybeHide(true), 4000); // страховка

    /* ---------- Прогресс скролла ---------- */
    const progress = el('div', 'fx-progress');
    document.body.appendChild(progress);

    /* ---------- HERO ---------- */
    const headline = $('.headline');
    const title = $('.title');
    const heroPic = $('.headline picture');

    if (headline) {
        headline.append(
            el('div', 'fx-meta fx-meta--tl', '<b>[A16]</b> Bionic<br>6-core CPU'),
            el('div', 'fx-meta fx-meta--tr', '48 MP<br><b>ProRAW</b>'),
            el('div', 'fx-meta fx-meta--bl', 'ProMotion<br><b>1–120 Hz</b>'),
            el('div', 'fx-meta fx-meta--br', 'Scroll')
        );
    }

    if (title) {
        splitChars(title, 1); // «14» — контуром
        title.classList.add('fx-split');
        document.addEventListener('fx:ready', () => title.classList.add('fx-go'), { once: true });
    }

    /* ---------- Перекрещённые строки ---------- */
    const bands = [];
    if (headline) {
        const words = ['A16 Bionic', 'Dynamic Island', '48 MP', 'ProMotion', 'Ceramic Shield', 'Always-On'];
        const items = words.map(w => `<span class="fx-band__item">${w}</span>`).join('');
        const cross = el('div', 'fx-cross');
        cross.setAttribute('aria-hidden', 'true');
        cross.innerHTML =
            `<div class="fx-band fx-band--b"><div class="fx-band__track">${items.repeat(4)}</div></div>` +
            `<div class="fx-band fx-band--a"><div class="fx-band__track">${items.repeat(4)}</div></div>`;
        headline.after(cross);
        $$('.fx-band__track', cross).forEach((track, i) => {
            bands.push({ track, x: i ? 0 : -track.scrollWidth / 4, dir: i ? -1 : 1 });
        });
    }

    /* ---------- Заголовки секций ---------- */
    const sectionTitles = [$('.new-title'), $('.color-title'), $('.contacts .contacts-title')].filter(Boolean);
    sectionTitles.forEach((t, i) => {
        splitWords(t);
        if (!t.classList.contains('contacts-title')) {
            t.appendChild(el('span', 'fx-index', `(0${i + 1})`));
        }
    });
    const modalTitle = $('.modal .contacts-title');
    if (modalTitle) modalTitle.classList.add('fx-in');

    /* ---------- Карточки цветов ---------- */
    const colorItems = $$('.color-item');
    colorItems.forEach(item => item.prepend(el('span', 'fx-fill')));

    /* ---------- Бейдж в контактах ---------- */
    const contacts = $('.contacts-inner');
    const openBtn = $('#openModal');
    if (contacts) {
        const label = (openBtn ? openBtn.textContent.trim() : 'Order') + ' • iPhone 14 Pro • ';
        const badge = el('div', 'fx-badge',
            `<svg viewBox="0 0 120 120"><defs><path id="fx-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"/></defs>` +
            `<text><textPath href="#fx-circle">${label}${label}</textPath></text></svg><span>↗</span>`);
        badge.setAttribute('role', 'button');
        badge.setAttribute('aria-label', label);
        badge.addEventListener('click', () => openBtn && openBtn.click());
        contacts.appendChild(badge);
    }

    /* ---------- Огромное слово в подвале ---------- */
    const footer = $('.footer');
    if (footer) {
        const big = el('div', 'fx-bigword');
        big.setAttribute('aria-hidden', 'true');
        big.innerHTML = [...'IPHONE14PRO'].map(c => `<span>${c}</span>`).join('');
        footer.prepend(big);
    }

    /* ---------- Stagger для появления ---------- */
    const groups = new Map();
    $$('.fade-in-scroll').forEach(node => {
        const p = node.parentElement;
        if (!groups.has(p)) groups.set(p, []);
        groups.get(p).push(node);
    });
    groups.forEach(list => {
        if (list.length < 2) return;
        list.forEach((node, i) => {
            node.style.transitionDelay = `${i * 80}ms`;
            setTimeout(() => (node.style.transitionDelay = ''), 4000 + i * 80);
        });
    });

    /* ---------- IntersectionObserver: заголовки и карточки ---------- */
    const revealTargets = [...sectionTitles, ...colorItems];
    if ('IntersectionObserver' in window && !reduceMotion) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const t = entry.target;
                const idx = colorItems.indexOf(t);
                if (idx > -1) t.style.transitionDelay = `${(idx % 4) * 120}ms`;
                t.classList.add('fx-in');
                if (idx > -1) setTimeout(() => (t.style.transitionDelay = ''), 1600);
                io.unobserve(t);
            });
        }, { threshold: 0.25 });
        revealTargets.forEach(t => io.observe(t));
    } else {
        revealTargets.forEach(t => t.classList.add('fx-in'));
    }

    if (reduceMotion) {
        title && title.classList.add('fx-go');
        return;
    }

    /* ---------- Курсор ---------- */
    let mouseX = innerWidth / 2, mouseY = innerHeight / 2;
    let curX = mouseX, curY = mouseY;
    let cursor = null;

    if (finePointer) {
        cursor = el('div', 'fx-cursor');
        document.body.appendChild(cursor);
        addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.classList.add('is-visible');
        }, { passive: true });
        document.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));

        const viewSel = '.color-item, .images-new, .headline picture, .contacts-inner picture';
        const hoverSel = 'a, button, select, input, .close, .close-btn, .fx-badge';
        document.addEventListener('mouseover', e => {
            cursor.classList.toggle('is-view', !!e.target.closest(viewSel));
            cursor.classList.toggle('is-hover', !!e.target.closest(hoverSel));
        });
    }

    /* ---------- Главный цикл ---------- */
    let lastY = scrollY;
    let velocity = 0;
    let heroMX = 0, heroMY = 0, heroCX = 0, heroCY = 0;

    if (headline && finePointer) {
        headline.addEventListener('mousemove', e => {
            const r = headline.getBoundingClientRect();
            heroMX = (e.clientX - r.left) / r.width - 0.5;
            heroMY = (e.clientY - r.top) / r.height - 0.5;
        });
        headline.addEventListener('mouseleave', () => { heroMX = 0; heroMY = 0; });
    }

    const tick = () => {
        const y = scrollY;
        velocity = lerp(velocity, y - lastY, 0.15);
        lastY = y;

        const max = document.documentElement.scrollHeight - innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

        // Строки: скорость зависит от скорости скролла
        const dirSign = velocity < -0.1 ? -1 : 1;
        const speed = 1.2 + Math.min(Math.abs(velocity) * 0.6, 25);
        bands.forEach(b => {
            const half = b.track.scrollWidth / 2;
            b.x -= speed * b.dir * dirSign;
            if (b.x <= -half) b.x += half;
            if (b.x > 0) b.x -= half;
            b.track.style.transform = `translate3d(${b.x}px,0,0)`;
        });

        // Параллакс hero
        if (y < innerHeight * 1.5) {
            heroCX = lerp(heroCX, heroMX, 0.08);
            heroCY = lerp(heroCY, heroMY, 0.08);
            if (title) title.style.translate = `${heroCX * -30}px ${y * 0.25}px`;
            if (heroPic) heroPic.style.translate = `${heroCX * 40}px ${y * -0.08 + heroCY * 20}px`;
        }

        if (cursor) {
            curX = lerp(curX, mouseX, 0.2);
            curY = lerp(curY, mouseY, 0.2);
            cursor.style.translate = `${curX}px ${curY}px`;
        }
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    if (!finePointer) return;

    /* ---------- Магнитные кнопки ---------- */
    $$('.headline-btn, .contacts-btn, .fx-badge').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            btn.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.3}px ${(e.clientY - r.top - r.height / 2) * 0.4}px`;
        });
        btn.addEventListener('mouseleave', () => (btn.style.translate = ''));
    });
})();

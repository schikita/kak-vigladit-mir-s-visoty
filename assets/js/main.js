document.addEventListener('DOMContentLoaded', () => {
  /* Прелоадер и первичная анимация */
  const preloader = document.getElementById('preloader');
  const revealItems = document.querySelectorAll('.reveal');

  const io = ('IntersectionObserver' in window)
    ? new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.15 })
    : null;

  revealItems.forEach(el => io ? io.observe(el) : el.classList.add('is-visible'));

  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 900);
  }

  /* Хедер при скролле */
  const header = document.querySelector('.site-header');
  const onScrollHeader = () => {
    if (window.scrollY > 100) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* Кнопка наверх */
  const backToTop = document.getElementById('back-to-top');
  const onScrollTop = () => {
    if (window.pageYOffset > 300) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  };
  onScrollTop();
  window.addEventListener('scroll', onScrollTop, { passive: true });

  /* Плавная прокрутка для якорей (учёт фиксированного хедера) */
  /* Плавная прокрутка для якорей (учёт фиксированного хедера) */
  const scrollToId = (id) => {
    const target = document.querySelector(id);
    if (!target) return;

    const headerOffset =
      document.querySelector('.site-header')?.offsetHeight || 80;

    const top =
      target.getBoundingClientRect().top +
      window.pageYOffset -
      headerOffset;

    window.scrollTo({ top, behavior: 'smooth' });
  };

  // Делегирование: работает и для ссылок, добавленных позже (мобильное меню)
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    e.preventDefault();

    // Если кликнули по ссылке в мобильном меню — закрываем панель
    if (link.closest('#mobile-nav') && typeof closeMobile === 'function') {
      closeMobile();
    }

    scrollToId(href);
  });



  /* Мобильное меню (синхронизация пунктов) */
  const navMenu = document.getElementById('nav-menu');
  const mobileNavMenu = document.getElementById('mobile-nav-menu');
  if (navMenu && mobileNavMenu) {
    mobileNavMenu.innerHTML = '';
    navMenu.querySelectorAll('li').forEach(li => {
      mobileNavMenu.appendChild(li.cloneNode(true));
    });
  }});

const navToggle   = document.getElementById('nav-toggle');
const navClose    = document.getElementById('nav-close');
const mobileNav   = document.getElementById('mobile-nav');
const mobileOverlay = document.getElementById('mobile-menu-overlay');

function openMobile() {
  // показать меню
  mobileNav.classList.add('active');
  mobileOverlay.classList.add('active');
  document.body.classList.add('nav-open');
  document.body.style.overflow = 'hidden';

  // доступность
  navToggle.setAttribute('aria-expanded', 'true');
  mobileNav.setAttribute('aria-hidden', 'false');

  // переносим фокус ПОСЛЕ снятия aria-hidden
  requestAnimationFrame(() => navClose.focus());
}

function closeMobile() {
  // вернуть фокус наружу
  navToggle.focus();

  // скрыть меню
  mobileNav.classList.remove('active');
  mobileOverlay.classList.remove('active');
  document.body.classList.remove('nav-open');
  document.body.style.overflow = 'auto';

  // доступность (после возврата фокуса)
  navToggle.setAttribute('aria-expanded', 'false');
  mobileNav.setAttribute('aria-hidden', 'true');
}

navToggle?.addEventListener('click', openMobile);
navClose?.addEventListener('click', closeMobile);
mobileOverlay?.addEventListener('click', closeMobile);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileNav?.classList.contains('active')) closeMobile();
});

// Отмечаем секцию как видимую, чтобы запустить анимации
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('in-view');
  });
}, { threshold: 0.2 });

document.querySelectorAll('.section--mountains').forEach(el => io.observe(el));



(() => {
  const grid = document.getElementById('ascent-collage-grid');
  const box  = document.getElementById('ascent-lightbox');
  if (!grid || !box) return;

  const img     = document.getElementById('ascent-lightbox-img');
  const caption = document.getElementById('ascent-lightbox-caption');
  const closeBtn= box.querySelector('[data-close]');
  const backdrop= box.querySelector('.lightbox__backdrop');
  let lastFocus = null;

  function openLightbox({src, alt, cap}){
    lastFocus = document.activeElement;
    img.src = src;
    img.alt = alt || '';
    caption.textContent = cap || alt || '';
    box.classList.add('open');
    box.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    // Фокус на кнопку
    const btn = box.querySelector('.lightbox__close');
    btn && btn.focus();
  }

  function closeLightbox(){
    box.classList.remove('open');
    box.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    img.src = '';
    // Вернуть фокус
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  // Открытие по клику на карточку
  grid.addEventListener('click', (e) => {
    const el = e.target.closest('.collage-item');
    if (!el) return;
    const src = el.dataset.full || el.querySelector('img')?.src;
    const alt = el.querySelector('img')?.alt || '';
    const cap = el.dataset.caption || alt;
    if (src) openLightbox({src, alt, cap});
  });

  // Закрытие
  box.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-close')) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    // Простой trap: таб — держим фокус на close
    if (e.key === 'Tab'){
      e.preventDefault();
      const btn = box.querySelector('.lightbox__close');
      btn && btn.focus();
    }
  });
})();


// Кастомный плеер с lazy-подгрузкой и автопаузой
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".custom-player").forEach((player) => {
    const video  = player.querySelector(".report-video");
    const playBtn = player.querySelector(".btn-play");
    const volume  = player.querySelector(".volume");
    if (!video || !playBtn || !volume) return;

    // ленивое подключение источника
    const lazyIO = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && video.dataset.src && !video.src) {
        video.src = video.dataset.src;
        lazyIO.unobserve(video);
      }
    }, { threshold: 0.25 });
    lazyIO.observe(video);

    // стартовая громкость
    video.volume = parseFloat(volume.value || "0.6");

    // play/pause
    playBtn.addEventListener("click", () => {
      if (video.paused) {
        video.play().then(() => {
          playBtn.classList.add("pause");
          playBtn.setAttribute("aria-pressed", "true");
          playBtn.setAttribute("aria-label", "Пауза");
        }).catch(() => {});
      } else {
        video.pause();
        playBtn.classList.remove("pause");
        playBtn.setAttribute("aria-pressed", "false");
        playBtn.setAttribute("aria-label", "Воспроизвести");
      }
    });

    // изменение кнопки при внешних событиях
    video.addEventListener("pause", () => playBtn.classList.remove("pause"));
    video.addEventListener("play",  () => playBtn.classList.add("pause"));

    // громкость
    volume.addEventListener("input", e => { video.volume = Number(e.target.value); });

    // автопауза при уходе с вкладки / из вьюпорта
    const pause = () => { if (!video.paused) video.pause(); };
    document.addEventListener("visibilitychange", () => document.hidden && pause());
    window.addEventListener("blur", pause);
    const viewIO = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.2) pause();
    }, { threshold: [0, 0.2, 1] });
    viewIO.observe(video);
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const grid   = document.getElementById("mahjong-grid");
  const reset  = document.getElementById("mahjong-reset");
  const status = document.getElementById("mahjong-status");
  if (!grid || !reset) return;

  // Вопрос–ответ пары
  const qaPairs = [
    {
      id: 1,
      q: "Максимальная высота вершины Ухуру?",
      a: "5895 м над уровнем моря"
    },
    {
      id: 2,
      q: "Оптимальная скорость подъёма?",
      a: "Около 1–1,5 км/ч"
    },
    {
      id: 3,
      q: "Сколько дней заняло восхождение у Захара?",
      a: "8 дней: 6 вверх и 2 вниз"
    },
    {
      id: 4,
      q: "Два продукта-топа для альпинистов?",
      a: "Сало и халва — калорийные и долго хранятся"
    },
    {
      id: 5,
      q: "Зачем трекинговые палки?",
      a: "Задают ритм, берегут ноги, помогают балансу"
    },
    {
      id: 6,
      q: "Сколько примерно калорий сжигают в день на подъёме?",
      a: "Около 4000–6000 ккал"
    }
  ];

  let first = null;
  let lock  = false;
  let matchedCount = 0;

  const createTiles = () => {
    const tilesData = [];
    qaPairs.forEach(pair => {
      tilesData.push({ id: pair.id, type: "q", label: "Вопрос", text: pair.q });
      tilesData.push({ id: pair.id, type: "a", label: "Ответ",  text: pair.a });
    });

    // Перемешиваем
    for (let i = tilesData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tilesData[i], tilesData[j]] = [tilesData[j], tilesData[i]];
    }

    grid.innerHTML = "";
    matchedCount = 0;
    status.textContent = "";

    tilesData.forEach((tile, index) => {
      const btn = document.createElement("button");
      btn.className = "mahjong-tile";
      btn.type = "button";
      btn.dataset.id = tile.id;
      btn.dataset.type = tile.type;
      btn.dataset.index = index;

      const inner = document.createElement("div");
      inner.className = "mahjong-inner";

      const lbl = document.createElement("div");
      lbl.className = "mahjong-label " + (tile.type === "q" ? "mahjong-label--q" : "mahjong-label--a");
      lbl.textContent = tile.label;

      const txt = document.createElement("div");
      txt.className = "mahjong-text";
      txt.textContent = tile.text;

      inner.appendChild(lbl);
      inner.appendChild(txt);
      btn.appendChild(inner);
      grid.appendChild(btn);
    });
  };

  const closeTiles = (t1, t2) => {
    t1.classList.remove("is-open");
    t2.classList.remove("is-open");
  };

  grid.addEventListener("click", (e) => {
    const tile = e.target.closest(".mahjong-tile");
    if (!tile || lock || tile.classList.contains("is-open") || tile.classList.contains("is-matched")) return;

    tile.classList.add("is-open");

    if (!first) {
      first = tile;
      return;
    }

    // Вторая карточка
    const second = tile;
    lock = true;

    const isMatch =
      first.dataset.id === second.dataset.id &&
      first.dataset.type !== second.dataset.type;

    if (isMatch) {
      // Совпадение: фиксируем
      setTimeout(() => {
        first.classList.add("is-matched");
        second.classList.add("is-matched");
        first.disabled = true;
        second.disabled = true;
        matchedCount++;
        if (matchedCount === qaPairs.length) {
          status.textContent = "Все пары найдены! Отличная подготовка 😉";
        }
        first = null;
        lock = false;
      }, 220);
    } else {
      // Нет совпадения: прячем
      setTimeout(() => {
        closeTiles(first, second);
        first = null;
        lock = false;
      }, 550);
    }
  });

  reset.addEventListener("click", () => {
    first = null;
    lock = false;
    createTiles();
  });

  // инициализация при загрузке
  createTiles();
});


// ===============================
// КАРУСЕЛЬ ПРОЕКТОВ
// ===============================
(function setupProjectsCarousel() {
  const viewport = document.querySelector('#projects .projects-viewport');
  if (!viewport) return;

  const stage = viewport.querySelector('.projects-stage');
  const cards = [...stage.querySelectorAll('.project-card')];
  if (!cards.length) return;

  const dotsWrap = viewport.querySelector('.pr-dots');
  const prevBtn = viewport.querySelector('.prev');
  const nextBtn = viewport.querySelector('.next');

  let i = 0, timer = null;
  const interval = +(viewport.dataset.interval || 5000);
  const autoplay = viewport.dataset.autoplay !== 'false';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  dotsWrap.innerHTML = cards.map(() => '<i></i>').join('');
  const dots = [...dotsWrap.children];

  const show = (idx) => {
    i = (idx + cards.length) % cards.length;
    cards.forEach((c, k) => c.classList.toggle('is-active', k === i));
    dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
  };

  const next = () => show(i + 1);
  const prev = () => show(i - 1);
  const play = () => {
    if (reduce || !autoplay) return;
    stop();
    timer = setInterval(next, interval);
  };
  const stop = () => timer && clearInterval(timer);

  show(0);
  play();

  nextBtn?.addEventListener('click', () => { next(); play(); });
  prevBtn?.addEventListener('click', () => { prev(); play(); });
  dotsWrap.addEventListener('click', (e) => {
    const idx = dots.indexOf(e.target);
    if (idx > -1) { show(idx); play(); }
  });

  viewport.addEventListener('mouseenter', stop);
  viewport.addEventListener('mouseleave', play);
  viewport.addEventListener('focusin', stop);
  viewport.addEventListener('focusout', play);

  // Авто-пауза вне экрана
const sectionsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('in-view');
  });
}, { threshold: 0.2 });
  io.observe(viewport);
})();
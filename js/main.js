/* ═══════════════════════════════════════════════════════════════
   AMANDA LENNS — INTERAÇÕES
   - Nav: scroll state + menu mobile acessível
   - Reveal on scroll (IntersectionObserver) + parallax leve
   - Lightbox da galeria (teclado, foco, Escape, navegação)
   - Links configuráveis (WhatsApp / plataformas) com tratamento
     honesto de campos provisórios (sem destinos inventados)
   - Vídeo do hero: alternativa estática se não carregar / mobile leve
   Respeita prefers-reduced-motion em todos os efeitos.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || { whatsappNumber: "", links: {} };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- TOAST ---------- */
  var toastEl = document.getElementById("toast");
  var toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("is-visible");
    }, 3600);
  }

  /* ---------- WHATSAPP ---------- */
  function waHref() {
    var num = String(cfg.whatsappNumber || "").replace(/\D+/g, "");
    if (!num) return "";
    var msg = cfg.whatsappMessage ? "?text=" + encodeURIComponent(cfg.whatsappMessage) : "";
    return "https://wa.me/" + num + msg;
  }

  var hasWa = !!waHref();
  var waButtons = document.querySelectorAll(".js-whatsapp");
  Array.prototype.forEach.call(waButtons, function (btn) {
    if (hasWa) {
      btn.setAttribute("href", waHref());
      btn.setAttribute("target", "_blank");
      btn.setAttribute("rel", "noopener");
    } else {
      btn.classList.add("is-placeholder");
      btn.setAttribute("href", "#");
      btn.setAttribute("aria-label", "WhatsApp — campo provisório, número ainda não informado");
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        showToast("Campo provisório: o número de WhatsApp ainda será informado. Substitua em config.js.");
      });
    }
  });

  /* ---------- LINKS DE PLATAFORMAS ---------- */
  var anyPlaceholder = !hasWa;
  var linkEls = document.querySelectorAll(".js-link[data-config-key]");
  Array.prototype.forEach.call(linkEls, function (a) {
    var key = a.getAttribute("data-config-key");
    var url = (cfg.links && cfg.links[key]) || "";
    var card = a.closest(".platform-card") || a.closest("li");
    if (/^https?:\/\//i.test(url)) {
      a.setAttribute("href", url);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
      if (card) card.classList.remove("is-placeholder");
    } else {
      a.setAttribute("href", "#");
      if (card) card.classList.add("is-placeholder");
      a.classList.add("is-placeholder");
      anyPlaceholder = true;
      a.addEventListener("click", function (e) {
        e.preventDefault();
        showToast("Campo provisório: o link oficial deste canal ainda será informado. Substitua em config.js.");
      });
    }
  });

  var footerNote = document.getElementById("footerPlaceholderNote");
  if (footerNote && anyPlaceholder) footerNote.hidden = false;

  /* ---------- NAV: SCROLL STATE ---------- */
  var nav = document.getElementById("siteNav");
  function onScrollNav() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- NAV: MENU MOBILE ---------- */
  var toggle = document.getElementById("navToggle");
  var list = document.getElementById("navList");
  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Fechar menu de navegação" : "Abrir menu de navegação");
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("is-open"));
    });
    list && Array.prototype.forEach.call(list.querySelectorAll("a"), function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    Array.prototype.forEach.call(revealEls, function (el) { io.observe(el); });
  }

  /* ---------- PARALLAX LEVE (imagem da Essência) ---------- */
  var parallaxEl = document.querySelector("[data-parallax]");
  if (parallaxEl && !reduceMotion && window.matchMedia("(min-width: 861px)").matches) {
    var ticking = false;
    function applyParallax() {
      var rect = parallaxEl.getBoundingClientRect();
      var vh = window.innerHeight;
      var progress = (rect.top + rect.height / 2 - vh / 2) / vh; // -1..~1
      var shift = Math.max(-40, Math.min(40, progress * -40));
      parallaxEl.style.transform = "translateY(" + shift.toFixed(1) + "px)";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(applyParallax); }
    }, { passive: true });
    applyParallax();
  }

  /* ---------- HERO: ALTERNATIVA DE VÍDEO ---------- */
  var hero = document.querySelector(".hero");
  var heroVideo = document.querySelector(".hero__video");
  if (hero && heroVideo) {
    function useStaticHero() { hero.classList.add("has-static-media"); }
    heroVideo.addEventListener("error", useStaticMediaErrorHandler, true);
    var src = heroVideo.querySelector("source");
    if (src) src.addEventListener("error", useStaticHero);

    // Em telas pequenas ou economia de dados, usa a foto estática (mais rápida).
    var isSmall = window.matchMedia("(max-width: 640px)").matches;
    var saveData = navigator.connection && navigator.connection.saveData;
    if (isSmall || saveData) {
      useStaticHero();
      try { heroVideo.pause(); } catch (e) {}
      heroVideo.removeAttribute("autoplay");
    } else {
      var p = heroVideo.play && heroVideo.play();
      if (p && typeof p.catch === "function") p.catch(useStaticHero);
    }

    // Pausa o vídeo quando fora da viewport (performance/bateria)
    if (!reduceMotion && "IntersectionObserver" in window && !useStaticHero.called) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (hero.classList.contains("has-static-media")) return;
          if (en.isIntersecting) { heroVideo.play().catch(function(){}); }
          else { heroVideo.pause(); }
        });
      }, { threshold: 0.05 });
      vio.observe(hero);
    }
  }
  function useStaticMediaErrorHandler() {
    if (hero) hero.classList.add("has-static-media");
  }

  /* ---------- LIGHTBOX DA GALERIA ---------- */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightboxImg");
  var lbCounter = document.getElementById("lightboxCounter");
  var lbClose = document.getElementById("lightboxClose");
  var lbPrev = document.getElementById("lightboxPrev");
  var lbNext = document.getElementById("lightboxNext");
  var triggers = Array.prototype.slice.call(document.querySelectorAll(".gallery__trigger"));
  var currentIndex = 0;
  var lastFocused = null;

  function renderLightbox() {
    var t = triggers[currentIndex];
    if (!t || !lbImg) return;
    lbImg.src = t.getAttribute("data-full");
    lbImg.alt = t.getAttribute("data-alt") || "Imagem ampliada da galeria";
    if (lbCounter) lbCounter.textContent = (currentIndex + 1) + " / " + triggers.length;
  }
  function openLightbox(index) {
    if (!lightbox) return;
    currentIndex = index;
    lastFocused = document.activeElement;
    renderLightbox();
    lightbox.hidden = false;
    document.body.classList.add("no-scroll");
    (lbClose || lightbox).focus();
  }
  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.classList.remove("no-scroll");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }
  function step(delta) {
    currentIndex = (currentIndex + delta + triggers.length) % triggers.length;
    renderLightbox();
  }

  triggers.forEach(function (t, i) {
    t.addEventListener("click", function () { openLightbox(i); });
  });
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lbPrev) lbPrev.addEventListener("click", function () { step(-1); });
  if (lbNext) lbNext.addEventListener("click", function () { step(1); });
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });

  // Foco preso dentro do lightbox enquanto aberto
  if (lightbox) {
    lightbox.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var focusables = lightbox.querySelectorAll("button");
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
})();

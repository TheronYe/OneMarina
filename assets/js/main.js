/* ═══════════════════════════════════════════════════════════
   ONE MARINA 瑅海 — Interactions
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var d = document;
  var w = window;
  var root = d.documentElement;
  var reduceMotion = w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Preloader ─────────────────────────────────────────── */
  var pre = d.getElementById("preloader");
  var preHidden = false;

  function hidePreloader() {
    if (preHidden) return;
    preHidden = true;
    if (pre) {
      pre.classList.add("done");
      setTimeout(function () {
        if (pre && pre.parentNode) pre.parentNode.removeChild(pre);
      }, 900);
    }
    d.body.classList.add("loaded");
    startReveals();
  }

  var minWait = new Promise(function (res) { setTimeout(res, reduceMotion ? 200 : 1600); });
  var loadWait = new Promise(function (res) {
    if (d.readyState === "complete") res();
    else w.addEventListener("load", res, { once: true });
  });
  Promise.all([minWait, loadWait]).then(hidePreloader);
  setTimeout(hidePreloader, 5200); /* safety net */

  /* ── Reveal on scroll ──────────────────────────────────── */
  function startReveals() {
    var items = [].slice.call(d.querySelectorAll(".reveal"));
    if (!("IntersectionObserver" in w) || reduceMotion) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }
  /* if preloader element is missing for any reason, don't block reveals */
  if (!pre) { d.body.classList.add("loaded"); startReveals(); }

  /* ── Language switch (繁 / EN) ─────────────────────────── */
  var LANG_KEY = "om-lang";
  var btnTc = d.getElementById("langTc");
  var btnEn = d.getElementById("langEn");
  var i18nNodes = [].slice.call(d.querySelectorAll("[data-en]"));

  /* snapshot original (traditional Chinese) markup once */
  i18nNodes.forEach(function (el) { el.dataset.tc = el.innerHTML; });

  function setLang(lang) {
    var en = lang === "en";
    i18nNodes.forEach(function (el) {
      el.innerHTML = en ? el.dataset.en : el.dataset.tc;
    });
    root.setAttribute("lang", en ? "en" : "zh-Hant");
    if (btnTc && btnEn) {
      btnTc.classList.toggle("active", !en);
      btnEn.classList.toggle("active", en);
      btnTc.setAttribute("aria-pressed", String(!en));
      btnEn.setAttribute("aria-pressed", String(en));
    }
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* private mode */ }
  }

  if (btnTc) btnTc.addEventListener("click", function () { setLang("tc"); });
  if (btnEn) btnEn.addEventListener("click", function () { setLang("en"); });

  var savedLang = null;
  try { savedLang = localStorage.getItem(LANG_KEY); } catch (e) { /* ignore */ }
  if (savedLang === "en") setLang("en");

  /* ── Navigation ────────────────────────────────────────── */
  var nav = d.getElementById("nav");
  var burger = d.getElementById("burger");
  var navLinks = d.getElementById("navLinks");
  var toTop = d.getElementById("toTop");

  function onScroll() {
    var y = w.scrollY || root.scrollTop;
    if (nav) nav.classList.toggle("scrolled", y > 40);
    if (toTop) toTop.classList.toggle("show", y > 620);
  }
  w.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    d.body.classList.remove("menu-open");
    if (burger) burger.setAttribute("aria-expanded", "false");
  }
  if (burger) {
    burger.addEventListener("click", function () {
      var open = d.body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", String(open));
    });
  }
  if (navLinks) {
    [].slice.call(navLinks.querySelectorAll("a")).forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }
  /* Esc 键、品牌标志、页面遮罩与抽屉关闭键均可收起菜单 */
  d.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") closeMenu();
  });
  var brand = d.querySelector(".brand");
  if (brand) brand.addEventListener("click", closeMenu);
  var navBackdrop = d.getElementById("navBackdrop");
  var drawerClose = d.getElementById("drawerClose");
  if (navBackdrop) navBackdrop.addEventListener("click", closeMenu);
  if (drawerClose) drawerClose.addEventListener("click", closeMenu);

  /* active section spy */
  var sections = [].slice.call(d.querySelectorAll("main section[id]"));
  var linkMap = {};
  if (navLinks) {
    [].slice.call(navLinks.querySelectorAll("a[href^='#']")).forEach(function (a) {
      linkMap[a.getAttribute("href").slice(1)] = a;
    });
  }
  if ("IntersectionObserver" in w && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkMap[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          [].slice.call(navLinks.querySelectorAll("a")).forEach(function (a) { a.classList.remove("active"); });
          link.classList.add("active");
        }
      });
    }, { rootMargin: "-42% 0px -52% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  if (toTop) {
    toTop.addEventListener("click", function () {
      w.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ── Animated counters ─────────────────────────────────── */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;
    if (reduceMotion) { el.textContent = String(target); return; }
    var dur = 1700;
    var t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var stats = d.getElementById("stats");
  if (stats && "IntersectionObserver" in w) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          [].slice.call(stats.querySelectorAll("[data-count]")).forEach(animateCount);
          so.disconnect();
        }
      });
    }, { threshold: 0.35 });
    so.observe(stats);
  }

  /* ── Residence tabs ────────────────────────────────────── */
  var tabs = [].slice.call(d.querySelectorAll(".tab"));
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var id = tab.getAttribute("data-tab");
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", String(on));
      });
      [].slice.call(d.querySelectorAll(".panel")).forEach(function (p) {
        var on = p.id === id;
        p.classList.toggle("active", on);
        p.hidden = !on;
      });
    });
  });

  /* ══ 聯絡資料設定 ★ 修改電話／WhatsApp 請改這裡 ═════════════
     電話號碼不會在頁面上顯示，僅用於 tel: 連結（點擊圖示即撥號）。
     phone    — 電話號碼（國際格式，勿加空格）
     whatsapp — WhatsApp 號碼（wa.me 連結用；不含「+」及空格）
     waText   — WhatsApp 對話預先填寫的文字                       */
  var CONTACT = {
    phone: "+85284939175",
    whatsapp: "85284939175",
    waText: "NA您好，我想登記 One Marina 示範單位預約。"
  };
  var waHref = "https://wa.me/" + CONTACT.whatsapp + "?text=" + encodeURIComponent(CONTACT.waText);
  var telLink = d.getElementById("contactTel");
  var waLink = d.getElementById("contactWa");
  var fabTel = d.getElementById("fabTel");
  var fabWa = d.getElementById("fabWa");
  if (telLink) telLink.href = "tel:" + CONTACT.phone;
  if (waLink) waLink.href = waHref;
  if (fabTel) fabTel.href = "tel:" + CONTACT.phone;
  if (fabWa) fabWa.href = waHref;
})();

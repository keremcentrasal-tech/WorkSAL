/* CentraSAL ortak betik dosyası — gizlilik, koşullar, worksal, quantsal ve 404 sayfaları için */
(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  var nav = document.querySelector("nav");

  /* ---- Ürünler açılır menüsü ---- */
  var dd = document.getElementById("dd"), ddb = document.getElementById("ddb");
  if (dd && ddb) {
    var setDD = function (o) { dd.classList.toggle("open", o); ddb.setAttribute("aria-expanded", o); };
    ddb.addEventListener("click", function (e) { e.stopPropagation(); setDD(!dd.classList.contains("open")); });
    document.addEventListener("click", function (e) { if (!dd.contains(e.target)) setDD(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setDD(false); });
  }

  /* ---- Mobil menü (burger) ---- */
  var burger = nav && nav.querySelector(".burger");
  if (burger) {
    var setMenu = function (o) {
      nav.classList.toggle("mo", o);
      burger.setAttribute("aria-expanded", o);
      burger.setAttribute("aria-label", o ? "Menüyü kapat" : "Menüyü aç");
    };
    burger.addEventListener("click", function (e) { e.stopPropagation(); setMenu(!nav.classList.contains("mo")); });
    nav.querySelectorAll("#navlist a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    document.addEventListener("click", function (e) { if (!nav.contains(e.target)) setMenu(false); });
    addEventListener("resize", function () { if (innerWidth > 720) setMenu(false); });
  }

  /* ---- Görünme animasyonları (.rv) ---- */
  var rv = [].slice.call(document.querySelectorAll(".rv"));
  document.querySelectorAll(".cards,.vm,.bento,.three,.fgrid,.pgrid").forEach(function (g) {
    g.querySelectorAll(".rv").forEach(function (el, i) { el.style.transitionDelay = (i * 90) + "ms"; });
  });
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Kaydırma: ilerleme çubuğu, menü arka planı, yukarı çık ---- */
  var pb = document.getElementById("pb"), up = document.getElementById("up");
  function onScroll() {
    var y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    if (pb) pb.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
    if (nav) nav.classList.toggle("sc", y > 20);
    if (up) up.classList.toggle("on", y > 700);
  }
  addEventListener("scroll", function () { requestAnimationFrame(onScroll); }, { passive: true });
  onScroll();
  if (up) up.addEventListener("click", function () { scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* ---- Aktif menü bağlantısı (aynı sayfadaki # bağlantıları) ---- */
  if ("IntersectionObserver" in window) {
    var map = [].slice.call(document.querySelectorAll('nav ul a[href^="#"]')).map(function (a) {
      var s = null;
      try { s = document.querySelector(a.getAttribute("href")); } catch (e) {}
      return { a: a, s: s };
    }).filter(function (m) { return m.s; });
    if (map.length) {
      var spy = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) map.forEach(function (m) { m.a.classList.toggle("act", m.s === e.target); });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      map.forEach(function (m) { spy.observe(m.s); });
    }
  }

  /* ---- Kartlarda ışık efekti ---- */
  document.querySelectorAll(".tile").forEach(function (t) {
    t.addEventListener("pointermove", function (e) {
      var r = t.getBoundingClientRect();
      t.style.setProperty("--mx", (e.clientX - r.left) + "px");
      t.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ---- Sayfa geçişi ---- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target || a.hasAttribute("download")) return;
    var u;
    try { u = new URL(a.href, location.href); } catch (err) { return; }
    if (u.origin !== location.origin || u.pathname === location.pathname || !/\.html$|\/$/.test(u.pathname)) return;
    e.preventDefault();
    document.body.classList.add("leaving");
    setTimeout(function () { location.href = u.href; }, reduce ? 0 : 280);
  });
  addEventListener("pageshow", function (e) { if (e.persisted) document.body.classList.remove("leaving"); });
})();
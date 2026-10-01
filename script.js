/* =========================================================
   CHAI SUTTA — SHARED SITE BEHAVIOUR
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Sticky nav ---------- */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 20) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("burger");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll("#navLinks a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = (Array.prototype.indexOf.call(el.parentNode.children, el) % 4) * 80;
          setTimeout(function () { el.classList.add("in"); }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1500, start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Accordion (FAQ + Help + anywhere with .faq-item) ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      var group = item.closest("[data-accordion-single]") || document;
      if (group.hasAttribute && group.hasAttribute("data-accordion-single")) {
        group.querySelectorAll(".faq-item").forEach(function (other) {
          other.classList.remove("open");
          var q = other.querySelector(".faq-q");
          if (q) q.setAttribute("aria-expanded", "false");
        });
      } else {
        item.classList.toggle("open", !isOpen);
      }
      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Search filter (FAQ + Help) ---------- */
  var search = document.getElementById("faqSearch");
  if (search) {
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-searchable]"));
    var empty = document.getElementById("noResults");
    var onInput = function () {
      var q = search.value.trim().toLowerCase();
      var visible = 0;
      items.forEach(function (item) {
        var text = (item.getAttribute("data-searchable") || "").toLowerCase();
        var match = !q || text.indexOf(q) !== -1;
        item.style.display = match ? "" : "none";
        if (match) visible++;
      });
      if (empty) empty.classList.toggle("show", visible === 0);
    };
    search.addEventListener("input", onInput);
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Guard: non-functional forms (no backend) ---------- */
  document.querySelectorAll("[data-mailto-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var to = form.getAttribute("data-mailto-form");
      var data = new FormData(form);
      var lines = [];
      data.forEach(function (value, key) { lines.push(key + ": " + value); });
      var subject = encodeURIComponent("Chai Sutta — " + (form.getAttribute("data-subject") || "Support request"));
      var body = encodeURIComponent(lines.join("\n"));
      window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
    });
  });
})();

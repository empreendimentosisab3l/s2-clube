/* ============================================
   S2 CLUBE — Custom Interactions
   ============================================ */

(function () {
  'use strict';

  function revealOnScroll() {
    var targets = document.querySelectorAll('.s2-animate:not(.visible), .s2-animate-children:not(.visible)');
    var windowHeight = window.innerHeight;

    targets.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < windowHeight - 60) {
        el.classList.add('visible');
      }
    });

    // Photo parallax is handled by initImageParallax()
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (id === '#') return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          var offset = window.innerWidth < 768 ? (window.innerHeight * 0.78) : (window.innerHeight * 0.5);
          var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* --- Image parallax (scroll-driven zoom) --- */
  function initImageParallax() {
    var images = document.querySelectorAll(
      '.photo-grid-item .hero-photo, ' +
      '.change-photo-grid-item .hero-photo, ' +
      '.metabolism .hero-photo, ' +
      '.journey-image .hero-photo'
    );
    if (!images.length) return;

    // Track hover state per image
    images.forEach(function (img) {
      var container = img.closest('.photo-grid-item, .change-photo-grid-item, .metabolism, .journey-image');
      if (container) {
        container.addEventListener('mouseenter', function () { img._hovered = true; });
        container.addEventListener('mouseleave', function () { img._hovered = false; });
      }
    });

    function updateParallax() {
      var wh = window.innerHeight;
      images.forEach(function (img) {
        if (img._hovered) return; // hover CSS handles it
        var rect = img.getBoundingClientRect();
        var progress = Math.max(0, Math.min(1, (wh - rect.top) / (wh + rect.height)));
        var scale = 1.3 - (0.3 * progress);
        var ty = 20 - (20 * progress);
        img.style.transform = 'scale(' + scale.toFixed(3) + ') translateY(' + ty.toFixed(1) + 'px)';
      });
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  /* --- Count Up animation --- */
  function initCountUp() {
    var counters = document.querySelectorAll('.s2-countup');
    var started = {};

    function animateCount(el) {
      var id = el.getAttribute('data-target') + el.getAttribute('data-suffix');
      if (started[id]) return;
      started[id] = true;

      var target = parseFloat(el.getAttribute('data-target'));
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 2000;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
        }
      }
      requestAnimationFrame(step);
    }

    function checkCounters() {
      var windowHeight = window.innerHeight;
      counters.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < windowHeight - 50) {
          animateCount(el);
        }
      });
    }

    window.addEventListener('scroll', checkCounters, { passive: true });
    checkCounters();
  }

  /* --- FAQ Accordion toggle --- */
  function initFaqAccordion() {
    document.querySelectorAll('.accordion-item-wrapper').forEach(function (item) {
      item.addEventListener('click', function () {
        var body = this.querySelector('.acordion-body');
        var icon = this.querySelector('.accordion-icon-wrapper');
        var isOpen = body.style.height !== '0px' && body.style.height !== '';

        // Close all
        document.querySelectorAll('.acordion-body').forEach(function (b) {
          b.style.height = '0px';
          b.style.opacity = '0';
        });
        document.querySelectorAll('.accordion-icon-wrapper').forEach(function (i) {
          i.style.transform = 'rotate(0deg)';
        });

        // Open clicked if it was closed
        if (!isOpen && body) {
          body.style.height = 'auto';
          body.style.opacity = '1';
          if (icon) icon.style.transform = 'rotate(45deg)';
        }
      });
    });
  }

  /* --- Fix sticky nav (remove Webflow inline transform) --- */
  function initStickyNav() {
    var nav = document.querySelector('.hero---navigation.fixed');
    if (nav) {
      nav.style.transform = 'none';
      nav.style.position = 'fixed';
      nav.style.top = '0';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.zIndex = '100';
      nav.style.background = 'rgba(255,255,255,0.97)';
      nav.style.backdropFilter = 'blur(10px)';
      nav.style.marginTop = '0';
    }
    // Hide the hero nav (duplicate)
    var heroNav = document.querySelector('.section---hero .hero---navigation:not(.fixed)');
    if (heroNav) {
      heroNav.style.display = 'none';
    }
    // Show/hide on scroll
    if (nav) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
          nav.classList.add('nav-visible');
        } else {
          nav.classList.remove('nav-visible');
        }
      }, { passive: true });
    }
  }

  function init() {
    document.body.classList.add('s2-js-ready');
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll, { passive: true });
    window.addEventListener('resize', revealOnScroll, { passive: true });
    initSmoothScroll();
    initFaqAccordion();
    initCountUp();
    initStickyNav();
    initImageParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

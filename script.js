/* ================================================================
   HASEEB GRAPHICS DESIGNER — script.js
   Features: AOS init, Navbar scroll, Smooth scroll, Counter
             animation, Skill bars, Portfolio filter, Contact form,
             Back to top, Scrollspy active nav links
   ================================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------
     1. INITIALIZE AOS (Animate On Scroll)
  ---------------------------------------- */
  AOS.init({
    duration: 680,
    once: true,
    offset: 70,
    easing: 'ease-out-cubic',
  });


  /* ----------------------------------------
     2. NAVBAR — Transparent → Solid on Scroll
  ---------------------------------------- */
  var navbar = document.getElementById('mainNavbar');

  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run once on load


  /* ----------------------------------------
     3. SMOOTH SCROLL for anchor links
  ---------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      var navHeight = navbar ? navbar.offsetHeight : 80;
      var targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });

      // Close Bootstrap mobile collapse if open
      var collapseEl = document.getElementById('navbarNav');
      if (collapseEl && collapseEl.classList.contains('show')) {
        var bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });


  /* ----------------------------------------
     4. BACK TO TOP BUTTON
  ---------------------------------------- */
  var backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 420) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ----------------------------------------
     5. COUNTER ANIMATION
  ---------------------------------------- */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 1600;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  var countersAnimated = false;
  var heroStats = document.querySelector('.hero-stats');

  if (heroStats && 'IntersectionObserver' in window) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          document.querySelectorAll('.counter').forEach(animateCounter);
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    statsObserver.observe(heroStats);
  }


  /* ----------------------------------------
     6. SKILL BAR ANIMATION
  ---------------------------------------- */
  var skillBars = document.querySelectorAll('.skill-bar');

  if (skillBars.length && 'IntersectionObserver' in window) {
    var skillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    skillBars.forEach(function (bar) { skillObserver.observe(bar); });
  }


  /* ----------------------------------------
     7. PORTFOLIO FILTER
  ---------------------------------------- */
  var filterBtns = document.querySelectorAll('#portfolioTabs .nav-link');
  var portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Update active class
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(function (item) {
        var categories = (item.getAttribute('data-category') || '').trim();
        var matches = filter === 'all' || categories.split(/\s+/).indexOf(filter) !== -1;

        if (matches) {
          item.classList.remove('hidden');
          // Trigger re-animation
          item.style.opacity = '0';
          item.style.transform = 'translateY(16px)';
          setTimeout(function () {
            item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 30);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });


  /* ----------------------------------------
     8. CONTACT FORM
  ---------------------------------------- */
  var contactForm = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');
  var submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
        return;
      }

      // Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';

      // Simulate async send (replace with real fetch/API call)
      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-send-fill me-2" aria-hidden="true"></i>Send Message';

        if (formSuccess) {
          formSuccess.classList.remove('d-none');
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        contactForm.reset();
        contactForm.classList.remove('was-validated');

        // Hide success message after 6 seconds
        setTimeout(function () {
          if (formSuccess) formSuccess.classList.add('d-none');
        }, 6000);
      }, 1800);
    });
  }


  /* ----------------------------------------
     9. SCROLLSPY — Active Nav Link Highlight
  ---------------------------------------- */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('#mainNavbar .nav-link[href^="#"]');

  function updateActiveNav() {
    var scrollPos = window.scrollY + (navbar ? navbar.offsetHeight : 80) + 20;
    var current = '';

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

});

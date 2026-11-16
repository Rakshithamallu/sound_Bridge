/**
 * SOUNDBRIDGE SPEECH & HEARING CLINIC — CORE APP LOGIC
 * Navigation, mobile drawer, services interaction, sound journey stepper,
 * reviews carousel, gallery lightbox, high-conversion appointment booking form.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Navigation Scroll Effect
  const navWrapper = document.querySelector('.site-nav-wrapper');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navWrapper?.classList.add('scrolled');
    } else {
      navWrapper?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Scroll Spy: Update active nav link based on scroll position
  const navSections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-links .nav-link');

  function updateActiveNavLink() {
    const scrollPosition = window.pageYOffset + 140;
    let currentSectionId = 'hero';

    navSections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    desktopNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // 3. Mobile Navigation Drawer
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileClose = document.querySelector('.mobile-drawer-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-item a');

  function openMobileNav() {
    mobileDrawer?.classList.add('open');
    mobileDrawer?.setAttribute('aria-hidden', 'false');
    if ('inert' in mobileDrawer) mobileDrawer.inert = false;
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav() {
    // If an element inside the drawer has focus, blur or return focus to toggle button
    if (mobileDrawer?.contains(document.activeElement)) {
      mobileToggle?.focus();
    }
    mobileDrawer?.classList.remove('open');
    mobileDrawer?.setAttribute('aria-hidden', 'true');
    if ('inert' in mobileDrawer) mobileDrawer.inert = true;
    document.body.style.overflow = '';
  }

  // Initialize drawer inert state when closed
  if (mobileDrawer && 'inert' in mobileDrawer) {
    mobileDrawer.inert = true;
  }

  mobileToggle?.addEventListener('click', openMobileNav);
  mobileClose?.addEventListener('click', closeMobileNav);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileNav));

  // 4. Smooth Anchor Link Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 5. Interactive Service Panels (Horizontal Accordion)
  const servicePanels = document.querySelectorAll('.service-panel');
  servicePanels.forEach(panel => {
    panel.addEventListener('click', () => {
      const isActive = panel.classList.contains('active');
      servicePanels.forEach(p => p.classList.remove('active'));
      if (!isActive) {
        panel.classList.add('active');
      }
    });
  });

  // Quick book service button inside service drawer
  document.querySelectorAll('.book-service-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const serviceName = btn.getAttribute('data-service');
      const serviceSelect = document.getElementById('appointment-service');
      if (serviceSelect && serviceName) {
        serviceSelect.value = serviceName;
      }
      const apptSection = document.getElementById('appointment');
      if (apptSection) {
        const offsetPosition = apptSection.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });

  // 6. The Sound Journey Interactive Stepper
  const journeyNodes = document.querySelectorAll('.journey-node-item');
  const journeyTrackProgress = document.querySelector('.journey-track-progress');
  const spotlightBadge = document.querySelector('.spotlight-stage-badge');
  const spotlightTitle = document.querySelector('.spotlight-title');
  const spotlightDesc = document.querySelector('.spotlight-desc');
  const spotlightClinicLink = document.querySelector('.spotlight-clinic-link');

  const journeyData = [
    {
      stage: 'STAGE 01',
      title: 'SOUND — Acoustic Capture',
      desc: 'Sound begins as acoustic vibrations and air pressure waves in our everyday world — the laughter of loved ones, music, and quiet murmurs of conversation.',
      link: 'At SoundBridge, we utilize clinical diagnostic audiometers to precisely capture and evaluate how sound travels through your unique auditory pathways.'
    },
    {
      stage: 'STAGE 02',
      title: 'HEARING — Anatomical Transmission',
      desc: 'The outer ear collects sound vibrations, directing them across the tympanic membrane and ossicles into the fluid-filled cochlea where microscopic hair cells convert motion into electrical signals.',
      link: 'Our team performs comprehensive pediatric and adult hearing evaluations to measure frequency-specific auditory response across low, speech, and high bands.'
    },
    {
      stage: 'STAGE 03',
      title: 'UNDERSTANDING — Cognitive Processing',
      desc: 'Auditory nerve impulses reach the brainstem and cerebral cortex, where digital and neurological clarity turns raw frequencies into recognizable speech and semantic meaning.',
      link: 'SoundBridge provides advanced hearing aids with digital signal processing that isolates human speech from complex ambient background noise.'
    },
    {
      stage: 'STAGE 04',
      title: 'COMMUNICATION — Natural Self-Expression',
      desc: 'When sound and comprehension harmonize, communication flows effortlessly. Voice modulation, vocabulary retrieval, and expressive dialogue regain their natural rhythm.',
      link: 'Our licensed speech therapists conduct specialized speech and language evaluations, providing customized therapy for articulation, fluency, and expression.'
    },
    {
      stage: 'STAGE 05',
      title: 'CONNECTION — Restoring Life’s Bonds',
      desc: 'The final destination is human connection — active engagement in family dinners, professional meetings, and heartfelt conversations without strain or isolation.',
      link: 'Our ongoing care, device fine-tuning, maintenance, and patient-first dedication ensure you remain effortlessly connected to the world around you.'
    }
  ];

  function setJourneyStage(index) {
    journeyNodes.forEach((node, idx) => {
      if (idx === index) node.classList.add('active');
      else node.classList.remove('active');
    });

    if (journeyTrackProgress) {
      journeyTrackProgress.style.width = `${((index + 1) / 5) * 100}%`;
    }

    const data = journeyData[index];
    if (spotlightBadge) spotlightBadge.textContent = data.stage;
    if (spotlightTitle) spotlightTitle.textContent = data.title;
    if (spotlightDesc) spotlightDesc.textContent = data.desc;
    if (spotlightClinicLink) spotlightClinicLink.textContent = data.link;
  }

  journeyNodes.forEach((node, index) => {
    node.addEventListener('click', () => {
      setJourneyStage(index);
      // Scroll spotlight card into view so user sees the info
      const spotlightCard = document.querySelector('.journey-spotlight-card');
      if (spotlightCard) {
        spotlightCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  // 7. Reviews Carousel
  const reviewsTrack = document.querySelector('.reviews-track');
  const reviewCards = document.querySelectorAll('.review-card');
  const prevReviewBtn = document.querySelector('.review-prev-btn');
  const nextReviewBtn = document.querySelector('.review-next-btn');
  let currentReviewIdx = 0;

  function updateReviewCarousel() {
    if (!reviewsTrack || !reviewCards.length) return;
    const cardWidth = reviewCards[0].offsetWidth + 28; // gap
    const maxIdx = window.innerWidth < 860 ? reviewCards.length - 1 : Math.max(0, reviewCards.length - 2);
    currentReviewIdx = Math.max(0, Math.min(currentReviewIdx, maxIdx));
    reviewsTrack.style.transform = `translateX(-${currentReviewIdx * cardWidth}px)`;
  }

  prevReviewBtn?.addEventListener('click', () => {
    currentReviewIdx = Math.max(0, currentReviewIdx - 1);
    updateReviewCarousel();
  });
  nextReviewBtn?.addEventListener('click', () => {
    currentReviewIdx++;
    updateReviewCarousel();
  });

  window.addEventListener('resize', updateReviewCarousel);

  // 8. Gallery Scroll Reveal Animations
  const galleryAnimateEls = document.querySelectorAll('.gallery-animate');
  if (galleryAnimateEls.length > 0) {
    const galleryObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('gallery-visible');
          galleryObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    galleryAnimateEls.forEach(el => galleryObserver.observe(el));
  }

  // 9. Gallery Lightbox
  const galleryItems = document.querySelectorAll('.gallery-card');
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-image-wrap img');
  const lightboxCounter = document.querySelector('.lightbox-counter');
  const lightboxClose = document.querySelector('.lightbox-close-btn');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  let currentGalleryIdx = 0;
  const galleryImagesData = Array.from(galleryItems).map(item => {
    const img = item.querySelector('img');
    return {
      src: img?.getAttribute('src') || '',
      alt: img?.getAttribute('alt') || 'SoundBridge Clinic Gallery'
    };
  });

  function openLightbox(index) {
    currentGalleryIdx = index;
    updateLightbox();
    lightboxModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    if (!lightboxImg || !galleryImagesData.length) return;
    const item = galleryImagesData[currentGalleryIdx];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentGalleryIdx + 1} / ${galleryImagesData.length}`;
    }
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', () => {
    currentGalleryIdx = (currentGalleryIdx - 1 + galleryImagesData.length) % galleryImagesData.length;
    updateLightbox();
  });
  lightboxNext?.addEventListener('click', () => {
    currentGalleryIdx = (currentGalleryIdx + 1) % galleryImagesData.length;
    updateLightbox();
  });

  // Keyboard navigation for Lightbox
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      currentGalleryIdx = (currentGalleryIdx - 1 + galleryImagesData.length) % galleryImagesData.length;
      updateLightbox();
    }
    if (e.key === 'ArrowRight') {
      currentGalleryIdx = (currentGalleryIdx + 1) % galleryImagesData.length;
      updateLightbox();
    }
  });

  // Close lightbox on backdrop click
  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  // 9. Appointment Booking Form Handling & WhatsApp Integration
  const bookingForm = document.getElementById('appointment-form');
  const successState = document.querySelector('.booking-success-state');
  const resetFormBtn = document.getElementById('reset-booking-btn');

  // Real-time validation error clear
  const bookingInputs = bookingForm?.querySelectorAll('.form-input, .form-select, .form-textarea');
  bookingInputs?.forEach(inp => {
    inp.addEventListener('input', () => {
      inp.closest('.form-group')?.classList.remove('has-error');
    });
    inp.addEventListener('change', () => {
      inp.closest('.form-group')?.classList.remove('has-error');
    });
  });

  bookingForm?.addEventListener('submit', function (e) {
    e.preventDefault();

    let hasErrors = false;
    const nameInput = document.getElementById('patient-name');
    const phoneInput = document.getElementById('patient-phone');
    const serviceInput = document.getElementById('appointment-service');
    const dateInput = document.getElementById('appointment-date');
    const notesInput = document.getElementById('patient-notes');

    // Validation
    if (!nameInput.value.trim()) {
      nameInput.closest('.form-group')?.classList.add('has-error');
      hasErrors = true;
    } else {
      nameInput.closest('.form-group')?.classList.remove('has-error');
    }

    const phoneRegex = /^[0-9+\s\-()]{8,15}$/;
    if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value.trim())) {
      phoneInput.closest('.form-group')?.classList.add('has-error');
      hasErrors = true;
    } else {
      phoneInput.closest('.form-group')?.classList.remove('has-error');
    }

    if (!serviceInput.value) {
      serviceInput.closest('.form-group')?.classList.add('has-error');
      hasErrors = true;
    } else {
      serviceInput.closest('.form-group')?.classList.remove('has-error');
    }

    if (hasErrors) {
      const firstError = bookingForm.querySelector('.has-error .form-input, .has-error .form-select');
      firstError?.focus();
      return;
    }

    const nameVal = nameInput.value.trim();
    const phoneVal = phoneInput.value.trim();
    const serviceVal = serviceInput.value;
    const ageVal = document.getElementById('patient-age')?.value.trim() || 'Not specified';
    const cityVal = document.getElementById('patient-city')?.value.trim() || 'Bengaluru';
    const symptomVal = document.getElementById('patient-hearing-problem')?.value || 'Unspecified';
    const dateVal = dateInput?.value || 'Flexible / Next Available';
    const timeVal = document.getElementById('appointment-time')?.value || 'Flexible';
    const notesVal = notesInput?.value.trim() || 'None';

    // WhatsApp Message Format (Full 9-field transmission)
    const clinicPhone = '918618459344';
    const waText =
      `*SoundBridge Clinic — New Appointment Request*\n` +
      `-------------------------------------------\n` +
      `*Patient Name:* ${nameVal}\n` +
      `*Mobile:* ${phoneVal}\n` +
      `*Age:* ${ageVal}\n` +
      `*City / Area:* ${cityVal}\n` +
      `*Service Required:* ${serviceVal}\n` +
      `*Primary Concern:* ${symptomVal}\n` +
      `*Preferred Date:* ${dateVal}\n` +
      `*Preferred Slot:* ${timeVal}\n` +
      `*Notes / History:* ${notesVal}\n` +
      `-------------------------------------------\n` +
      `_Sent from SoundBridge Speech & Hearing Clinic Official Portal_`;

    const whatsappUrl = `https://wa.me/${clinicPhone}?text=${encodeURIComponent(waText)}`;

    // Open WhatsApp in a new tab immediately (in user gesture call stack to avoid popup blocker)
    window.open(whatsappUrl, '_blank');

    // Show Loading state on Submit Button
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="btn-spinner" style="display:inline-block;width:18px;height:18px;border:2px solid #071521;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></span>
      <span>Opening WhatsApp...</span>
    `;

    // Optionally notify local backend endpoint if running
    try {
      fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameVal,
          phone: phoneVal,
          service: serviceVal,
          dateTime: dateVal,
          notes: notesVal
        })
      }).catch(() => { });
    } catch (_) { }

    setTimeout(() => {
      // Fire celebration confetti if available
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#25D366', '#7DD9EA', '#38BDF8', '#FFFFFF']
        });
      }

      bookingForm.style.display = 'none';
      if (successState) {
        successState.classList.add('active');
        const summaryName = document.getElementById('confirmed-patient-name');
        const summaryPhone = document.getElementById('confirmed-patient-phone');
        const summaryService = document.getElementById('confirmed-service-name');
        const waDirectBtn = document.getElementById('whatsapp-direct-btn');

        if (summaryName) summaryName.textContent = nameVal;
        if (summaryPhone) summaryPhone.textContent = phoneVal;
        if (summaryService) summaryService.textContent = serviceVal;
        if (waDirectBtn) {
          waDirectBtn.href = whatsappUrl;
        }

        if (window.lucide) {
          window.lucide.createIcons();
        }
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }, 500);
  });

  resetFormBtn?.addEventListener('click', () => {
    bookingForm.reset();
    bookingForm.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
    bookingForm.style.display = 'flex';
    successState?.classList.remove('active');
  });

  // 10. Back to top button
  const backToTopBtn = document.querySelector('.back-to-top-btn');
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // 11. Hearing Aid Product Catalog Filter Logic
  const filterBtns = document.querySelectorAll('.catalog-filter-btn');
  const productCards = document.querySelectorAll('.product-style-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(',');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 12. Interactive FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const drawer = item.querySelector('.faq-content-drawer');

    trigger?.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items for clean accordion UX
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherTrigger = other.querySelector('.faq-trigger');
        const otherDrawer = other.querySelector('.faq-content-drawer');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        if (otherDrawer) otherDrawer.style.maxHeight = null;
      });

      if (!isOpen && drawer) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        drawer.style.maxHeight = drawer.scrollHeight + 'px';
      }
    });
  });

  // Floating appointment button auto-focus
  const floatingApptBtn = document.querySelector('.floating-btn-appointment');
  floatingApptBtn?.addEventListener('click', () => {
    setTimeout(() => {
      document.getElementById('patient-name')?.focus();
    }, 700);
  });

  // 11. Scroll-Triggered Animated Number Counters
  initScrollCounters();

  function initScrollCounters() {
    const counterElements = document.querySelectorAll('[data-counter]');
    if (!counterElements.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize displayed values to 0 before scroll triggers
    counterElements.forEach(el => {
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      if (!prefersReducedMotion) {
        el.textContent = `${prefix}${(0).toFixed(decimals)}${suffix}`;
      }
    });

    function animateCounter(el) {
      const target = parseFloat(el.getAttribute('data-counter'));
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = parseInt(el.getAttribute('data-duration') || '1800', 10);

      if (prefersReducedMotion || isNaN(target)) {
        el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
        el.closest('.metric-card')?.classList.add('counted');
        return;
      }

      const card = el.closest('.metric-card');
      card?.classList.add('counting');

      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Quintic ease-out deceleration curve
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const currentVal = target * easeOut;

        el.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
          if (card) {
            card.classList.remove('counting');
            card.classList.add('counted');
          }
        }
      }

      requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.25,
      rootMargin: '0px 0px -40px 0px'
    });

    counterElements.forEach(el => observer.observe(el));
  }
});

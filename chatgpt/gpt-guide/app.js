// ===== Wait for DOM =====
document.addEventListener('DOMContentLoaded', () => {

  // ===== DOM Elements =====
  const slidesContainer = document.getElementById('slidesContainer');
  const progressFill = document.getElementById('progressFill');
  const currentSlideEl = document.getElementById('currentSlide');
  const totalSlidesEl = document.getElementById('totalSlides');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const menuBtn = document.getElementById('menuBtn');
  const overviewPanel = document.getElementById('overviewPanel');
  const overviewGrid = document.getElementById('overviewGrid');
  const closeOverview = document.getElementById('closeOverview');
  const shortcutsHint = document.getElementById('shortcutsHint');

  // ===== State =====
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let currentSlide = 1;

  // ===== Debug =====
  console.log('GPT Guide initializing...', {
    slidesContainer: !!slidesContainer,
    prevBtn: !!prevBtn,
    nextBtn: !!nextBtn,
    totalSlides: totalSlides
  });

  // ===== Safety checks =====
  if (!slidesContainer || !prevBtn || !nextBtn || totalSlides === 0) {
    console.error('Required elements not found');
    return;
  }

  // ===== Initialize =====
  if (totalSlidesEl) totalSlidesEl.textContent = totalSlides;

  // Hide shortcuts hint after 5 seconds
  if (shortcutsHint) {
    setTimeout(() => shortcutsHint.classList.add('hidden'), 5000);
  }

  // ===== Slide Titles =====
  function getSlideTitles() {
    const titles = [];
    slides.forEach((slide, i) => {
      const h1 = slide.querySelector('h1');
      const h2 = slide.querySelector('h2');
      const title = h1 ? h1.textContent.replace(/<br\s*\/?>/gi, ' ').trim() :
                   h2 ? h2.textContent.trim() :
                   `Page ${i + 1}`;
      titles.push(title);
    });
    return titles;
  }

  const slideTitles = getSlideTitles();

  // ===== Build Overview Panel =====
  function buildOverviewPanel() {
    if (!overviewGrid) return;
    overviewGrid.innerHTML = '';
    for (let i = 1; i <= totalSlides; i++) {
      const item = document.createElement('div');
      item.className = `overview-item ${i === currentSlide ? 'active' : ''}`;
      item.innerHTML = `
        <span class="overview-num">${i}</span>
        <span class="overview-title">${slideTitles[i - 1] || `Page ${i}`}</span>
      `;
      item.addEventListener('click', () => {
        goToSlide(i);
        closeOverviewPanel();
      });
      overviewGrid.appendChild(item);
    }
  }

  buildOverviewPanel();

  // ===== Navigation Functions =====
  function goToSlide(n) {
    console.log('goToSlide called:', n);
    if (n < 1 || n > totalSlides) return;

    currentSlide = n;
    const targetSlide = slides[n - 1];

    // Scroll the target slide into view
    targetSlide.scrollIntoView({ behavior: 'smooth', block: 'start' });

    updateUI();
  }

  function nextSlide() {
    console.log('nextSlide called, current:', currentSlide);
    if (currentSlide < totalSlides) {
      goToSlide(currentSlide + 1);
    }
  }

  function prevSlide() {
    console.log('prevSlide called, current:', currentSlide);
    if (currentSlide > 1) {
      goToSlide(currentSlide - 1);
    }
  }

  function updateUI() {
    // Update counter
    if (currentSlideEl) currentSlideEl.textContent = currentSlide;

    // Update progress bar
    if (progressFill) {
      const progress = ((currentSlide - 1) / (totalSlides - 1)) * 100;
      progressFill.style.width = `${progress}%`;
    }

    // Update navigation buttons
    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;

    // Update overview panel
    document.querySelectorAll('.overview-item').forEach((item, i) => {
      item.classList.toggle('active', i + 1 === currentSlide);
    });
  }

  // ===== Overview Panel =====
  function openOverviewPanel() {
    if (overviewPanel) overviewPanel.classList.add('open');
  }

  function closeOverviewPanel() {
    if (overviewPanel) overviewPanel.classList.remove('open');
  }

  function toggleOverviewPanel() {
    if (overviewPanel) overviewPanel.classList.toggle('open');
  }

  // ===== Scroll Detection =====
  let scrollTimeout;
  slidesContainer.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Find which slide is most visible
      const containerTop = slidesContainer.getBoundingClientRect().top;
      let newSlide = 1;
      let minDistance = Infinity;

      slides.forEach((slide, i) => {
        const rect = slide.getBoundingClientRect();
        const distance = Math.abs(rect.top - containerTop);

        if (distance < minDistance) {
          minDistance = distance;
          newSlide = i + 1;
        }
      });

      if (newSlide !== currentSlide) {
        currentSlide = newSlide;
        updateUI();
      }
    }, 150);
  });

  // ===== Button Event Listeners =====
  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Prev button clicked');
    prevSlide();
  });

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Next button clicked');
    nextSlide();
  });

  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Menu button clicked');
      toggleOverviewPanel();
    });
  }

  if (closeOverview) {
    closeOverview.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeOverviewPanel();
    });
  }

  // ===== Keyboard Navigation =====
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(1);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides);
        break;
      case 'm':
      case 'M':
        e.preventDefault();
        toggleOverviewPanel();
        break;
      case 'Escape':
        closeOverviewPanel();
        break;
    }
  });

  // ===== Copy to Clipboard =====
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetId = btn.dataset.copy;
      const codeEl = document.getElementById(targetId);

      if (codeEl) {
        try {
          await navigator.clipboard.writeText(codeEl.textContent);
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      }
    });
  });

  // ===== Click outside to close overview =====
  document.addEventListener('click', (e) => {
    if (overviewPanel && overviewPanel.classList.contains('open') &&
        !overviewPanel.contains(e.target) &&
        menuBtn && !menuBtn.contains(e.target)) {
      closeOverviewPanel();
    }
  });

  // ===== Initialize UI =====
  updateUI();

  console.log('GPT Guide initialized with', totalSlides, 'pages');
});

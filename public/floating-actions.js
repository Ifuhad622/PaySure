// Initialize Floating Actions System
function initializeFloatingActions() {
  // Make all floating buttons visible with staggered animation
  const floatingBtns = document.querySelectorAll('.floating-btn');

  floatingBtns.forEach((btn, index) => {
    // Skip theme toggle and WhatsApp as they should always be visible
    if (btn.classList.contains('theme-toggle') || btn.classList.contains('whatsapp-float')) {
      return;
    }

    setTimeout(() => {
      btn.classList.add('visible');
      btn.classList.add('animate');

      // Remove animate class after animation
      setTimeout(() => {
        btn.classList.remove('animate');
      }, 600);
    }, index * 200);
  });

  // Add scroll functionality
  setupScrollButtons();

  // Add responsive behavior
  handleFloatingActionsResize();
  window.addEventListener('resize', handleFloatingActionsResize);
}

// Setup scroll button functionality
function setupScrollButtons() {
  const backToTopBtn = document.getElementById('backToTop');
  const backToBottomBtn = document.getElementById('backToBottom');

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', scrollToTop);
  }

  if (backToBottomBtn) {
    backToBottomBtn.addEventListener('click', scrollToBottom);
  }
}

// Scroll to top function
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Scroll to bottom function
function scrollToBottom() {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  });
}

function handleFloatingActionsResize() {
  const floatingActions = document.querySelector('.floating-actions');
  const chatWidget = document.querySelector('.chat-widget');

  if (!floatingActions || !chatWidget) return;

  const screenWidth = window.innerWidth;

  // Adjust positioning based on screen size
  if (screenWidth <= 320) {
    floatingActions.style.gap = '5px';
    chatWidget.style.bottom = '100px';
  } else if (screenWidth <= 480) {
    floatingActions.style.gap = '8px';
    chatWidget.style.bottom = '140px';
  } else if (screenWidth <= 768) {
    floatingActions.style.gap = '10px';
    chatWidget.style.bottom = '170px';
  } else {
    floatingActions.style.gap = '12px';
    chatWidget.style.bottom = '200px';
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeFloatingActions();
});

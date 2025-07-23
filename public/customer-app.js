// MelHad Investment - Customer App JavaScript

class CustomerApp {
  constructor() {
    this.cart = [];
    this.services = {
      // Printing Services (prices in Sierra Leone Leone)
      "document-bw": {
        name: "Document Printing (B&W)",
        price: 500,
        unit: "page",
        category: "printing",
      },
      "document-color": {
        name: "Document Printing (Color)",
        price: 1250,
        unit: "page",
        category: "printing",
      },
      "photo-4x6": {
        name: "Photo Printing (4x6)",
        price: 2500,
        unit: "photo",
        category: "printing",
      },
      "photo-8x10": {
        name: "Photo Printing (8x10)",
        price: 10000,
        unit: "photo",
        category: "printing",
      },
      "business-cards": {
        name: "Business Cards",
        price: 75000,
        unit: "set of 100",
        category: "printing",
      },
      flyers: {
        name: "Flyers & Posters",
        price: 3750,
        unit: "flyer",
        category: "printing",
      },
      banners: {
        name: "Banner Printing",
        price: 125000,
        unit: "banner",
        category: "printing",
      },
      tshirts: {
        name: "T-Shirt Printing",
        price: 60000,
        unit: "shirt",
        category: "printing",
      },

      // Additional Printing Services
      "wedding-invitations": {
        name: "Wedding Invitations",
        price: 15000,
        unit: "invitation",
        category: "printing",
      },
      "custom-mugs": {
        name: "Custom Mug Printing",
        price: 45000,
        unit: "mug",
        category: "printing",
      },
      "custom-notebooks": {
        name: "Custom Notebooks",
        price: 35000,
        unit: "notebook",
        category: "printing",
      },
      "id-cards": {
        name: "ID Card Printing",
        price: 8000,
        unit: "card",
        category: "printing",
      },
      letterheads: {
        name: "Company Letterheads",
        price: 2500,
        unit: "sheet",
        category: "printing",
      },
      "vinyl-printing": {
        name: "Vinyl Sticker Printing",
        price: 25000,
        unit: "sheet",
        category: "printing",
      },
      "receipt-books": {
        name: "Receipt Books",
        price: 50000,
        unit: "book",
        category: "printing",
      },
      "certificate-printing": {
        name: "Certificate Printing",
        price: 20000,
        unit: "certificate",
        category: "printing",
      },
      "canvas-printing": {
        name: "Canvas Photo Printing",
        price: 85000,
        unit: "canvas",
        category: "printing",
      },
      "calendar-printing": {
        name: "Custom Calendars",
        price: 40000,
        unit: "calendar",
        category: "printing",
      },
      "brochure-printing": {
        name: "Brochure Printing",
        price: 8000,
        unit: "brochure",
        category: "printing",
      },
      "menu-printing": {
        name: "Restaurant Menu Printing",
        price: 12000,
        unit: "menu",
        category: "printing",
      },
      "envelope-printing": {
        name: "Custom Envelope Printing",
        price: 1500,
        unit: "envelope",
        category: "printing",
      },
      "booklet-printing": {
        name: "Booklet/Catalog Printing",
        price: 25000,
        unit: "booklet",
        category: "printing",
      },
      "label-printing": {
        name: "Product Label Printing",
        price: 5000,
        unit: "sheet",
        category: "printing",
      },

      // Digital Services
      "website-basic": {
        name: "Basic Website",
        price: 2500000,
        unit: "website",
        category: "digital",
      },
      "website-ecommerce": {
        name: "E-commerce Website",
        price: 7500000,
        unit: "website",
        category: "digital",
      },
      "web-app": {
        name: "Web Application",
        price: 12500000,
        unit: "application",
        category: "digital",
      },
      "logo-design": {
        name: "Logo Design",
        price: 500000,
        unit: "logo",
        category: "digital",
      },
      "graphic-design": {
        name: "Graphic Design",
        price: 250000,
        unit: "design",
        category: "digital",
      },
      "social-media": {
        name: "Social Media Management",
        price: 750000,
        unit: "month",
        category: "digital",
      },

      // IT & Network Services
      "computer-repair": {
        name: "Computer Repair",
        price: 150000,
        unit: "service",
        category: "support",
      },
      "network-setup": {
        name: "Network Setup",
        price: 500000,
        unit: "setup",
        category: "support",
      },
      "it-consulting": {
        name: "IT Consulting",
        price: 200000,
        unit: "hour",
        category: "support",
      },
      "data-recovery": {
        name: "Data Recovery",
        price: 350000,
        unit: "recovery",
        category: "support",
      },
      "software-installation": {
        name: "Software Installation",
        price: 75000,
        unit: "installation",
        category: "support",
      },
      "security-setup": {
        name: "Security Setup",
        price: 125000,
        unit: "setup",
        category: "support",
      },

      // Additional Printing Services
      "stickers": {
        name: "Stickers & Labels",
        price: 15000,
        unit: "set",
        category: "printing",
      },
      "calendars": {
        name: "Calendar Printing",
        price: 35000,
        unit: "calendar",
        category: "printing",
      },
      "brochures": {
        name: "Brochures & Booklets",
        price: 25000,
        unit: "brochure",
        category: "printing",
      },
      "certificates": {
        name: "Certificates & Awards",
        price: 45000,
        unit: "certificate",
        category: "printing",
      },
      "invitations": {
        name: "Wedding Invitations",
        price: 8000,
        unit: "invitation",
        category: "printing",
      },
      "mugs": {
        name: "Custom Mugs",
        price: 25000,
        unit: "mug",
        category: "printing",
      },
      "notebooks": {
        name: "Custom Notebooks",
        price: 18000,
        unit: "notebook",
        category: "printing",
      },
      "id-cards": {
        name: "ID Cards & Badges",
        price: 5000,
        unit: "card",
        category: "printing",
      },
      "letterheads": {
        name: "Letterheads",
        price: 12000,
        unit: "set",
        category: "printing",
      },
      "vinyl-printing": {
        name: "Vinyl Printing",
        price: 75000,
        unit: "design",
        category: "printing",
      },
      "receipts": {
        name: "Receipt Books",
        price: 30000,
        unit: "book",
        category: "printing",
      },

      // Additional IT Support Services
      "cctv-installation": {
        name: "CCTV Installation",
        price: 750000,
        unit: "installation",
        category: "support",
      },
    };

    this.deliveryFee = 25000; // Le 25,000 for delivery
    this.uploadedFiles = [];
        this.whatsappNumber = "+23278475680"; // Update with actual WhatsApp number

    this.init();
  }

    init() {
    this.setupEventListeners();
    this.updateCart();
    this.setupFileUpload();
    this.setupSmoothScrolling();
    this.setupServiceTabs();
    this.setupDeliveryOptions();
    this.setupGalleryFilter();
    this.setupTestimonialsAnimation();
    this.setupMobileMenu();
    this.setupTheme();
    this.setupServiceSearch();
    this.setupScrollToTop();

    console.log("🚀 MelHad Investment Customer App Initialized");
    this.initializeChat();
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.getAttribute("href");
        this.scrollToSection(target.substring(1));
        this.updateActiveNavLink(link);
      });
    });

    // Contact form
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => this.handleContactForm(e));
    }

    // Order form
    const orderForm = document.getElementById("orderForm");
    if (orderForm) {
      orderForm.addEventListener("submit", (e) => e.preventDefault());
    }

    // Modal close
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal")) {
        this.closeModal();
      }
    });

    // Scroll spy for navigation
    window.addEventListener("scroll", () => this.handleScroll());

    // Close mobile menu when clicking on nav links
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        const mobileNav = document.getElementById("mainNav");
        if (mobileNav) {
          mobileNav.classList.remove("mobile-open");
        }
      });
    });
  }

  setupServiceTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const serviceGrids = document.querySelectorAll(".services-grid");

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const category = btn.dataset.category;

        // Update active tab
        tabBtns.forEach((t) => t.classList.remove("active"));
        btn.classList.add("active");

        // Show corresponding service grid
        serviceGrids.forEach((grid) => {
          grid.classList.remove("active");
          if (grid.id === `${category}-services`) {
            grid.classList.add("active");
          }
        });
      });
    });
  }

    setupDeliveryOptions() {
    const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
    deliveryOptions.forEach((option) => {
      option.addEventListener("change", () => {
        this.updateCart();
      });
    });
  }

  setupGalleryFilter() {
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;

        // Update active tab
        galleryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Filter gallery items
        galleryItems.forEach(item => {
          const category = item.dataset.category;

          if (filter === 'all' || category === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  setupTestimonialsAnimation() {
    // Intersection Observer for testimonials animation
    const testimonialCards = document.querySelectorAll('.testimonial-card.enhanced');

    if (testimonialCards.length === 0) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
            entry.target.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s both`;
          }, index * 100);
        }
      });
    }, observerOptions);

    // Initially hide testimonials and observe them
    testimonialCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(50px) scale(0.9)';
      card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      observer.observe(card);
    });

    // Add CSS animation keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(50px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `;
    document.head.appendChild(style);
  }

  setupMobileMenu() {
    // Show/hide mobile menu toggle based on screen size
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const checkScreenSize = () => {
      if (window.innerWidth <= 768) {
        if (toggleBtn) toggleBtn.style.display = 'block';
      } else {
        if (toggleBtn) toggleBtn.style.display = 'none';
        // Close mobile menu if it's open
        const mobileNav = document.getElementById('mainNav');
        if (mobileNav) mobileNav.classList.remove('mobile-open');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      const mobileNav = document.getElementById('mainNav');
      const toggleBtn = document.querySelector('.mobile-menu-toggle');

      if (mobileNav && toggleBtn &&
          !mobileNav.contains(e.target) &&
          !toggleBtn.contains(e.target) &&
          mobileNav.classList.contains('mobile-open')) {
        mobileNav.classList.remove('mobile-open');
      }
    });
  }

  setupTheme() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.applyTheme(savedTheme);
  }

  applyTheme(theme) {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');

    if (theme === 'dark') {
      body.setAttribute('data-theme', 'dark');
      if (themeIcon) {
        themeIcon.className = 'fas fa-sun';
      }
    } else {
      body.removeAttribute('data-theme');
      if (themeIcon) {
        themeIcon.className = 'fas fa-moon';
      }
    }

    // Save theme preference
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Add rotation animation to toggle button
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
      toggleBtn.classList.add('rotating');
      setTimeout(() => {
        toggleBtn.classList.remove('rotating');
      }, 500);
    }

    this.applyTheme(newTheme);
  }

  setupServiceSearch() {
    const searchInput = document.getElementById('serviceSearch');
    const clearBtn = document.querySelector('.clear-search');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (query.length > 0) {
          if (clearBtn) clearBtn.style.display = 'block';
        } else {
          if (clearBtn) clearBtn.style.display = 'none';
        }
        this.filterServices(query);
      });
    }
  }

  filterServices(query = '') {
    const serviceCards = document.querySelectorAll('.service-card');
    const tabs = document.querySelectorAll('.tab-btn');
    let hasVisibleServices = false;

    if (query.trim() === '') {
      // Show all services in current category
      const activeTab = document.querySelector('.tab-btn.active');
      if (activeTab) {
        const category = activeTab.dataset.category;
        this.showServicesByCategory(category);
      }
      return;
    }

    // Hide all category tabs when searching
    tabs.forEach(tab => {
      tab.style.display = 'none';
    });

    // Show all service grids
    const serviceGrids = document.querySelectorAll('.services-grid');
    serviceGrids.forEach(grid => {
      grid.classList.add('active');
    });

    serviceCards.forEach(card => {
      const serviceName = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const serviceDescription = card.querySelector('p')?.textContent.toLowerCase() || '';
      const searchQuery = query.toLowerCase();

      if (serviceName.includes(searchQuery) || serviceDescription.includes(searchQuery)) {
        card.style.display = 'block';
        card.style.animation = 'fadeInUp 0.3s ease';
        hasVisibleServices = true;
      } else {
        card.style.display = 'none';
      }
    });

    // Show "no results" message if needed
    this.toggleNoResultsMessage(!hasVisibleServices, query);
  }

  showServicesByCategory(category) {
    const tabs = document.querySelectorAll('.tab-btn');
    const serviceGrids = document.querySelectorAll('.services-grid');

    // Show all tabs
    tabs.forEach(tab => {
      tab.style.display = 'flex';
    });

    // Hide all grids first
    serviceGrids.forEach(grid => {
      grid.classList.remove('active');
    });

    // Show selected category
    const targetGrid = document.getElementById(`${category}-services`);
    if (targetGrid) {
      targetGrid.classList.add('active');
    }

    // Remove no results message
    this.toggleNoResultsMessage(false);
  }

  toggleNoResultsMessage(show, query = '') {
    let noResultsMsg = document.getElementById('noResultsMessage');

    if (show && !noResultsMsg) {
      noResultsMsg = document.createElement('div');
      noResultsMsg.id = 'noResultsMessage';
      noResultsMsg.className = 'no-results-message';
      noResultsMsg.innerHTML = `
        <div class="no-results-content">
          <i class="fas fa-search"></i>
          <h3>No services found</h3>
          <p>No services match "${query}". Try different keywords or browse our categories.</p>
          <button class="cta-btn" onclick="clearSearch()">Clear Search</button>
        </div>
      `;

      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.appendChild(noResultsMsg);
      }
    } else if (!show && noResultsMsg) {
      noResultsMsg.remove();
    }
  }

  clearServiceSearch() {
    const searchInput = document.getElementById('serviceSearch');
    const clearBtn = document.querySelector('.clear-search');

    if (searchInput) {
      searchInput.value = '';
    }
    if (clearBtn) {
      clearBtn.style.display = 'none';
    }

    // Show current category services
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
      const category = activeTab.dataset.category;
      this.showServicesByCategory(category);
    }
  }

  setupScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-to-top');

    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollBtn.style.display = 'flex';
        setTimeout(() => scrollBtn.classList.add('visible'), 10);
      } else {
        scrollBtn.classList.remove('visible');
        setTimeout(() => {
          if (!scrollBtn.classList.contains('visible')) {
            scrollBtn.style.display = 'none';
          }
        }, 300);
      }
    });
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Success Modal Management
  showSuccessModal(paymentData) {
    // Store invoice for sharing
    this.currentInvoice = paymentData.invoice;

    // Update modal content
    document.getElementById('successPaymentId').textContent = paymentData.paymentId;
    document.getElementById('successAmount').textContent = `Le ${this.formatPrice(paymentData.amount)}`;
    document.getElementById('successSecurityScore').textContent = `${paymentData.securityScore}/100`;

    // Show modal
    const modal = document.getElementById('successModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  showErrorModal(message, errorCode, originalError) {
    // Create error modal if it doesn't exist
    let errorModal = document.getElementById('errorModal');
    if (!errorModal) {
      errorModal = this.createErrorModal();
      document.body.appendChild(errorModal);
    }

    // Update error content
    const errorTitle = document.getElementById('errorTitle');
    const errorMessage = document.getElementById('errorMessage');
    const errorDetails = document.getElementById('errorDetails');
    const retryBtn = document.getElementById('retryPayment');

    if (errorTitle) errorTitle.textContent = this.getErrorTitle(errorCode);
    if (errorMessage) errorMessage.textContent = message;
    if (errorDetails) {
      errorDetails.innerHTML = `
        <p><strong>Error Code:</strong> ${errorCode}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Suggestion:</strong> ${this.getErrorSuggestion(errorCode)}</p>
      `;
    }

    // Show/hide retry button based on error type
    if (retryBtn) {
      retryBtn.style.display = errorCode === 'SECURITY_ERROR' ? 'none' : 'block';
    }

    // Show modal
    errorModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  createErrorModal() {
    const modal = document.createElement('div');
    modal.id = 'errorModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="error-modal">
        <div class="error-content">
          <div class="error-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <h2 id="errorTitle">Payment Failed</h2>
          <p id="errorMessage">An error occurred while processing your payment.</p>

          <div class="error-details" id="errorDetails">
            <!-- Error details will be populated here -->
          </div>

          <div class="error-actions">
            <button class="cta-btn" id="retryPayment" onclick="retryPayment()">Try Again</button>
            <button class="secondary-btn" onclick="closeErrorModal()">Cancel</button>
            <button class="support-btn" onclick="contactSupport()">Contact Support</button>
          </div>
        </div>
      </div>
    `;
    return modal;
  }

  getErrorTitle(errorCode) {
    const titles = {
      'NETWORK_ERROR': 'Connection Failed',
      'TIMEOUT_ERROR': 'Request Timed Out',
      'SECURITY_ERROR': 'Security Check Failed',
      'INSUFFICIENT_FUNDS': 'Insufficient Funds',
      'INVALID_PAYMENT': 'Invalid Payment Details',
      'PAYMENT_ERROR': 'Payment Failed'
    };
    return titles[errorCode] || 'Payment Error';
  }

  getErrorSuggestion(errorCode) {
    const suggestions = {
      'NETWORK_ERROR': 'Check your internet connection and try again.',
      'TIMEOUT_ERROR': 'The request took too long. Please try again.',
      'SECURITY_ERROR': 'Contact customer support for assistance.',
      'INSUFFICIENT_FUNDS': 'Please check your account balance before retrying.',
      'INVALID_PAYMENT': 'Verify your payment details and try again.',
      'PAYMENT_ERROR': 'Please try again or contact support if the problem persists.'
    };
    return suggestions[errorCode] || 'Please try again or contact support.';
  }

  // Chat functionality
  initializeChat() {
    this.chatMessages = [];
    this.chatIsOpen = false;

    // Auto-show notification after delay
    setTimeout(() => {
      this.showChatNotification();
    }, 30000); // Show after 30 seconds
  }

  showChatNotification() {
    const notification = document.getElementById('chatNotification');
    if (notification && !this.chatIsOpen) {
      notification.style.display = 'flex';
    }
  }

  hideChatNotification() {
    const notification = document.getElementById('chatNotification');
    if (notification) {
      notification.style.display = 'none';
    }
  }

  setupFileUpload() {
    const uploadArea = document.getElementById("uploadArea");
    const fileInput = document.getElementById("fileInput");

    if (!uploadArea || !fileInput) return;

    // Click to upload
    uploadArea.addEventListener("click", () => fileInput.click());

    // Drag and drop
    uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadArea.classList.add("dragover");
    });

    uploadArea.addEventListener("dragleave", () => {
      uploadArea.classList.remove("dragover");
    });

    uploadArea.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadArea.classList.remove("dragover");
      const files = Array.from(e.dataTransfer.files);
      this.handleFileUpload(files);
    });

    // File input change
    fileInput.addEventListener("change", (e) => {
      const files = Array.from(e.target.files);
      this.handleFileUpload(files);
    });
  }

  handleFileUpload(files) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];

    files.forEach((file) => {
      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }

            if (
        !allowedTypes.includes(file.type) &&
        !file.name.toLowerCase().endsWith(".ai") &&
        !file.name.toLowerCase().endsWith(".psd") &&
        !file.name.toLowerCase().endsWith(".cdr")
      ) {
        alert(
          `File "${file.name}" is not supported. Please upload PDF, DOC, JPG, PNG, AI, PSD, or CDR files.`,
        );
        return;
      }

      this.uploadedFiles.push(file);
    });

    this.updateUploadedFiles();
  }

  updateUploadedFiles() {
    const container = document.getElementById("uploadedFiles");
    if (!container) return;

    if (this.uploadedFiles.length === 0) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = this.uploadedFiles
      .map(
        (file, index) => `
            <div class="uploaded-file">
                <i class="fas fa-file-alt"></i>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${this.formatFileSize(file.size)}</div>
                </div>
                <button class="remove-file" onclick="customerApp.removeFile(${index})" title="Remove file">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `,
      )
      .join("");
  }

  removeFile(index) {
    this.uploadedFiles.splice(index, 1);
    this.updateUploadedFiles();
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  setupSmoothScrolling() {
    // Already handled by CSS scroll-behavior: smooth
  }

  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerHeight = document.querySelector(".main-header").offsetHeight;
      const targetPosition = section.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  }

  updateActiveNavLink(activeLink) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
    });
    activeLink.classList.add("active");
  }

  handleScroll() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        const navLink = document.querySelector(
          `.nav-link[href="#${sectionId}"]`,
        );
        if (navLink) {
          this.updateActiveNavLink(navLink);
        }
      }
    });
  }

  addToCart(serviceId) {
    const service = this.services[serviceId];
    if (!service) return;

    const existingItem = this.cart.find((item) => item.id === serviceId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        id: serviceId,
        name: service.name,
        price: service.price,
        unit: service.unit,
        quantity: 1,
      });
    }

    this.updateCart();
    this.showAddToCartFeedback(serviceId);
  }

  removeFromCart(serviceId) {
    this.cart = this.cart.filter((item) => item.id !== serviceId);
    this.updateCart();
  }

  updateQuantity(serviceId, newQuantity) {
    const item = this.cart.find((item) => item.id === serviceId);
    if (item) {
      if (newQuantity <= 0) {
        this.removeFromCart(serviceId);
      } else {
        item.quantity = newQuantity;
        this.updateCart();
      }
    }
  }

  updateCart() {
    const cartContainer = document.getElementById("cartItems");
    const totalsContainer = document.getElementById("orderTotals");
    const actionsContainer = document.getElementById("orderActions");

    if (!cartContainer) return;

    if (this.cart.length === 0) {
      cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>No services selected</p>
                    <small>Choose services from the menu above</small>
                </div>
            `;

      if (totalsContainer) totalsContainer.style.display = "none";
      if (actionsContainer) actionsContainer.style.display = "none";
      return;
    }

    // Render cart items
    cartContainer.innerHTML = this.cart
      .map(
        (item) => `
            <div class="cart-item">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-details">Le ${this.formatPrice(item.price)} per ${item.unit}</div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="customerApp.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <input type="number" class="qty-input" value="${item.quantity}" min="1" 
                               onchange="customerApp.updateQuantity('${item.id}', parseInt(this.value))">
                        <button class="qty-btn" onclick="customerApp.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="item-price">Le ${this.formatPrice(item.price * item.quantity)}</div>
                <button class="remove-item" onclick="customerApp.removeFromCart('${item.id}')" title="Remove item">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `,
      )
      .join("");

    // Calculate totals
    const subtotal = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const deliveryOption = document.querySelector(
      'input[name="delivery"]:checked',
    );
    const delivery =
      deliveryOption && deliveryOption.value === "delivery"
        ? this.deliveryFee
        : 0;
    const total = subtotal + delivery;

    // Update totals display
    if (totalsContainer) {
      document.getElementById("subtotal").textContent =
        `Le ${this.formatPrice(subtotal)}`;
      document.getElementById("deliveryFee").textContent =
        delivery > 0 ? `Le ${this.formatPrice(delivery)}` : "Free";
      document.getElementById("totalAmount").textContent =
        `Le ${this.formatPrice(total)}`;
      totalsContainer.style.display = "block";
    }

    if (actionsContainer) {
      actionsContainer.style.display = "flex";
    }
  }

  formatPrice(price) {
    return new Intl.NumberFormat("en-SL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  showAddToCartFeedback(serviceId) {
    const serviceCard = document.querySelector(`[data-service="${serviceId}"]`);
    const selectBtn = serviceCard?.querySelector(".select-service");

    if (selectBtn) {
      const originalText = selectBtn.innerHTML;
      selectBtn.innerHTML = '<i class="fas fa-check"></i> Added!';
      selectBtn.classList.add("selected");

      setTimeout(() => {
        selectBtn.innerHTML = originalText;
        selectBtn.classList.remove("selected");
      }, 2000);
    }

    // Scroll to cart
    setTimeout(() => {
      this.scrollToSection("order");
    }, 500);
  }

  clearCart() {
    this.cart = [];
    this.updateCart();
  }

  getOrderData() {
    const customerName = document.getElementById("customerName").value;
    const customerPhone = document.getElementById("customerPhone").value;
    const customerEmail = document.getElementById("customerEmail").value;
    const customerLocation = document.getElementById("customerLocation").value;
    const specialInstructions = document.getElementById(
      "specialInstructions",
    ).value;
    const deliveryOption = document.querySelector(
      'input[name="delivery"]:checked',
    );

    if (!customerName || !customerPhone) {
      showErrorMessage("Please fill in your name and WhatsApp number to proceed with your order.", "error");
      return null;
    }

    if (this.cart.length === 0) {
      showErrorMessage("Please select at least one service before proceeding.", "error");
      return null;
    }

    const subtotal = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const delivery =
      deliveryOption && deliveryOption.value === "delivery"
        ? this.deliveryFee
        : 0;
    const total = subtotal + delivery;

    return {
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        location: customerLocation,
      },
      items: this.cart,
      delivery: {
        option: deliveryOption ? deliveryOption.value : "pickup",
        fee: delivery,
      },
      specialInstructions,
      files: this.uploadedFiles,
      totals: {
        subtotal,
        delivery,
        total,
      },
    };
  }

  orderViaWhatsApp() {
    const orderData = this.getOrderData();
    if (!orderData) return;

    const message = this.createWhatsAppMessage(orderData);
    const whatsappUrl = `https://wa.me/${this.whatsappNumber.replace("+", "")}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  }

  createWhatsAppMessage(orderData) {
    let message = `🏢 *MelHad Investment - New Order*\n\n`;

    message += `👤 *Customer Information:*\n`;
    message += `Name: ${orderData.customer.name}\n`;
    message += `Phone: ${orderData.customer.phone}\n`;
    if (orderData.customer.email)
      message += `Email: ${orderData.customer.email}\n`;
    if (orderData.customer.location)
      message += `Location: ${orderData.customer.location}\n`;

    message += `\n��� *Services Ordered:*\n`;
    orderData.items.forEach((item) => {
      message += `• ${item.name}\n`;
      message += `  Quantity: ${item.quantity} ${item.unit}${item.quantity > 1 ? "s" : ""}\n`;
      message += `  Price: Le ${this.formatPrice(item.price * item.quantity)}\n\n`;
    });

    message += `🚚 *Delivery:* ${orderData.delivery.option === "delivery" ? "Home Delivery" : "Store Pickup"}\n`;
    if (orderData.delivery.fee > 0) {
      message += `Delivery Fee: Le ${this.formatPrice(orderData.delivery.fee)}\n`;
    }

    message += `\n💰 *Order Total:*\n`;
    message += `Subtotal: Le ${this.formatPrice(orderData.totals.subtotal)}\n`;
    if (orderData.totals.delivery > 0) {
      message += `Delivery: Le ${this.formatPrice(orderData.totals.delivery)}\n`;
    }
    message += `*Total: Le ${this.formatPrice(orderData.totals.total)}*\n`;

    if (orderData.specialInstructions) {
      message += `\n📝 *Special Instructions:*\n${orderData.specialInstructions}\n`;
    }

    if (orderData.files.length > 0) {
      message += `\n📎 *Attached Files:* ${orderData.files.length} file(s)\n`;
      orderData.files.forEach((file) => {
        message += `• ${file.name} (${this.formatFileSize(file.size)})\n`;
      });
      message += `*I will send the files in separate messages*\n`;
    }

    message += `\n✅ Please confirm this order and provide payment instructions.`;

    return message;
  }

  async generatePaymentLink() {
    const orderData = this.getOrderData();
    if (!orderData) return;

    this.showLoading(true);

    try {
      // Simulate API call to generate payment link
      await this.delay(2000);

      const paymentId = "PAY-" + Date.now();
      const paymentLink = `https://pay.melhadinvestment.sl/payment/${paymentId}`;

      this.showPaymentLinkModal(paymentLink, orderData);
    } catch (error) {
      alert("Error generating payment link. Please try again.");
      console.error("Payment link generation error:", error);
    } finally {
      this.showLoading(false);
    }
  }

  showPaymentLinkModal(paymentLink, orderData) {
    const modal = document.getElementById("paymentModal");
    const linkInput = document.getElementById("paymentLinkText");

    if (modal && linkInput) {
      linkInput.value = paymentLink;
      modal.classList.add("active");

      // Store order data for sharing
      this.currentPaymentData = { link: paymentLink, order: orderData };

      // Generate QR code (simplified)
      this.generateQRCode(paymentLink);
    }
  }

  generateQRCode(text) {
    const qrContainer = document.getElementById("qrCode");
    if (qrContainer) {
      // Simplified QR code placeholder
      qrContainer.innerHTML = `
                <div style="width: 150px; height: 150px; background: #f0f0f0; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                    <div style="text-align: center; color: #666;">
                        <i class="fas fa-qrcode" style="font-size: 2rem; margin-bottom: 8px;"></i>
                        <br>QR Code
                    </div>
                </div>
            `;
    }
  }

  copyPaymentLink() {
    const linkInput = document.getElementById("paymentLinkText");
    if (linkInput) {
      linkInput.select();
      document.execCommand("copy");

      // Show feedback
      const copyBtn = document.querySelector(".copy-btn");
      const originalContent = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check"></i>';

      setTimeout(() => {
        copyBtn.innerHTML = originalContent;
      }, 2000);
    }
  }

  shareViaWhatsApp() {
    if (!this.currentPaymentData) return;

    const message =
      `💳 *Payment Link - MelHad Investment*\n\n` +
      `Please use this secure link to pay for your order:\n` +
      `${this.currentPaymentData.link}\n\n` +
      `Order Total: Le ${this.formatPrice(this.currentPaymentData.order.totals.total)}\n\n` +
      `Thank you for choosing MelHad Investment! 🙏`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  }

  shareViaEmail() {
    if (!this.currentPaymentData) return;

    const subject = "Payment Link - MelHad Investment";
    const body =
      `Dear Customer,\n\n` +
      `Please use this secure link to pay for your order:\n` +
      `${this.currentPaymentData.link}\n\n` +
      `Order Total: Le ${this.formatPrice(this.currentPaymentData.order.totals.total)}\n\n` +
      `Best regards,\n` +
      `MelHad Investment Team`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  }

  closeModal() {
    const modal = document.getElementById("paymentModal");
    if (modal) {
      modal.classList.remove("active");
    }
    this.currentPaymentData = null;
  }

  showLoading(show) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) {
      overlay.style.display = show ? "flex" : "none";
    }
  }

  handleContactForm(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name =
      formData.get("name") ||
      e.target.querySelector('input[placeholder="Your Name"]').value;
    const email =
      formData.get("email") ||
      e.target.querySelector('input[placeholder="Your Email"]').value;
    const subject =
      formData.get("subject") ||
      e.target.querySelector('input[placeholder="Subject"]').value;
    const message =
      formData.get("message") ||
      e.target.querySelector('textarea[placeholder="Your Message"]').value;

    if (!name || !email || !subject || !message) {
      alert("Please fill in all fields.");
      return;
    }

    this.showLoading(true);

    // Simulate form submission
    setTimeout(() => {
      this.showLoading(false);
      showSuccessMessage("Thank you for your message! Our team will respond shortly.", "success");
      e.target.reset();
    }, 2000);
  }

  openWhatsApp() {
    const message = `Hello MelHad Investment! 👋\n\nI'm interested in your services. Can you help me with more information?`;
    const whatsappUrl = `https://wa.me/${this.whatsappNumber.replace("+", "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  redirectToCheckout(orderData) {
    try {
      // Store order data in localStorage for checkout page
      localStorage.setItem('currentOrder', JSON.stringify(orderData));

      // Generate order ID for URL
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Track checkout initiation
      gtag('event', 'begin_checkout', {
        'currency': 'SLL',
        'value': orderData.totals.total,
        'items': orderData.items.map(item => ({
          'item_id': item.serviceId,
          'item_name': item.serviceName,
          'quantity': item.quantity,
          'price': item.price
        }))
      });

      // Redirect to checkout page
      window.location.href = `/checkout?order=${orderId}`;

    } catch (error) {
      console.error('Checkout redirect error:', error);
      this.showErrorModal('Failed to redirect to checkout. Please try again.', 'CHECKOUT_ERROR');
    }
  }
}

// Quote Calculator Functions
function updateQuoteCalculation() {
  const serviceSelect = document.getElementById('calcService');
  const quantityInput = document.getElementById('calcQuantity');
  const quoteAmount = document.getElementById('quoteAmount');
  const addToCartBtn = document.getElementById('addToCartBtn');

  const serviceId = serviceSelect.value;
  const quantity = parseInt(quantityInput.value) || 1;

  if (!serviceId || !customerApp.services[serviceId]) {
    quoteAmount.textContent = 'Le 0';
    addToCartBtn.style.display = 'none';
    return;
  }

  const service = customerApp.services[serviceId];
  const total = service.price * quantity;

  quoteAmount.textContent = `Le ${customerApp.formatPrice(total)}`;
  addToCartBtn.style.display = 'flex';
}

function addCalculatedToCart() {
  const serviceSelect = document.getElementById('calcService');
  const quantityInput = document.getElementById('calcQuantity');

  const serviceId = serviceSelect.value;
  const quantity = parseInt(quantityInput.value) || 1;

  if (!serviceId) return;

  // Add to cart multiple times based on quantity
  for (let i = 0; i < quantity; i++) {
    customerApp.addToCart(serviceId);
  }

  // Show professional success message
  showSuccessMessage(`${quantity} ${customerApp.services[serviceId].name}(s) added to your cart successfully!`, 'success');

  // Reset calculator
  serviceSelect.value = '';
  quantityInput.value = 1;
  updateQuoteCalculation();

  // Scroll to order section
  customerApp.scrollToSection('order');
}

// Newsletter Functions
function subscribeNewsletter(event) {
  event.preventDefault();

  const emailInput = document.getElementById('newsletterEmail');
  const email = emailInput.value.trim();

  if (!email) {
    alert('Please enter your email address.');
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Simulate subscription
  const subscribeBtn = document.querySelector('.subscribe-btn');
  const originalText = subscribeBtn.innerHTML;

  subscribeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
  subscribeBtn.disabled = true;

  setTimeout(() => {
    subscribeBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
    emailInput.value = '';

    setTimeout(() => {
      subscribeBtn.innerHTML = originalText;
      subscribeBtn.disabled = false;
    }, 3000);

    // Send WhatsApp notification to business
    const businessMessage = `📧 *Newsletter Subscription*\n\nNew subscriber: ${email}\n\nDate: ${new Date().toLocaleDateString()}`;
    console.log('Newsletter subscription:', businessMessage);

    showSuccessMessage('Thank you for subscribing to MelHad Investment updates! You\'ll receive our latest news, exclusive offers, and business insights.', 'success');
  }, 2000);
}

// Chat Widget Functions
function toggleChat() {
  const chatWidget = document.getElementById('chatWidget');
  const isActive = chatWidget.classList.contains('active');

  if (isActive) {
    chatWidget.classList.remove('active');
    customerApp.chatIsOpen = false;
  } else {
    chatWidget.classList.add('active');
    customerApp.chatIsOpen = true;
    customerApp.hideChatNotification();
  }
}

function sendQuickMessage(message) {
  const input = document.getElementById('chatMessageInput');
  input.value = message;
  const event = new Event('submit', { bubbles: true, cancelable: true });
  input.closest('form').dispatchEvent(event);
}

function sendChatMessage(event) {
  event.preventDefault();

  const input = document.getElementById('chatMessageInput');
  const message = input.value.trim();

  if (!message) return;

  // Add user message to chat
  addChatMessage(message, 'user');

  // Clear input
  input.value = '';

  // Simulate agent response
  setTimeout(() => {
    let response = getAutomaticResponse(message);
    addChatMessage(response, 'agent');
  }, 1000 + Math.random() * 2000);
}

function addChatMessage(message, sender) {
  const messagesContainer = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.className = `message ${sender}-message`;

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  messageElement.innerHTML = `
    <div class="message-avatar">
      <i class="fas fa-${sender === 'user' ? 'user' : 'user-headset'}"></i>
    </div>
    <div class="message-content">
      <div class="message-bubble">${message}</div>
      <div class="message-time">${timeString}</div>
    </div>
  `;

  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getAutomaticResponse(userMessage) {
  const message = userMessage.toLowerCase();

  if (message.includes('quote') || message.includes('price')) {
    return "I'd be happy to help you with a quote! You can use our Quick Quote Calculator on the homepage, or tell me what services you need and I'll calculate it for you. 💰";
  }

  if (message.includes('track') || message.includes('order')) {
    return "To track your order, you can use the 'Track Order' button in the header, or provide me with your order ID and I'll check the status for you. 📦";
  }

  if (message.includes('print') || message.includes('printing')) {
    return "We offer a wide range of printing services including documents, business cards, flyers, banners, t-shirts, and more! What type of printing do you need? 🖨️";
  }

  if (message.includes('payment') || message.includes('pay')) {
    return "We accept Orange Money, Afrimoney, and bank transfers. You can pay directly through our app or via WhatsApp. All payments are secure and protected. 💳";
  }

  if (message.includes('hours') || message.includes('open')) {
    return "We're open Monday-Friday 8AM-6PM, Saturday 9AM-4PM, and closed on Sunday. WhatsApp support is available 24/7! 🕐";
  }

  if (message.includes('location') || message.includes('address')) {
    return "We're located at 5 Naimbana Street, Freetown, Sierra Leone. You can find us on the map in our contact section! 📍";
  }

  if (message.includes('hello') || message.includes('hi')) {
    return "Hello! 👋 Welcome to MelHad Investment. I'm here to help you with any questions about our printing, digital, or IT services. What can I assist you with today?";
  }

  return "Thank you for your message! For immediate assistance, you can also contact us via WhatsApp at +232 78 475 680. How else can I help you today? 😊";
}

// Order History Functions
function openOrderHistory() {
  const modal = document.getElementById('orderHistoryModal');
  if (modal) {
    modal.classList.add('active');
    document.getElementById('historyPhone').value = '';
    document.getElementById('orderHistoryList').innerHTML = `
      <div class="history-empty">
        <i class="fas fa-history"></i>
        <p>Enter your phone number to view order history</p>
      </div>
    `;
  }
}

function closeOrderHistory() {
  const modal = document.getElementById('orderHistoryModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function loadOrderHistory() {
  const phone = document.getElementById('historyPhone').value.trim();
  const historyList = document.getElementById('orderHistoryList');

  if (!phone) {
    alert('Please enter your phone number');
    return;
  }

  // Show loading
  historyList.innerHTML = '<div class="history-empty"><i class="fas fa-spinner fa-spin"></i><p>Loading order history...</p></div>';

  // Simulate API call
  setTimeout(() => {
    const orders = getOrderHistoryByPhone(phone);

    if (orders.length === 0) {
      historyList.innerHTML = `
        <div class="history-empty">
          <i class="fas fa-inbox"></i>
          <p>No orders found for this phone number</p>
          <small>Make your first order to see history here</small>
        </div>
      `;
    } else {
      let historyHTML = '';
      orders.forEach(order => {
        historyHTML += `
          <div class="order-history-item">
            <div class="order-header">
              <span class="order-id">${order.id}</span>
              <span class="order-date">${order.date}</span>
            </div>
            <div class="order-items">
              ${order.items.map(item => `<div class="order-item">• ${item}</div>`).join('')}
            </div>
            <div class="order-total">Total: Le ${customerApp.formatPrice(order.total)}</div>
            <div class="order-status">Status: <span class="${order.status}">${order.status}</span></div>
          </div>
        `;
      });
      historyList.innerHTML = historyHTML;
    }
  }, 1500);
}

function getOrderHistoryByPhone(phone) {
  // Production-ready order history - connect to real backend API
  // In production, this should make an actual API call to your backend
  // Example: return fetch('/api/orders/history', { method: 'POST', body: JSON.stringify({phone}) })

  // For now, return empty array until backend is connected
  return [];
}

// Bulk Order Functions
function submitBulkOrder(event) {
  event.preventDefault();

  const companyName = document.getElementById('companyName').value;
  const contactPerson = document.getElementById('contactPerson').value;
  const businessPhone = document.getElementById('businessPhone').value;
  const businessEmail = document.getElementById('businessEmail').value;
  const requirements = document.getElementById('bulkRequirements').value;

  if (!companyName || !contactPerson || !businessPhone || !requirements) {
    alert('Please fill in all required fields');
    return;
  }

  const submitBtn = document.querySelector('.bulk-submit-btn');
  const originalText = submitBtn.innerHTML;

  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
  submitBtn.disabled = true;

  // Process enterprise bulk order request
  setTimeout(() => {
    // Create WhatsApp message for bulk order
    const message = `🏢 *Bulk Order Request - MelHad Investment*\n\n` +
      `Company: ${companyName}\n` +
      `Contact: ${contactPerson}\n` +
      `Phone: ${businessPhone}\n` +
      `Email: ${businessEmail || 'Not provided'}\n\n` +
      `Requirements:\n${requirements}\n\n` +
      `Please provide bulk pricing and timeline.`;

    const whatsappUrl = `https://wa.me/23278475680?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    submitBtn.innerHTML = '<i class="fas fa-check"></i> Request Sent!';

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      document.getElementById('bulkOrderForm').reset();
    }, 3000);

    showSuccessMessage('Enterprise bulk order request submitted successfully! Our business development team will contact you within 4-6 business hours with a comprehensive quote and timeline.', 'success');
  }, 2000);
}

// FAQ functionality
function toggleFAQ(element) {
  const faqItem = element.closest('.faq-item');
  const isActive = faqItem.classList.contains('active');

  // Close all FAQ items
  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.remove('active');
  });

  // Open clicked item if it wasn't active
  if (!isActive) {
    faqItem.classList.add('active');
  }
}

// Order Tracking functionality
function openTrackingModal() {
  const modal = document.getElementById('trackingModal');
  if (modal) {
    modal.classList.add('active');
    // Clear previous search
    document.getElementById('orderIdSearch').value = '';
    document.getElementById('trackingResults').style.display = 'none';
    document.getElementById('noOrderFound').style.display = 'none';
  }
}

function closeTrackingModal() {
  const modal = document.getElementById('trackingModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function searchOrder() {
  const searchValue = document.getElementById('orderIdSearch').value.trim();
  const resultsDiv = document.getElementById('trackingResults');
  const noOrderDiv = document.getElementById('noOrderFound');

  if (!searchValue) {
    alert('Please enter an Order ID or Phone Number');
    return;
  }

  // Show loading state
  customerApp.showLoading(true);

  // Simulate API call to search for order
  setTimeout(() => {
    customerApp.showLoading(false);

    // Mock order data - in production, this would be fetched from the server
    const mockOrderData = {
      'ORD-1736548800000': {
        id: 'ORD-1736548800000',
        customerName: 'John Doe',
        total: 125000,
        status: 'processing',
        createdAt: '2024-01-10',
        phone: '+23278475680'
      }
    };

    // Search by order ID or phone number
    let foundOrder = null;

    if (searchValue.startsWith('ORD-')) {
      foundOrder = mockOrderData[searchValue];
    } else {
      // Search by phone number
      Object.values(mockOrderData).forEach(order => {
        if (order.phone === searchValue) {
          foundOrder = order;
        }
      });
    }

    if (foundOrder) {
      // Display order information
      document.getElementById('foundOrderId').textContent = `Order #${foundOrder.id}`;
      document.getElementById('foundOrderStatus').textContent = foundOrder.status;
      document.getElementById('foundOrderStatus').className = `order-status ${foundOrder.status}`;
      document.getElementById('foundCustomerName').textContent = foundOrder.customerName;
      document.getElementById('foundOrderTotal').textContent = `Le ${customerApp.formatPrice(foundOrder.total)}`;
      document.getElementById('foundOrderDate').textContent = foundOrder.createdAt;
      document.getElementById('orderPlacedDate').textContent = foundOrder.createdAt;

      // Update timeline based on status
      updateOrderTimeline(foundOrder.status);

      resultsDiv.style.display = 'block';
      noOrderDiv.style.display = 'none';
    } else {
      // Order not found
      resultsDiv.style.display = 'none';
      noOrderDiv.style.display = 'block';
    }
  }, 1500);
}

function updateOrderTimeline(status) {
  const timelineItems = document.querySelectorAll('.timeline-item');

  // Reset all items
  timelineItems.forEach(item => {
    item.classList.remove('completed', 'active');
  });

  // Set status based on order status
  switch(status) {
    case 'pending':
      timelineItems[0].classList.add('active');
      break;
    case 'processing':
      timelineItems[0].classList.add('completed');
      timelineItems[1].classList.add('active');
      break;
    case 'ready':
      timelineItems[0].classList.add('completed');
      timelineItems[1].classList.add('completed');
      timelineItems[2].classList.add('active');
      break;
    case 'completed':
      timelineItems.forEach(item => item.classList.add('completed'));
      break;
    default:
      timelineItems[0].classList.add('active');
  }
}

function contactWhatsApp() {
  const orderId = document.getElementById('foundOrderId').textContent;
  const message = `Hello! I'm checking on my order: ${orderId}. Can you please provide an update?`;
  const whatsappUrl = `https://wa.me/23278475680?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

function contactSupport() {
  const searchValue = document.getElementById('orderIdSearch').value;
  const message = `Hello! I'm trying to track my order but can't find it. I searched for: ${searchValue}. Can you help me?`;
  const whatsappUrl = `https://wa.me/23278475680?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

// Custom order submission functions
function submitCustomOrder() {
  const customerName = document.getElementById("customerName").value;
  const customerPhone = document.getElementById("customerPhone").value;
  const customerEmail = document.getElementById("customerEmail").value;
  const customerLocation = document.getElementById("customerLocation").value;
  const specialInstructions = document.getElementById("specialInstructions").value;
  const deliveryOption = document.querySelector('input[name="delivery"]:checked');

  if (!customerName || !customerPhone) {
    alert("Please fill in your name and WhatsApp number.");
    return;
  }

  let message = `🏢 *MelHad Investment - Custom Order Request*\n\n`;
  message += `👤 *Customer Information:*\n`;
  message += `Name: ${customerName}\n`;
  message += `Phone: ${customerPhone}\n`;
  if (customerEmail) message += `Email: ${customerEmail}\n`;
  if (customerLocation) message += `Location: ${customerLocation}\n`;

  // Check if services were selected
  if (customerApp.cart.length > 0) {
    message += `\n📦 *Selected Services:*\n`;
    customerApp.cart.forEach((item) => {
      message += `• ${item.name} (${item.quantity} ${item.unit}${item.quantity > 1 ? "s" : ""})\n`;
    });

    const subtotal = customerApp.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = deliveryOption && deliveryOption.value === "delivery" ? customerApp.deliveryFee : 0;
    const total = subtotal + delivery;

    message += `\n💰 *Estimated Total:* Le ${customerApp.formatPrice(total)}\n`;
  } else {
    message += `\n📝 *Service Request:* Custom order - please discuss requirements\n`;
  }

  message += `\n🚚 *Delivery:* ${deliveryOption && deliveryOption.value === "delivery" ? "Home Delivery" : "Store Pickup"}\n`;

  if (specialInstructions) {
    message += `\n📝 *Special Instructions:*\n${specialInstructions}\n`;
  }

  if (customerApp.uploadedFiles.length > 0) {
    message += `\n📎 *Files Attached:* ${customerApp.uploadedFiles.length} file(s)\n`;
    customerApp.uploadedFiles.forEach((file) => {
      message += `• ${file.name}\n`;
    });
    message += `*Files will be sent separately*\n`;
  }

  message += `\n✅ Please confirm this order and provide pricing/timeline.`;

  const whatsappUrl = `https://wa.me/23278475680?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

function generateCustomQuote() {
  const customerName = document.getElementById("customerName").value;
  const customerPhone = document.getElementById("customerPhone").value;
  const specialInstructions = document.getElementById("specialInstructions").value;

  if (!customerName || !customerPhone) {
    alert("Please fill in your name and WhatsApp number to get a quote.");
    return;
  }

  let message = `💰 *MelHad Investment - Quote Request*\n\n`;
  message += `👤 *Customer:* ${customerName}\n`;
  message += `�� *Phone:* ${customerPhone}\n\n`;

  if (specialInstructions) {
    message += `��� *Project Details:*\n${specialInstructions}\n\n`;
  } else {
    message += `📝 *Project Details:* Please discuss requirements\n\n`;
  }

  if (customerApp.uploadedFiles.length > 0) {
    message += `📎 *Reference Files:* ${customerApp.uploadedFiles.length} file(s) attached\n\n`;
  }

  message += `🔍 *Request:* Please provide a detailed quote for the above requirements.\n\n`;
  message += `Thank you!`;

  const whatsappUrl = `https://wa.me/23278475680?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

// Payment Processing Functions
function processDirectPayment() {
  const orderData = customerApp.getOrderData();
  if (!orderData) return;

  // Show payment modal with order details
  const modal = document.getElementById('paymentProcessModal');
  const paymentItems = document.getElementById('paymentItems');
  const paymentTotal = document.getElementById('paymentTotal');

  // Populate order items
  let itemsHTML = '';
  orderData.items.forEach(item => {
    itemsHTML += `
      <div class="payment-item">
        <span>${item.name} (${item.quantity})</span>
        <span>Le ${customerApp.formatPrice(item.price * item.quantity)}</span>
      </div>
    `;
  });

  if (orderData.delivery.fee > 0) {
    itemsHTML += `
      <div class="payment-item">
        <span>Delivery Fee</span>
        <span>Le ${customerApp.formatPrice(orderData.delivery.fee)}</span>
      </div>
    `;
  }

  paymentItems.innerHTML = itemsHTML;
  paymentTotal.textContent = `Le ${customerApp.formatPrice(orderData.totals.total)}`;

  // Pre-fill customer phone if available
  const customerPhone = document.getElementById("customerPhone").value;
  if (customerPhone) {
    document.getElementById('paymentPhone').value = customerPhone;
  }

  modal.classList.add('active');
  customerApp.currentOrderData = orderData;
}

function closePaymentModal() {
  const modal = document.getElementById('paymentProcessModal');
  modal.classList.remove('active');
  customerApp.currentOrderData = null;
}

async function confirmPayment() {
  const paymentPhone = document.getElementById('paymentPhone').value;
  const paymentPin = document.getElementById('paymentPin').value;
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

  // Enhanced Security Validations
  if (!paymentPhone) {
    customerApp.showErrorModal('Please enter your mobile number for payment processing.', 'MISSING_PHONE');
    return;
  }

  // Phone number validation
  const phoneRegex = /^\+232[0-9]{8}$/;
  if (!phoneRegex.test(paymentPhone)) {
    customerApp.showErrorModal('Please enter a valid Sierra Leone phone number in format +232XXXXXXXX', 'INVALID_PHONE');
    return;
  }

  if (!paymentPin || paymentPin.length < 4) {
    customerApp.showErrorModal('Please enter a valid payment PIN (minimum 4 digits).', 'INVALID_PIN');
    return;
  }

  if (!customerApp.currentOrderData) {
    customerApp.showErrorModal('Order information is missing. Please refresh the page and try again.', 'MISSING_ORDER_DATA');
    return;
  }

  if (!customerApp.currentOrderData.items || customerApp.currentOrderData.items.length === 0) {
    customerApp.showErrorModal('No items in your order. Please add services before proceeding.', 'EMPTY_ORDER');
    return;
  }

  // Anti-fraud checks
  const securityCheck = await performSecurityChecks(paymentPhone, customerApp.currentOrderData);
  if (!securityCheck.passed) {
    alert(`Security Check Failed: ${securityCheck.reason}\n\nFor your protection, this transaction has been blocked. Please contact support if you believe this is an error.`);
    return;
  }

  customerApp.showLoading(true);

  try {
    // Simulate enhanced payment processing with security
    await customerApp.delay(3000);

    // Create secure payment record with additional security data
    const payment = {
      id: 'PAY-' + Date.now(),
      orderId: 'ORD-' + Date.now(),
      amount: customerApp.currentOrderData.totals.total,
      method: paymentMethod,
      phone: paymentPhone,
      status: 'completed',
      processedAt: new Date(),
      securityScore: securityCheck.score,
      ipHash: await generateIPHash(),
      deviceFingerprint: generateDeviceFingerprint(),
      transactionHash: await generateTransactionHash(customerApp.currentOrderData)
    };

    // Redirect to checkout page instead of old payment processing
    customerApp.redirectToCheckout(customerApp.currentOrderData);
    return;

    // Check if response is ok
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Invalid payment data provided.');
      } else if (response.status === 401) {
        throw new Error('Payment authentication failed.');
      } else if (response.status === 403) {
        throw new Error('Payment not allowed. Please contact support.');
      } else if (response.status === 404) {
        throw new Error('Payment service not found. Please try again later.');
      } else if (response.status === 429) {
        throw new Error('Too many payment attempts. Please wait before trying again.');
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(`Payment failed with status ${response.status}`);
      }
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Payment processing failed');
    }

    const invoice = result.invoice;

    customerApp.showLoading(false);
    closePaymentModal();

    // Show success modal with PDF sharing options
    this.showSuccessModal({
      paymentId: payment.id,
      amount: payment.amount,
      securityScore: securityCheck.score,
      invoice: invoice
    });

    // Clear cart after successful payment
    customerApp.clearCart();

    // Log successful secure transaction
    logSecureTransaction(payment);

  } catch (error) {
    customerApp.showLoading(false);

    // Comprehensive error handling
    let errorMessage = 'Payment processing failed. Please try again.';
    let errorCode = 'PAYMENT_ERROR';

    if (error.message) {
      if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network connection error. Please check your internet connection and try again.';
        errorCode = 'NETWORK_ERROR';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Payment processing timed out. Please try again.';
        errorCode = 'TIMEOUT_ERROR';
      } else if (error.message.includes('fraud') || error.message.includes('security')) {
        errorMessage = 'Payment blocked for security reasons. Please contact support if you believe this is an error.';
        errorCode = 'SECURITY_ERROR';
      } else if (error.message.includes('insufficient')) {
        errorMessage = 'Insufficient funds. Please check your account balance and try again.';
        errorCode = 'INSUFFICIENT_FUNDS';
      } else if (error.message.includes('invalid')) {
        errorMessage = 'Invalid payment information. Please check your details and try again.';
        errorCode = 'INVALID_PAYMENT';
      }
    }

    customerApp.showErrorModal(errorMessage, errorCode, error);
    console.error('Payment error:', error);
    logFailedTransaction(error, paymentPhone);
  }
}

// Enhanced Security Functions
async function performSecurityChecks(phone, orderData) {
  let score = 100;
  let riskFactors = [];

  // Check 1: Phone number format and carrier validation
  if (!phone.startsWith('+232')) {
    score -= 30;
    riskFactors.push('Invalid country code');
  }

  // Check 2: Order amount validation
  if (orderData.totals.total > 5000000) { // Large amount check
    score -= 10;
    riskFactors.push('High value transaction');
  }

  // Check 3: Rapid repeat attempts
  const recentAttempts = getRecentPaymentAttempts(phone);
  if (recentAttempts > 3) {
    score -= 40;
    riskFactors.push('Multiple recent attempts');
  }

  // Check 4: Device fingerprint consistency
  const deviceConsistency = checkDeviceConsistency();
  if (deviceConsistency < 0.7) {
    score -= 20;
    riskFactors.push('Device inconsistency');
  }

  // Check 5: Time-based validation
  const hour = new Date().getHours();
  if (hour < 6 || hour > 22) { // Unusual hours
    score -= 15;
    riskFactors.push('Unusual transaction time');
  }

  // Check 6: Geographic validation (simulated)
  const geoScore = await validateGeolocation();
  if (geoScore < 0.8) {
    score -= 25;
    riskFactors.push('Geographic anomaly');
  }

  const passed = score >= 60; // Minimum security threshold

  return {
    passed,
    score: Math.max(0, score),
    riskFactors,
    reason: !passed ? riskFactors.join(', ') : 'Security checks passed'
  };
}

function getRecentPaymentAttempts(phone) {
  // Simulate checking recent attempts from this phone number
  const attempts = localStorage.getItem(`attempts_${phone}`) || '0';
  return parseInt(attempts);
}

function checkDeviceConsistency() {
  // Simulate device fingerprint consistency check
  return Math.random() * 0.4 + 0.6; // 0.6 - 1.0 range
}

async function validateGeolocation() {
  // Simulate geolocation validation
  return Math.random() * 0.3 + 0.7; // 0.7 - 1.0 range
}

async function generateIPHash() {
  // Simulate IP hashing for security
  const timestamp = Date.now();
  return 'ip_' + btoa(timestamp.toString()).substring(0, 16);
}

function generateDeviceFingerprint() {
  // Generate device fingerprint for security tracking
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Security fingerprint', 2, 2);

  const fingerprint = {
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
    userAgent: btoa(navigator.userAgent).substring(0, 20),
    canvas: canvas.toDataURL().substring(0, 50)
  };

  return btoa(JSON.stringify(fingerprint)).substring(0, 32);
}

async function generateTransactionHash(orderData) {
  // Generate unique transaction hash
  const data = JSON.stringify(orderData) + Date.now();
  return btoa(data).substring(0, 24);
}

function logSecureTransaction(payment) {
  console.log('🔒 Secure Transaction Logged:', {
    id: payment.id,
    amount: payment.amount,
    securityScore: payment.securityScore,
    timestamp: payment.processedAt
  });

  // Store successful transaction for fraud detection
  const transactions = JSON.parse(localStorage.getItem('secureTransactions') || '[]');
  transactions.push({
    id: payment.id,
    phone: payment.phone.substring(0, 8) + 'xxx', // Masked for privacy
    amount: payment.amount,
    timestamp: payment.processedAt,
    securityScore: payment.securityScore
  });

  // Keep only last 50 transactions for fraud pattern detection
  if (transactions.length > 50) {
    transactions.splice(0, transactions.length - 50);
  }

  localStorage.setItem('secureTransactions', JSON.stringify(transactions));
}

function logFailedTransaction(error, phone) {
  console.warn('🚨 Failed Transaction Logged:', {
    phone: phone.substring(0, 8) + 'xxx',
    error: error.message,
    timestamp: new Date()
  });

  // Increment failed attempt counter
  const attempts = getRecentPaymentAttempts(phone);
  localStorage.setItem(`attempts_${phone}`, (attempts + 1).toString());

  // Auto-clear attempts after 1 hour
  setTimeout(() => {
    localStorage.removeItem(`attempts_${phone}`);
  }, 3600000);
}

async function generateInvoicePDF(orderData, payment) {
  // Simulate PDF generation
  const invoice = {
    id: 'INV-' + Date.now(),
    orderId: payment.orderId,
    paymentId: payment.id,
    customer: orderData.customer,
    items: orderData.items,
    totals: orderData.totals,
    payment: payment,
    generatedAt: new Date(),
    pdfUrl: `/pdfs/invoice-${payment.id}.pdf`
  };

  console.log('📄 PDF Invoice generated:', invoice);
  return invoice;
}

async function sendPaymentNotifications(orderData, payment, invoice) {
  // Business notification
  const businessMessage =
    `💰 *Payment Received - MelHad Investment*\n\n` +
    `Payment ID: ${payment.id}\n` +
    `Amount: Le ${customerApp.formatPrice(payment.amount)}\n` +
    `Method: ${payment.method.toUpperCase()}\n` +
    `Customer: ${orderData.customer.name}\n` +
    `Phone: ${orderData.customer.phone}\n\n` +
    `📦 *Items:*\n${orderData.items.map(item => `• ${item.name} (${item.quantity})`).join('\n')}\n\n` +
    `Invoice: ${invoice.pdfUrl}`;

  // Customer confirmation
  const customerMessage =
    `🎉 *Payment Confirmed - MelHad Investment*\n\n` +
    `Thank you ${orderData.customer.name}!\n\n` +
    `Payment ID: ${payment.id}\n` +
    `Amount Paid: Le ${customerApp.formatPrice(payment.amount)}\n` +
    `Method: ${payment.method.toUpperCase()}\n\n` +
    `📦 *Your Order:*\n${orderData.items.map(item => `• ${item.name} (${item.quantity})`).join('\n')}\n\n` +
    `🚚 Delivery: ${orderData.delivery.option}\n\n` +
    `📄 Your invoice has been generated.\n` +
    `�� We'll send updates via WhatsApp.\n\n` +
    `Thank you for choosing MelHad Investment! ���`;

  console.log('📱 WhatsApp notifications sent:', {
    business: businessMessage,
    customer: customerMessage
  });

  // In a real implementation, these would be sent via WhatsApp API
  return true;
}

// Global functions for onclick handlers
function addToCart(serviceId) {
  customerApp.addToCart(serviceId);
}

function orderViaWhatsApp() {
  customerApp.orderViaWhatsApp();
}

function generatePaymentLink() {
  customerApp.generatePaymentLink();
}

function clearCart() {
  customerApp.clearCart();
}

function scrollToSection(sectionId) {
  customerApp.scrollToSection(sectionId);
}

function openWhatsApp() {
  customerApp.openWhatsApp();
}

function copyPaymentLink() {
  customerApp.copyPaymentLink();
}

function shareViaWhatsApp() {
  customerApp.shareViaWhatsApp();
}

function shareViaEmail() {
  customerApp.shareViaEmail();
}

function closeModal() {
  customerApp.closeModal();
}

// Mobile menu toggle function
function toggleMobileMenu() {
  const mobileNav = document.getElementById('mainNav');
  if (mobileNav) {
    mobileNav.classList.toggle('mobile-open');
  }
}

// Theme toggle function
function toggleTheme() {
  if (customerApp) {
    customerApp.toggleTheme();
  }
}

// Service search functions
function filterServices() {
  const searchInput = document.getElementById('serviceSearch');
  if (customerApp && searchInput) {
    customerApp.filterServices(searchInput.value);
  }
}

function clearSearch() {
  if (customerApp) {
    customerApp.clearServiceSearch();
  }
}



// Success Modal Functions
function closeSuccessModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function downloadInvoicePDF() {
  if (customerApp && customerApp.currentInvoice && customerApp.currentInvoice.pdfUrl) {
    // Create download link
    const link = document.createElement('a');
    link.href = customerApp.currentInvoice.pdfUrl;
    link.download = customerApp.currentInvoice.pdfFilename || 'invoice.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert('PDF not available. Please contact support.');
  }
}

function shareInvoice() {
  if (customerApp && customerApp.currentInvoice) {
    if (navigator.share) {
      navigator.share({
        title: 'MelHad Investment Invoice',
        text: `Invoice from MelHad Investment - Payment ID: ${customerApp.currentInvoice.id}`,
        url: customerApp.currentInvoice.pdfUrl
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: copy link to clipboard
      const fullUrl = window.location.origin + customerApp.currentInvoice.pdfUrl;
      navigator.clipboard.writeText(fullUrl).then(() => {
        alert('Invoice link copied to clipboard!');
      }).catch(() => {
        alert('Unable to copy link. You can manually share: ' + fullUrl);
      });
    }
  }
}

function shareViaWhatsApp() {
  if (customerApp && customerApp.currentInvoice) {
    const message = `🧾 *Invoice from MelHad Investment*%0A%0A💳 Payment ID: ${customerApp.currentInvoice.id}%0A📄 Download your invoice: ${window.location.origin + customerApp.currentInvoice.pdfUrl}%0A%0AThank you for choosing MelHad Investment! 🙏`;
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }
}

function trackThisOrder() {
  if (customerApp && customerApp.currentInvoice) {
    closeSuccessModal();
    // Auto-fill the tracking modal with the order ID
    const trackingInput = document.getElementById('orderIdSearch');
    if (trackingInput) {
      trackingInput.value = customerApp.currentInvoice.orderId || customerApp.currentInvoice.id;
    }
    openTrackingModal();
  }
}

// Error Modal Functions
function closeErrorModal() {
  const modal = document.getElementById('errorModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function retryPayment() {
  closeErrorModal();
  // Reopen payment modal for retry
  processDirectPayment();
}

function contactSupport() {
  const message = `Hello! I need help with a payment issue.%0A%0AError occurred at: ${new Date().toLocaleString()}%0APlease assist me with my payment.`;
  const whatsappUrl = `https://wa.me/23278475680?text=${message}`;
  window.open(whatsappUrl, '_blank');
}

// Initialize the app
let customerApp;
document.addEventListener("DOMContentLoaded", function () {
  customerApp = new CustomerApp();

  // Update UI based on authentication status
  updateAuthUI();

  // Set default date range for file uploads
  const today = new Date().toISOString().split("T")[0];
  console.log("📱 MelHad Investment Customer App - Ready for orders!");
});

// Update UI based on authentication status
function updateAuthUI() {
  const authToken = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');
  const dashboardBtn = document.querySelector('.dashboard-btn');
  const loginBtn = document.querySelector('.login-btn');

  if (authToken && userRole === 'admin') {
    // User is logged in as admin
    if (dashboardBtn) {
      dashboardBtn.style.display = 'flex';
      dashboardBtn.innerHTML = '<i class="fas fa-tachometer-alt"></i>Dashboard';
    }
    if (loginBtn) {
      loginBtn.innerHTML = '<i class="fas fa-user-check"></i>Admin';
      loginBtn.onclick = logout;
    }
  } else {
    // User not logged in or not admin
    if (dashboardBtn) {
      dashboardBtn.style.display = 'none';
    }
    if (loginBtn) {
      loginBtn.innerHTML = '<i class="fas fa-user"></i>Login';
      loginBtn.onclick = openLoginModal;
    }
  }
}

// Logout function
function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('username');
  updateAuthUI();
  showErrorMessage('Logged out successfully', 'success');
}

// Mobile Menu Toggle Function
function toggleMobileMenu() {
  const nav = document.getElementById('mainNav');
  const body = document.body;

  if (nav.classList.contains('mobile-open')) {
    nav.classList.remove('mobile-open');
    body.style.overflow = 'auto';
  } else {
    nav.classList.add('mobile-open');
    body.style.overflow = 'hidden';
  }
}

// Close mobile menu when clicking on nav links
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      const nav = document.getElementById('mainNav');
      if (nav.classList.contains('mobile-open')) {
        nav.classList.remove('mobile-open');
        document.body.style.overflow = 'auto';
      }
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    const nav = document.getElementById('mainNav');
    const toggle = document.querySelector('.mobile-menu-toggle');

    if (nav.classList.contains('mobile-open') &&
        !nav.contains(e.target) &&
        !toggle.contains(e.target)) {
      nav.classList.remove('mobile-open');
      document.body.style.overflow = 'auto';
    }
  });
});

// Handle browser back/forward
window.addEventListener("popstate", function (e) {
  if (e.state && e.state.section) {
    customerApp.scrollToSection(e.state.section);
  }
});

console.log("🇸🇱 MelHad Investment - Professional Services in Sierra Leone");

// Enterprise Package Data
const enterprisePackages = {
  'startup-package': {
    name: 'Startup Business Package',
    price: 850000,
    originalPrice: 1200000,
    savings: 350000,
    items: [
      'Professional Logo Design',
      'Business Cards (500 pieces)',
      'Company Letterhead Design',
      'Basic Website (5 pages)',
      'Social Media Setup',
      'Marketing Flyer Design'
    ],
    category: 'enterprise'
  },
  'enterprise-package': {
    name: 'Enterprise Solution Package',
    price: 2500000,
    originalPrice: 3500000,
    savings: 1000000,
    items: [
      'Complete Brand Identity',
      'Professional Website + E-commerce',
      'Mobile App Development',
      'IT Infrastructure Setup',
      'Digital Marketing Strategy',
      'Staff Training'
    ],
    category: 'enterprise'
  },
  'social-media-package': {
    name: 'Social Media Marketing Package',
    price: 450000,
    isMonthly: true,
    items: [
      'Content Creation (20 posts/month)',
      'Facebook & Instagram Management',
      'Paid Ads Setup & Management',
      'Analytics & Reporting',
      'Community Management'
    ],
    category: 'enterprise'
  },
  'ecommerce-package': {
    name: 'E-Commerce Store Package',
    price: 1200000,
    items: [
      'Professional Online Store',
      'Mobile Money Integration',
      'Inventory Management System',
      'Order Management',
      'Customer Support Setup',
      'Training & Support'
    ],
    category: 'enterprise'
  },
  'event-package': {
    name: 'Event Marketing Package',
    price: 320000,
    items: [
      'Event Banner Design',
      'Invitation Cards (100 pieces)',
      'Social Media Graphics',
      'Event Photography',
      'Program/Brochure Design'
    ],
    category: 'enterprise'
  },
  'restaurant-package': {
    name: 'Restaurant Business Package',
    price: 680000,
    items: [
      'Menu Design & Printing',
      'Restaurant Signage',
      'Website with Online Ordering',
      'Social Media Setup',
      'Digital Marketing Plan'
    ],
    category: 'enterprise'
  }
};

// Add enterprise packages to services
Object.assign(customerApp.services, enterprisePackages);

// Social Sharing Functions
function shareOnFacebook() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent('Check out MelHad Investment - Sierra Leone\'s premier business services! Professional printing, web development & IT solutions.');
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
  openSocialWindow(facebookUrl, 'Facebook');

  // Analytics tracking
  gtag('event', 'share', {
    method: 'Facebook',
    content_type: 'website',
    content_id: 'homepage'
  });
}

function shareOnTwitter() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent('Professional business services in Sierra Leone 🇸🇱 - MelHad Investment offers printing, web development & IT solutions. #SierraLeone #Business');
  const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=SierraLeone,Business,Printing`;
  openSocialWindow(twitterUrl, 'Twitter');

  gtag('event', 'share', {
    method: 'Twitter',
    content_type: 'website',
    content_id: 'homepage'
  });
}

function shareOnLinkedIn() {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent('MelHad Investment - Sierra Leone Business Services');
  const summary = encodeURIComponent('Professional printing, web development, and IT support services in Sierra Leone. Serving businesses across Freetown, Bo, Kenema and nationwide.');
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`;
  openSocialWindow(linkedinUrl, 'LinkedIn');

  gtag('event', 'share', {
    method: 'LinkedIn',
    content_type: 'website',
    content_id: 'homepage'
  });
}

function shareOnWhatsApp() {
  const text = encodeURIComponent('🏢 Check out MelHad Investment - Sierra Leone\'s premier business services!\n\n✅ Professional Printing\n✅ Web Development\n✅ IT Support\n✅ Digital Marketing\n\nServing all of Sierra Leone 🇸🇱\n\n' + window.location.href);
  const whatsappUrl = `https://wa.me/?text=${text}`;
  window.open(whatsappUrl, '_blank');

  gtag('event', 'share', {
    method: 'WhatsApp',
    content_type: 'website',
    content_id: 'homepage'
  });
}

function openSocialWindow(url, platform) {
  const width = 600;
  const height = 400;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  window.open(
    url,
    `share${platform}`,
    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
  );
}

// Business WhatsApp function
function openWhatsAppBusiness() {
  const message = encodeURIComponent('Hello! I\'m interested in MelHad Investment\'s enterprise business solutions. Please provide me with a consultation on your professional services.');
  const whatsappUrl = `https://wa.me/23278475680?text=${message}`;
  window.open(whatsappUrl, '_blank');

  gtag('event', 'consultation_request', {
    method: 'WhatsApp',
    content_type: 'enterprise'
  });
}

// Enhanced Analytics Functions
function trackServiceInterest(serviceId) {
  gtag('event', 'service_interest', {
    service_id: serviceId,
    service_name: customerApp.services[serviceId]?.name || serviceId
  });
}

function trackQuoteRequest(serviceId, quantity) {
  gtag('event', 'quote_request', {
    service_id: serviceId,
    service_name: customerApp.services[serviceId]?.name || serviceId,
    quantity: quantity
  });
}

function trackOrderStart() {
  gtag('event', 'begin_checkout', {
    currency: 'SLL',
    value: customerApp.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    items: customerApp.cart.map(item => ({
      item_id: item.id,
      item_name: item.name,
      quantity: item.quantity,
      price: item.price
    }))
  });
}

// Animated Counter for Stats
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60 FPS
        let current = 0;

        const updateCounter = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.round(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target + (target === 24 ? '' : '+');
          }
        };

        updateCounter();
        observer.unobserve(counter);
      }
    });
  });

  counters.forEach(counter => observer.observe(counter));
}

// SEO and Performance Optimization
function optimizePerformance() {
  // Lazy load images
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));

  // Preload critical resources
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.href = 'customer-styles.css';
  preloadLink.as = 'style';
  document.head.appendChild(preloadLink);
}

// Enhanced Service Category Management
function switchServiceCategory(category) {
  // Hide all service grids
  document.querySelectorAll('.services-grid').forEach(grid => {
    grid.classList.remove('active');
  });

  // Show selected category
  const targetGrid = document.getElementById(`${category}-services`);
  if (targetGrid) {
    targetGrid.classList.add('active');
  }

  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  document.querySelector(`.tab-btn[data-category="${category}"]`).classList.add('active');

  // Analytics tracking
  gtag('event', 'service_category_view', {
    category: category
  });
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
  // Initialize floating actions
  initializeFloatingActions();

  // Initialize counters animation
  animateCounters();

  // Initialize performance optimizations
  optimizePerformance();

  // Add category switching for enterprise tab
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      switchServiceCategory(category);
    });
  });

  // Track page view
  gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href
  });
});

console.log("🚀 MelHad Investment - Enterprise Features Loaded");
console.log("📊 Analytics & Social Sharing Ready");
console.log("🌟 Sierra Leone's Premier Business Solutions");

// Footer Modal Functions
function openPrivacyPolicy() {
  openFooterModal('privacyPolicyModal');
}

function openTermsOfService() {
  openFooterModal('termsOfServiceModal');
}

function openRefundPolicy() {
  openFooterModal('refundPolicyModal');
}

function openCookiePolicy() {
  openFooterModal('cookiePolicyModal');
}

function openSupportCenter() {
  openFooterModal('supportCenterModal');
}

function openDataProtection() {
  openFooterModal('dataProtectionModal');
}

function openAccessibility() {
  openFooterModal('accessibilityModal');
}

function openFooterModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeFooterModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});

// Dashboard and Login Functions
function openDashboard() {
  // Check if user is logged in and is admin
  const authToken = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');

  if (!authToken) {
    // User not logged in, open login modal
    openLoginModal();
    return;
  }

  if (userRole !== 'admin') {
    // User not admin, show error
    showErrorMessage('Access denied. Dashboard is only available for administrators.', 'error');
    return;
  }

  // User is admin, redirect to dashboard
  window.location.href = '/dashboard.html';
}

function openLoginModal() {
  // Create and show login modal
  const modal = document.createElement('div');
  modal.id = 'loginModal';
  modal.className = 'modal active';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Admin Login</h3>
        <button class="close-btn" onclick="closeLoginModal()">&times;</button>
      </div>
      <div class="modal-body">
        <form id="quickLoginForm" onsubmit="handleQuickLogin(event)">
          <div class="form-group">
            <label for="loginUsername">Username</label>
            <input type="text" id="loginUsername" name="username" required value="Fuhad">
          </div>
          <div class="form-group">
            <label for="loginPassword">Password</label>
            <input type="password" id="loginPassword" name="password" required value="melhad@1">
          </div>
          <button type="submit" class="auth-btn primary">
            <span class="btn-text">Login</span>
            <div class="btn-loader" style="display: none;">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
          </button>
        </form>
        <div id="loginMessage" class="auth-message" style="display: none;"></div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = 'auto';
  }
}

function handleQuickLogin(event) {
  event.preventDefault();

  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  // Production credentials check
  if (username === 'Fuhad' && password === 'melhad@1') {
    // Store admin session
    localStorage.setItem('authToken', 'admin-token-' + Date.now());
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('username', 'Fuhad');

    // Show success message
    showLoginMessage('Login successful! Redirecting to dashboard...', 'success');

    // Close modal and redirect after delay
    setTimeout(() => {
      closeLoginModal();
      window.location.href = '/dashboard.html';
    }, 1500);
  } else {
    showLoginMessage('Invalid credentials. Please try again.', 'error');
  }
}

function showLoginMessage(message, type) {
  const messageEl = document.getElementById('loginMessage');
  if (messageEl) {
    messageEl.textContent = message;
    messageEl.className = `auth-message ${type}`;
    messageEl.style.display = 'block';

    if (type === 'error') {
      setTimeout(() => {
        messageEl.style.display = 'none';
      }, 3000);
    }
  }
}

function showErrorMessage(message, type = 'error') {
  // Create temporary error message
  const errorDiv = document.createElement('div');
  errorDiv.className = `error-toast ${type}`;
  errorDiv.innerHTML = `
    <div class="error-content">
      <i class="fas fa-exclamation-circle"></i>
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()">&times;</button>
    </div>
  `;

  document.body.appendChild(errorDiv);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentElement) {
      errorDiv.remove();
    }
  }, 5000);
}

function showSuccessMessage(message, type = 'success') {
  // Create professional success message
  const successDiv = document.createElement('div');
  successDiv.className = `success-toast ${type}`;
  successDiv.innerHTML = `
    <div class="success-content">
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()">&times;</button>
    </div>
  `;

  document.body.appendChild(successDiv);

  // Auto remove after 8 seconds for success messages
  setTimeout(() => {
    if (successDiv.parentElement) {
      successDiv.remove();
    }
  }, 8000);
}

// Scroll Button Functionality
document.addEventListener('DOMContentLoaded', function() {
  initializeScrollButtons();
});

function initializeScrollButtons() {
  const backToTop = document.getElementById('backToTop');
  const backToBottom = document.getElementById('backToBottom');

  if (!backToTop || !backToBottom) return;

  // Show/hide buttons based on scroll position
  function updateScrollButtons() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;

    // Show back to top when scrolled down more than 20%
    if (scrollPercent > 20) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Show back to bottom when not at the bottom (less than 80% scrolled)
    if (scrollPercent < 80) {
      backToBottom.classList.add('visible');
    } else {
      backToBottom.classList.remove('visible');
    }
  }

  // Smooth scroll to top
  backToTop.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Add click animation
    this.classList.add('animate');
    setTimeout(() => this.classList.remove('animate'), 600);
  });

  // Smooth scroll to bottom
  backToBottom.addEventListener('click', function() {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });

    // Add click animation
    this.classList.add('animate');
    setTimeout(() => this.classList.remove('animate'), 600);
  });

  // Listen for scroll events
  window.addEventListener('scroll', updateScrollButtons);

  // Initial check
  updateScrollButtons();
}

// Enhanced Mobile Menu Functionality
function toggleMobileMenu() {
  const overlay = document.getElementById('mobileMenuOverlay');
  const hamburger = document.querySelector('.hamburger-menu');

  if (!overlay || !hamburger) return;

  const isActive = overlay.classList.contains('active');

  if (isActive) {
    // Close menu
    overlay.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';

    // Add close animation
    setTimeout(() => {
      overlay.style.pointerEvents = 'none';
    }, 300);
  } else {
    // Open menu
    overlay.style.pointerEvents = 'auto';
    overlay.classList.add('active');
    hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Add entrance animation to nav links
    const navLinks = document.querySelectorAll('.mobile-nav-link');
    navLinks.forEach((link, index) => {
      link.style.animation = 'none';
      setTimeout(() => {
        link.style.animation = `slideInLeft 0.3s ease forwards`;
        link.style.animationDelay = `${index * 0.1}s`;
      }, 100);
    });
  }
}

function closeMobileMenu() {
  const overlay = document.getElementById('mobileMenuOverlay');
  const hamburger = document.querySelector('.hamburger-menu');

  if (overlay && hamburger) {
    overlay.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';

    setTimeout(() => {
      overlay.style.pointerEvents = 'none';
    }, 300);
  }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
  const overlay = document.getElementById('mobileMenuOverlay');
  const hamburger = document.querySelector('.hamburger-menu');
  const menuContent = document.querySelector('.mobile-menu-content');

  if (overlay && overlay.classList.contains('active')) {
    if (!menuContent.contains(e.target) && !hamburger.contains(e.target)) {
      closeMobileMenu();
    }
  }
});

// Add slide in animation keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInLeft {
    0% {
      opacity: 0;
      transform: translateX(-30px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(style);

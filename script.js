/**
 * Tejas Teke Portfolio - Interactive Scripts
 * Features: Light/Dark Mode, Smooth scroll and scroll animations, Contact Form
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initScrollAnimations();
  initContactForm();
  initResumeTracking();
});

/* ==========================================
   1. THEME SWITCHER (DARK / LIGHT MODE)
   ========================================== */
function initTheme() {
  const themeBtn = document.getElementById('theme-btn');
  const themeIcon = themeBtn.querySelector('i');
  
  // Check localStorage or system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  
  let currentTheme = 'dark'; // default
  if (savedTheme) {
    currentTheme = savedTheme;
  } else if (systemPrefersLight) {
    currentTheme = 'light';
  }
  
  // Apply theme
  applyTheme(currentTheme);
  
  // Toggle click event
  themeBtn.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
  });
  
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    
    if (theme === 'light') {
      themeIcon.className = 'fa-solid fa-sun';
      themeBtn.style.color = '#e28743'; // Warm accent for sun
    } else {
      themeIcon.className = 'fa-solid fa-moon';
      themeBtn.style.color = ''; // Reset
    }
  }
}

/* ==========================================
   2. MOBILE NAVIGATION MENU
   ========================================== */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link-item');
  const mobileIcon = mobileBtn.querySelector('i');
  
  mobileBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    if (navMenu.classList.contains('active')) {
      mobileIcon.className = 'fa-solid fa-xmark';
    } else {
      mobileIcon.className = 'fa-solid fa-bars';
    }
  });
  
  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileIcon.className = 'fa-solid fa-bars';
    });
  });

  // Highlight active navbar link on scroll
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });

    // Add scroll class to header for styling
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================
   3. SCROLL REVEAL & SKILLS PROGRESS ANIMATION
   ========================================== */
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        
        // Trigger specific sub-animations
        if (entry.target.id === 'skills') {
          animateSkills();
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  fadeElements.forEach(el => observer.observe(el));
  
  // Separate observer for Skills section specifically
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateSkills();
        skillsObserver.disconnect();
      }
    }, { threshold: 0.1 });
    skillsObserver.observe(skillsSection);
  }

  function animateSkills() {
    // Fill skill bars
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    skillBars.forEach(bar => {
      const targetPct = bar.getAttribute('data-pct');
      bar.style.width = `${targetPct}%`;
    });
    
    // Animate LeetCode circle path
    const leetCircle = document.getElementById('leetcode-circle');
    if (leetCircle) {
      const pct = 0.8;
      const radius = 45;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (pct * circumference);
      leetCircle.style.strokeDashoffset = offset;
    }
  }
}

/* ==========================================
   4. CONTACT FORM SUBMISSION
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-msg-feedback');
  const submitBtn = document.getElementById('btn-submit-form');
  
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Save original button content
    const originalBtnHTML = submitBtn.innerHTML;
    
    // Update button to loading state
    submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-circle-notch fa-spin"></i>';
    submitBtn.disabled = true;
    
    // Read input fields
    const name = document.getElementById('form-name').value.trim();
    const company = document.getElementById('form-company').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const role = document.getElementById('form-role').value;
    const message = document.getElementById('form-message').value.trim();
    
    // Google Form endpoint and Field Entry IDs mapping
    const googleFormActionUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSetpYUXG6sMvpvvCfZLo8HSx-9w85KZ03ls86l0WCyn1YxKJw/formResponse';
    
    const formData = new URLSearchParams();
    formData.append('entry.2107981272', name);         // Name (Required)
    formData.append('entry.1587445071', company);      // Company Name ? (Required)
    formData.append('entry.1771514759', email);        // Email ? (Required)
    formData.append('entry.1662415434', role);         // Job Opportunity / Role ? (Required)
    formData.append('entry.1822200156', message);       // Message ? (Optional)

    // Submit via fetch with no-cors mode
    fetch(googleFormActionUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    })
    .then(() => {
      // In no-cors mode, we can't inspect response contents, but successful connection triggers .then
      feedback.className = 'form-feedback success';
      feedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, <strong>${name}</strong>! Your message was submitted successfully to Tejas's workspace.`;
      feedback.style.display = 'block';
      
      // Reset the form
      form.reset();
    })
    .catch((error) => {
      console.error('Google Form Submission Error:', error);
      feedback.className = 'form-feedback error';
      feedback.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Error sending message. Please try again.';
      feedback.style.display = 'block';
    })
    .finally(() => {
      // Restore button state
      submitBtn.innerHTML = originalBtnHTML;
      submitBtn.disabled = false;
      
      // Auto-hide feedback after 6 seconds
      setTimeout(() => {
        feedback.style.display = 'none';
      }, 6000);
    });
  });
}

/* ==========================================
   5. RESUME DOWNLOAD TRACKER (MODAL)
   ========================================== */
function initResumeTracking() {
  const resumeBtn = document.getElementById('btn-hero-resume');
  const modal = document.getElementById('resume-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const submitBtn = document.getElementById('btn-submit-download');
  const nameInput = document.getElementById('resume-visitor-name');
  
  if (!resumeBtn || !modal) return;

  // Open modal
  resumeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('active');
    nameInput.focus();
  });

  // Close modal functions
  const closeModal = () => {
    modal.classList.remove('active');
    nameInput.value = '';
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Submit and download
  submitBtn.addEventListener('click', () => {
    const visitorName = nameInput.value.trim() || 'Anonymous Visitor';
    const googleFormActionUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSetpYUXG6sMvpvvCfZLo8HSx-9w85KZ03ls86l0WCyn1YxKJw/formResponse';
    
    // Change button text while loading
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Preparing...';
    submitBtn.disabled = true;

    const formData = new URLSearchParams();
    formData.append('entry.2107981272', visitorName);                 // Name
    formData.append('entry.1587445071', 'Resume Download Modal');     // Company Name
    formData.append('entry.1771514759', 'tejasteke2001@gmail.com');   // Email
    formData.append('entry.1662415434', 'Resume Download Tracker');   // Role
    formData.append('entry.1822200156', `${visitorName} has downloaded your resume! 🎉`); // Message

    // Submit silently then open download
    fetch(googleFormActionUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    }).finally(() => {
      // Restore button and close modal
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      closeModal();
      
      // Open the resume in a new tab
      window.open('https://drive.google.com/file/d/1JNjsJ7Kr3EM6Y7_XKfrgN91KZqWoafqg/view?usp=drive_link', '_blank');
    });
  });
}

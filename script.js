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
  initLinkTracking();
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
  const emailInput = document.getElementById('resume-visitor-email');
  
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
    if (emailInput) emailInput.value = '';
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Submit and download
  submitBtn.addEventListener('click', () => {
    const visitorName = nameInput.value.trim() || 'Anonymous Visitor';
    const visitorEmail = emailInput && emailInput.value.trim() ? emailInput.value.trim() : 'Not provided';
    const googleFormActionUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSetpYUXG6sMvpvvCfZLo8HSx-9w85KZ03ls86l0WCyn1YxKJw/formResponse';
    
    // Change button text while loading
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Preparing...';
    submitBtn.disabled = true;

    const formData = new URLSearchParams();
    formData.append('entry.2107981272', visitorName);                 // Name
    formData.append('entry.1587445071', 'Resume Download Modal');     // Company Name
    formData.append('entry.1771514759', visitorEmail);                // Email
    formData.append('entry.1662415434', 'Resume Download Tracker');   // Role
    formData.append('entry.1822200156', `${visitorName} (${visitorEmail}) has downloaded your resume! 🎉`); // Message

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
      
      // Trigger local download
      const link = document.createElement('a');
      link.href = 'Tejas_Teke_DataAnalyst.pdf';
      link.download = 'Tejas_Teke_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });
}

/* ==========================================
   6. ADVANCED TRACKING (VISITOR, TIME, CLICKS)
   ========================================== */
function initLinkTracking() {
  const googleFormActionUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeLSu4jAIPjfjDc4gnCaexYqwQYLG1d4UbX4TVDpQMDmXefPA/formResponse';
  
  // 1. Visitor ID
  let visitorId = localStorage.getItem('portfolio_visitor_id');
  if (!visitorId) {
    visitorId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('portfolio_visitor_id', visitorId);
  }

  // 2. Referrer
  const referrer = document.referrer ? new URL(document.referrer).hostname : 'Direct';

  // 3. Device & OS/Browser
  const ua = navigator.userAgent;
  let deviceType = 'Desktop';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    deviceType = 'Mobile';
  } else if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    deviceType = 'Tablet';
  }
  
  let browserOs = 'Unknown Browser / OS';
  if (ua.indexOf("Win") !== -1) browserOs = "Windows";
  if (ua.indexOf("Mac") !== -1) browserOs = "MacOS";
  if (ua.indexOf("Linux") !== -1) browserOs = "Linux";
  if (ua.indexOf("Android") !== -1) browserOs = "Android";
  if (ua.indexOf("like Mac") !== -1) browserOs = "iOS";
  
  if (ua.includes('Chrome')) browserOs += ' / Chrome';
  else if (ua.includes('Safari')) browserOs += ' / Safari';
  else if (ua.includes('Firefox')) browserOs += ' / Firefox';
  else if (ua.includes('Edge')) browserOs += ' / Edge';

  // 4. Location
  let userLocation = 'Fetching...';
  fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(data => {
      userLocation = `${data.city || 'Unknown'}, ${data.country_name || 'Unknown'}`;
    })
    .catch(() => {
      userLocation = 'Unavailable';
    });

  // 5. Scroll Depth & Time
  const startTime = Date.now();
  let maxScroll = 0;
  
  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight > 0) {
      const scrollPct = (window.scrollY / docHeight) * 100;
      if (scrollPct > maxScroll) maxScroll = scrollPct;
    }
  });

  // Helper to send data
  const sendAnalytics = (eventType, linkDetails = '') => {
    const timeSpentSecs = Math.round((Date.now() - startTime) / 1000);
    const formData = new URLSearchParams();
    
    // New Form Fields Mapping
    formData.append('entry.694495026', visitorId);
    formData.append('entry.1122240091', referrer);
    formData.append('entry.1061150014', userLocation);
    formData.append('entry.663726650', deviceType);
    formData.append('entry.1991648132', browserOs);
    formData.append('entry.126292303', `${timeSpentSecs} seconds`);
    formData.append('entry.1231190843', `${Math.round(maxScroll)}%`);
    
    let actionStr = eventType;
    if (linkDetails) {
      actionStr = `Clicked: ${linkDetails}`;
    }
    formData.append('entry.718984768', actionStr);

    fetch(googleFormActionUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    }).catch(e => console.error(e));
  };

  // 6. Track Page Exit
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendAnalytics('Page Exit');
    }
  });

  // 7. Track Link Clicks
  const trackLinks = document.querySelectorAll('.project-link, .social-link');
  trackLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const clickedUrl = link.href;
      let projectName = clickedUrl;
      try {
        const urlObj = new URL(clickedUrl);
        const host = urlObj.hostname.toLowerCase();
        
        if (host.includes('linkedin.com')) projectName = 'linkedin';
        else if (host.includes('mail.google.com')) projectName = 'email';
        else {
          const segments = urlObj.pathname.split('/').filter(p => p);
          if (segments.length > 0) projectName = segments.pop();
          
          if (host.includes('github.com') && projectName === 'tejasteke') projectName = 'github';
          else if (host.includes('github.io')) projectName += ' Live Site';
        }
      } catch (err) {}
      
      const clickTime = new Date().toLocaleTimeString();
      sendAnalytics('Link Click', `${projectName} at ${clickTime}`);
    });
  });
}

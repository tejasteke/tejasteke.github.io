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

  // 5. Scroll Depth & Active Time
  let totalActiveTime = 0;
  let lastVisibleTime = Date.now();
  
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      lastVisibleTime = Date.now();
    } else {
      totalActiveTime += (Date.now() - lastVisibleTime);
    }
  });

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
    let currentActive = totalActiveTime;
    if (document.visibilityState === 'visible') {
      currentActive += (Date.now() - lastVisibleTime);
    }
    const timeSpentSecs = Math.round(currentActive / 1000);
    
    const formData = new URLSearchParams();
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

    // Use keepalive for pagehide/unload reliability
    fetch(googleFormActionUrl, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    }).catch(e => console.error(e));
  };

  // 7. Track Link Clicks & Interactions
  const clickedLinks = [];
  
  // Helper to log interaction time
  const trackInteraction = (name) => {
    const dateTime = new Date().toLocaleString();
    clickedLinks.push(`${name} on ${dateTime}`);
  };

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
      
      trackInteraction(projectName);
    });
  });

  // Track Profile Photo Interactions
  const profileImg = document.querySelector('.hero-profile-img');
  if (profileImg) {
    // Track right-click (usually for save image as)
    profileImg.addEventListener('contextmenu', () => trackInteraction('Profile Photo Save/Right-Click'));
    
    // Track copy event
    profileImg.addEventListener('copy', () => trackInteraction('Profile Photo Copy'));
    
    // Track zoom / interact (clicks or first hover)
    profileImg.addEventListener('click', () => trackInteraction('Profile Photo Zoom/Click'));
    let hoverTracked = false;
    profileImg.addEventListener('mouseenter', () => {
      if (!hoverTracked) {
        trackInteraction('Profile Photo Hover/Zoom');
        hoverTracked = true; // only track hover once per session to avoid spam
      }
    });
  }

  // Track Resume Download
  const resumeBtn = document.getElementById('btn-hero-resume');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => trackInteraction('Opened Resume Modal'));
  }
  const submitResumeBtn = document.getElementById('btn-submit-download');
  if (submitResumeBtn) {
    submitResumeBtn.addEventListener('click', () => trackInteraction('Downloaded Resume'));
  }

  // 6. Track Page Exit & Auto-Save
  const submitSession = (reason) => {
    let currentActive = totalActiveTime;
    if (document.visibilityState === 'visible') {
      currentActive += (Date.now() - lastVisibleTime);
    }
    
    // Avoid spamming empty logs if left open in background for hours
    if (currentActive < 5000 && clickedLinks.length === 0 && reason !== 'Page Exit') {
      // Just reset the timers and wait for real activity
      totalActiveTime = 0;
      lastVisibleTime = Date.now();
      return;
    }

    let actionStr = reason;
    if (clickedLinks.length > 0) {
      const formattedClicks = clickedLinks.map((link, idx) => `${idx + 1}. ${link}`).join('\n');
      actionStr += `\n\n--- Interactions ---\n${formattedClicks}`;
    }
    
    sendAnalytics(actionStr);
    
    // Reset session variables so the next hour/session starts fresh
    clickedLinks.length = 0;
    totalActiveTime = 0;
    maxScroll = 0;
    lastVisibleTime = Date.now();
  };

  // Run the auto-save every 1 hour (3600000 milliseconds)
  const ONE_HOUR = 60 * 60 * 1000;
  setInterval(() => {
    submitSession('1 Hour Auto-Save');
  }, ONE_HOUR);

  let hasSentExit = false;
  window.addEventListener('pagehide', () => {
    if (!hasSentExit) {
      submitSession('Page Exit');
      hasSentExit = true;
    }
  });
}

// Mobile menu toggle
function toggleMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
}

function closeMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.classList.remove('active');
  mobileMenu.classList.remove('active');
}

// Form validation
function validateForm(data) {
  const errors = [];

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Please enter a valid name (minimum 2 characters)');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push('Please enter a valid email address');
  }

  // Phone validation (basic)
  const phoneRegex = /^\d{10,}$/;
  if (!data.contactNumber || !phoneRegex.test(data.contactNumber.replace(/[^0-9]/g, ''))) {
    errors.push('Please enter a valid contact number (minimum 10 digits)');
  }

  // Message validation
  if (!data.message || data.message.trim().length < 10) {
    errors.push('Please enter a detailed message (minimum 10 characters)');
  }

  return errors;
}

// Show message 
function showMessage(type, content) {
  const successMsg = document.getElementById('successMsg');
  const errorMsg = document.getElementById('errorMsg');
  const formMessages = document.getElementById('formMessages');

  // Reset messages
  successMsg.innerHTML = '';
  errorMsg.innerHTML = '';
  formMessages.style.display = 'block';

  if (type === 'success') {
    successMsg.innerHTML = content;
    successMsg.style.display = 'block';
    errorMsg.style.display = 'none';

    // Hide success message after 5 seconds
    setTimeout(() => {
      formMessages.style.display = 'none';
      successMsg.style.display = 'none';
    }, 5000);
  } else {
    errorMsg.innerHTML = Array.isArray(content) ? content.join('<br>') : content;
    errorMsg.style.display = 'block';
    successMsg.style.display = 'none';
  }
}

// Contact form submission
async function handleSubmit(event) {
  event.preventDefault();

  // Get form elements
  const form = event.target;
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // Validate form
  const errors = validateForm(data);
  if (errors.length > 0) {
    showMessage('error', errors);
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  submitBtnText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  try {
    // Make API call
    const response = await fetch('https://chikit360-backend.thundergits.com/inquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to submit inquiry. Please try again later.');
    }

    // Show success message
    showMessage('success', 'Thank you for your message! We\'ll get back to you soon.');
    form.reset();

  } catch (error) {
    showMessage('error', error.message);
    console.error('Form submission error:', error);
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    submitBtnText.innerHTML = 'Submit Inquiry';
  }
}

// Attach form submit handler
document.getElementById('inquiryForm').addEventListener('submit', handleSubmit);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add scroll effect to header
window.addEventListener('scroll', function () {
  const header = document.querySelector('header');
  if (window.scrollY > 100) {
    header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
  } else {
    header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  }
});

// Add intersection observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .step, .testimonial-card, .pricing-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
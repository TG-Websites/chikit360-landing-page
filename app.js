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



const container = document.getElementById('plans-container');

async function fetchPlans() {
  const res = await fetch('https://chikit360-backend.thundergits.com/offers-plan');
  const plans = await res.json();

  plans.data.forEach(plan => renderPlan(plan));
}

function renderPlan(plan) {
  const wrapper = document.createElement('div');
  wrapper.className = 'plan-card';
  wrapper.id = plan.id;

  if (plan.popular) {
    const popularTag = document.createElement('div');
    popularTag.className = 'popular-tag';
    popularTag.textContent = 'MOST POPULAR';
    wrapper.appendChild(popularTag);
  }

  let schemeIndex = 0;
  const schemes = plan.scheme || [];

  // Plan header
  wrapper.innerHTML = `
                <h2 class="plan-title">${plan.name}</h2>
                <p class="description">${plan.description || ''}</p>
                <div class="setup-price">
                    <i class="fas fa-tools"></i> Setup Fee: ₹${plan.initialSetUpPrice}
                </div>
            `;

  // Scheme slider
  const schemeSlider = document.createElement('div');
  schemeSlider.className = 'scheme-box';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'arrow-btn';
  prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'arrow-btn';
  nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';

  const schemeDisplay = document.createElement('div');
  schemeDisplay.className = 'scheme-price';

  function updateScheme() {
    const scheme = schemes[schemeIndex];
    schemeDisplay.innerHTML = `
                    <div class="price">₹${scheme.price}</div>
                    <div class="details">For ${scheme.validityInDays} Days</div>
                    ${scheme.discount ? `<div class="discount">${scheme.discount}% OFF</div>` : ''}
                `;
  }

  prevBtn.onclick = () => {
    schemeIndex = (schemeIndex - 1 + schemes.length) % schemes.length;
    updateScheme();
  };

  nextBtn.onclick = () => {
    schemeIndex = (schemeIndex + 1) % schemes.length;
    updateScheme();
  };

  schemeSlider.appendChild(prevBtn);
  schemeSlider.appendChild(schemeDisplay);
  schemeSlider.appendChild(nextBtn);
  updateScheme();
  wrapper.appendChild(schemeSlider);

  // Features
  if (plan.features?.length) {
    const features = document.createElement('div');
    features.className = 'features';
    features.innerHTML = `
                    <h3>Features Included</h3>
                    <ul>
                        ${plan.features.map(f => `
                            <li>
                                <i class="fas fa-check"></i>
                                <span>${f.label}</span>
                            </li>
                        `).join('')}
                    </ul>
                `;
    wrapper.appendChild(features);
  }

  // Add-ons
  if (plan.extraAddOn?.length) {
    const addons = document.createElement('div');
    addons.className = 'addons';
    addons.innerHTML = `
                    <h4>Extra Add Ons</h4>
                `;

    const ul = document.createElement('ul');
    plan.extraAddOn.forEach(addOn => {
      const li = document.createElement('li');
      li.className = 'addon-item';
      li.innerHTML = `
                        <div class="addon-title">${addOn.title}</div>
                        <div class="addon-price">₹${addOn.price}</div>
                    `;
      ul.appendChild(li);
    });

    addons.appendChild(ul);
    wrapper.appendChild(addons);
  }

  // Subscribe button
  const subscribeBtn = document.createElement('div');
  subscribeBtn.className = 'subscribe-btn';
  subscribeBtn.innerHTML = `
                <button class="btn">
                    <i class="fas fa-shopping-cart"></i> Subscribe to ${plan.name}
                </button>
            `;
  subscribeBtn.querySelector('.btn').onclick = () => {
    alert(`Subscribed to ${plan.name} plan!`);
  };
  wrapper.appendChild(subscribeBtn);

  container.appendChild(wrapper);
}

fetchPlans();






document.querySelector(".btn-cta-secondary").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("demoModal").style.display = "block";
});

// Close modal
function closeModal() {
  document.getElementById("demoModal").style.display = "none";
  document.getElementById("demoForm").reset();
  document.getElementById("formMessage").textContent = "";
}

// Form submission
document.getElementById("demoForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const message = document.getElementById("message").value.trim();
  const date = document.getElementById("datetime").value;

  const msg = document.getElementById("formMessage");
  msg.textContent = "Sending...";
  msg.className = "message";

  try {
    const res = await fetch('https://chikit360-backend.thundergits.com/inquiries', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        contactNumber: mobile,
        message,
        preferredDate: date,
        inquiryType: "demo"
      })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Something went wrong.");

    msg.textContent = "Demo scheduled successfully!";
    msg.className = "message success";

    setTimeout(() => {
      closeModal();
    }, 2000);
  } catch (err) {
    msg.textContent = err.message;
    msg.className = "message error";
  }
});


// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("demoModal");
  if (event.target === modal) {
    closeModal();
  }
}

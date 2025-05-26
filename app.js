
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

      // Contact form submission
      function handleSubmit(event) {
        event.preventDefault();
        
        // Get form data
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        // Show success message
        alert('Thank you for your message! We\'ll get back to you soon.');
        
        // Reset form
        event.target.reset();
      }

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
      window.addEventListener('scroll', function() {
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

      const observer = new IntersectionObserver(function(entries) {
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
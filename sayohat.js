// script.js - oddiy interaktivlik

// Navbar toggle (mobil)
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
navToggle.addEventListener('click', () => {
  if(navList.style.display === 'flex') {
    navList.style.display = 'none';
  } else {
    navList.style.display = 'flex';
    navList.style.flexDirection = 'column';
    navList.style.gap = '8px';
  }
});

// Form submit — demo (AJAX yo'q, faqat UI)
const contactForm = document.getElementById('contactForm');
const formResult = document.getElementById('formResult');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  if(!name){
    formResult.style.color = 'crimson';
    formResult.innerText = 'Iltimos, ismni kiriting.';
    return;
  }
  // Bu yerga haqiqiy backend bo'lsa fetch() bilan yuboriladi.
  formResult.style.color = 'green';
  formResult.innerText = `Rahmat, ${name}! Xabaringiz qabul qilindi.`;
  contactForm.reset();
});

// // Telefon raqamiga bosilganda xabar chiqarish
// const telLink = document.querySelector('.aloqa-link[href^="tel"]');
// if (telLink) {
//   telLink.addEventListener('click', () => {
//     alert("Telefon raqamiga qo'ng'iroq qilmoqchisiz!");
//   });
// }

// // Email ustiga bosilganda emailni clipboardga nusxalash
// const emailLink = document.querySelector('.aloqa-link[href^="mailto"]');
// if (emailLink) {
//   emailLink.addEventListener('click', (e) => {
//     e.preventDefault(); // brauzer ochilmasin
//     const email = emailLink.getAttribute("href").replace("mailto:", "");
//     navigator.clipboard.writeText(email);
//     alert("Email manzil nusxalandi:\n" + email);
//   });
// }

// script.js
document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------
     1) Scroll animatsiyasi: Aloqa bo'limi
     ----------------------- */
  const aosElems = document.querySelectorAll('.aloqa-section, .aloqa-item, .contact, #aloqa');
  // Berilgan elementlarga boshlang'ich style beramiz (agar CSS bunday qilmagan bo'lsa)
  aosElems.forEach(el => {
    el.style.opacity = el.style.opacity || '0';
    el.style.transform = el.style.transform || 'translateY(24px)';
    el.style.transition = el.style.transition || 'opacity 600ms ease, transform 600ms cubic-bezier(.2,.9,.2,1)';
    el.dataset._aos = 'init';
  });

  // IntersectionObserver - element ko'rinishga kirganda animatsiya
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.dataset._aos = 'shown';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    aosElems.forEach(el => obs.observe(el));
  } else {
    // Eskirgan brauzerlar uchun fallback — darhol ko'rsatish
    aosElems.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }

  /* -----------------------
     2) Social ikonalar float effekti
     ----------------------- */
  const socials = Array.from(document.querySelectorAll('.social-link'));
  let start = performance.now();
  // Amplituda va tezlik sozlanadi
  const amplitude = 6;    // maksimal px ga siljish (kam qiymat)
  const speed = 0.0018;   // harakat tezligi (kichik => sekin)

  // Mark hovered state to pause float
  socials.forEach((el, i) => {
    el.dataset._floatIndex = i;
    el.addEventListener('mouseenter', () => el.dataset._hover = '1');
    el.addEventListener('mouseleave', () => delete el.dataset._hover);
  });

  function tick(now) {
    const t = now - start;
    socials.forEach((el, i) => {
      if (el.dataset._hover) {
        el.style.transform = 'translateY(0)'; // hoverda to'xtat
        return;
      }
      // Har bir ikonaga biroz farq beramiz (fase)
      const phase = i * 0.7;
      const y = Math.sin((t * speed) + phase) * amplitude;
      el.style.transform = `translateY(${y}px)`;
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* -----------------------
     3) Popup (Yuborildi) yaratish funksiyasi
     ----------------------- */
  function showPopup(message = 'Yuborildi', duration = 2000) {
    // agar allaqachon popup bo'lsa, o'zgartiramiz
    let popup = document.querySelector('.__js_form_popup');
    if (!popup) {
      popup = document.createElement('div');
      popup.className = '__js_form_popup';
      // Inline style (CSS o'zgartirmaslik uchun)
      popup.style.position = 'fixed';
      popup.style.bottom = '28px';
      popup.style.left = '50%';
      popup.style.transform = 'translateX(-50%)';
      popup.style.padding = '10px 16px';
      popup.style.background = 'linear-gradient(90deg,#10b981,#06b6d4)';
      popup.style.color = '#fff';
      popup.style.borderRadius = '10px';
      popup.style.boxShadow = '0 10px 30px rgba(2,6,23,0.2)';
      popup.style.fontWeight = '700';
      popup.style.zIndex = '9999';
      popup.style.opacity = '0';
      popup.style.transition = 'opacity 260ms ease, transform 260ms cubic-bezier(.2,.9,.2,1)';
      document.body.appendChild(popup);
    }
    popup.textContent = message;
    // show
    requestAnimationFrame(() => {
      popup.style.opacity = '1';
      popup.style.transform = 'translateX(-50%) translateY(0)';
    });
    // hide after duration
    setTimeout(() => {
      popup.style.opacity = '0';
      popup.style.transform = 'translateX(-50%) translateY(8px)';
      // remove after transition
      setTimeout(() => {
        if (popup && popup.parentNode) popup.parentNode.removeChild(popup);
      }, 300);
    }, duration);
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      // show quick client-side popup (optimistic)
      showPopup('Xabaringiz yuborildi — iltimos kuting...', 1600);
      // Do NOT call e.preventDefault() so the form will submit to server (PHP)
    });
  }

  // If server-side PHP already rendered a result into #formResult, show popup
  const formResult = document.getElementById('formResult');
  if (formResult && formResult.textContent.trim().length > 0) {
    // short delay so user sees the text and popup
    setTimeout(() => {
      showPopup(formResult.textContent.trim(), 2200);
    }, 500);
  }

  const telLinks = document.querySelectorAll('.aloqa-link[href^="tel:"]');
  telLinks.forEach(a => {
    a.addEventListener('click', () => {
      // do not prevent default — phone call will start on mobile
      showPopup('⟲ Telefonni terish uchun tayyor...', 1200);
    });
  });
  const mailLinks = document.querySelectorAll('.aloqa-link[href^="mailto:"]');
  mailLinks.forEach(a => {
    a.addEventListener('click', (ev) => {
      // attempt to copy email to clipboard (non-blocking)
      const mail = a.getAttribute('href').replace(/^mailto:/, '');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(mail).then(() => {
          showPopup('Email manzil nusxalandi: ' + mail, 1600);
        }).catch(() => {
          // fallback: show message only
          showPopup('Emailga otiladi: ' + mail, 1400);
        });
      } else {
        showPopup('Emailga otiladi: ' + mail, 1400);
      }
      // let the mailto still open (do not preventDefault)
    });
  });

});

// Footer yilini to'ldirish
document.getElementById('year').innerText = new Date().getFullYear();

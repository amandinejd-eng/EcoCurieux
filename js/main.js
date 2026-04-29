// Gestion des dropdowns du menu navigation
(function() {
  const navItems = document.querySelectorAll('.nav-links > li');
  let closeTimers = new Map();

  function getOpenTransform() {
    return 'translateX(-50%) translateY(0)';
  }
  function getCloseTransform() {
    return 'translateX(-50%) translateY(-8px)';
  }

  function closeDropdown(li, dropdown) {
    dropdown.style.opacity = '0';
    dropdown.style.pointerEvents = 'none';
    dropdown.style.transform = getCloseTransform(li);
  }

  navItems.forEach(function(li) {
    const dropdown = li.querySelector('.dropdown');
    if (!dropdown) return;

    li.addEventListener('mouseenter', function() {
      if (closeTimers.has(li)) {
        clearTimeout(closeTimers.get(li));
        closeTimers.delete(li);
      }
      // Fermer les autres dropdowns
      navItems.forEach(function(other) {
        if (other !== li) {
          var otherDd = other.querySelector('.dropdown');
          if (otherDd) {
            closeDropdown(other, otherDd);
            if (closeTimers.has(other)) {
              clearTimeout(closeTimers.get(other));
              closeTimers.delete(other);
            }
          }
        }
      });
      dropdown.style.opacity = '1';
      dropdown.style.pointerEvents = 'all';
      dropdown.style.transform = getOpenTransform(li);
    });

    dropdown.addEventListener('mouseleave', function(e) {
      const relatedTarget = e.relatedTarget;
      if (!li.contains(relatedTarget)) {
        closeDropdown(li, dropdown);
        if (closeTimers.has(li)) {
          clearTimeout(closeTimers.get(li));
          closeTimers.delete(li);
        }
      }
    });

    li.addEventListener('mouseleave', function(e) {
      const relatedTarget = e.relatedTarget;
      if (!li.contains(relatedTarget)) {
        const timer = setTimeout(function() {
          closeDropdown(li, dropdown);
          closeTimers.delete(li);
        }, 300);
        closeTimers.set(li, timer);
      }
    });
  });
})();

function toggleMenu() {
  var menu = document.getElementById('mobileMenu');
  var isOpen = menu.classList.contains('open');
  if (!isOpen) {
    document.body.dataset.scrollY = window.scrollY;
    document.body.classList.add('menu-open');
    document.body.style.top = '-' + window.scrollY + 'px';
  } else {
    document.body.classList.remove('menu-open');
    document.body.style.top = '';
    window.scrollTo(0, parseInt(document.body.dataset.scrollY || '0'));
  }
  menu.classList.toggle('open');
}

async function sendContactForm() {
  const nameEl = document.getElementById('userName');
  const emailEl = document.getElementById('userEmail');
  const projectTypeEl = document.getElementById('projectType');
  const messageEl = document.getElementById('userMessage');
  const hpEl = document.getElementById('contactHp');
  const statusEl = document.getElementById('contactFormStatus');
  const btnEl = document.getElementById('contactSubmitBtn');

  const name = (nameEl && nameEl.value || '').trim();
  const email = (emailEl && emailEl.value || '').trim();
  const projectType = (projectTypeEl && projectTypeEl.value || '').trim();
  const message = (messageEl && messageEl.value || '').trim();
  const hp = (hpEl && hpEl.value || '').trim();

  const activeAudBtn = document.querySelector('#audSelector .aud-btn.active');
  const audience = activeAudBtn ? (activeAudBtn.getAttribute('data-val') || '') : '';

  if (!name || !email || !message) {
    if (statusEl) statusEl.textContent = 'Veuillez remplir votre nom, votre email et votre message.';
    return;
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    if (statusEl) statusEl.textContent = 'Veuillez saisir une adresse email valide.';
    return;
  }

  if (btnEl) btnEl.disabled = true;
  if (statusEl) statusEl.textContent = 'Envoi en cours…';

  try {
    const resp = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, projectType, message, audience, hp })
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data || data.ok !== true) {
      if (statusEl) statusEl.textContent = "Une erreur est survenue. Réessayez dans un instant.";
      return;
    }

    if (statusEl) statusEl.textContent = 'Merci ! Votre demande a bien été envoyée.';
    if (messageEl) messageEl.value = '';
  } catch (e) {
    if (statusEl) statusEl.textContent = "Impossible d'envoyer pour le moment. Vérifiez votre connexion et réessayez.";
  } finally {
    if (btnEl) btnEl.disabled = false;
  }
}

function selectAud(btn) {
  document.querySelectorAll('#audSelector .aud-btn').forEach(function(b) {
    b.classList.remove('active');
  });
  btn.classList.add('active');
}

document.addEventListener('click', function(e) {
  var m = document.getElementById('mobileMenu');
  var h = document.querySelector('.hamburger');
  if (m && m.classList.contains('open') && h && !m.contains(e.target) && !h.contains(e.target)) {
    m.classList.remove('open');
    document.body.classList.remove('menu-open');
    document.body.style.top = '';
    window.scrollTo(0, parseInt(document.body.dataset.scrollY || '0'));
  }
});

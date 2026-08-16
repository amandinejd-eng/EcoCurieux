const MONTHS_FR = [
  'JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
  'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'
];

function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function mediaUrl(path) {
  if (!path) return '';
  return encodeURI(String(path));
}

function parseDateParts(value) {
  const raw = String(value || '').trim();
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    return { year: iso[1], month: iso[2], day: iso[3], raw: iso[0] };
  }
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return {
    year: String(parsed.getFullYear()),
    month: String(parsed.getMonth() + 1).padStart(2, '0'),
    day: String(parsed.getDate()).padStart(2, '0'),
    raw: raw.slice(0, 10)
  };
}

function normalizeEvent(event) {
  if (!event) return event;
  const parts = parseDateParts(event.date);
  if (!parts) return event;
  const monthIndex = parseInt(parts.month, 10) - 1;
  return Object.assign({}, event, {
    date: parts.raw,
    day: parts.day,
    month: MONTHS_FR[monthIndex] || '',
    year: parts.year,
    id: event.id || ('event-' + parts.raw)
  });
}

function parseEventDay(eventDate) {
  const parts = parseDateParts(eventDate);
  if (!parts) return new Date(NaN);
  return new Date(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
}

function isEventPast(eventDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = parseEventDay(eventDate);
  if (Number.isNaN(day.getTime())) return false;
  return day < today;
}

function eventKey(event) {
  return String(event.id || '') + '|' + String(event.date || '') + '|' + String(event.title || '');
}

function collectEvents(data) {
  const merged = [];
  const seen = new Set();
  []
    .concat(data.upcoming || [])
    .concat(data.past || [])
    .concat(data.events || [])
    .map(normalizeEvent)
    .forEach(function (event) {
      const key = eventKey(event);
      if (seen.has(key)) return;
      seen.add(key);
      merged.push(event);
    });
  return merged;
}

async function loadEvents() {
  try {
    const response = await fetch('/evenements.json', { cache: 'no-store' });
    const data = await response.json();
    return collectEvents(data);
  } catch (error) {
    console.error('Erreur lors du chargement des événements:', error);
    return [];
  }
}

function createEventCard(event) {
  const detailsHtml = event.details ?
    `<div style="margin-top:1rem;">
      <div style="display:inline-block;background:var(--green);color:var(--white);padding:0.7rem 1.2rem;border-radius:10px;box-shadow:0 3px 10px rgba(70,123,67,0.25);">
        <span style="font-family:'Montserrat',sans-serif;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;opacity:0.9;">✨ EN PLUS :</span>
        <span style="font-family:'Lora',serif;font-size:0.9rem;margin-left:0.5rem;">${escapeHtml(event.details)}</span>
      </div>
    </div>`
    : '';

  return `
    <div class="upcoming-card" style="background:#ffffff;border-left:5px solid var(--green);border-radius:12px;padding:2rem;margin-bottom:1.5rem;display:flex;gap:2.5rem;align-items:flex-start;transition:all 0.3s ease;flex-wrap:wrap;box-shadow:0 4px 15px rgba(70,123,67,0.1);position:relative;" onmouseover="this.style.boxShadow='0 8px 25px rgba(70,123,67,0.18)';this.style.transform='translateX(5px)';" onmouseout="this.style.boxShadow='0 4px 15px rgba(70,123,67,0.1)';this.style.transform='translateX(0)';">
      <div class="timeline-dot"></div>
      <div class="upcoming-date" style="text-align:left;min-width:100px;display:flex;flex-direction:column;border-right:3px solid var(--green);padding-right:2rem;">
        <div class="upcoming-day" style="font-size:2.8rem;font-weight:900;color:var(--green-dark);line-height:1;font-family:'Montserrat',sans-serif;letter-spacing:-1px;">${escapeHtml(event.day)}</div>
        <div class="upcoming-month" style="font-family:'Montserrat',sans-serif;font-size:0.9rem;font-weight:700;color:var(--green);text-transform:uppercase;margin-top:0.2rem;letter-spacing:1px;">${escapeHtml(event.month)}</div>
        ${event.year ? `<div class="upcoming-year" style="font-family:'Montserrat',sans-serif;font-size:1.1rem;font-weight:800;color:var(--beige-2);margin-top:0.3rem;">${escapeHtml(event.year)}</div>` : ''}
      </div>
      <div class="upcoming-content" style="flex:1;min-width:280px;">
        <h3 style="font-family:'Montserrat',sans-serif;font-size:1.4rem;font-weight:800;color:var(--green-dark);margin:0 0 0.5rem;line-height:1.3;">${escapeHtml(event.title)}</h3>
        <p class="upcoming-location" style="font-size:0.9rem;color:#7a6a50;margin:0 0 1rem;display:flex;align-items:center;gap:0.4rem;font-weight:600;">
          <span style="font-size:1.1rem;">📍</span>
          ${escapeHtml(event.location)}
        </p>
        <button class="upcoming-toggle-btn" onclick="toggleUpcomingCard(this)">
          <span class="utb-icon">👇</span>
          <span class="utb-text">En savoir plus</span>
        </button>
        <div class="upcoming-details-wrap">
          <p style="font-family:'Lora',serif;font-size:1rem;line-height:1.7;color:#5a5040;margin:0;">${escapeHtml(event.description)}</p>
          ${detailsHtml}
        </div>
      </div>
      <div class="upcoming-badges" style="display:flex;flex-direction:column;gap:0.7rem;min-width:160px;">
        ${event.time ? `
        <span class="upcoming-badge" style="display:inline-flex;align-items:center;gap:0.5rem;background:linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%);color:var(--white);padding:9px 15px;border-radius:8px;font-family:'Montserrat',sans-serif;font-size:0.8rem;font-weight:700;box-shadow:0 2px 8px rgba(70,123,67,0.25);">
          <span style="font-size:1rem;">⏰</span>
          ${escapeHtml(event.time)}
        </span>
        ` : ''}
        ${event.audience ? `
        <span class="upcoming-badge" style="display:inline-flex;align-items:center;gap:0.5rem;background:var(--brown);color:var(--white);padding:9px 15px;border-radius:8px;font-family:'Montserrat',sans-serif;font-size:0.8rem;font-weight:700;box-shadow:0 2px 8px rgba(175,106,50,0.25);">
          <span style="font-size:1rem;">👥</span>
          ${escapeHtml(event.audience)}
        </span>
        ` : ''}
        ${event.price ? `
        <span class="upcoming-badge" style="display:inline-flex;align-items:center;gap:0.5rem;background:var(--beige-light);border:1px solid var(--beige-2);color:var(--brown);padding:9px 15px;border-radius:8px;font-family:'Montserrat',sans-serif;font-size:0.8rem;font-weight:700;box-shadow:0 2px 8px rgba(175,106,50,0.15);">
          <span style="font-size:1rem;">🎟️</span>
          ${escapeHtml(event.price)}
        </span>
        ` : ''}
      </div>
    </div>
  `;
}

function toggleUpcomingCard(btn) {
  const card = btn.closest('.upcoming-card');
  card.classList.toggle('expanded');
  const icon = btn.querySelector('.utb-icon');
  const text = btn.querySelector('.utb-text');
  if (card.classList.contains('expanded')) {
    icon.textContent = '👆';
    text.textContent = 'Masquer';
  } else {
    icon.textContent = '👇';
    text.textContent = 'En savoir plus';
  }
}

function photoSrc(photo) {
  return mediaUrl(typeof photo === 'string' ? photo : photo && photo.url);
}

function photoCaption(photo) {
  return typeof photo === 'object' && photo && photo.caption ? photo.caption : '';
}

function photoStyle(photo) {
  const zoom = typeof photo === 'object' && photo && photo.zoom;
  const rotation = typeof photo === 'object' && photo && photo.rotation ? Number(photo.rotation) : 0;
  const fit = zoom ? 'cover' : 'contain';
  const rotate = rotation ? ` transform:rotate(${rotation}deg);` : '';
  return `object-fit:${fit};${rotate}`;
}

function createPastEventCard(event) {
  const eventId = String(event.id || 'event-' + Math.random().toString(36).slice(2, 11)).replace(/[^a-zA-Z0-9_-]/g, '-');

  const mainPhotoHtml = event.photos && event.photos.length > 0 ?
    (() => {
      const photo = event.photos[0];
      const photoUrl = photoSrc(photo);
      const caption = photoCaption(photo);
      const captionHtml = caption ? `<div class="past-img-caption">${escapeHtml(caption)}</div>` : '';
      return `<div class="past-img-wrapper">
        <div class="past-img-ratio"></div>
        <img src="${escapeHtml(photoUrl)}" alt="${escapeHtml(caption || event.title)}" style="${photoStyle(photo)}">
        ${captionHtml}
        <div class="past-date-badge">${escapeHtml(event.day)} ${escapeHtml(event.month)}${event.year ? ' ' + escapeHtml(event.year) : ''}</div>
      </div>`;
    })()
    : '';

  const galleryHtml = event.photos && event.photos.length > 1 ?
    `<div class="past-gallery-container">
      <div class="past-gallery">
      ${event.photos.slice(1).map(photo => {
        const photoUrl = photoSrc(photo);
        const caption = photoCaption(photo);
        const captionHtml = caption ? `<div class="past-gallery-caption">${escapeHtml(caption)}</div>` : '';
        return `
        <div class="past-gallery-item">
          <img src="${escapeHtml(photoUrl)}" alt="${escapeHtml(caption || event.title)}" style="${photoStyle(photo)}">
          ${captionHtml}
        </div>
      `;
      }).join('')}
      </div>
    </div>`
    : '';

  const programHtml = event.program && event.program.length > 0 ?
    `<div style="margin-top:1.5rem;">
      <h4 class="past-subtitle">
        <span style="font-size:1.5rem;">🎯</span> Au programme
      </h4>
      <div class="past-program-grid">
        ${event.program.map(item => `
          <div class="past-program-item">
            <span class="ppi-icon">${escapeHtml(item.emoji || '')}</span>
            <div class="ppi-content">
              <h5>${escapeHtml(item.title)}</h5>
              <p>${escapeHtml(item.description)}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`
    : '';

  const ctaHtml = `
    <div class="past-cta-container">
      <a href="/contact.html" class="btn-primary">
        <span>💬</span> Organiser un événement similaire
      </a>
    </div>
  `;

  const expandableContent = `
    <div id="details-${eventId}" style="max-height:0;overflow:hidden;transition:max-height 0.5s ease-out;">
      <div class="past-details-inner">
        ${event.recap ? `<div class="past-recap">${escapeHtml(event.recap)}</div>` : ''}
        ${galleryHtml}
        ${programHtml}
        ${event.footer ? `<p class="past-footer">${escapeHtml(event.footer)}</p>` : ''}
        ${ctaHtml}
      </div>
    </div>
  `;

  const toggleButton = `
    <button onclick="toggleEventDetails('${eventId}')" id="btn-${eventId}" class="past-toggle-btn">
      <span id="icon-${eventId}">👇</span>
      <span id="text-${eventId}">Voir le détail de l'événement</span>
    </button>
  `;

  return `
    <div class="past-card">
      <span class="past-leaf-icon">🍃</span>
      <div class="past-main">
        ${mainPhotoHtml}
        <div class="past-info">
          <div class="past-header">
            <div class="past-date">
              <div class="pd-day">${escapeHtml(event.day)}</div>
              <div class="pd-month">${escapeHtml(event.month)}</div>
              ${event.year ? `<div class="pd-year">${escapeHtml(event.year)}</div>` : ''}
            </div>
            <div class="past-title-box">
              <h3>${escapeHtml(event.title)}</h3>
              <p class="past-location">
                <span style="font-size:1.1rem;">📍</span> ${escapeHtml(event.location)}
              </p>
            </div>
          </div>
          <p class="past-desc">${escapeHtml(event.description)}</p>
          ${toggleButton}
        </div>
      </div>
      ${expandableContent}
    </div>
  `;
}

async function displayUpcomingEvents(containerId) {
  const events = await loadEvents();
  const container = document.getElementById(containerId);
  if (!container) return;

  const upcomingEvents = events
    .filter(event => !isEventPast(event.date))
    .sort((a, b) => parseEventDay(a.date) - parseEventDay(b.date));

  if (upcomingEvents.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:4rem 2rem;background:var(--beige-light);border-radius:20px;border:2px dashed var(--beige-2);position:relative;overflow:hidden;">
        <span style="position:absolute;top:15px;left:20px;font-size:1.8rem;opacity:0.3;">🦗</span>
        <span style="position:absolute;top:20px;right:25px;font-size:1.6rem;opacity:0.3;">🐝</span>
        <span style="position:absolute;bottom:20px;left:30px;font-size:1.5rem;opacity:0.3;">🌸</span>
        <span style="position:absolute;bottom:25px;right:20px;font-size:1.7rem;opacity:0.3;">🌿</span>
        <div style="font-size:3.5rem;margin-bottom:1rem;">🌱</div>
        <p style="font-family:'Montserrat',sans-serif;font-size:1.2rem;font-weight:700;color:var(--green-dark);margin:0 0 0.5rem;">Aucune rencontre prévue pour le moment</p>
        <p style="font-family:'Lora',serif;font-size:1rem;color:#7a6a50;margin:0;">Je prépare de nouvelles animations. Revenez bientôt !</p>
      </div>
    `;
    return;
  }

  container.innerHTML = upcomingEvents.map(event => createEventCard(event)).join('');
}

async function displayPastEvents() {
  const events = await loadEvents();
  const carousel = document.getElementById('past-events-carousel');
  const indicators = document.getElementById('carousel-indicators');

  if (!carousel || !indicators) {
    console.error('Carousel elements not found');
    return;
  }

  const allPastEvents = events
    .filter(event => isEventPast(event.date))
    .sort((a, b) => parseEventDay(b.date) - parseEventDay(a.date));

  if (allPastEvents.length === 0) {
    carousel.innerHTML = `
      <div class="carousel-item">
        <div style="text-align:center;padding:4rem 2rem;background:var(--beige-light);border-radius:20px;border:2px dashed var(--beige-2);position:relative;overflow:hidden;">
          <span style="position:absolute;top:15px;left:20px;font-size:1.8rem;opacity:0.3;">🍃</span>
          <span style="position:absolute;top:20px;right:25px;font-size:1.6rem;opacity:0.3;">🦋</span>
          <span style="position:absolute;bottom:20px;left:30px;font-size:1.5rem;opacity:0.3;">🌿</span>
          <span style="position:absolute;bottom:25px;right:20px;font-size:1.7rem;opacity:0.3;">🌸</span>
          <div style="font-size:3.5rem;margin-bottom:1rem;">📚</div>
          <p style="font-family:'Montserrat',sans-serif;font-size:1.2rem;font-weight:700;color:var(--brown);margin:0 0 0.5rem;">Le carnet de bord est encore vide</p>
          <p style="font-family:'Lora',serif;font-size:1rem;color:#7a6a50;margin:0;">Les souvenirs de nos aventures apparaîtront bientôt ici.</p>
        </div>
      </div>
    `;
    indicators.innerHTML = '';
    return;
  }

  carousel.innerHTML = allPastEvents.map((event, index) =>
    `<div class="carousel-item${index === 0 ? ' active' : ''}">${createPastEventCard(event)}</div>`
  ).join('');

  indicators.innerHTML = allPastEvents.map((_, index) =>
    `<button class="carousel-indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></button>`
  ).join('');

  initCarousel(allPastEvents.length);
}

let currentIndex = 0;
function initCarousel(totalItems) {
  const items = document.querySelectorAll('.carousel-item');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const indicators = document.querySelectorAll('.carousel-indicator');
  const carouselWrapper = document.querySelector('.carousel-wrapper');

  function updateCarousel(index, scrollToTop) {
    currentIndex = index;
    items.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === totalItems - 1;
    if (scrollToTop !== false) {
      const section = document.getElementById('section-past');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) updateCarousel(currentIndex - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIndex < totalItems - 1) updateCarousel(currentIndex + 1);
    });
  }

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      updateCarousel(index);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      updateCarousel(currentIndex - 1);
    } else if (e.key === 'ArrowRight' && currentIndex < totalItems - 1) {
      updateCarousel(currentIndex + 1);
    }
  });

  if (carouselWrapper) {
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    carouselWrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isSwiping = true;
    }, { passive: true });

    carouselWrapper.addEventListener('touchend', (e) => {
      if (!isSwiping) return;
      isSwiping = false;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchStartX - touchEndX;
      const diffY = Math.abs(touchStartY - touchEndY);

      if (Math.abs(diffX) > 50 && diffX > diffY) {
        if (diffX > 0 && currentIndex < totalItems - 1) {
          updateCarousel(currentIndex + 1);
        } else if (diffX < 0 && currentIndex > 0) {
          updateCarousel(currentIndex - 1);
        }
      }
    }, { passive: true });
  }

  if (prevBtn) prevBtn.disabled = true;
  if (nextBtn) nextBtn.disabled = totalItems <= 1;
}

function toggleEventDetails(eventId) {
  const detailsDiv = document.getElementById(`details-${eventId}`);
  const iconSpan = document.getElementById(`icon-${eventId}`);
  const textSpan = document.getElementById(`text-${eventId}`);
  if (!detailsDiv) return;

  if (detailsDiv.style.maxHeight === '0px' || detailsDiv.style.maxHeight === '') {
    detailsDiv.style.maxHeight = 'none';
    detailsDiv.style.overflow = 'visible';
    if (iconSpan) iconSpan.textContent = '👆';
    if (textSpan) textSpan.textContent = 'Masquer les détails';
  } else {
    detailsDiv.style.maxHeight = '0px';
    detailsDiv.style.overflow = 'hidden';
    if (iconSpan) iconSpan.textContent = '👇';
    if (textSpan) textSpan.textContent = "Voir le détail de l'événement";
  }
}

function openGalleryOverlay(imgSrc, imgAlt) {
  const overlay = document.createElement('div');
  overlay.className = 'gallery-overlay';
  overlay.innerHTML = `
    <button class="gallery-overlay-close" aria-label="Fermer">✕</button>
    <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(imgAlt || '')}">
  `;
  overlay.addEventListener('click', () => overlay.remove());
  document.body.appendChild(overlay);
}

function initGalleryZoom() {
  document.querySelectorAll('.past-gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openGalleryOverlay(img.src, img.alt);
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  if (document.getElementById('upcoming-events-container')) {
    await displayUpcomingEvents('upcoming-events-container');
  }
  if (document.getElementById('past-events-carousel')) {
    await displayPastEvents();
    initGalleryZoom();
  }
  if (document.getElementById('upcoming-events-container-home')) {
    await displayUpcomingEvents('upcoming-events-container-home');
  }
});

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
  const endParts = parseDateParts(event.dateFin);
  return Object.assign({}, event, {
    date: parts.raw,
    dateFin: endParts ? endParts.raw : '',
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

function eventEndValue(event) {
  if (event && typeof event === 'object') return event.dateFin || event.date;
  return event;
}

function isEventPast(event) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = parseEventDay(eventEndValue(event));
  if (Number.isNaN(day.getTime())) return false;
  return day < today;
}

function isEventVisible(event) {
  return event && event.afficherSite !== false && event.afficherSite !== 'false';
}

function eventAcces(event) {
  const raw = String(event && event.acces || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (raw === 'prive' || raw === 'invitation') return raw;
  const audience = String(event && event.audience || '').toLowerCase();
  if (/priv|invitation|sur invitation/.test(audience)) return /invitation/.test(audience) ? 'invitation' : 'prive';
  return 'public';
}

function monthLabel(parts) {
  if (!parts) return '';
  return MONTHS_FR[parseInt(parts.month, 10) - 1] || '';
}

function dateBlockHtml(event, dayClass, monthClass, yearClass) {
  const start = parseDateParts(event.date);
  const end = parseDateParts(event.dateFin);
  if (!start) return '';
  if (!end || end.raw === start.raw) {
    return `<div class="${dayClass}">${escapeHtml(start.day)}</div>
        <div class="${monthClass}">${escapeHtml(monthLabel(start))}</div>
        ${start.year ? `<div class="${yearClass}">${escapeHtml(start.year)}</div>` : ''}`;
  }
  if (start.month === end.month && start.year === end.year) {
    return `<div class="${dayClass} is-range">${escapeHtml(start.day)}–${escapeHtml(end.day)}</div>
        <div class="${monthClass}">${escapeHtml(monthLabel(start))}</div>
        ${start.year ? `<div class="${yearClass}">${escapeHtml(start.year)}</div>` : ''}`;
  }
  return `<div class="${dayClass} is-range">${escapeHtml(start.day)} ${escapeHtml(monthLabel(start).slice(0, 4))}</div>
      <div class="${monthClass}">→ ${escapeHtml(end.day)} ${escapeHtml(monthLabel(end).slice(0, 4))}</div>
      ${end.year ? `<div class="${yearClass}">${escapeHtml(end.year)}</div>` : ''}`;
}

function accesLabel(acces) {
  if (acces === 'prive') return 'Privé';
  if (acces === 'invitation') return 'Sur invitation';
  return 'Public';
}

function dureeLabel(value) {
  const map = {
    'une-journee': 'Une journée',
    'demi-journee': 'Demi-journée',
    'plusieurs-jours': 'Plusieurs jours',
    stage: 'Stage'
  };
  return map[value] || '';
}

function statutLabel(value) {
  const map = { ouvert: 'Ouvert', complet: 'Complet', annule: 'Annulé', termine: 'Terminé' };
  return map[value] || '';
}

function renderBadge(kind, icon, text) {
  if (!text) return '';
  return `<span class="upcoming-badge badge-${kind}">
          <span>${icon}</span>
          ${escapeHtml(text)}
        </span>`;
}

function renderEventBadges(event) {
  const acces = eventAcces(event);
  const statut = String(event.statut || '');
  const duree = dureeLabel(event.dureeType);
  const chips = [
    acces !== 'public' ? renderBadge('acces-' + acces, acces === 'invitation' ? '✉️' : '🔒', accesLabel(acces)) : '',
    statut && statut !== 'ouvert' ? renderBadge('statut-' + statut, statut === 'complet' ? '🚫' : (statut === 'annule' ? '⛔' : '✓'), statutLabel(statut)) : '',
    duree && event.dureeType && event.dureeType !== 'une-journee' ? renderBadge('duree', '📅', duree) : '',
    event.time ? renderBadge('time', '⏰', event.time) : '',
    event.audience ? renderBadge('audience', '👥', event.audience) : '',
    event.ages ? renderBadge('ages', '🎈', event.ages) : '',
    event.price ? renderBadge('price', '🎟️', event.price) : '',
    event.inscription ? renderBadge('info', '📝', event.inscription) : '',
    event.places ? renderBadge('info', '🪑', event.places) : '',
    event.type ? renderBadge('info', '🏷️', event.type) : ''
  ];
  return chips.filter(Boolean).join('');
}

function renderEventFacts(event) {
  const rows = [
    event.inclus ? ['Inclus', event.inclus] : null,
    event.aPrevoir ? ['À prévoir', event.aPrevoir] : null,
    event.meteo ? ['Consignes', event.meteo] : null
  ].filter(Boolean);
  if (!rows.length) return '';
  return `<div class="event-facts">
      ${rows.map(function (row) {
        return `<div class="event-fact">
          <span class="event-fact-label">${escapeHtml(row[0])}</span>
          <span class="event-fact-text">${richText(row[1])}</span>
        </div>`;
      }).join('')}
    </div>`;
}

function dateBadgeText(event) {
  const start = parseDateParts(event.date);
  const end = parseDateParts(event.dateFin);
  if (!start) return '';
  if (!end || end.raw === start.raw) {
    return start.day + ' ' + monthLabel(start) + (start.year ? ' ' + start.year : '');
  }
  if (start.month === end.month && start.year === end.year) {
    return start.day + '–' + end.day + ' ' + monthLabel(start) + (start.year ? ' ' + start.year : '');
  }
  return start.day + ' ' + monthLabel(start).slice(0, 4) + ' → ' + end.day + ' ' + monthLabel(end).slice(0, 4);
}

function locationHtml(event) {
  if (event.masquerLieu === true || event.masquerLieu === 'true' || !event.location) return '';
  return `<p class="upcoming-location">
          <span>📍</span>
          ${escapeHtml(event.location)}
        </p>`;
}

function pastLocationHtml(event) {
  if (event.masquerLieu === true || event.masquerLieu === 'true' || !event.location) return '';
  return `<p class="past-location">
                <span>📍</span> ${escapeHtml(event.location)}
              </p>`;
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

function richText(str) {
  return escapeHtml(str)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

function cssColor(value) {
  const raw = String(value || '').trim();
  if (!raw || /[;{}<>]/.test(raw)) return '';
  if (/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(raw)) return raw;
  if (/^rgba?\(/i.test(raw) || /^hsla?\(/i.test(raw)) return raw;
  if (/^[a-z]+$/i.test(raw)) return raw;
  return '';
}

function eventAccent(event, fallback) {
  return cssColor(event.couleur || event.color) || fallback;
}

function eventTitleColor(event) {
  return cssColor(event.couleurTitre);
}

function eventTitleHtml(event) {
  const title = String(event.title || '');
  const emoji = String(event.emoji || '').trim();
  const prefix = emoji && title.indexOf(emoji) !== 0 ? escapeHtml(emoji) + ' ' : '';
  return prefix + escapeHtml(title);
}

function eventSubtitle(event) {
  return event.subtitle || event.sousTitre || '';
}

function normalizePhoto(photo) {
  if (!photo) return null;
  if (typeof photo === 'string') {
    return { url: photo, caption: '', role: 'galerie', position: 'gauche', cadrage: 'contenir', focus: 'centre', rotation: 0 };
  }
  return photo;
}

function eventPhotos(event) {
  return (event.photos || []).map(normalizePhoto).filter(function (photo) {
    return photo && (photo.url || photo.src);
  });
}

function mainPhoto(event) {
  const photos = eventPhotos(event);
  return photos.find(function (photo) { return photo.role === 'principale'; }) || photos[0] || null;
}

function galleryPhotos(event) {
  const photos = eventPhotos(event);
  const main = mainPhoto(event);
  return photos.filter(function (photo) { return photo !== main; });
}

function photoLayout(event) {
  const main = mainPhoto(event);
  const pos = (main && main.position) || event.dispositionPhoto || 'gauche';
  if (pos === 'droite' || pos === 'haut' || pos === 'pleine') return pos;
  return 'gauche';
}

function focusPos(focus) {
  const map = { centre: 'center', haut: 'top', bas: 'bottom', gauche: 'left', droite: 'right' };
  return map[focus] || 'center';
}

function photoVars(photo) {
  const item = normalizePhoto(photo) || {};
  const fill = item.cadrage === 'remplir' || item.zoom === true || item.zoom === 'true';
  const rot = Number(item.rotation || 0) || 0;
  return '--photo-fit:' + (fill ? 'cover' : 'contain') +
    ';--photo-pos:' + focusPos(item.focus) +
    ';--photo-rot:' + rot + 'deg';
}

function photoSrc(photo) {
  const item = normalizePhoto(photo);
  return mediaUrl(item && (item.url || item.src));
}

function photoCaption(photo) {
  const item = normalizePhoto(photo);
  return item && item.caption ? item.caption : '';
}

function renderMainPhoto(event, extraClass) {
  const photo = mainPhoto(event);
  if (!photo) return '';
  const src = photoSrc(photo);
  const caption = photoCaption(photo);
  const captionHtml = caption ? `<div class="past-img-caption">${escapeHtml(caption)}</div>` : '';
  const badge = extraClass === 'upcoming-photo' ? '' :
    `<div class="past-date-badge">${escapeHtml(dateBadgeText(event))}</div>`;
  return `<div class="${extraClass || 'past-img-wrapper'} event-photo" style="${photoVars(photo)}">
    <div class="past-img-ratio"></div>
    <img src="${escapeHtml(src)}" alt="${escapeHtml(caption || event.title || '')}">
    ${captionHtml}
    ${badge}
  </div>`;
}

function renderGallery(event) {
  const photos = galleryPhotos(event);
  if (!photos.length) return '';
  const grid = event.galerie === 'grille' ? ' is-grid' : '';
  return `<div class="past-gallery-container">
      <div class="past-gallery${grid}">
      ${photos.map(function (photo) {
        const caption = photoCaption(photo);
        const captionHtml = caption ? `<div class="past-gallery-caption">${escapeHtml(caption)}</div>` : '';
        return `
        <div class="past-gallery-item event-photo" style="${photoVars(photo)}">
          <img src="${escapeHtml(photoSrc(photo))}" alt="${escapeHtml(caption || event.title || '')}">
          ${captionHtml}
        </div>`;
      }).join('')}
      </div>
    </div>`;
}

function renderProgram(event) {
  if (!event.program || !event.program.length) return '';
  const heading = event.titreProgramme || 'Au programme';
  const emoji = event.emojiProgramme || '🎯';
  return `<div class="event-program">
      <h4 class="past-subtitle">
        <span>${escapeHtml(emoji)}</span> ${escapeHtml(heading)}
      </h4>
      <div class="past-program-grid">
        ${event.program.map(function (item) {
          const color = cssColor(item.couleur);
          const style = color ? ` style="border-top-color:${color}"` : '';
          return `
          <div class="past-program-item"${style}>
            <span class="ppi-icon">${escapeHtml(item.emoji || '')}</span>
            <div class="ppi-content">
              <h5>${escapeHtml(item.title || '')}</h5>
              <p>${richText(item.description || '')}</p>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
}

function renderDetailsBox(event) {
  if (!event.details) return '';
  const accent = eventAccent(event, 'var(--green)');
  return `<div class="event-plus">
      <div class="event-plus-inner" style="background:${accent}">
        <span class="event-plus-label">✨ EN PLUS :</span>
        <span class="event-plus-text">${richText(event.details)}</span>
      </div>
    </div>`;
}

function createEventCard(event) {
  const accent = eventAccent(event, 'var(--green)');
  const titleColor = eventTitleColor(event);
  const layout = photoLayout(event);
  const photoHtml = renderMainPhoto(event, 'upcoming-photo past-img-wrapper');
  const subtitle = eventSubtitle(event);
  const extra = [
    event.recap ? `<div class="past-recap">${richText(event.recap)}</div>` : '',
    renderGallery(event),
    renderProgram(event),
    event.footer ? `<p class="past-footer">${richText(event.footer)}</p>` : ''
  ].join('');

  return `
    <div class="upcoming-card layout-${layout}${event.statut === 'annule' ? ' is-cancelled' : ''}${event.statut === 'complet' ? ' is-full' : ''}" style="--event-accent:${accent};${titleColor ? '--event-title:' + titleColor + ';' : ''}">
      <div class="timeline-dot"></div>
      <div class="upcoming-date">
        ${dateBlockHtml(event, 'upcoming-day', 'upcoming-month', 'upcoming-year')}
      </div>
      ${photoHtml}
      <div class="upcoming-content">
        <h3>${eventTitleHtml(event)}</h3>
        ${subtitle ? `<p class="event-subtitle">${escapeHtml(subtitle)}</p>` : ''}
        ${locationHtml(event)}
        <button class="upcoming-toggle-btn" onclick="toggleUpcomingCard(this)">
          <span class="utb-icon">👇</span>
          <span class="utb-text">En savoir plus</span>
        </button>
        <div class="upcoming-details-wrap">
          <p class="upcoming-desc">${richText(event.description || '')}</p>
          ${renderDetailsBox(event)}
          ${renderEventFacts(event)}
          ${extra}
        </div>
      </div>
      <div class="upcoming-badges">
        ${renderEventBadges(event)}
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

function createPastEventCard(event) {
  const eventId = String(event.id || 'event-' + Math.random().toString(36).slice(2, 11)).replace(/[^a-zA-Z0-9_-]/g, '-');
  const accent = eventAccent(event, 'var(--brown)');
  const titleColor = eventTitleColor(event);
  const layout = photoLayout(event);
  const icon = event.icone || '🍃';
  const subtitle = eventSubtitle(event);
  const mainPhotoHtml = renderMainPhoto(event);
  const extraDetails = [
    event.recap ? `<div class="past-recap">${richText(event.recap)}</div>` : '',
    renderGallery(event),
    renderProgram(event),
    event.footer ? `<p class="past-footer">${richText(event.footer)}</p>` : '',
    `<div class="past-cta-container">
      <a href="/contact.html" class="btn-primary">
        <span>💬</span> Organiser un événement similaire
      </a>
    </div>`
  ].join('');

  return `
    <div class="past-card${event.statut === 'annule' ? ' is-cancelled' : ''}" style="--event-accent:${accent};${titleColor ? '--event-title:' + titleColor + ';' : ''}">
      <span class="past-leaf-icon">${escapeHtml(icon)}</span>
      <div class="past-main layout-${layout}">
        ${mainPhotoHtml}
        <div class="past-info">
          <div class="past-header">
            <div class="past-date">
              ${dateBlockHtml(event, 'pd-day', 'pd-month', 'pd-year')}
            </div>
            <div class="past-title-box">
              <h3>${eventTitleHtml(event)}</h3>
              ${subtitle ? `<p class="event-subtitle">${escapeHtml(subtitle)}</p>` : ''}
              ${pastLocationHtml(event)}
              <div class="past-badges">${renderEventBadges(event)}</div>
            </div>
          </div>
          <p class="past-desc">${richText(event.description || '')}</p>
          ${renderDetailsBox(event)}
          ${renderEventFacts(event)}
          <button onclick="toggleEventDetails('${eventId}')" id="btn-${eventId}" class="past-toggle-btn">
            <span id="icon-${eventId}">👇</span>
            <span id="text-${eventId}">Voir le détail de l'événement</span>
          </button>
        </div>
      </div>
      <div id="details-${eventId}" class="past-details">
        <div class="past-details-inner">
          ${extraDetails}
        </div>
      </div>
    </div>
  `;
}

async function displayUpcomingEvents(containerId) {
  const events = await loadEvents();
  const container = document.getElementById(containerId);
  if (!container) return;

  const upcomingEvents = events
    .filter(event => isEventVisible(event) && !isEventPast(event))
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
  initGalleryZoom();
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
    .filter(event => isEventVisible(event) && isEventPast(event))
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

  const open = !detailsDiv.classList.contains('is-open');
  detailsDiv.classList.toggle('is-open', open);
  if (iconSpan) iconSpan.textContent = open ? '👆' : '👇';
  if (textSpan) textSpan.textContent = open ? 'Masquer les détails' : "Voir le détail de l'événement";
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
  if (document.documentElement.dataset.galleryZoom === '1') return;
  document.documentElement.dataset.galleryZoom = '1';
  document.addEventListener('click', function (e) {
    const item = e.target.closest('.past-gallery-item, .past-img-wrapper, .upcoming-photo');
    if (!item || e.target.closest('.gallery-overlay')) return;
    const img = item.querySelector('img');
    if (img) openGalleryOverlay(img.src, img.alt);
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

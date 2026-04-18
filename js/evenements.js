// Gestion automatique des événements
async function loadEvents() {
  try {
    const response = await fetch('/evenements.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors du chargement des événements:', error);
    return { upcoming: [], past: [] };
  }
}

function isEventPast(eventDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const event = new Date(eventDate);
  event.setHours(0, 0, 0, 0);
  return event < today;
}

function createEventCard(event) {
  const detailsHtml = event.details ? 
    `<div style="margin-top:1rem;">
      <div style="display:inline-block;background:var(--green);color:var(--white);padding:0.7rem 1.2rem;border-radius:10px;box-shadow:0 3px 10px rgba(70,123,67,0.25);">
        <span style="font-family:'Montserrat',sans-serif;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;opacity:0.9;">✨ EN PLUS :</span>
        <span style="font-family:'Lora',serif;font-size:0.9rem;margin-left:0.5rem;">${event.details}</span>
      </div>
    </div>` 
    : '';
  
  return `
    <div class="upcoming-card" style="background:#ffffff;border-left:5px solid var(--green);border-radius:12px;padding:2rem;margin-bottom:1.5rem;display:flex;gap:2.5rem;align-items:flex-start;transition:all 0.3s ease;flex-wrap:wrap;box-shadow:0 4px 15px rgba(70,123,67,0.1);position:relative;" onmouseover="this.style.boxShadow='0 8px 25px rgba(70,123,67,0.18)';this.style.transform='translateX(5px)';" onmouseout="this.style.boxShadow='0 4px 15px rgba(70,123,67,0.1)';this.style.transform='translateX(0)';">
      
      <div class="timeline-dot"></div>

      <!-- Date Minimaliste -->
      <div class="upcoming-date" style="text-align:left;min-width:100px;display:flex;flex-direction:column;border-right:3px solid var(--green);padding-right:2rem;">
        <div class="upcoming-day" style="font-size:2.8rem;font-weight:900;color:var(--green-dark);line-height:1;font-family:'Montserrat',sans-serif;letter-spacing:-1px;">${event.day}</div>
        <div class="upcoming-month" style="font-family:'Montserrat',sans-serif;font-size:0.9rem;font-weight:700;color:var(--green);text-transform:uppercase;margin-top:0.2rem;letter-spacing:1px;">${event.month}</div>
        ${event.year ? `<div class="upcoming-year" style="font-family:'Montserrat',sans-serif;font-size:1.1rem;font-weight:800;color:var(--beige-2);margin-top:0.3rem;">${event.year}</div>` : ''}
      </div>
      
      <!-- Contenu Central -->
      <div class="upcoming-content" style="flex:1;min-width:280px;">
        <h3 style="font-family:'Montserrat',sans-serif;font-size:1.4rem;font-weight:800;color:var(--green-dark);margin:0 0 0.5rem;line-height:1.3;">${event.title}</h3>
        <p class="upcoming-location" style="font-size:0.9rem;color:#7a6a50;margin:0 0 1rem;display:flex;align-items:center;gap:0.4rem;font-weight:600;">
          <span style="font-size:1.1rem;">📍</span>
          ${event.location}
        </p>
        <button class="upcoming-toggle-btn" onclick="toggleUpcomingCard(this)">
          <span class="utb-icon">👇</span>
          <span class="utb-text">En savoir plus</span>
        </button>
        <div class="upcoming-details-wrap">
          <p style="font-family:'Lora',serif;font-size:1rem;line-height:1.7;color:#5a5040;margin:0;">${event.description}</p>
          ${detailsHtml}
        </div>
      </div>

      <!-- Badges Droite -->
      <div class="upcoming-badges" style="display:flex;flex-direction:column;gap:0.7rem;min-width:160px;">
        ${event.time ? `
        <span class="upcoming-badge" style="display:inline-flex;align-items:center;gap:0.5rem;background:linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%);color:var(--white);padding:9px 15px;border-radius:8px;font-family:'Montserrat',sans-serif;font-size:0.8rem;font-weight:700;box-shadow:0 2px 8px rgba(70,123,67,0.25);">
          <span style="font-size:1rem;">⏰</span>
          ${event.time}
        </span>
        ` : ''}
        <span class="upcoming-badge" style="display:inline-flex;align-items:center;gap:0.5rem;background:var(--brown);color:var(--white);padding:9px 15px;border-radius:8px;font-family:'Montserrat',sans-serif;font-size:0.8rem;font-weight:700;box-shadow:0 2px 8px rgba(175,106,50,0.25);">
          <span style="font-size:1rem;">👥</span>
          ${event.audience}
        </span>
        ${event.price ? `
        <span class="upcoming-badge" style="display:inline-flex;align-items:center;gap:0.5rem;background:var(--beige-light);border:1px solid var(--beige-2);color:var(--brown);padding:9px 15px;border-radius:8px;font-family:'Montserrat',sans-serif;font-size:0.8rem;font-weight:700;box-shadow:0 2px 8px rgba(175,106,50,0.15);">
          <span style="font-size:1rem;">🎟️</span>
          ${event.price}
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

function createPastEventCard(event) {
  const eventId = event.id || 'event-' + Math.random().toString(36).substr(2, 9);
  
  // Photo principale
  const mainPhotoHtml = event.photos && event.photos.length > 0 ? 
    (() => {
      const photo = event.photos[0];
      const photoUrl = typeof photo === 'string' ? photo : photo.url;
      const caption = typeof photo === 'object' && photo.caption ? photo.caption : '';
      const zoom = typeof photo === 'object' && photo.zoom ? photo.zoom : false;
      
      const captionHtml = caption ? 
        `<div class="past-img-caption">${caption}</div>` : '';
        
      return `<div class="past-img-wrapper">
        <div class="past-img-ratio"></div>
        <img src="${photoUrl}" alt="${caption || event.title}" style="object-fit: ${zoom ? 'cover' : 'contain'}">
        ${captionHtml}
        <div class="past-date-badge">${event.day} ${event.month}${event.year ? ' ' + event.year : ''}</div>
      </div>`;
    })()
    : '';
  
  // Galerie photos supplémentaires
  const galleryHtml = event.photos && event.photos.length > 1 ? 
    `<div class="past-gallery-container">
      <div class="past-gallery">
      ${event.photos.slice(1).map(photo => {
        const photoUrl = typeof photo === 'string' ? photo : photo.url;
        const caption = typeof photo === 'object' && photo.caption ? photo.caption : '';
        const zoom = typeof photo === 'object' && photo.zoom ? photo.zoom : false;
        
        const captionHtml = caption ? 
          `<div class="past-gallery-caption">${caption}</div>` : '';

        return `
        <div class="past-gallery-item">
          <img src="${photoUrl}" alt="${caption || event.title}" style="object-fit: ${zoom ? 'cover' : 'contain'}">
          ${captionHtml}
        </div>
      `}).join('')}
      </div>
    </div>`
    : '';
  
  // Programme détaillé
  const programHtml = event.program && event.program.length > 0 ? 
    `<div style="margin-top:1.5rem;">
      <h4 class="past-subtitle">
        <span style="font-size:1.5rem;">🎯</span> Au programme
      </h4>
      <div class="past-program-grid">
        ${event.program.map(item => `
          <div class="past-program-item">
            <span class="ppi-icon">${item.emoji}</span>
            <div class="ppi-content">
              <h5>${item.title}</h5>
              <p>${item.description}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`
    : '';
  
  // Bouton CTA
  const ctaHtml = `
    <div class="past-cta-container">
      <a href="/contact.html" class="btn-primary">
        <span>💬</span> Organiser un événement similaire
      </a>
    </div>
  `;
  
  // Contenu dépliable
  const expandableContent = `
    <div id="details-${eventId}" style="max-height:0;overflow:hidden;transition:max-height 0.5s ease-out;">
      <div class="past-details-inner">
        ${event.recap ? `<div class="past-recap">${event.recap}</div>` : ''}
        ${galleryHtml}
        ${programHtml}
        ${ctaHtml}
      </div>
    </div>
  `;
  
  // Bouton déployer
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
              <div class="pd-day">${event.day}</div>
              <div class="pd-month">${event.month}</div>
              ${event.year ? `<div class="pd-year">${event.year}</div>` : ''}
            </div>
            
            <div class="past-title-box">
              <h3>${event.title}</h3>
              <p class="past-location">
                <span style="font-size:1.1rem;">📍</span> ${event.location}
              </p>
            </div>
          </div>
          
          <p class="past-desc">${event.description}</p>
          
          ${toggleButton}
        </div>
      </div>
      
      ${expandableContent}
    </div>
  `;
}

async function displayUpcomingEvents(containerId) {
  const data = await loadEvents();
  const container = document.getElementById(containerId);
  
  if (!container) return;
  
  // Filtrer les événements à venir
  const upcomingEvents = data.upcoming.filter(event => !isEventPast(event.date));
  
  // Trier par date croissante (le plus proche en premier)
  upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  
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
  const data = await loadEvents();
  const carousel = document.getElementById('past-events-carousel');
  const indicators = document.getElementById('carousel-indicators');
  
  if (!carousel || !indicators) {
    console.error('Carousel elements not found');
    return;
  }
  
  // Récupérer tous les événements passés (ceux dans "past" + ceux dans "upcoming" qui sont passés)
  const pastEventsFromUpcoming = data.upcoming.filter(event => isEventPast(event.date));
  const allPastEvents = [...data.past, ...pastEventsFromUpcoming];
  
  // Trier par date décroissante (plus récent en premier)
  allPastEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
  
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
  
  // Créer les indicateurs
  indicators.innerHTML = allPastEvents.map((_, index) => 
    `<button class="carousel-indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></button>`
  ).join('');
  
  // Initialiser le carrousel
  initCarousel(allPastEvents.length);
}

// Fonction pour initialiser le carrousel (show/hide)
let currentIndex = 0;
function initCarousel(totalItems) {
  const items = document.querySelectorAll('.carousel-item');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const indicators = document.querySelectorAll('.carousel-indicator');
  
  function updateCarousel(index) {
    currentIndex = index;
    
    // Cacher tous les items, afficher l'actif
    items.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
    
    // Mettre à jour les indicateurs
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });
    
    // Désactiver les flèches aux extrémités
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === totalItems - 1;
    
    // Scroll en haut de la section pour voir l'événement
    const section = document.getElementById('section-past');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  // Navigation par flèches
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      updateCarousel(currentIndex - 1);
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentIndex < totalItems - 1) {
      updateCarousel(currentIndex + 1);
    }
  });
  
  // Navigation par indicateurs
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      updateCarousel(index);
    });
  });
  
  // Navigation au clavier
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      updateCarousel(currentIndex - 1);
    } else if (e.key === 'ArrowRight' && currentIndex < totalItems - 1) {
      updateCarousel(currentIndex + 1);
    }
  });
  
  // Initialiser les flèches (premier item déjà actif en HTML)
  prevBtn.disabled = true;
  nextBtn.disabled = totalItems <= 1;
}

// Fonction pour déployer/replier les détails d'un événement
function toggleEventDetails(eventId) {
  const detailsDiv = document.getElementById(`details-${eventId}`);
  const iconSpan = document.getElementById(`icon-${eventId}`);
  const textSpan = document.getElementById(`text-${eventId}`);
  
  if (detailsDiv.style.maxHeight === '0px' || detailsDiv.style.maxHeight === '') {
    // Déployer - utiliser 'none' pour aucune limite de hauteur
    detailsDiv.style.maxHeight = 'none';
    detailsDiv.style.overflow = 'visible';
    iconSpan.textContent = '👆';
    textSpan.textContent = 'Masquer les détails';
  } else {
    // Replier
    detailsDiv.style.maxHeight = '0px';
    detailsDiv.style.overflow = 'hidden';
    iconSpan.textContent = '👇';
    textSpan.textContent = "Voir le détail de l'événement";
  }
}

// Zoom galerie au clic (mobile)
function openGalleryOverlay(imgSrc, imgAlt) {
  const overlay = document.createElement('div');
  overlay.className = 'gallery-overlay';
  overlay.innerHTML = `
    <button class="gallery-overlay-close" aria-label="Fermer">✕</button>
    <img src="${imgSrc}" alt="${imgAlt || ''}">
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

// Auto-initialisation
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


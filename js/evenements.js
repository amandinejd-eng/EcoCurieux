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
    <div style="background:#ffffff;border-left:5px solid var(--green);border-radius:12px;padding:2rem;margin-bottom:1.5rem;display:flex;gap:2.5rem;align-items:flex-start;transition:all 0.3s ease;flex-wrap:wrap;box-shadow:0 4px 15px rgba(70,123,67,0.1);position:relative;" onmouseover="this.style.boxShadow='0 8px 25px rgba(70,123,67,0.18)';this.style.transform='translateX(5px)';" onmouseout="this.style.boxShadow='0 4px 15px rgba(70,123,67,0.1)';this.style.transform='translateX(0)';">
      
      <!-- Date Minimaliste -->
      <div style="text-align:left;min-width:100px;display:flex;flex-direction:column;border-right:3px solid var(--green);padding-right:2rem;">
        <div style="font-size:2.8rem;font-weight:900;color:var(--green-dark);line-height:1;font-family:'Montserrat',sans-serif;letter-spacing:-1px;">${event.day}</div>
        <div style="font-family:'Montserrat',sans-serif;font-size:0.9rem;font-weight:700;color:var(--green);text-transform:uppercase;margin-top:0.2rem;letter-spacing:1px;">${event.month}</div>
        ${event.year ? `<div style="font-family:'Montserrat',sans-serif;font-size:1.1rem;font-weight:800;color:var(--beige-2);margin-top:0.3rem;">${event.year}</div>` : ''}
      </div>
      
      <!-- Contenu Central -->
      <div style="flex:1;min-width:280px;">
        <h3 style="font-family:'Montserrat',sans-serif;font-size:1.4rem;font-weight:800;color:var(--green-dark);margin:0 0 0.5rem;line-height:1.3;">${event.title}</h3>
        <p style="font-size:0.9rem;color:#7a6a50;margin:0 0 1rem;display:flex;align-items:center;gap:0.4rem;font-weight:600;">
          <span style="font-size:1.1rem;">📍</span>
          ${event.location}
        </p>
        <p style="font-family:'Lora',serif;font-size:1rem;line-height:1.7;color:#5a5040;margin:0;">${event.description}</p>
        ${detailsHtml}
      </div>

      <!-- Badges Droite -->
      <div style="display:flex;flex-direction:column;gap:0.7rem;min-width:160px;">
        ${event.time ? `
        <span style="display:inline-flex;align-items:center;gap:0.5rem;background:linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%);color:var(--white);padding:9px 15px;border-radius:8px;font-family:'Montserrat',sans-serif;font-size:0.8rem;font-weight:700;box-shadow:0 2px 8px rgba(70,123,67,0.25);">
          <span style="font-size:1rem;">⏰</span>
          ${event.time}
        </span>
        ` : ''}
        <span style="display:inline-flex;align-items:center;gap:0.5rem;background:var(--brown);color:var(--white);padding:9px 15px;border-radius:8px;font-family:'Montserrat',sans-serif;font-size:0.8rem;font-weight:700;box-shadow:0 2px 8px rgba(175,106,50,0.25);">
          <span style="font-size:1rem;">👥</span>
          ${event.audience}
        </span>
        ${event.price ? `
        <span style="display:inline-flex;align-items:center;gap:0.5rem;background:var(--beige-light);border:1px solid var(--beige-2);color:var(--brown);padding:9px 15px;border-radius:8px;font-family:'Montserrat',sans-serif;font-size:0.8rem;font-weight:700;box-shadow:0 2px 8px rgba(175,106,50,0.15);">
          <span style="font-size:1rem;">🎟️</span>
          ${event.price}
        </span>
        ` : ''}
      </div>

    </div>
  `;
}

function createPastEventCard(event) {
  const eventId = event.id || 'event-' + Math.random().toString(36).substr(2, 9);
  
  // Photo principale
  const mainPhotoHtml = event.photos && event.photos.length > 0 ? 
    (() => {
      const photo = event.photos[0];
      const photoUrl = typeof photo === 'string' ? photo : photo.url;
      const rotation = typeof photo === 'object' && photo.rotation ? photo.rotation : 0;
      const caption = typeof photo === 'object' && photo.caption ? photo.caption : '';
      
      const captionHtml = caption ? 
        `<div class="photo-caption" style="position:absolute;bottom:0;left:0;right:0;background:rgba(70,123,67,0.85);color:white;padding:1rem;font-family:'Montserrat',sans-serif;font-size:0.9rem;font-weight:600;text-align:center;transform:translateY(100%);transition:transform 0.4s ease;z-index:2;">${caption}</div>` 
        : '';
        
      return `<div style="width:100%;height:280px;overflow:hidden;border-radius:12px;margin-bottom:1.5rem;box-shadow:0 4px 15px rgba(0,0,0,0.08);position:relative;cursor:pointer;" 
                   onmouseenter="this.querySelector('img').style.transform='rotate(${rotation}deg) scale(1.05)'; ${caption ? "this.querySelector('.photo-caption').style.transform='translateY(0)';" : ""}" 
                   onmouseleave="this.querySelector('img').style.transform='rotate(${rotation}deg) scale(1)'; ${caption ? "this.querySelector('.photo-caption').style.transform='translateY(100%)';" : ""}">
        <img src="${photoUrl}" alt="${caption || event.title}" style="width:100%;height:100%;object-fit:cover;transform:rotate(${rotation}deg);transition:transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
        ${captionHtml}
      </div>`;
    })()
    : '';
  
  // Galerie photos supplémentaires
  const galleryHtml = event.photos && event.photos.length > 1 ? 
    `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,200px));justify-content:center;gap:1rem;width:fit-content;max-width:100%;margin:2rem auto 1.5rem;padding-left:2rem;box-sizing:border-box;">
      ${event.photos.slice(1).map(photo => {
        const photoUrl = typeof photo === 'string' ? photo : photo.url;
        const rotation = typeof photo === 'object' && photo.rotation ? photo.rotation : 0;
        const caption = typeof photo === 'object' && photo.caption ? photo.caption : '';
        
        let imgStyle = 'width:100%;height:100%;object-fit:contain;transition:transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);';
        if (rotation !== 0) {
          imgStyle = `width:100%;height:100%;object-fit:contain;transform:rotate(${rotation}deg) scale(1.3);transition:transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);`;
        }
        
        // Texte au survol (caption)
        const captionHtml = caption ? 
          `<div class="photo-caption" style="position:absolute;bottom:0;left:0;right:0;background:rgba(70,123,67,0.85);color:white;padding:0.8rem;font-family:'Montserrat',sans-serif;font-size:0.8rem;font-weight:600;text-align:center;transform:translateY(100%);transition:transform 0.3s ease;z-index:2;">${caption}</div>` 
          : '';

        return `
        <div style="height:180px;background:#f5efe6;border-radius:12px;box-shadow:0 3px 10px rgba(0,0,0,0.08);cursor:pointer;overflow:hidden;display:flex;align-items:center;justify-content:center;position:relative;" 
             onmouseenter="this.style.boxShadow='0 8px 20px rgba(0,0,0,0.2)'; this.querySelector('img').style.transform='${rotation === 0 ? 'scale(1.15)' : `rotate(${rotation}deg) scale(1.45)`}'; ${caption ? "this.querySelector('.photo-caption').style.transform='translateY(0)';" : ""}" 
             onmouseleave="this.style.boxShadow='0 3px 10px rgba(0,0,0,0.08)'; this.querySelector('img').style.transform='${rotation === 0 ? 'scale(1)' : `rotate(${rotation}deg) scale(1.3)`}'; ${caption ? "this.querySelector('.photo-caption').style.transform='translateY(100%)';" : ""}">
          <img src="${photoUrl}" alt="${caption || event.title}" style="${imgStyle}">
          ${captionHtml}
        </div>
      `}).join('')}
    </div>`
    : '';
  
  // Programme détaillé
  const programHtml = event.program && event.program.length > 0 ? 
    `<div style="margin-top:1.5rem;">
      <h4 style="font-family:'Montserrat',sans-serif;font-size:1rem;font-weight:700;color:var(--green-dark);margin:0 0 1rem;display:flex;align-items:center;gap:0.5rem;">
        <span style="font-size:1.2rem;">🎯</span>
        Au programme
      </h4>
      <div style="display:flex;flex-direction:column;gap:1rem;">
        ${event.program.map(item => `
          <div style="background:var(--beige-light);padding:1rem;border-radius:10px;border-left:3px solid var(--brown);transition:all 0.3s ease;" onmouseover="this.style.background='#f9f3e6';" onmouseout="this.style.background='var(--beige-light)';">
            <div style="display:flex;align-items:flex-start;gap:0.8rem;">
              <span style="font-size:1.5rem;flex-shrink:0;">${item.emoji}</span>
              <div>
                <h5 style="font-family:'Montserrat',sans-serif;font-size:0.9rem;font-weight:700;color:var(--green-dark);margin:0 0 0.4rem;">${item.title}</h5>
                <p style="font-family:'Lora',serif;font-size:0.85rem;line-height:1.6;color:#6b5a40;margin:0;">${item.description}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`
    : '';
  
  // Footer personnalisé
  const footerHtml = event.footer ?
    `<div style="margin-top:1.5rem;padding:1rem;background:linear-gradient(135deg, var(--beige-light) 0%, #fef9f0 100%);border-radius:10px;border:1px solid var(--beige-2);">
      <p style="font-family:'Lora',serif;font-size:0.85rem;line-height:1.6;color:#6b5a40;margin:0;font-style:italic;">
        <span style="font-size:1rem;margin-right:0.3rem;">✨</span>
        ${event.footer}
      </p>
    </div>`
    : '';
  
  // Bouton CTA
  const ctaHtml = `
    <div style="margin-top:1.5rem;text-align:center;">
      <a href="/contact.html" style="display:inline-flex;align-items:center;gap:0.5rem;background:var(--brown);color:var(--white);padding:0.8rem 1.8rem;border-radius:30px;font-family:'Montserrat',sans-serif;font-size:0.85rem;font-weight:700;text-decoration:none;transition:all 0.3s ease;box-shadow:0 4px 12px rgba(175,106,50,0.25);" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 18px rgba(175,106,50,0.35)';" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 12px rgba(175,106,50,0.25)';">
        <span>💬</span>
        Organiser un événement similaire
      </a>
    </div>
  `;
  
  // Contenu dépliable
  const expandableContent = `
    <div id="details-${eventId}" style="max-height:0;overflow:hidden;transition:max-height 0.5s ease-out;">
      ${galleryHtml}
      ${event.recap ? `<p style="font-family:'Lora',serif;font-size:0.95rem;line-height:1.7;color:#5a5040;margin:0 0 1rem;font-style:italic;">${event.recap}</p>` : ''}
      ${programHtml}
      ${footerHtml}
      ${ctaHtml}
    </div>
  `;
  
  // Bouton déployer
  const toggleButton = `
    <button onclick="toggleEventDetails('${eventId}')" id="btn-${eventId}" style="margin-top:1rem;width:100%;display:flex;align-items:center;justify-content:center;gap:0.5rem;background:var(--beige-light);color:var(--brown);padding:0.8rem;border:2px solid var(--beige-2);border-radius:10px;font-family:'Montserrat',sans-serif;font-size:0.85rem;font-weight:700;cursor:pointer;transition:all 0.3s ease;" onmouseover="this.style.background='var(--beige-2)';this.style.borderColor='var(--brown)';" onmouseout="this.style.background='var(--beige-light)';this.style.borderColor='var(--beige-2)';">
      <span id="icon-${eventId}">👇</span>
      <span id="text-${eventId}">Voir le détail de l'événement</span>
    </button>
  `;
  
  return `
    <div style="background:var(--white);border-top:4px solid var(--brown);border-radius:16px;padding:2rem;box-shadow:0 8px 25px rgba(175,106,50,0.08);display:flex;flex-direction:column;transition:all 0.35s ease;position:relative;" onmouseover="this.style.boxShadow='0 12px 35px rgba(175,106,50,0.15)';" onmouseout="this.style.boxShadow='0 8px 25px rgba(175,106,50,0.08)';">
      
      <span style="position:absolute;top:1rem;right:1rem;font-size:1.8rem;opacity:0.35;">🍃</span>
      
      ${mainPhotoHtml}
      
      <div style="display:flex;align-items:flex-start;gap:1rem;margin-bottom:1rem;">
        <div style="text-align:center;min-width:50px;border-right:3px solid var(--brown);padding-right:1rem;">
          <div style="font-size:1.7rem;font-weight:900;line-height:1;color:var(--brown);font-family:'Montserrat',sans-serif;">${event.day}</div>
          <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;margin-top:3px;color:var(--brown);font-family:'Montserrat',sans-serif;">${event.month}</div>
          ${event.year ? `<div style="font-size:0.9rem;font-weight:800;color:var(--beige-2);margin-top:2px;font-family:'Montserrat',sans-serif;">${event.year}</div>` : ''}
        </div>
        <div style="flex:1;">
          <h3 style="font-family:'Montserrat',sans-serif;font-size:1.2rem;font-weight:800;color:var(--green-dark);margin:0 0 0.4rem;line-height:1.3;">${event.title}</h3>
          <p style="font-size:0.85rem;color:#8a7a60;margin:0;display:flex;align-items:center;gap:0.4rem;">
            <span style="font-size:1rem;">📍</span>
            ${event.location}
          </p>
        </div>
      </div>
      
      <p style="font-family:'Lora',serif;font-size:0.95rem;line-height:1.7;color:#5a5040;margin:0;">${event.description}</p>
      
      ${toggleButton}
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

async function displayPastEvents(containerId) {
  const data = await loadEvents();
  const container = document.getElementById(containerId);
  
  if (!container) return;
  
  // Récupérer tous les événements passés (ceux dans "past" + ceux dans "upcoming" qui sont passés)
  const pastEventsFromUpcoming = data.upcoming.filter(event => isEventPast(event.date));
  const allPastEvents = [...data.past, ...pastEventsFromUpcoming];
  
  // Trier par date décroissante (plus récent en premier)
  allPastEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (allPastEvents.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:4rem 2rem;background:var(--beige-light);border-radius:20px;border:2px dashed var(--beige-2);grid-column:1/-1;position:relative;overflow:hidden;">
        <span style="position:absolute;top:15px;left:20px;font-size:1.8rem;opacity:0.3;">🍃</span>
        <span style="position:absolute;top:20px;right:25px;font-size:1.6rem;opacity:0.3;">🦋</span>
        <span style="position:absolute;bottom:20px;left:30px;font-size:1.5rem;opacity:0.3;">🌿</span>
        <span style="position:absolute;bottom:25px;right:20px;font-size:1.7rem;opacity:0.3;">🌸</span>
        <div style="font-size:3.5rem;margin-bottom:1rem;">📚</div>
        <p style="font-family:'Montserrat',sans-serif;font-size:1.2rem;font-weight:700;color:var(--brown);margin:0 0 0.5rem;">Le carnet de bord est encore vide</p>
        <p style="font-family:'Lora',serif;font-size:1rem;color:#7a6a50;margin:0;">Les souvenirs de nos aventures apparaîtront bientôt ici.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = allPastEvents.map(event => createPastEventCard(event)).join('');
}

// Fonction pour déployer/replier les détails d'un événement
function toggleEventDetails(eventId) {
  const detailsDiv = document.getElementById(`details-${eventId}`);
  const iconSpan = document.getElementById(`icon-${eventId}`);
  const textSpan = document.getElementById(`text-${eventId}`);
  
  if (detailsDiv.style.maxHeight === '0px' || detailsDiv.style.maxHeight === '') {
    // Déployer
    detailsDiv.style.maxHeight = detailsDiv.scrollHeight + 'px';
    iconSpan.textContent = '👆';
    textSpan.textContent = 'Masquer les détails';
  } else {
    // Replier
    detailsDiv.style.maxHeight = '0px';
    iconSpan.textContent = '👇';
    textSpan.textContent = "Voir le détail de l'événement";
  }
}

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('upcoming-events-container')) {
    displayUpcomingEvents('upcoming-events-container');
  }
  if (document.getElementById('past-events-container')) {
    displayPastEvents('past-events-container');
  }
  if (document.getElementById('upcoming-events-container-home')) {
    displayUpcomingEvents('upcoming-events-container-home');
  }
});


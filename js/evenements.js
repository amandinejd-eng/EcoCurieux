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
    `<p style="font-size:0.87rem;line-height:1.6;color:#5a5040;margin:0.5rem 0 0;"><strong style="color:var(--green-dark);">Inédit :</strong> ${event.details}</p>` 
    : '';
  
  return `
    <div class="service-card" style="background:var(--white);border:2px solid var(--beige-2);border-radius:20px;padding:1.5rem;box-shadow:5px 5px 0 var(--beige-2);">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;">
        <div style="background:var(--green);color:var(--white);padding:0.5rem 1rem;border-radius:10px;font-weight:700;text-align:center;min-width:60px;">
          <div style="font-size:1.2rem;line-height:1;">${event.day}</div>
          <div style="font-size:0.7rem;">${event.month}</div>
        </div>
        <div>
          <h3 style="font-family:'Montserrat',sans-serif;font-size:1rem;font-weight:800;color:var(--green-dark);margin:0;">${event.title}</h3>
          <p style="font-size:0.85rem;color:#7a6a50;margin:0.2rem 0 0;">${event.location}</p>
        </div>
      </div>
      <p style="font-size:0.87rem;line-height:1.6;color:#5a5040;margin:0;">${event.description}</p>
      ${detailsHtml}
      <div style="margin-top:0.8rem;">
        <span style="display:inline-block;background:var(--beige);border:1px solid var(--beige-2);color:var(--green-dark);padding:3px 10px;border-radius:20px;font-family:'Montserrat',sans-serif;font-size:0.72rem;font-weight:700;margin-right:0.3rem;">🕐 ${event.time}</span>
        <span style="display:inline-block;background:var(--beige);border:1px solid var(--beige-2);color:var(--green-dark);padding:3px 10px;border-radius:20px;font-family:'Montserrat',sans-serif;font-size:0.72rem;font-weight:700;">👨‍👩‍👧‍👦 ${event.audience}</span>
      </div>
    </div>
  `;
}

function createPastEventCard(event) {
  const photosHtml = event.photos && event.photos.length > 0 ? 
    `<div style="margin-bottom:1rem;">
      <img src="${event.photos[0]}" alt="${event.title}" style="width:100%;height:200px;object-fit:cover;border-radius:15px;">
    </div>` 
    : '';
  
  const recapHtml = event.recap ? 
    `<p style="font-size:0.9rem;line-height:1.6;color:#5a5040;margin-top:0.8rem;font-style:italic;">${event.recap}</p>` 
    : '';
  
  return `
    <div class="service-card" style="background:var(--white);border:2px solid var(--beige-2);border-radius:20px;padding:1.5rem;box-shadow:5px 5px 0 rgba(143,82,40,0.3);">
      ${photosHtml}
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;">
        <div style="background:var(--brown);color:var(--white);padding:0.5rem 1rem;border-radius:10px;font-weight:700;text-align:center;min-width:60px;opacity:0.85;">
          <div style="font-size:1.2rem;line-height:1;">${event.day}</div>
          <div style="font-size:0.7rem;">${event.month}</div>
        </div>
        <div>
          <h3 style="font-family:'Montserrat',sans-serif;font-size:1rem;font-weight:800;color:var(--green-dark);margin:0;">${event.title}</h3>
          <p style="font-size:0.85rem;color:#7a6a50;margin:0.2rem 0 0;">${event.location}</p>
        </div>
      </div>
      <p style="font-size:0.87rem;line-height:1.6;color:#5a5040;margin:0;">${event.description}</p>
      ${recapHtml}
    </div>
  `;
}

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
    `<div style="margin-top:0.8rem;padding:0.6rem 0.8rem;background:var(--beige-light);border-left:3px solid var(--green);border-radius:0 4px 4px 0;">
      <p style="font-size:0.85rem;line-height:1.5;color:var(--green-dark);margin:0;"><strong style="font-family:'Montserrat',sans-serif;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.5px;">En plus :</strong> ${event.details}</p>
    </div>` 
    : '';
  
  return `
    <div style="background:#f8fdf9;border-left:5px solid var(--green);border-radius:12px;padding:2rem;margin-bottom:1.5rem;display:flex;gap:2.5rem;align-items:flex-start;transition:all 0.3s ease;flex-wrap:wrap;box-shadow:0 2px 10px rgba(107,155,122,0.08);position:relative;" onmouseover="this.style.boxShadow='0 4px 20px rgba(107,155,122,0.15)';this.style.transform='translateX(5px)';" onmouseout="this.style.boxShadow='0 2px 10px rgba(107,155,122,0.08)';this.style.transform='translateX(0)';">
      
      <!-- Emoticon décoratif -->
      <span style="position:absolute;top:1rem;right:1rem;font-size:1.8rem;opacity:0.4;">🌱</span>
      
      <!-- Date Minimaliste -->
      <div style="text-align:left;min-width:100px;display:flex;flex-direction:column;border-right:3px solid var(--green);padding-right:2rem;">
        <div style="font-size:2.8rem;font-weight:900;color:var(--green-dark);line-height:1;font-family:'Montserrat',sans-serif;letter-spacing:-1px;">${event.day}</div>
        <div style="font-family:'Montserrat',sans-serif;font-size:0.9rem;font-weight:700;color:var(--green);text-transform:uppercase;margin-top:0.2rem;letter-spacing:1px;">${event.month}</div>
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
        <span style="display:inline-flex;align-items:center;gap:0.5rem;background:linear-gradient(135deg, #6fb87e 0%, #5a9c6a 100%);color:var(--white);padding:9px 15px;border-radius:8px;font-family:'Montserrat',sans-serif;font-size:0.8rem;font-weight:700;box-shadow:0 2px 8px rgba(107,155,122,0.25);">
          <span style="font-size:1rem;">⏰</span>
          ${event.time}
        </span>
        <span style="display:inline-flex;align-items:center;gap:0.5rem;background:linear-gradient(135deg, #e89b5f 0%, #d4834a 100%);color:var(--white);padding:9px 15px;border-radius:8px;font-family:'Montserrat',sans-serif;font-size:0.8rem;font-weight:700;box-shadow:0 2px 8px rgba(232,155,95,0.25);">
          <span style="font-size:1rem;">👥</span>
          ${event.audience}
        </span>
      </div>

    </div>
  `;
}

function createPastEventCard(event) {
  const photosHtml = event.photos && event.photos.length > 0 ? 
    `<div style="width:100%;height:220px;overflow:hidden;border-radius:12px;margin-bottom:1.5rem;box-shadow:0 4px 15px rgba(0,0,0,0.05);">
      <img src="${event.photos[0]}" alt="${event.title}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
    </div>` 
    : '';
  
  const recapHtml = event.recap ? 
    `<div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--beige-2);">
      <p style="font-family:'Lora',serif;font-size:0.95rem;line-height:1.6;color:#6b5a40;font-style:italic;margin:0;">
        <span style="color:var(--brown);font-weight:700;font-style:normal;display:flex;align-items:center;gap:0.5rem;margin-bottom:0.6rem;font-family:'Montserrat',sans-serif;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;">
          <span style="font-size:1.1rem;">📖</span>
          Retour sur l'événement
        </span>
        "${event.recap}"
      </p>
    </div>` 
    : '';
  
  return `
    <div style="background:#fdfbf8;border-top:4px solid var(--brown);border-radius:16px;padding:2rem;box-shadow:0 8px 25px rgba(143,82,40,0.08);display:flex;flex-direction:column;height:100%;transition:all 0.35s ease;position:relative;" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 12px 35px rgba(143,82,40,0.15)';" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 25px rgba(143,82,40,0.08)';">
      
      <!-- Emoticon décoratif -->
      <span style="position:absolute;top:1rem;right:1rem;font-size:1.8rem;opacity:0.35;">🍃</span>
      
      ${photosHtml}
      
      <div style="flex:1;display:flex;flex-direction:column;">
        <div style="display:flex;align-items:flex-start;gap:1rem;margin-bottom:1rem;">
          <div style="text-align:center;min-width:50px;border-right:3px solid var(--brown);padding-right:1rem;">
            <div style="font-size:1.7rem;font-weight:900;line-height:1;color:var(--brown);font-family:'Montserrat',sans-serif;">${event.day}</div>
            <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;margin-top:3px;color:var(--brown);font-family:'Montserrat',sans-serif;">${event.month}</div>
          </div>
          <div style="flex:1;">
            <h3 style="font-family:'Montserrat',sans-serif;font-size:1.15rem;font-weight:800;color:var(--green-dark);margin:0 0 0.4rem;line-height:1.3;">${event.title}</h3>
            <p style="font-size:0.85rem;color:#8a7a60;margin:0;display:flex;align-items:center;gap:0.4rem;">
              <span style="font-size:1rem;">📍</span>
              ${event.location}
            </p>
          </div>
        </div>
        
        <p style="font-family:'Lora',serif;font-size:0.95rem;line-height:1.7;color:#5a5040;margin:0;">${event.description}</p>
        
        <div style="flex:1;"></div>
        
        ${recapHtml}
      </div>
    </div>
  `;
}

async function displayUpcomingEvents(containerId) {
  const data = await loadEvents();
  const container = document.getElementById(containerId);
  
  if (!container) return;
  
  // Filtrer les événements à venir
  const upcomingEvents = data.upcoming.filter(event => !isEventPast(event.date));
  
  if (upcomingEvents.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:4rem 2rem;background:linear-gradient(135deg, var(--beige-light) 0%, #f8fdf9 100%);border-radius:20px;border:2px dashed #d4c4a8;position:relative;overflow:hidden;">
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
  
  // Récupérer tous les événements passés
  const pastEventsFromUpcoming = data.upcoming.filter(event => isEventPast(event.date));
  const allPastEvents = [...data.past, ...pastEventsFromUpcoming];
  
  // Trier par date décroissante (plus récent en premier)
  allPastEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (allPastEvents.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:4rem 2rem;background:linear-gradient(135deg, #fdfbf8 0%, var(--beige-light) 100%);border-radius:20px;border:2px dashed #d4c4a8;grid-column:1/-1;position:relative;overflow:hidden;">
        <span style="position:absolute;top:15px;left:20px;font-size:1.8rem;opacity:0.3;">🍃</span>
        <span style="position:absolute;top:20px;right:25px;font-size:1.6rem;opacity:0.3;">🦋</span>
        <span style="position:absolute;bottom:20px;left:30px;font-size:1.5rem;opacity:0.3;">🌿</span>
        <span style="position:absolute;bottom:25px;right:20px;font-size:1.7rem;opacity:0.3;">🌸</span>
        <div style="font-size:3.5rem;margin-bottom:1rem;">�</div>
        <p style="font-family:'Montserrat',sans-serif;font-size:1.2rem;font-weight:700;color:var(--brown);margin:0 0 0.5rem;">Le carnet de bord est encore vide</p>
        <p style="font-family:'Lora',serif;font-size:1rem;color:#7a6a50;margin:0;">Les souvenirs de nos aventures apparaîtront bientôt ici.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = allPastEvents.map(event => createPastEventCard(event)).join('');
}

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('upcoming-events-container')) {
    displayUpcomingEvents('upcoming-events-container');
  }
  if (document.getElementById('past-events-container')) {
    displayPastEvents('past-events-container');
  }
});

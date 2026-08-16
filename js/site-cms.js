(function () {
  const PAGE_FILES = {
    accueil: '/contenu/accueil.json',
    animations: '/contenu/animations.json',
    'pour-qui': '/contenu/pour-qui.json',
    contact: '/contenu/contact.json',
    kits: '/contenu/kits.json',
    'kit-couveuse': '/contenu/kits.json',
    'kit-mante': '/contenu/kits.json',
    'kit-phasmes': '/contenu/kits.json'
  };

  const MONTHS_FR = [
    'JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
    'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'
  ];

  function getPath(obj, path) {
    return path.split('.').reduce(function (acc, key) {
      return acc == null ? acc : acc[key];
    }, obj);
  }

  function listText(item) {
    if (item == null) return '';
    if (typeof item === 'string') return item;
    return item.texte || item.label || item.title || '';
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function applyTheme(theme) {
    if (!theme) return;
    var root = document.documentElement;
    var colors = theme.colors || {};
    if (colors.green) root.style.setProperty('--green', colors.green);
    if (colors.greenDark) root.style.setProperty('--green-dark', colors.greenDark);
    if (colors.brown) root.style.setProperty('--brown', colors.brown);
    if (colors.beige) root.style.setProperty('--beige', colors.beige);
    if (colors.beige2) root.style.setProperty('--beige-2', colors.beige2);
    if (colors.beigeLight) root.style.setProperty('--beige-light', colors.beigeLight);

    var fonts = theme.fonts || {};
    var titres = fonts.titres || 'Montserrat';
    var texte = fonts.texte || 'Lora';
    var logoFont = fonts.logo || 'Nunito';
    root.style.setProperty('--font-titles', "'" + titres + "', sans-serif");
    root.style.setProperty('--font-body', "'" + texte + "', serif");
    root.style.setProperty('--font-logo', "'" + logoFont + "', sans-serif");

    var families = [titres, texte, logoFont].filter(function (name, i, arr) {
      return arr.indexOf(name) === i;
    }).map(function (name) {
      return 'family=' + String(name).replace(/ /g, '+') + ':ital,wght@0,400;0,600;0,700;0,800;0,900;1,400';
    }).join('&');

    var fontLink = document.getElementById('site-fonts');
    if (!fontLink) {
      fontLink = document.createElement('link');
      fontLink.id = 'site-fonts';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    }
    fontLink.href = 'https://fonts.googleapis.com/css2?' + families + '&display=swap';

    var style = document.getElementById('cms-theme-override');
    if (!style) {
      style = document.createElement('style');
      style.id = 'cms-theme-override';
      document.head.appendChild(style);
    }
    style.textContent =
      'body, p { font-family: var(--font-body) !important; }' +
      'h1, h2, h3, h4, h5, h6, .section-title, .nav-links a, .nav-cta, .btn-primary, .btn-outline, .mm-head, .mobile-menu a, .hero-badge, .section-label { font-family: var(--font-titles) !important; }' +
      '.nav-logo-name { font-family: var(--font-logo) !important; }';

    document.querySelectorAll('.nav-logo-name').forEach(function (el) {
      if (theme.nom) el.textContent = theme.nom;
    });
    document.querySelectorAll('.nav-logo-sub').forEach(function (el) {
      if (theme.slogan) el.textContent = theme.slogan;
    });
    document.querySelectorAll('.nav-logo-img img').forEach(function (el) {
      if (theme.logo) el.src = theme.logo;
    });

    document.querySelectorAll('footer').forEach(function (footer) {
      var lines = footer.querySelectorAll('p');
      if (lines[0] && theme.nom && theme.slogan) {
        lines[0].textContent = theme.nom + ' · ' + theme.slogan;
      }
      if (lines[1] && theme.auteur) {
        lines[1].textContent = theme.auteur;
      }
      if (lines[2]) {
        var year = new Date().getFullYear();
        var zoneShort = (theme.zone || 'Saône-et-Loire').split('&')[0].trim();
        var email = theme.email || 'amandinejd@gmail.com';
        lines[2].innerHTML = '© ' + year + ' · ' + escapeHtml(zoneShort) +
          ' · <a href="mailto:' + escapeHtml(email) +
          '" style="color:rgba(243,222,180,0.85); font-weight:600; text-decoration:none;">' +
          escapeHtml(email) + '</a>';
      }
    });
  }

  function applyFields(data) {
    document.querySelectorAll('[data-cms]').forEach(function (el) {
      var value = getPath(data, el.getAttribute('data-cms'));
      if (value == null || value === '') return;
      el.textContent = value;
    });
    document.querySelectorAll('[data-cms-html]').forEach(function (el) {
      var value = getPath(data, el.getAttribute('data-cms-html'));
      if (value == null || value === '') return;
      el.innerHTML = value;
    });
    document.querySelectorAll('[data-cms-src]').forEach(function (el) {
      var value = getPath(data, el.getAttribute('data-cms-src'));
      if (!value) return;
      el.src = value;
    });
  }

  function renderBulles(bulles) {
    var box = document.querySelector('[data-cms-bulles]');
    if (!box || !bulles || !bulles.length) return;
    box.innerHTML = bulles.map(function (item) {
      var html = escapeHtml(item.texte || '').replace(/\n/g, '<br>');
      return '<div class="hbb"><img src="' + escapeHtml(item.image || '') +
        '" alt="' + escapeHtml((item.texte || '').replace(/\n/g, ' ')) +
        '"><div class="bubble-text">' + html + '</div></div>';
    }).join('');
  }

  function renderTicker(items) {
    var box = document.querySelector('[data-cms-bandeau]');
    if (!box || !items || !items.length) return;
    var html = items.map(function (item) {
      return '<span>' + escapeHtml(listText(item)) + '</span>';
    }).join('');
    box.innerHTML = html + html;
  }

  function renderPiliers(piliers) {
    var box = document.querySelector('[data-cms-piliers]');
    if (!box || !piliers) return;
    box.innerHTML = piliers.map(function (item) {
      return '<div class="pillier"><h4>' + escapeHtml(item.titre || '') +
        '</h4><p>' + escapeHtml(item.texte || '') + '</p></div>';
    }).join('');
  }

  function renderValeurs(valeurs) {
    var box = document.querySelector('[data-cms-valeurs]');
    if (!box || !valeurs) return;
    box.innerHTML = valeurs.map(function (item) {
      return '<div class="valeur"><div class="vi">' + escapeHtml(item.emoji || '') +
        '</div><span>' + escapeHtml(item.texte || '') + '</span></div>';
    }).join('');
  }

  function renderGaranties(items) {
    var box = document.querySelector('[data-cms-garanties]');
    if (!box || !items) return;
    var classes = ['', 'gb-green', 'gb-brown'];
    var shadows = ['var(--beige-2)', 'var(--green-dark)', '#8f5228'];
    box.innerHTML = items.map(function (item, i) {
      return '<div class="garantie-box ' + (classes[i] || '') +
        '" style="box-shadow: 4px 4px 0 ' + (shadows[i] || 'var(--beige-2)') +
        ';"><div class="gb-icon">' + escapeHtml(item.emoji || '') +
        '</div><div><div class="gb-title">' + escapeHtml(item.titre || '') +
        '</div><div class="gb-sub">' + escapeHtml(item.sous || '') +
        '</div></div></div>';
    }).join('');
  }

  function renderSimpleList(selector, items, className) {
    var box = document.querySelector(selector);
    if (!box || !items) return;
    box.innerHTML = items.map(function (item) {
      var text = escapeHtml(listText(item));
      if (className === 'stage-mini-item') {
        return '<div class="stage-mini-item"><span>' + text + '</span></div>';
      }
      return '<div class="' + className + '">' + text + '</div>';
    }).join('');
  }

  function renderTags(selector, items, className) {
    var box = document.querySelector(selector);
    if (!box || !items) return;
    box.innerHTML = items.map(function (item) {
      return '<span class="' + className + '">' + escapeHtml(listText(item)) + '</span>';
    }).join('');
  }

  function renderThemes(themes) {
    var box = document.querySelector('[data-cms-themes]');
    if (!box || !themes) return;
    box.innerHTML = themes.map(function (item) {
      return '<div class="theme-card"><span class="theme-icon">' + escapeHtml(item.emoji || '') +
        '</span><div class="theme-card-body"><h4>' + escapeHtml(item.titre || '') +
        '</h4><p>' + escapeHtml(item.texte || '') + '</p></div></div>';
    }).join('');
  }

  function renderUnivers(items) {
    var box = document.querySelector('[data-cms-univers]');
    if (!box || !items) return;
    box.innerHTML = items.map(function (item) {
      return '<div class="univers-mini-card"><span class="ubc-icon-sm">' +
        escapeHtml(item.emoji || '') + '</span><div><strong>' +
        escapeHtml(item.titre || '') + '</strong><p>' +
        escapeHtml(item.texte || '') + '</p></div></div>';
    }).join('');
  }

  function renderPourQui(cartes) {
    var box = document.querySelector('[data-cms-cartes]');
    if (!box || !cartes) return;
    var extra = ['ac-scolaires', 'ac-green ac-loisirs', 'ac-brown ac-collectivites', 'ac-particuliers'];
    box.innerHTML = cartes.map(function (item, i) {
      var tags = (item.etiquettes || []).map(function (tag) {
        return '<span class="atelier-tag">' + escapeHtml(listText(tag)) + '</span>';
      }).join('');
      var photo = item.photo ? ' style="--cms-card-photo:url(\'' + String(item.photo).replace(/'/g, '%27') + '\')"' : '';
      return '<div class="atelier-card ' + (extra[i] || '') + '"' + photo + '>' +
        '<div class="ac-top"><div class="ac-icon-wrap">' + escapeHtml(item.emoji || '') +
        '</div><h3>' + escapeHtml(item.titre || '') + '</h3></div>' +
        '<p>' + escapeHtml(item.texte || '') + '</p>' +
        '<div class="atelier-tags">' + tags + '</div></div>';
    }).join('');

    var style = document.getElementById('cms-pour-qui-photos');
    if (!style) {
      style = document.createElement('style');
      style.id = 'cms-pour-qui-photos';
      document.head.appendChild(style);
    }
    style.textContent = cartes.map(function (item, i) {
      if (!item.photo) return '';
      var sel = ['.ac-scolaires', '.ac-loisirs', '.ac-collectivites', '.ac-particuliers'][i];
      if (!sel) return '';
      var overlay = i === 2
        ? 'linear-gradient(to bottom, rgba(0,0,0,0) 15%, rgba(100,50,10,0.93) 65%)'
        : 'linear-gradient(to bottom, rgba(0,0,0,0) 15%, rgba(44,79,42,0.92) 65%)';
      return sel + '{ background: ' + overlay + ', url("' + encodeURI(item.photo).replace(/&/g, '%26') + '") center/cover no-repeat !important; }';
    }).join('');
  }

  function findKit(data, id) {
    return ((data && data.fiches) || []).find(function (item) { return item.id === id; });
  }

  function paragraphs(text) {
    return String(text || '').split(/\n+/).filter(Boolean).map(function (p) {
      return '<p>' + escapeHtml(p) + '</p>';
    }).join('');
  }

  function listItems(text) {
    return String(text || '').split(/\n+/).filter(Boolean).map(function (p) {
      return '<li>' + escapeHtml(p) + '</li>';
    }).join('');
  }

  function applyKitFiche(fiche) {
    if (!fiche) return;
    applyFields(fiche);
    var desc = document.querySelector('[data-cms-kit-desc]');
    if (desc) desc.innerHTML = paragraphs(fiche.description);
    var contenu = document.querySelector('[data-cms-kit-contenu]');
    if (contenu) contenu.innerHTML = listItems(fiche.contenu);
  }

  function applyKitsIndex(data) {
    if (!data) return;
    applyFields(data.index || {});
    renderTags('[data-cms-pastilles]', (data.index && data.index.pastilles) || [], 'info-pill');
    var cards = document.querySelectorAll('[data-cms-kit-card]');
    (data.fiches || []).forEach(function (fiche, i) {
      var card = cards[i];
      if (!card) return;
      var img = card.querySelector('img');
      var title = card.querySelector('h2');
      var text = card.querySelector('.kit-card-body p');
      if (img && fiche.photo) img.src = fiche.photo;
      if (title) title.textContent = ((fiche.titre || '') + ' ' + (fiche.titreAccent || '')).trim();
      if (text) text.textContent = fiche.texteCarte || '';
    });
  }

  function applyContact(data, theme) {
    applyFields(data);
    var details = document.querySelector('[data-cms-contact-details]');
    if (details && theme) {
      details.innerHTML =
        '<div class="cv4-detail"><div class="cv4-detail-icon">📞</div> ' + escapeHtml(theme.telephone || '') + '</div>' +
        '<a href="mailto:' + escapeHtml(theme.email || '') + '" class="cv4-detail"><div class="cv4-detail-icon">✉️</div> ' +
        escapeHtml(theme.email || '') + '</a>' +
        '<div class="cv4-detail"><div class="cv4-detail-icon">📍</div> ' + escapeHtml(theme.zone || '') + '</div>';
    }
    if (data.qrFacebook) {
      var fb = document.querySelector('[data-cms-src="qrFacebook"]');
      if (fb) fb.src = data.qrFacebook;
    }
    if (data.qrInstagram) {
      var ig = document.querySelector('[data-cms-src="qrInstagram"]');
      if (ig) ig.src = data.qrInstagram;
    }
  }

  async function initContent(theme) {
    var page = document.body && document.body.getAttribute('data-page');
    var file = PAGE_FILES[page];
    if (!file) return;
    var data;
    try {
      var res = await fetch(file);
      if (!res.ok) return;
      data = await res.json();
    } catch (err) {
      console.error('Impossible de charger le contenu CMS', err);
      return;
    }

    if (page === 'accueil') {
      applyFields(data);
      renderBulles(data.bulles);
      renderTicker(data.bandeau);
      renderPiliers(data.demarche && data.demarche.piliers);
      renderValeurs(data.demarche && data.demarche.valeurs);
      renderGaranties(data.garanties);
    } else if (page === 'animations') {
      applyFields(data);
      renderSimpleList('[data-cms-puces]', data.atelier && data.atelier.puces, 'rubrique-bullet');
      renderTags('[data-cms-etiquettes]', data.atelier && data.atelier.etiquettes, 'theme-tag');
      renderThemes(data.atelier && data.atelier.themes);
      renderUnivers(data.anniversaires && data.anniversaires.univers);
      renderSimpleList('[data-cms-infos]', data.stages && data.stages.infos, 'stage-mini-item');
    } else if (page === 'pour-qui') {
      applyFields(data);
      renderPourQui(data.cartes);
    } else if (page === 'contact') {
      applyContact(data, theme);
    } else if (page === 'kits') {
      applyKitsIndex(data);
    } else if (page === 'kit-couveuse') {
      applyKitFiche(findKit(data, 'couveuse'));
    } else if (page === 'kit-mante') {
      applyKitFiche(findKit(data, 'mante'));
    } else if (page === 'kit-phasmes') {
      applyKitFiche(findKit(data, 'phasmes'));
    }
  }

  window.EcoCms = {
    normalizeEventDate: function (event) {
      if (!event || !event.date) return event;
      var raw = String(event.date).slice(0, 10);
      var parts = raw.split('-');
      if (parts.length !== 3) return event;
      var year = parts[0];
      var monthIndex = parseInt(parts[1], 10) - 1;
      var dayNum = parseInt(parts[2], 10);
      event.day = event.day || String(dayNum).padStart(2, '0');
      event.month = event.month || MONTHS_FR[monthIndex] || '';
      event.year = event.year || year;
      event.id = event.id || ('event-' + raw);
      return event;
    }
  };

  fetch('/contenu/theme.json')
    .then(function (res) { return res.ok ? res.json() : {}; })
    .then(function (theme) {
      var start = function () {
        applyTheme(theme);
        initContent(theme);
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
      } else {
        start();
      }
    })
    .catch(function () {
      var start = function () { initContent(null); };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
      } else {
        start();
      }
    });
})();

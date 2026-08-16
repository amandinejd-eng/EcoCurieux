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

  function richText(str) {
    return escapeHtml(str)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function slugify(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function isVisible(item) {
    return item && item.visible !== false;
  }

  function applyNav(nav, extras) {
    if (!nav || !nav.items) return;
    var items = nav.items.filter(isVisible);
    var extraPages = ((extras && extras.pages) || []).filter(function (page) {
      return isVisible(page) && page.afficherMenu;
    });
    var hrefs = items.map(function (item) { return item.href; });
    extraPages.forEach(function (page) {
      var href = '/p/' + slugify(page.slug || page.titre);
      if (hrefs.indexOf(href) !== -1) return;
      items.push({
        emoji: page.emoji || '🌿',
        label: page.titre || page.slug,
        href: href
      });
      hrefs.push(href);
    });

    var links = document.querySelector('.nav-links');
    if (links) {
      links.innerHTML = items.map(function (item) {
        var children = (item.children || []).filter(isVisible);
        if (children.length) {
          return '<li><a href="' + escapeHtml(item.href || '#') + '">' + escapeHtml(item.label || '') +
            ' <span class="arrow">▼</span></a><div class="dropdown">' +
            children.map(function (child) {
              return '<a href="' + escapeHtml(child.href || '#') + '"><span class="dd-icon">' +
                escapeHtml(child.emoji || '') + '</span>' + escapeHtml(child.label || '') + '</a>';
            }).join('') + '</div></li>';
        }
        return '<li><a href="' + escapeHtml(item.href || '#') + '">' + escapeHtml(item.label || '') + '</a></li>';
      }).join('');
    }

    var cta = nav.cta;
    document.querySelectorAll('.nav-cta').forEach(function (el) {
      if (!cta || cta.visible === false) {
        el.style.display = 'none';
        return;
      }
      el.style.display = '';
      el.href = cta.href || '/contact.html';
      el.textContent = ((cta.emoji ? cta.emoji + ' ' : '') + (cta.label || 'Me contacter')).trim();
    });

    var mobile = document.getElementById('mobileMenu');
    if (mobile) {
      var html = '<span class="mm-head">Menu</span>';
      items.forEach(function (item) {
        var children = (item.children || []).filter(isVisible);
        if (children.length) {
          html += '<span class="mm-head">' + escapeHtml(item.label || '') + '</span>';
          children.forEach(function (child) {
            html += '<a href="' + escapeHtml(child.href || '#') + '" onclick="toggleMenu()"><span>' +
              escapeHtml(child.emoji || '') + '</span> ' + escapeHtml(child.label || '') + '</a>';
          });
        } else {
          html += '<a href="' + escapeHtml(item.href || '#') + '" onclick="toggleMenu()"><span>' +
            escapeHtml(item.emoji || '') + '</span> ' + escapeHtml(item.label || '') + '</a>';
        }
      });
      if (cta && cta.visible !== false) {
        html += '<a href="' + escapeHtml(cta.href || '/contact.html') + '" class="mm-cta" onclick="toggleMenu()">' +
          escapeHtml(cta.label || 'Me contacter') + '</a>';
      }
      mobile.innerHTML = html;
    }

    if (window.EcoNav && typeof window.EcoNav.bind === 'function') window.EcoNav.bind();
  }

  function pageSlug() {
    var path = String(location.pathname || '').replace(/\/+$/, '');
    var match = path.match(/\/p\/([^/]+)$/);
    if (match) return decodeURIComponent(match[1]);
    try {
      return new URLSearchParams(location.search).get('slug') || '';
    } catch (err) {
      return '';
    }
  }

  function renderFreePage(bundle) {
    var slug = slugify(pageSlug());
    var pages = (bundle && bundle.pages) || [];
    var page = pages.find(function (item) {
      return slugify(item.slug || item.titre) === slug && isVisible(item);
    });
    var root = document.getElementById('free-page');
    if (!root) return;
    if (!page) {
      document.title = 'Page introuvable – Écocurieux';
      root.innerHTML =
        '<div class="free-empty"><div>🌱</div><h1>Cette page n’existe pas (encore)</h1>' +
        '<p>Elle a peut-être été masquée ou l’adresse n’est pas la bonne.</p>' +
        '<a class="btn-primary" href="/">Retour à l’accueil</a></div>';
      return;
    }
    document.title = (page.titre || 'Écocurieux') + ' – Écocurieux';
    var accent = page.couleurAccent ? ' style="color:' + String(page.couleurAccent).replace(/"/g, '') + '"' : '';
    var photos = (page.photos || []).filter(function (photo) { return photo && photo.url; });
    var photoHtml = photos.map(function (photo) {
      var pos = photo.position || 'pleine';
      return '<figure class="free-photo layout-' + pos + '"><img src="' + escapeHtml(photo.url) +
        '" alt="' + escapeHtml(photo.caption || page.titre || '') + '">' +
        (photo.caption ? '<figcaption>' + escapeHtml(photo.caption) + '</figcaption>' : '') +
        '</figure>';
    }).join('');
    var blocs = (page.blocs || []).map(function (bloc) {
      var color = bloc.couleur ? ' style="border-left-color:' + String(bloc.couleur).replace(/"/g, '') + '"' : '';
      var img = bloc.photo ? '<img src="' + escapeHtml(bloc.photo) + '" alt="' + escapeHtml(bloc.titre || '') + '">' : '';
      return '<article class="free-block"' + color + '>' + img + '<div><h2>' +
        (bloc.emoji ? escapeHtml(bloc.emoji) + ' ' : '') + escapeHtml(bloc.titre || '') +
        '</h2><p>' + richText(bloc.texte || '') + '</p></div></article>';
    }).join('');
    var cta = (page.ctaLabel && page.ctaLien)
      ? '<a class="btn-primary" href="' + escapeHtml(page.ctaLien) + '">' + escapeHtml(page.ctaLabel) + '</a>'
      : '';
    root.innerHTML =
      '<header class="free-hero">' +
        (page.badge ? '<div class="hero-badge">' + escapeHtml(page.badge) + '</div>' : '') +
        '<h1>' + (page.emoji ? '<span class="free-emoji">' + escapeHtml(page.emoji) + '</span> ' : '') +
        escapeHtml(page.titre || '') +
        (page.titreAccent ? ' <span class="accent"' + accent + '>' + escapeHtml(page.titreAccent) + '</span>' : '') +
        '</h1>' +
        (page.sousTitre ? '<p class="free-sub">' + escapeHtml(page.sousTitre) + '</p>' : '') +
      '</header>' +
      (page.intro ? '<p class="free-intro">' + richText(page.intro) + '</p>' : '') +
      (photoHtml ? '<div class="free-photos">' + photoHtml + '</div>' : '') +
      (blocs ? '<div class="free-blocks">' + blocs + '</div>' : '') +
      (cta ? '<div class="free-cta">' + cta + '</div>' : '');
  }

  function applyColor(selector, color) {
    if (!color) return;
    document.querySelectorAll(selector).forEach(function (el) {
      el.style.color = color;
    });
  }

  function overlayFromColor(color, fallback) {
    var raw = String(color || '').trim();
    var hex = raw.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (!hex) return fallback;
    var h = hex[1];
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var r = parseInt(h.slice(0, 2), 16);
    var g = parseInt(h.slice(2, 4), 16);
    var b = parseInt(h.slice(4, 6), 16);
    return 'linear-gradient(to bottom, rgba(0,0,0,0) 15%, rgba(' + r + ',' + g + ',' + b + ',0.92) 65%)';
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
      var emoji = item.emoji ? '<span class="hbb-emoji">' + escapeHtml(item.emoji) + '</span>' : '';
      return '<div class="hbb"><img src="' + escapeHtml(item.image || '') +
        '" alt="' + escapeHtml((item.texte || '').replace(/\n/g, ' ')) +
        '">' + emoji + '<div class="bubble-text">' + html + '</div></div>';
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
      var color = item.couleur ? ' style="border-left-color:' + String(item.couleur).replace(/"/g, '') + '"' : '';
      var emoji = item.emoji ? escapeHtml(item.emoji) + ' ' : '';
      return '<div class="pillier"' + color + '><h4>' + emoji + escapeHtml(item.titre || '') +
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
      var shadow = item.couleur || shadows[i] || 'var(--beige-2)';
      return '<div class="garantie-box ' + (classes[i] || '') +
        '" style="box-shadow: 4px 4px 0 ' + String(shadow).replace(/"/g, '') +
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
      var color = item.couleur ? ' style="border-left:4px solid ' + String(item.couleur).replace(/"/g, '') + '"' : '';
      return '<div class="theme-card"' + color + '><span class="theme-icon">' + escapeHtml(item.emoji || '') +
        '</span><div class="theme-card-body"><h4>' + escapeHtml(item.titre || '') +
        '</h4><p>' + escapeHtml(item.texte || '') + '</p></div></div>';
    }).join('');
  }

  function renderUnivers(items) {
    var box = document.querySelector('[data-cms-univers]');
    if (!box || !items) return;
    box.innerHTML = items.map(function (item) {
      var color = item.couleur ? ' style="border-left:4px solid ' + String(item.couleur).replace(/"/g, '') + '"' : '';
      return '<div class="univers-mini-card"' + color + '><span class="ubc-icon-sm">' +
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
      var overlay = overlayFromColor(item.couleur, i === 2
        ? 'linear-gradient(to bottom, rgba(0,0,0,0) 15%, rgba(100,50,10,0.93) 65%)'
        : 'linear-gradient(to bottom, rgba(0,0,0,0) 15%, rgba(44,79,42,0.92) 65%)');
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
      if (title) title.textContent = ((fiche.emoji ? fiche.emoji + ' ' : '') + (fiche.titre || '') + ' ' + (fiche.titreAccent || '')).trim();
      if (text) text.textContent = fiche.texteCarte || '';
      if (fiche.couleurAccent && title) {
        var accent = title.querySelector('.accent') || title;
        accent.style.color = fiche.couleurAccent;
      }
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

  async function initContent(theme, extras) {
    var page = document.body && document.body.getAttribute('data-page');
    if (page === 'page-libre') {
      renderFreePage(extras || { pages: [] });
      return;
    }
    var file = PAGE_FILES[page];
    if (!file) return;
    var data;
    try {
      var res = await fetch(file, { cache: 'no-store' });
      if (!res.ok) return;
      data = await res.json();
    } catch (err) {
      console.error('Impossible de charger le contenu CMS', err);
      return;
    }

    if (page === 'accueil') {
      applyFields(data);
      applyColor('[data-cms="hero.titreAccent"]', data.hero && data.hero.couleurAccent);
      applyColor('[data-cms="demarche.titreAccent"]', data.demarche && data.demarche.couleurAccent);
      renderBulles(data.bulles);
      renderTicker(data.bandeau);
      renderPiliers(data.demarche && data.demarche.piliers);
      renderValeurs(data.demarche && data.demarche.valeurs);
      renderGaranties(data.garanties);
    } else if (page === 'animations') {
      applyFields(data);
      applyColor('[data-cms="titreAccent"]', data.couleurAccent);
      applyColor('[data-cms="atelier.titreAccent"]', data.atelier && data.atelier.couleurAccent);
      applyColor('[data-cms="anniversaires.titreAccent"]', data.anniversaires && data.anniversaires.couleurAccent);
      applyColor('[data-cms="stages.titreAccent"]', data.stages && data.stages.couleurAccent);
      renderSimpleList('[data-cms-puces]', data.atelier && data.atelier.puces, 'rubrique-bullet');
      renderTags('[data-cms-etiquettes]', data.atelier && data.atelier.etiquettes, 'theme-tag');
      renderThemes(data.atelier && data.atelier.themes);
      renderUnivers(data.anniversaires && data.anniversaires.univers);
      renderSimpleList('[data-cms-infos]', data.stages && data.stages.infos, 'stage-mini-item');
    } else if (page === 'pour-qui') {
      applyFields(data);
      applyColor('[data-cms="titreAccent"]', data.couleurAccent);
      renderPourQui(data.cartes);
    } else if (page === 'contact') {
      applyContact(data, theme);
    } else if (page === 'kits') {
      applyKitsIndex(data);
      applyColor('[data-cms="titreAccent"]', data.index && data.index.couleurAccent);
    } else if (page === 'kit-couveuse') {
      applyKitFiche(findKit(data, 'couveuse'));
      var couveuse = findKit(data, 'couveuse');
      applyColor('[data-cms="titreAccent"]', couveuse && couveuse.couleurAccent);
    } else if (page === 'kit-mante') {
      applyKitFiche(findKit(data, 'mante'));
      var mante = findKit(data, 'mante');
      applyColor('[data-cms="titreAccent"]', mante && mante.couleurAccent);
    } else if (page === 'kit-phasmes') {
      applyKitFiche(findKit(data, 'phasmes'));
      var phasmes = findKit(data, 'phasmes');
      applyColor('[data-cms="titreAccent"]', phasmes && phasmes.couleurAccent);
    }
  }

  window.EcoCms = {
    normalizeEventDate: function (event) {
      if (!event || !event.date) return event;
      var raw = String(event.date).match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (!raw) return event;
      var year = raw[1];
      var monthIndex = parseInt(raw[2], 10) - 1;
      var dayNum = raw[3];
      event.date = raw[0];
      event.day = dayNum;
      event.month = MONTHS_FR[monthIndex] || '';
      event.year = year;
      event.id = event.id || ('event-' + raw[0]);
      return event;
    }
  };

  function loadJson(url) {
    return fetch(url, { cache: 'no-store' }).then(function (res) {
      return res.ok ? res.json() : null;
    }).catch(function () { return null; });
  }

  function boot(theme, nav, extras) {
    applyTheme(theme);
    applyNav(nav, extras);
    initContent(theme, extras);
  }

  Promise.all([
    loadJson('/contenu/theme.json'),
    loadJson('/contenu/navigation.json'),
    loadJson('/contenu/pages-libre.json')
  ]).then(function (results) {
    var theme = results[0] || {};
    var nav = results[1];
    var extras = results[2];
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { boot(theme, nav, extras); });
    } else {
      boot(theme, nav, extras);
    }
  }).catch(function () {
    var start = function () { initContent(null, null); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
  });
})();

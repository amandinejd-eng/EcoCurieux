(function () {
  if (!window.CMS || !window.createClass || !window.h) return;

  var h = window.h;
  var createClass = window.createClass;

  function toJS(value) {
    if (value && typeof value.toJS === 'function') return value.toJS();
    return value;
  }

  function getData(entry) {
    var data = entry && entry.get && entry.get('data');
    return toJS(data) || {};
  }

  function assetUrl(getAsset, path) {
    if (!path) return '';
    try {
      var asset = getAsset(path);
      if (!asset) return path;
      return asset.url || String(asset) || path;
    } catch (err) {
      return path;
    }
  }

  function text(value) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    return value.texte || value.label || value.title || '';
  }

  function list(value) {
    return Array.isArray(value) ? value : [];
  }

  function img(src, className, alt) {
    if (!src) return null;
    return h('img', { className: className || 'pv-img', src: src, alt: alt || '' });
  }

  function kicker(label) {
    return h('div', { className: 'pv-kicker' }, label);
  }

  function empty(message) {
    return h('p', { className: 'pv-empty' }, message || 'Rien à afficher pour l’instant.');
  }

  var ThemePreview = createClass({
    render: function () {
      var d = getData(this.props.entry);
      var colors = d.colors || {};
      var fonts = d.fonts || {};
      var getAsset = this.props.getAsset;
      var swatches = [
        ['Vert', colors.green],
        ['Vert foncé', colors.greenDark],
        ['Brun', colors.brown],
        ['Beige', colors.beige],
        ['Beige 2', colors.beige2],
        ['Fond', colors.beigeLight]
      ];
      return h('div', { className: 'pv' },
        kicker('Apparence du site'),
        h('h1', {}, d.nom || 'Écocurieux'),
        h('p', {}, d.slogan || ''),
        img(assetUrl(getAsset, d.logo), 'pv-img', 'Logo'),
        h('div', { className: 'pv-card' },
          h('p', {}, (d.auteur || '') + (d.zone ? ' · ' + d.zone : '')),
          h('p', { className: 'pv-muted' }, [d.email, d.telephone].filter(Boolean).join(' · '))
        ),
        h('h2', {}, 'Couleurs'),
        h('div', { className: 'pv-swatches' },
          swatches.map(function (item) {
            return h('div', { className: 'pv-swatch', key: item[0] },
              h('i', { style: { background: item[1] || '#ddd' } }),
              item[0]
            );
          })
        ),
        h('div', { className: 'pv-card' },
          h('h2', { style: { fontFamily: (fonts.titres || 'Montserrat') + ', sans-serif' } }, 'Titres : ' + (fonts.titres || 'Montserrat')),
          h('p', { style: { fontFamily: (fonts.texte || 'Lora') + ', serif' } }, 'Texte courant : ' + (fonts.texte || 'Lora')),
          h('p', { style: { fontFamily: (fonts.logo || 'Nunito') + ', sans-serif', fontWeight: 800 } }, 'Logo : ' + (fonts.logo || 'Nunito'))
        )
      );
    }
  });

  var EventsPreview = createClass({
    render: function () {
      var d = getData(this.props.entry);
      var upcoming = list(d.upcoming);
      var past = list(d.past);
      var getAsset = this.props.getAsset;

      function eventCard(event, i, kind) {
        var raw = String(event.date || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
        var day = raw ? raw[3] : '—';
        var monthYear = raw ? raw[2] + '/' + raw[1] : '';
        var photos = list(event.photos);
        var first = photos[0];
        var src = first && (first.url || first);
        var accent = event.couleur || (kind === 'past' ? '#af6a32' : '#467b43');
        var title = (event.emoji ? event.emoji + ' ' : '') + (event.title || 'Sans titre');
        return h('div', {
          className: 'pv-card pv-event',
          key: event.id || i,
          style: { borderLeftColor: accent }
        },
          h('div', { className: 'pv-date', style: { color: accent } },
            h('b', {}, day),
            h('span', {}, monthYear)
          ),
          h('div', { style: { flex: 1 } },
            src ? img(assetUrl(getAsset, src), 'pv-thumb', event.title || '') : null,
            h('h3', { style: event.couleurTitre ? { color: event.couleurTitre } : null }, title),
            event.subtitle ? h('p', { className: 'pv-muted' }, event.subtitle) : null,
            h('p', { className: 'pv-muted' }, event.location || ''),
            h('p', {}, event.description || ''),
            event.time ? h('span', { className: 'pv-chip' }, '⏰ ' + event.time) : null,
            event.audience ? h('span', { className: 'pv-chip' }, '👥 ' + event.audience) : null,
            event.price ? h('span', { className: 'pv-chip' }, '🎟️ ' + event.price) : null,
            photos.length ? h('p', { className: 'pv-muted' }, photos.length + ' photo' + (photos.length > 1 ? 's' : '')) : null
          )
        );
      }

      return h('div', { className: 'pv' },
        kicker('Agenda'),
        h('h1', {}, 'Événements'),
        h('p', { className: 'pv-muted' }, 'La date classe toute seule l’événement. Photos, couleurs et programme s’affichent comme sur le site.'),
        h('h2', {}, 'À venir (' + upcoming.length + ')'),
        upcoming.length ? upcoming.map(function (event, i) { return eventCard(event, i, 'upcoming'); }) : empty('Aucun événement à venir.'),
        h('h2', {}, 'Passés (' + past.length + ')'),
        past.length ? past.map(function (event, i) { return eventCard(event, i, 'past'); }) : empty('Aucun événement passé.')
      );
    }
  });

  var AccueilPreview = createClass({
    render: function () {
      var d = getData(this.props.entry);
      var hero = d.hero || {};
      var qui = d.qui || {};
      var getAsset = this.props.getAsset;
      return h('div', { className: 'pv' },
        kicker(hero.badge || 'Accueil'),
        h('h1', {},
          (hero.titreAvant || '') + ' ',
          h('span', { className: 'pv-accent' }, hero.titreAccent || '')
        ),
        h('p', {}, hero.sousTitre || ''),
        h('p', {}, hero.texte || ''),
        hero.bouton1 ? h('span', { className: 'pv-chip' }, hero.bouton1) : null,
        hero.bouton2 ? h('span', { className: 'pv-chip' }, hero.bouton2) : null,
        h('div', { className: 'pv-card pv-row' },
          img(assetUrl(getAsset, qui.photo), 'pv-thumb', qui.titre || ''),
          h('div', { style: { flex: 1 } },
            h('h2', {}, qui.titre || 'Qui suis-je'),
            h('p', {}, qui.p1 || ''),
            h('p', {}, qui.p2 || '')
          )
        )
      );
    }
  });

  var AnimationsPreview = createClass({
    render: function () {
      var d = getData(this.props.entry);
      return h('div', { className: 'pv' },
        kicker(d.badge || 'Animations'),
        h('h1', {},
          (d.titre || '') + ' ',
          h('span', { className: 'pv-accent' }, d.titreAccent || ''),
          ' ',
          d.titreFin || ''
        ),
        h('p', {}, d.sousTitre || ''),
        ['atelier', 'anniversaires', 'stages'].map(function (key) {
          var block = d[key] || {};
          return h('div', { className: 'pv-card', key: key },
            h('h2', {}, (block.titre || key) + ' ', h('span', { className: 'pv-accent' }, block.titreAccent || '')),
            h('p', {}, block.intro || '')
          );
        })
      );
    }
  });

  var PourQuiPreview = createClass({
    render: function () {
      var d = getData(this.props.entry);
      var cartes = list(d.cartes);
      return h('div', { className: 'pv' },
        kicker(d.label || 'Pour qui'),
        h('h1', {},
          (d.titre || '') + ' ',
          h('span', { className: 'pv-accent' }, d.titreAccent || '')
        ),
        cartes.map(function (carte, i) {
          return h('div', { className: 'pv-card', key: i },
            h('h3', {}, (carte.emoji ? carte.emoji + ' ' : '') + (carte.titre || '')),
            h('p', {}, carte.texte || ''),
            list(carte.etiquettes).map(function (tag, j) {
              return h('span', { className: 'pv-chip', key: j }, text(tag));
            })
          );
        })
      );
    }
  });

  var ContactPreview = createClass({
    render: function () {
      var d = getData(this.props.entry);
      return h('div', { className: 'pv' },
        kicker(d.eyebrow || 'Contact'),
        h('h1', {},
          (d.titre1 || '') + ' ',
          h('span', { className: 'pv-accent' }, d.titreAccent || '')
        ),
        h('p', {}, d.intro || ''),
        h('div', { className: 'pv-card' },
          h('h2', {}, d.formTitre || 'Formulaire'),
          h('p', { className: 'pv-muted' }, d.rc || '')
        )
      );
    }
  });

  var KitsPreview = createClass({
    render: function () {
      var d = getData(this.props.entry);
      var index = d.index || {};
      var fiches = list(d.fiches);
      var getAsset = this.props.getAsset;
      return h('div', { className: 'pv' },
        kicker('Kits'),
        h('h1', {},
          (index.titre || '') + ' ',
          h('span', { className: 'pv-accent' }, index.titreAccent || '')
        ),
        h('p', {}, index.intro || ''),
        fiches.map(function (fiche, i) {
          return h('div', { className: 'pv-card pv-row', key: fiche.id || i },
            img(assetUrl(getAsset, fiche.photo), 'pv-thumb', fiche.titre || ''),
            h('div', { style: { flex: 1 } },
              h('h3', {}, fiche.titre || ''),
              h('p', {}, fiche.texteCarte || fiche.sousTitre || ''),
              fiche.duree ? h('span', { className: 'pv-chip' }, fiche.duree) : null,
              fiche.public ? h('span', { className: 'pv-chip' }, fiche.public) : null,
              fiche.tarif ? h('span', { className: 'pv-chip' }, fiche.tarif) : null
            )
          );
        })
      );
    }
  });

  CMS.registerPreviewStyle('/admin/preview.css');
  CMS.registerPreviewTemplate('theme', ThemePreview);
  CMS.registerPreviewTemplate('agenda', EventsPreview);
  CMS.registerPreviewTemplate('accueil', AccueilPreview);
  CMS.registerPreviewTemplate('animations', AnimationsPreview);
  CMS.registerPreviewTemplate('pour_qui', PourQuiPreview);
  CMS.registerPreviewTemplate('contact', ContactPreview);
  CMS.registerPreviewTemplate('kits', KitsPreview);
})();

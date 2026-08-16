(function () {
  var palette = window.EcoEmojis;
  if (!palette) return;

  var lastField = null;

  function rememberField(el) {
    if (!el) return;
    var tag = (el.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || el.isContentEditable) lastField = el;
  }

  document.addEventListener('focusin', function (e) {
    rememberField(e.target);
  });

  function setNativeValue(el, value) {
    var proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    var desc = Object.getOwnPropertyDescriptor(proto, 'value');
    if (desc && desc.set) desc.set.call(el, value);
    else el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function insertEmoji(emoji) {
    var el = lastField;
    if (el && el.isConnected && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
      var start = el.selectionStart != null ? el.selectionStart : String(el.value || '').length;
      var end = el.selectionEnd != null ? el.selectionEnd : start;
      var value = String(el.value || '');
      setNativeValue(el, value.slice(0, start) + emoji + value.slice(end));
      try {
        el.focus();
        var pos = start + emoji.length;
        el.setSelectionRange(pos, pos);
      } catch (err) {}
      return true;
    }
    if (el && el.isConnected && el.isContentEditable) {
      el.focus();
      try {
        document.execCommand('insertText', false, emoji);
        return true;
      } catch (err) {}
    }
    return false;
  }

  function copyEmoji(emoji) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(emoji).catch(function () {});
    }
  }

  function toast(message) {
    var el = document.getElementById('ec-emoji-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'ec-emoji-toast';
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('is-on');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () {
      el.classList.remove('is-on');
    }, 1600);
  }

  function pick(emoji, fromWidget) {
    copyEmoji(emoji);
    var inserted = insertEmoji(emoji);
    if (fromWidget) return;
    toast(inserted ? emoji + ' ajouté' : emoji + ' copié — Ctrl + V pour coller');
  }

  function renderGrid(container, query, catId, onPick) {
    var items = palette.search(query, catId);
    container.innerHTML = '';
    if (!items.length) {
      var empty = document.createElement('p');
      empty.className = 'ec-emoji-empty';
      empty.textContent = 'Aucun emoji pour cette recherche.';
      container.appendChild(empty);
      return;
    }
    items.slice(0, 420).forEach(function (item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ec-emoji-btn';
      btn.textContent = item.emoji;
      btn.title = item.name || item.emoji;
      btn.addEventListener('click', function () {
        onPick(item.emoji);
      });
      container.appendChild(btn);
    });
  }

  function mountDock() {
    if (document.getElementById('ec-emoji-dock')) return;
    var dock = document.createElement('div');
    dock.id = 'ec-emoji-dock';
    dock.innerHTML =
      '<button type="button" class="ec-emoji-toggle" id="ec-emoji-toggle" title="Palette d’emojis">😊</button>' +
      '<div class="ec-emoji-panel" id="ec-emoji-panel" hidden>' +
        '<div class="ec-emoji-head">' +
          '<strong>Palette d’emojis</strong>' +
          '<button type="button" class="ec-emoji-close" id="ec-emoji-close" aria-label="Fermer">✕</button>' +
        '</div>' +
        '<input type="search" class="ec-emoji-search" id="ec-emoji-search" placeholder="Cherche : oiseau, arbre, fête…">' +
        '<div class="ec-emoji-cats" id="ec-emoji-cats"></div>' +
        '<div class="ec-emoji-grid" id="ec-emoji-grid"></div>' +
        '<p class="ec-emoji-help">Clique un emoji pour l’ajouter dans le champ en cours, ou le copier.</p>' +
      '</div>';
    document.body.appendChild(dock);

    var panel = document.getElementById('ec-emoji-panel');
    var grid = document.getElementById('ec-emoji-grid');
    var search = document.getElementById('ec-emoji-search');
    var catsBox = document.getElementById('ec-emoji-cats');
    var catId = 'tous';

    function addCat(id, label) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ec-emoji-cat' + (id === catId ? ' is-on' : '');
      btn.textContent = label;
      btn.addEventListener('click', function () {
        catId = id;
        Array.prototype.forEach.call(catsBox.children, function (child) {
          child.classList.toggle('is-on', child === btn);
        });
        renderGrid(grid, search.value, catId, function (emoji) {
          pick(emoji, false);
        });
      });
      catsBox.appendChild(btn);
    }

    addCat('tous', 'Tous');
    palette.cats.forEach(function (cat) {
      addCat(cat.id, cat.label);
    });

    function refresh() {
      renderGrid(grid, search.value, catId, function (emoji) {
        pick(emoji, false);
      });
    }

    search.addEventListener('input', refresh);
    document.getElementById('ec-emoji-toggle').addEventListener('click', function () {
      var open = panel.hasAttribute('hidden');
      if (open) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
      if (open) {
        refresh();
        search.focus();
      }
    });
    document.getElementById('ec-emoji-close').addEventListener('click', function () {
      panel.setAttribute('hidden', '');
    });
    refresh();
  }

  function registerWidget() {
    if (!window.CMS || !window.createClass || !window.h) return false;
    if (registerWidget.done) return true;
    registerWidget.done = true;

    var h = window.h;
    var createClass = window.createClass;

    var EmojiControl = createClass({
      getInitialState: function () {
        return { query: '', cat: 'utiles', open: true };
      },
      choose: function (emoji) {
        this.props.onChange(emoji);
      },
      render: function () {
        var self = this;
        var value = this.props.value || '';
        var query = this.state.query || '';
        var cat = this.state.cat || 'utiles';
        var items = palette.search(query, cat).slice(0, 220);

        return h('div', { className: 'ec-emoji-field' },
          h('div', { className: 'ec-emoji-current' },
            h('span', { className: 'ec-emoji-preview' }, value || '🙂'),
            h('input', {
              id: this.props.forID,
              className: this.props.classNameWrapper,
              type: 'text',
              value: value,
              placeholder: 'Clique un emoji ci-dessous',
              onChange: function (e) {
                self.props.onChange(e.target.value);
              },
              onFocus: function (e) {
                rememberField(e.target);
              }
            }),
            value ? h('button', {
              type: 'button',
              className: 'ec-emoji-clear',
              onClick: function () { self.props.onChange(''); }
            }, 'Effacer') : null
          ),
          h('input', {
            type: 'search',
            className: 'ec-emoji-search',
            placeholder: 'Cherche un emoji (oiseau, arbre, fête…)',
            value: query,
            onChange: function (e) {
              self.setState({ query: e.target.value });
            }
          }),
          h('div', { className: 'ec-emoji-cats' },
            [{ id: 'tous', label: 'Tous' }].concat(palette.cats).map(function (catItem) {
              var id = catItem.id;
              var label = catItem.label;
              return h('button', {
                type: 'button',
                key: id,
                className: 'ec-emoji-cat' + (cat === id ? ' is-on' : ''),
                onClick: function () { self.setState({ cat: id }); }
              }, label);
            })
          ),
          h('div', { className: 'ec-emoji-grid' },
            items.length ? items.map(function (item) {
              return h('button', {
                type: 'button',
                key: item.emoji + item.name,
                className: 'ec-emoji-btn' + (value === item.emoji ? ' is-on' : ''),
                title: item.name,
                onClick: function () { self.choose(item.emoji); }
              }, item.emoji);
            }) : h('p', { className: 'ec-emoji-empty' }, 'Aucun emoji pour cette recherche.')
          )
        );
      }
    });

    var EmojiPreview = createClass({
      render: function () {
        return h('span', { style: { fontSize: '1.6rem' } }, this.props.value || '');
      }
    });

    if (CMS.registerFieldType) CMS.registerFieldType('emoji', EmojiControl, EmojiPreview);
    else if (CMS.registerWidget) CMS.registerWidget('emoji', EmojiControl, EmojiPreview);
    return true;
  }

  function boot() {
    mountDock();
    if (registerWidget()) return;
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (registerWidget() || tries > 40) clearInterval(timer);
    }, 150);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

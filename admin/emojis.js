window.EcoEmojis = (function () {
  var cats = [
    {
      id: 'utiles',
      label: 'Les plus utiles',
      items: [
        ['🌿', 'plante nature'], ['🌱', 'pousse jeune plant'], ['🍃', 'feuille'], ['🌳', 'arbre'],
        ['🌲', 'sapin forêt'], ['🌸', 'fleur'], ['🌻', 'tournesol'], ['🐝', 'abeille'],
        ['🦋', 'papillon'], ['🐛', 'chenille insecte'], ['🦗', 'criquet sauterelle'], ['🐞', 'coccinelle'],
        ['🐦', 'oiseau'], ['🦉', 'hibou chouette'], ['🪺', 'nid oeuf'], ['🥚', 'oeuf'],
        ['🦔', 'hérisson'], ['🐿️', 'écureuil'], ['🐸', 'grenouille'], ['🐌', 'escargot'],
        ['🪱', 'ver de terre'], ['🐜', 'fourmi'], ['🕷️', 'araignée'], ['🕸️', 'toile araignée'],
        ['🍄', 'champignon'], ['🌾', 'blé céréale'], ['🪨', 'rocher pierre'], ['💧', 'goutte eau'],
        ['☀️', 'soleil'], ['🌈', 'arc-en-ciel'],         ['🌍', 'terre planète'], ['🧭', 'boussole'],
        ['🔍', 'loupe'], ['🔬', 'microscope'], ['📚', 'livres'], ['✏️', 'crayon'],
        ['🎒', 'cartable école'], ['🏫', 'école'], ['👨‍👩‍👧‍👦', 'famille'], ['🎂', 'anniversaire gâteau'],
        ['🎉', 'fête'], ['🏕️', 'camp nature'], ['🥾', 'randonnée chaussure'], ['📍', 'lieu pin'],
        ['📅', 'calendrier'], ['⏰', 'horloge'], ['🎟️', 'billet tarif'], ['💬', 'message'],
        ['📬', 'contact courrier'], ['📞', 'téléphone'], ['✨', 'étincelles'], ['💚', 'coeur vert']
      ]
    },
    {
      id: 'plantes',
      label: 'Plantes & fleurs',
      items: [
        ['🌿', 'herbe plante'], ['🍀', 'trèfle'], ['🌱', 'pousse'], ['🌲', 'sapin'],
        ['🌳', 'arbre feuillu'], ['🌴', 'palmier'], ['🌵', 'cactus'], ['🎋', 'bambou'],
        ['🍃', 'feuille vent'], ['🍂', 'feuille morte automne'], ['🍁', 'érable'], ['🌾', 'épi blé'],
        ['🌸', 'fleur de cerisier'], ['💮', 'fleur blanche'], ['🏵️', 'rosette'], ['🌹', 'rose'],
        ['🥀', 'rose fanée'], ['🌺', 'hibiscus'], ['🌻', 'tournesol'], ['🌼', 'pâquerette'],
        ['🌷', 'tulipe'], ['🪻', 'jacinthe'], ['🪴', 'plante en pot'], ['🪵', 'bois bûche'],
        ['🌰', 'châtaigne'], ['🥜', 'cacahuète'], ['🍇', 'raisin'], ['🍓', 'fraise'],
        ['🍒', 'cerise'], ['🍑', 'pêche'], ['🍎', 'pomme'], ['🍏', 'pomme verte'],
        ['🍐', 'poire'], ['🍋', 'citron'], ['🍌', 'banane'], ['🍉', 'pastèque'],
        ['🫐', 'myrtille'], ['🫒', 'olive'], ['🥑', 'avocat'], ['🌽', 'maïs'],
        ['🥕', 'carotte'], ['🧄', 'ail'], ['🧅', 'oignon'], ['🥔', 'pomme de terre'],
        ['🥦', 'brocoli'], ['🥬', 'salade'], ['🥒', 'concombre'], ['🫑', 'poivron'],
        ['🍅', 'tomate'], ['🍆', 'aubergine'], ['🫘', 'haricot'], ['🫚', 'gingembre']
      ]
    },
    {
      id: 'insectes',
      label: 'Insectes & petites bêtes',
      items: [
        ['🐝', 'abeille'], ['🪲', 'coléoptère scarabée'], ['🐞', 'coccinelle'], ['🦋', 'papillon'],
        ['🐛', 'chenille'], ['🦗', 'criquet'], ['🐜', 'fourmi'], ['🦟', 'moustique'],
        ['🪰', 'mouche'], ['🪳', 'cafard'], ['🕷️', 'araignée'], ['🦂', 'scorpion'],
        ['🐌', 'escargot'], ['🪱', 'ver'], ['🦠', 'microbe bactérie'], ['🕸️', 'toile']
      ]
    },
    {
      id: 'oiseaux',
      label: 'Oiseaux',
      items: [
        ['🐦', 'oiseau'], ['🐤', 'poussin'], ['🐣', 'poussin qui sort'], ['🐥', 'poussin face'],
        ['🐔', 'poule'], ['🐓', 'coq'], ['🦃', 'dinde'], ['🦅', 'aigle'],
        ['🦆', 'canard'], ['🦢', 'cygne'], ['🦉', 'hibou'], ['🦤', 'dodo'],
        ['🦩', 'flamant'], ['🦚', 'paon'], ['🦜', 'perroquet'], ['🐧', 'pingouin'],
        ['🪺', 'nid'], ['🥚', 'oeuf'], ['🪶', 'plume']
      ]
    },
    {
      id: 'animaux',
      label: 'Animaux',
      items: [
        ['🦔', 'hérisson'], ['🐿️', 'écureuil'], ['🐇', 'lapin'], ['🦊', 'renard'],
        ['🐻', 'ours'], ['🐼', 'panda'], ['🐨', 'koala'], ['🐯', 'tigre'],
        ['🦁', 'lion'], ['🐮', 'vache'], ['🐷', 'cochon'], ['🐸', 'grenouille'],
        ['🐵', 'singe'], ['🙈', 'singe caché'], ['🐺', 'loup'], ['🐗', 'sanglier'],
        ['🐴', 'cheval'], ['🦄', 'licorne'], ['🦓', 'zèbre'], ['🦌', 'cerf'],
        ['🦬', 'bison'], ['🐂', 'taureau'], ['🐃', 'buffle'], ['🐄', 'vache'],
        ['🐖', 'cochon'], ['🐏', 'bélier'], ['🐑', 'mouton'], ['🐐', 'chèvre'],
        ['🐪', 'dromadaire'], ['🐫', 'chameau'], ['🦙', 'lama'], ['🦒', 'girafe'],
        ['🐘', 'éléphant'], ['🦣', 'mammouth'], ['🦏', 'rhino'], ['🦛', 'hippo'],
        ['🐭', 'souris'], ['🐀', 'rat'], ['🐹', 'hamster'], ['🐰', 'lapin tête'],
        ['🦇', 'chauve-souris'], ['🦫', 'castor'], ['🦦', 'loutre'], ['🦨', 'moufette'],
        ['🦡', 'blaireau'], ['🐾', 'empreintes'], ['🦮', 'chien'], ['🐕', 'chien'],
        ['🐩', 'caniche'], ['🐈', 'chat'], ['🐈‍⬛', 'chat noir'], ['🦝', 'raton laveur']
      ]
    },
    {
      id: 'eau',
      label: 'Eau, mer & rivière',
      items: [
        ['💧', 'goutte'], ['💦', 'éclaboussures'], ['🌊', 'vague'], ['🏞️', 'paysage rivière'],
        ['🏝️', 'île'], ['🏖️', 'plage'], ['⛵', 'voile'], ['🛶', 'canoë'],
        ['🐟', 'poisson'], ['🐠', 'poisson tropical'], ['🐡', 'poisson-globe'], ['🦈', 'requin'],
        ['🐙', 'poulpe'], ['🦑', 'calamar'], ['🦐', 'crevette'], ['🦞', 'homard'],
        ['🦀', 'crabe'], ['🐚', 'coquillage'], ['🪸', 'corail'], ['🐳', 'baleine'],
        ['🐋', 'cachalot'], ['🐬', 'dauphin'], ['🦭', 'phoque'], ['🪼', 'méduse'],
        ['🐸', 'grenouille'], ['🐊', 'crocodile'], ['🐢', 'tortue']
      ]
    },
    {
      id: 'meteo',
      label: 'Ciel & météo',
      items: [
        ['☀️', 'soleil'], ['🌤️', 'soleil nuage'], ['⛅', 'nuageux'], ['🌥️', 'gros nuage'],
        ['☁️', 'nuage'], ['🌦️', 'pluie soleil'], ['🌧️', 'pluie'], ['⛈️', 'orage'],
        ['🌩️', 'éclair'], ['🌨️', 'neige'], ['❄️', 'flocon'], ['☃️', 'bonhomme neige'],
        ['⛄', 'bonhomme'], ['🌬️', 'vent'], ['💨', 'souffle'], ['🌪️', 'tornade'],
        ['🌫️', 'brouillard'], ['🌈', 'arc-en-ciel'], ['⭐', 'étoile'], ['🌟', 'étoile brillante'],
        ['✨', 'étincelles'], ['⚡', 'foudre'], ['🔥', 'feu'], ['💥', 'explosion'],
        ['🌙', 'lune'], ['🌛', 'lune visage'], ['🌝', 'pleine lune'], ['🌞', 'soleil visage'],
        ['🪐', 'planète'], ['🌍', 'europe afrique'], ['🌎', 'amériques'], ['🌏', 'asie'],
        ['🌑', 'nouvelle lune'], ['🌕', 'pleine lune'], ['💫', 'tourbillon']
      ]
    },
    {
      id: 'saisons',
      label: 'Saisons & fêtes',
      items: [
        ['🌸', 'printemps'], ['☀️', 'été'], ['🍂', 'automne'], ['❄️', 'hiver'],
        ['🎄', 'noël'], ['🎃', 'halloween'], ['🐰', 'pâques'], ['🎁', 'cadeau'],
        ['🎀', 'nœud'], ['🎈', 'ballon'], ['🎉', 'cotillons'], ['🎊', 'confettis'],
        ['🥳', 'fête'], ['🎂', 'gâteau'], ['🧁', 'cupcake'], ['🕯️', 'bougie'],
        ['🎆', 'feu d artifice'], ['🎇', 'cierge magique'], ['🪄', 'baguette magique']
      ]
    },
    {
      id: 'enfants',
      label: 'Enfants, école & jeux',
      items: [
        ['👶', 'bébé'], ['👧', 'fille'], ['👦', 'garçon'], ['🧒', 'enfant'],
        ['👩', 'femme'], ['👨', 'homme'], ['👩‍🏫', 'enseignante'], ['👨‍🏫', 'enseignant'],
        ['🏫', 'école'], ['🎒', 'cartable'], ['✏️', 'crayon'], ['✒️', 'plume'],
        ['🖊️', 'stylo'], ['📝', 'bloc-notes'], ['📚', 'livres'], ['📖', 'livre ouvert'],
        ['📒', 'cahier'], ['📏', 'règle'], ['📐', 'équerre'], ['✂️', 'ciseaux'],
        ['📌', 'épingle'], ['📎', 'trombone'], ['🧮', 'boulier'], ['🎨', 'peinture'],
        ['🖍️', 'crayon de couleur'], ['🧩', 'puzzle'], ['🧸', 'peluche'], ['🪀', 'yoyo'],
        ['🪁', 'cerf-volant'], ['🪀', 'jeu'], ['🎯', 'cible'], ['♟️', 'pion'],
        ['🎲', 'dé'], ['🃏', 'carte'], ['🪄', 'magie'], ['🎭', 'théâtre'],
        ['🪆', 'poupées russes'], ['🪁', 'cerf volant']
      ]
    },
    {
      id: 'lieux',
      label: 'Lieux & nature',
      items: [
        ['🏞️', 'parc national'], ['🏔️', 'montagne neige'], ['⛰️', 'montagne'], ['🌋', 'volcan'],
        ['🏕️', 'camping'], ['⛺', 'tente'], ['🛖', 'cabane'], ['🏡', 'maison jardin'],
        ['🏠', 'maison'], ['🏘️', 'maisons'], ['🏰', 'château'], ['⛪', 'église'],
        ['⛲', 'fontaine'], ['🌉', 'pont'], ['🛣️', 'route'], ['🛤️', 'voie ferrée'],
        ['🏟️', 'stade'], ['🏛️', 'monument'], ['🏗️', 'chantier'], ['🚜', 'tracteur'],
        ['🌾', 'champ'], ['🗺️', 'carte'], ['🧭', 'boussole'], ['📍', 'épingle lieu'],
        ['📌', 'pin'], ['🚩', 'drapeau'], ['🏁', 'arrivée']
      ]
    },
    {
      id: 'activites',
      label: 'Activités & sport',
      items: [
        ['🚶', 'marche'], ['🚶‍♀️', 'marche femme'], ['🏃', 'course'], ['🏃‍♀️', 'course femme'],
        ['🥾', 'randonnée'], ['🧗', 'escalade'], ['🚴', 'vélo'], ['🚵', 'VTT'],
        ['🛶', 'canoë'], ['🚣', 'aviron'], ['🏊', 'natation'], ['🎣', 'pêche'],
        ['🤿', 'plongée'], ['🏇', 'équitation'], ['⛷️', 'ski'], ['🏂', 'snowboard'],
        ['🏕️', 'bivouac'], ['🔥', 'feu de camp'], ['📸', 'photo'], ['🎥', 'vidéo'],
        ['🔭', 'télescope'], ['🔬', 'microscope'], ['🧪', 'chimie'], ['⚗️', 'alambic']
      ]
    },
    {
      id: 'objets',
      label: 'Objets & outils',
      items: [
        ['🔍', 'loupe'], ['🔎', 'loupe droite'], ['💡', 'idée ampoule'], ['🕯️', 'bougie'],
        ['🔦', 'lampe'], ['🪣', 'seau'], ['🧹', 'balai'], ['🧺', 'panier'],
        ['🧵', 'fil'], ['🪡', 'aiguille'], ['🪢', 'nœud'], ['🧰', 'boîte à outils'],
        ['🔨', 'marteau'], ['🪓', 'hache'], ['⛏️', 'pioche'], ['🪚', 'scie'],
        ['🔧', 'clé'], ['🪛', 'tournevis'], ['🧲', 'aimant'], ['⚖️', 'balance'],
        ['🧴', 'flacon'], ['🧼', 'savon'], ['🧽', 'éponge'], ['🧯', 'extincteur'],
        ['🔑', 'clé'], ['🗝️', 'vieille clé'], ['📦', 'colis'], ['🎁', 'cadeau'],
        ['✉️', 'enveloppe'], ['📩', 'courrier'], ['📨', 'réception'], ['📧', 'email'],
        ['📱', 'téléphone'], ['💻', 'ordinateur'], ['🖨️', 'imprimante'], ['📷', 'appareil photo']
      ]
    },
    {
      id: 'symboles',
      label: 'Cœurs, signes & flèches',
      items: [
        ['❤️', 'coeur rouge'], ['🧡', 'coeur orange'], ['💛', 'coeur jaune'], ['💚', 'coeur vert'],
        ['💙', 'coeur bleu'], ['💜', 'coeur violet'], ['🖤', 'coeur noir'], ['🤍', 'coeur blanc'],
        ['🤎', 'coeur brun'], ['💕', 'deux coeurs'], ['💞', 'coeurs tournants'], ['💓', 'coeur battant'],
        ['💗', 'coeur grandissant'], ['💖', 'coeur étincelant'], ['💘', 'coeur flèche'], ['💝', 'coeur ruban'],
        ['✅', 'valide'], ['❌', 'croix'], ['✔️', 'coche'], ['☑️', 'case cochée'],
        ['➕', 'plus'], ['➖', 'moins'], ['➗', 'diviser'], ['✖️', 'fois'],
        ['➡️', 'flèche droite'], ['⬅️', 'flèche gauche'], ['⬆️', 'flèche haut'], ['⬇️', 'flèche bas'],
        ['↗️', 'diagonale'], ['↩️', 'retour'], ['🔄', 'rafraîchir'], ['🔃', 'cycle'],
        ['⭐', 'étoile'], ['🌟', 'étoile brillante'], ['⚡', 'éclair'], ['🔥', 'feu'],
        ['💯', 'cent'], ['🔔', 'cloche'], ['🔕', 'silence'], ['🔒', 'cadenas'],
        ['📣', 'megaphone'], ['📢', 'annonce'], ['💬', 'bulle'], ['💭', 'pensée'],
        ['🗯️', 'colère'], ['💡', 'idée'], ['⚠️', 'attention'], ['♻️', 'recyclage'],
        ['🔰', 'débutant'], ['⚜️', 'fleur de lys'], ['☮️', 'paix'], ['☯️', 'yin yang'],
        ['✳️', 'étoile 8'], ['❇️', 'étincelle'], ['🔴', 'rond rouge'], ['🟠', 'rond orange'],
        ['🟡', 'rond jaune'], ['🟢', 'rond vert'], ['🔵', 'rond bleu'], ['🟣', 'rond violet'],
        ['🟤', 'rond brun'], ['⚫', 'rond noir'], ['⚪', 'rond blanc'], ['🟥', 'carré rouge'],
        ['🟧', 'carré orange'], ['🟨', 'carré jaune'], ['🟩', 'carré vert'], ['🟦', 'carré bleu']
      ]
    },
    {
      id: 'visages',
      label: 'Visages & émotions',
      items: [
        ['😀', 'sourire'], ['😃', 'grand sourire'], ['😄', 'yeux souriants'], ['😁', 'ravi'],
        ['😆', 'rire'], ['😅', 'ouf'], ['🤣', 'mort de rire'], ['😂', 'larmes de joie'],
        ['🙂', 'content'], ['😉', 'clin d oeil'], ['😊', 'timide'], ['😇', 'ange'],
        ['🥰', 'amoureux'], ['😍', 'yeux coeur'], ['🤩', 'ébloui'], ['😘', 'bisou'],
        ['😋', 'miam'], ['😜', 'langue'], ['🤗', 'câlin'], ['🤔', 'réflexion'],
        ['🤫', 'chut'], ['🤭', 'oops'], ['🫡', 'salut'], ['😐', 'neutre'],
        ['😴', 'dodo'], ['🥱', 'bâillement'], ['😮', 'surprise'], ['😯', 'oh'],
        ['😲', 'choqué'], ['😳', 'gêné'], ['🥺', 'suppliant'], ['😢', 'triste'],
        ['😭', 'pleurs'], ['😤', 'vexé'], ['😡', 'en colère'], ['🤯', 'explose'],
        ['😎', 'cool'], ['🤓', 'intello'], ['🧐', 'examinateur'], ['🤠', 'cowboy'],
        ['🥳', 'fête'], ['😈', 'diablotin'], ['👻', 'fantôme'], ['🎃', 'citrouille'],
        ['😺', 'chat sourire'], ['😸', 'chat rire'], ['😻', 'chat amoureux']
      ]
    },
    {
      id: 'mains',
      label: 'Mains & personnes',
      items: [
        ['👍', 'ok'], ['👎', 'non'], ['👏', 'applaudir'], ['🙌', 'bravo'],
        ['👋', 'coucou'], ['🤝', 'poignée de main'], ['🙏', 'merci'], ['💪', 'force'],
        ['✌️', 'victoire'], ['🤞', 'fingers crossed'], ['🫶', 'coeur mains'], ['🤲', 'mains ouvertes'],
        ['👆', 'index haut'], ['👇', 'index bas'], ['👉', 'index droite'], ['👈', 'index gauche'],
        ['🫵', 'toi'], ['✋', 'stop'], ['🖐️', 'main'], ['👌', 'parfait'],
        ['👨‍👩‍👧', 'famille'], ['👩‍👧', 'mère fille'], ['👨‍👦', 'père fils'], ['🫂', 'accolade']
      ]
    },
    {
      id: 'nourriture',
      label: 'Goûter & boissons',
      items: [
        ['🍯', 'miel'], ['🥛', 'lait'], ['🫖', 'théière'], ['🍵', 'thé'],
        ['☕', 'café'], ['🧃', 'jus'], ['🥤', 'gobelet'], ['💧', 'eau'],
        ['🍎', 'pomme'], ['🍌', 'banane'], ['🍇', 'raisin'], ['🍓', 'fraise'],
        ['🥐', 'croissant'], ['🥖', 'baguette'], ['🧀', 'fromage'], ['🥞', 'crêpes'],
        ['🍪', 'cookie'], ['🍩', 'donut'], ['🍫', 'chocolat'], ['🍿', 'popcorn'],
        ['🥪', 'sandwich'], ['🥗', 'salade'], ['🍲', 'soupe'], ['🍯', 'pot de miel']
      ]
    },
    {
      id: 'temps',
      label: 'Temps & organisation',
      items: [
        ['📅', 'calendrier'], ['📆', 'date'], ['🗓️', 'agenda'], ['⏰', 'réveil'],
        ['⌚', 'montre'], ['⏳', 'sablier'], ['⌛', 'sablier fin'], ['🕐', 'une heure'],
        ['🕒', 'trois heures'], ['🕛', 'midi minuit'], ['🔔', 'rappel'], ['📌', 'important'],
        ['🏷️', 'étiquette'], ['📋', 'liste'], ['✅', 'fait'], ['🆕', 'nouveau']
      ]
    }
  ];

  function all() {
    var seen = {};
    var list = [];
    cats.forEach(function (cat) {
      cat.items.forEach(function (item) {
        var emoji = item[0];
        if (seen[emoji]) return;
        seen[emoji] = true;
        list.push({ emoji: emoji, name: item[1] || '', cat: cat.id, label: cat.label });
      });
    });
    return list;
  }

  function search(query, catId) {
    var q = String(query || '').trim().toLowerCase();
    return all().filter(function (item) {
      if (catId && catId !== 'tous' && item.cat !== catId) return false;
      if (!q) return true;
      return item.emoji.indexOf(q) !== -1 ||
        item.name.toLowerCase().indexOf(q) !== -1 ||
        item.label.toLowerCase().indexOf(q) !== -1;
    });
  }

  return { cats: cats, all: all, search: search };
})();

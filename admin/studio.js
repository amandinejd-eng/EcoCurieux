(function () {
  var boot = document.getElementById('ec-boot');
  var root = document.getElementById('nc-root');
  var bar = document.getElementById('ec-bar');

  function hideBoot() {
    if (boot) boot.classList.add('is-hidden');
  }

  if (root && window.MutationObserver) {
    var observer = new MutationObserver(function () {
      if (root.childElementCount > 0) hideBoot();
    });
    observer.observe(root, { childList: true, subtree: false });
  }
  window.setTimeout(hideBoot, 8000);

  function markStep() {
    if (!bar) return;
    var hash = String(location.hash || '');
    var step = 1;
    if (/\/entries\//.test(hash) || /\/new/.test(hash)) step = 2;
    else if (/\/collections\//.test(hash)) step = 1;
    var items = bar.querySelectorAll('.ec-steps li');
    items.forEach(function (item, index) {
      item.classList.toggle('is-on', index + 1 === step);
    });
  }

  window.addEventListener('hashchange', markStep);
  markStep();
})();

(function () {
  function toggleClass(buttonSelector, targetSelector) {
    var button = document.querySelector(buttonSelector);
    var target = document.querySelector(targetSelector);
    if (!button || !target) {
      return;
    }
    button.addEventListener('click', function () {
      target.classList.toggle('is-open');
    });
  }

  function setupHeader() {
    toggleClass('[data-search-toggle]', '[data-header-search]');
    toggleClass('[data-menu-toggle]', '[data-mobile-menu]');
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    function show(next) {
      index = next;
      slides.forEach(function (slide, i) {
        slide.hidden = i !== index;
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    show(0);
    window.setInterval(function () {
      show((index + 1) % slides.length);
    }, 6000);
  }

  function setupFilters() {
    var input = document.querySelector('[data-filter-input]');
    var select = document.querySelector('[data-filter-category]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var empty = document.querySelector('[data-empty-state]');
    if (!cards.length || (!input && !select)) {
      return;
    }
    function run() {
      var q = input ? input.value.trim().toLowerCase() : '';
      var category = select ? select.value : 'all';
      var visible = 0;
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var cardCategory = card.getAttribute('data-category') || '';
        var ok = (!q || text.indexOf(q) !== -1) && (category === 'all' || category === cardCategory);
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }
    if (input) {
      input.addEventListener('input', run);
    }
    if (select) {
      select.addEventListener('change', run);
    }
    run();
  }

  function cardHtml(item) {
    return [
      '<article data-movie-card data-category="' + item.categoryId + '" data-search="' + escapeAttr(item.search) + '">',
      '<a class="movie-card" href="' + item.url + '">',
      '<div class="movie-thumb"><img src="' + item.cover + '" alt="' + escapeAttr(item.title) + '" loading="lazy"><span class="card-badge">' + item.category + '</span><span class="card-play">▶</span></div>',
      '<div class="movie-body"><h3 class="clamp-2">' + item.title + '</h3><p class="clamp-2">' + item.oneLine + '</p><div class="movie-meta"><span>' + item.year + '</span><span>' + item.region + '</span><span>' + item.type + '</span></div></div>',
      '</a>',
      '</article>'
    ].join('');
  }

  function escapeAttr(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function setupSearchPage() {
    var form = document.querySelector('[data-search-page-form]');
    var input = document.querySelector('[data-search-page-input]');
    var results = document.querySelector('[data-search-results]');
    var empty = document.querySelector('[data-search-empty]');
    var data = window.JJO_SEARCH_INDEX || [];
    if (!form || !input || !results) {
      return;
    }
    function render(value) {
      var q = value.trim().toLowerCase();
      var matched = q ? data.filter(function (item) {
        return item.search.toLowerCase().indexOf(q) !== -1;
      }).slice(0, 120) : data.slice(0, 40);
      results.innerHTML = matched.map(cardHtml).join('');
      if (empty) {
        empty.classList.toggle('is-visible', matched.length === 0);
      }
    }
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    input.value = initial;
    render(initial);
    input.addEventListener('input', function () {
      render(input.value);
    });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      render(input.value);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupHeader();
    setupHero();
    setupFilters();
    setupSearchPage();
  });
}());

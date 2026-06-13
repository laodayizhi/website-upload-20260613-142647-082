(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function startHero() {
      stopHero();
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    function stopHero() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = parseInt(dot.getAttribute('data-hero-dot'), 10);
        showSlide(index);
        startHero();
      });
    });

    hero.addEventListener('mouseenter', stopHero);
    hero.addEventListener('mouseleave', startHero);
    startHero();
  }

  var searchForm = document.querySelector('[data-search-form]');
  var searchInput = document.querySelector('[data-search-input]');
  var searchList = document.querySelector('[data-search-list]');
  var filterRow = document.querySelector('[data-filter-row]');
  var activeCategory = 'all';

  if (searchInput && searchList) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    searchInput.value = query;

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applySearch() {
      var term = normalize(searchInput.value);
      var cards = Array.prototype.slice.call(searchList.querySelectorAll('[data-card]'));

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();
        var category = card.getAttribute('data-category');
        var matchesTerm = !term || haystack.indexOf(term) !== -1;
        var matchesCategory = activeCategory === 'all' || category === activeCategory;
        card.classList.toggle('is-hidden', !(matchesTerm && matchesCategory));
      });
    }

    searchInput.addEventListener('input', applySearch);

    if (searchForm) {
      searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        applySearch();
      });
    }

    if (filterRow) {
      filterRow.addEventListener('click', function (event) {
        var button = event.target.closest('button[data-filter]');

        if (!button) {
          return;
        }

        activeCategory = button.getAttribute('data-filter') || 'all';
        Array.prototype.slice.call(filterRow.querySelectorAll('button')).forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
        applySearch();
      });
    }

    applySearch();
  }

  var players = Array.prototype.slice.call(document.querySelectorAll('.movie-player'));

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var shade = player.querySelector('.player-shade');
    var button = player.querySelector('.player-start');
    var stream = player.getAttribute('data-stream');
    var ready = false;
    var hls = null;

    function attachStream() {
      if (!video || !stream || ready) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }

      ready = true;
    }

    function playVideo() {
      if (!video) {
        return;
      }

      attachStream();
      player.classList.add('is-playing');
      video.controls = true;
      var result = video.play();

      if (result && typeof result.catch === 'function') {
        result.catch(function () {});
      }
    }

    if (shade) {
      shade.addEventListener('click', playVideo);
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        playVideo();
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          playVideo();
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  });
})();

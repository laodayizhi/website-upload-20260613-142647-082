(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
      return;
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  ready(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
      menuButton.addEventListener('click', function () {
        mobileMenu.classList.toggle('is-open');
      });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var previous = hero.querySelector('[data-hero-prev]');
      var next = hero.querySelector('[data-hero-next]');
      var current = 0;
      var timer = null;

      function show(index) {
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

      function play() {
        clearInterval(timer);
        timer = setInterval(function () {
          show(current + 1);
        }, 5200);
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
          show(index);
          play();
        });
      });

      if (previous) {
        previous.addEventListener('click', function () {
          show(current - 1);
          play();
        });
      }

      if (next) {
        next.addEventListener('click', function () {
          show(current + 1);
          play();
        });
      }

      show(0);
      play();
    });

    document.querySelectorAll('[data-movie-grid]').forEach(function (grid) {
      var scope = grid.closest('.container-custom') || document;
      var input = scope.querySelector('[data-search-input]');
      var region = scope.querySelector('[data-filter-region]');
      var type = scope.querySelector('[data-filter-type]');
      var year = scope.querySelector('[data-filter-year]');
      var status = scope.querySelector('[data-filter-status]');
      var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));

      function value(element) {
        return element ? element.value.trim().toLowerCase() : '';
      }

      function apply() {
        var keyword = value(input);
        var regionValue = value(region);
        var typeValue = value(type);
        var yearValue = value(year);
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = [
            card.dataset.title,
            card.dataset.region,
            card.dataset.type,
            card.dataset.year,
            card.dataset.genre,
            card.dataset.tags
          ].join(' ').toLowerCase();
          var matched = true;

          if (keyword && haystack.indexOf(keyword) === -1) {
            matched = false;
          }
          if (regionValue && String(card.dataset.region || '').toLowerCase().indexOf(regionValue) === -1) {
            matched = false;
          }
          if (typeValue && String(card.dataset.type || '').toLowerCase().indexOf(typeValue) === -1) {
            matched = false;
          }
          if (yearValue && String(card.dataset.year || '').toLowerCase() !== yearValue) {
            matched = false;
          }

          card.classList.toggle('is-hidden', !matched);
          if (matched) {
            visible += 1;
          }
        });

        if (status) {
          status.textContent = visible ? '筛选结果已更新，可点击影片进入播放页' : '没有匹配的影片，请调整筛选条件';
        }
      }

      [input, region, type, year].forEach(function (element) {
        if (element) {
          element.addEventListener('input', apply);
          element.addEventListener('change', apply);
        }
      });
    });
  });
}());

(function() {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function() {
            mobileNav.classList.toggle("open");
        });
    }

    document.querySelectorAll("[data-hero-slider]").forEach(function(slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
        var current = 0;
        var timer = null;

        function show(index) {
            current = index;
            slides.forEach(function(slide, itemIndex) {
                slide.classList.toggle("active", itemIndex === index);
            });
            dots.forEach(function(dot, itemIndex) {
                dot.classList.toggle("active", itemIndex === index);
            });
        }

        function next() {
            if (slides.length > 0) {
                show((current + 1) % slides.length);
            }
        }

        dots.forEach(function(dot) {
            dot.addEventListener("click", function() {
                var index = Number(dot.getAttribute("data-hero-dot"));
                show(index);
                if (timer) {
                    window.clearInterval(timer);
                }
                timer = window.setInterval(next, 5200);
            });
        });

        if (slides.length > 1) {
            timer = window.setInterval(next, 5200);
        }
    });

    document.querySelectorAll("[data-filter-panel]").forEach(function(panel) {
        var scope = panel.parentElement;
        var input = panel.querySelector("[data-filter-input]");
        var typeFilter = panel.querySelector("[data-type-filter]");
        var yearFilter = panel.querySelector("[data-year-filter]");
        var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));
        var emptyState = scope.querySelector("[data-empty-state]");

        function matchYear(cardYear, selected) {
            var year = Number(cardYear || 0);
            if (!selected) {
                return true;
            }
            if (selected === "2025") {
                return year >= 2025;
            }
            if (selected === "2020") {
                return year >= 2020 && year <= 2024;
            }
            if (selected === "2010") {
                return year >= 2010 && year <= 2019;
            }
            if (selected === "2000") {
                return year >= 2000 && year <= 2009;
            }
            if (selected === "old") {
                return year > 0 && year < 2000;
            }
            return true;
        }

        function applyFilter() {
            var keyword = (input ? input.value : "").trim().toLowerCase();
            var typeValue = typeFilter ? typeFilter.value : "";
            var yearValue = yearFilter ? yearFilter.value : "";
            var shown = 0;

            cards.forEach(function(card) {
                var text = card.getAttribute("data-search") || "";
                var cardType = card.getAttribute("data-type") || "";
                var cardYear = card.getAttribute("data-year") || "";
                var visible = (!keyword || text.indexOf(keyword) !== -1) && (!typeValue || cardType === typeValue) && matchYear(cardYear, yearValue);
                card.classList.toggle("hidden-by-filter", !visible);
                if (visible) {
                    shown += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle("show", shown === 0);
            }
        }

        [input, typeFilter, yearFilter].forEach(function(element) {
            if (element) {
                element.addEventListener("input", applyFilter);
                element.addEventListener("change", applyFilter);
            }
        });
    });
})();

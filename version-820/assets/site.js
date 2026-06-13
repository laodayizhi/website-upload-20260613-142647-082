(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (toggle && panel) {
            toggle.addEventListener("click", function () {
                panel.classList.toggle("is-open");
            });
        }

        document.querySelectorAll("[data-header-search]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input[name='q']");
                var query = input ? input.value.trim() : "";
                var target = "./search.html";
                if (query) {
                    target += "?q=" + encodeURIComponent(query);
                }
                window.location.href = target;
            });
        });

        initHero();
        initFilters();
        initPlayer();
    });

    function initHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        var prev = root.querySelector("[data-hero-prev]");
        var next = root.querySelector("[data-hero-next]");
        var index = 0;
        var timer;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function start() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(index + 1);
            }, 5600);
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                start();
            });
        });
        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }
        show(0);
        start();
    }

    function initFilters() {
        var panels = document.querySelectorAll("[data-filter-panel]");
        panels.forEach(function (panel) {
            var input = panel.querySelector("[data-card-search]");
            var year = panel.querySelector("[data-year-filter]");
            var type = panel.querySelector("[data-type-filter]");
            var result = panel.querySelector("[data-filter-result]");
            var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
            var params = new URLSearchParams(window.location.search);
            var q = params.get("q") || "";
            if (input && q) {
                input.value = q;
            }

            function normalize(value) {
                return String(value || "").toLowerCase();
            }

            function apply() {
                var keyword = normalize(input ? input.value.trim() : "");
                var selectedYear = year ? year.value : "";
                var selectedType = type ? type.value : "";
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = normalize(card.getAttribute("data-keywords"));
                    var title = normalize(card.getAttribute("data-title"));
                    var cardYear = card.getAttribute("data-year") || "";
                    var cardType = card.getAttribute("data-type") || "";
                    var keywordOk = !keyword || haystack.indexOf(keyword) !== -1 || title.indexOf(keyword) !== -1;
                    var yearOk = !selectedYear || cardYear === selectedYear;
                    var typeOk = !selectedType || cardType.indexOf(selectedType) !== -1;
                    var isVisible = keywordOk && yearOk && typeOk;
                    card.classList.toggle("hidden-by-filter", !isVisible);
                    if (isVisible) {
                        visible += 1;
                    }
                });
                if (result) {
                    result.textContent = visible > 0 ? "筛选结果 " + visible + " 部" : "暂无匹配结果";
                }
            }

            [input, year, type].forEach(function (node) {
                if (node) {
                    node.addEventListener("input", apply);
                    node.addEventListener("change", apply);
                }
            });
            apply();
        });
    }

    function initPlayer() {
        var video = document.querySelector("[data-player-video]");
        var button = document.querySelector("[data-play-button]");
        var shell = document.querySelector("[data-player-shell]");
        if (!video || !button) {
            return;
        }
        var source = video.getAttribute("data-src");
        var hlsInstance = null;
        var attached = false;

        function attach() {
            if (attached || !source) {
                return Promise.resolve();
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                return Promise.resolve();
            }
            if (window.Hls && window.Hls.isSupported()) {
                return new Promise(function (resolve) {
                    hlsInstance = new Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(source);
                    hlsInstance.attachMedia(video);
                    hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
                        resolve();
                    });
                    hlsInstance.on(Hls.Events.ERROR, function (event, data) {
                        if (data && data.fatal && hlsInstance) {
                            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                                hlsInstance.startLoad();
                            } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                                hlsInstance.recoverMediaError();
                            } else {
                                hlsInstance.destroy();
                            }
                        }
                    });
                    setTimeout(resolve, 1200);
                });
            }
            video.src = source;
            return Promise.resolve();
        }

        function play() {
            attach().then(function () {
                if (shell) {
                    shell.classList.add("is-started");
                }
                var promise = video.play();
                if (promise && typeof promise.catch === "function") {
                    promise.catch(function () {});
                }
            });
        }

        button.addEventListener("click", play);
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener("play", function () {
            if (shell) {
                shell.classList.add("is-started");
            }
        });
    }
})();

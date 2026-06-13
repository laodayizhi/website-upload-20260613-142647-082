(function () {
  function start(options) {
    var video = document.getElementById(options.videoId);
    var cover = document.getElementById(options.coverId);
    var button = document.getElementById(options.buttonId);
    if (!video || !options.src) {
      return;
    }
    var loaded = false;
    var hls = null;

    function load() {
      if (loaded) {
        return;
      }
      loaded = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = options.src;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          maxBufferLength: 60,
          backBufferLength: 30,
          enableWorker: true
        });
        hls.loadSource(options.src);
        hls.attachMedia(video);
      } else {
        video.src = options.src;
      }
    }

    function play() {
      load();
      if (cover) {
        cover.classList.add('is-hidden');
      }
      video.controls = true;
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener('click', play);
    }
    if (button) {
      button.addEventListener('click', play);
    }
    video.addEventListener('click', function () {
      if (!loaded || video.paused) {
        play();
      }
    });
    window.addEventListener('pagehide', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  }

  window.JJOPlayer = {
    start: start
  };
}());

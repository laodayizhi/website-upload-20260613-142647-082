function initMoviePlayer(containerId, streamUrl) {
  var container = document.getElementById(containerId);

  if (!container) {
    return;
  }

  var video = container.querySelector('video');
  var overlay = container.querySelector('.player-overlay');
  var hls = null;

  if (!video) {
    return;
  }

  video.setAttribute('playsinline', '');
  video.controls = true;

  function hideOverlay() {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  }

  function attachNative() {
    if (video.getAttribute('src') !== streamUrl) {
      video.setAttribute('src', streamUrl);
    }
  }

  function attachHls() {
    if (!hls && window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    }
  }

  function playVideo() {
    hideOverlay();

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      attachNative();
    } else if (window.Hls && window.Hls.isSupported()) {
      attachHls();
    } else {
      attachNative();
    }

    var promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        video.controls = true;
      });
    }
  }

  if (overlay) {
    overlay.addEventListener('click', playVideo);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    }
  });

  video.addEventListener('play', hideOverlay);
}

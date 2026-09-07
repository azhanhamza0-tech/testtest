// ==========================================================================
// MERZE MOVIES (مەرزە موڤیز) - CINEMATIC VIDEO PLAYER & LIMIT ENFORCEMENT
// Multi-quality selector, 50-movie limit protection, and custom Kurdish controls
// ==========================================================================

const MerzePlayer = {
  currentMovie: null,
  currentEpisode: null,
  activeQuality: "1080p",
  isLimitReached: false,

  async init(movieId, episodeNumber = null) {
    console.log("🎬 بارکردنی پەخشی ڤیدیۆ بۆ:", movieId);
    const container = document.getElementById("player-container");
    if (!container) return;

    const movie = await window.MerzeDB.getMovieById(movieId);
    if (!movie) {
      container.innerHTML = `<div class="p-4 text-center">فیلمەکە نەدۆزرایەوە.</div>`;
      return;
    }

    this.currentMovie = movie;

    // Check user authentication & VIP status
    const user = window.MerzeAuth ? window.MerzeAuth.getUser() : null;
    const isVip = window.MerzeAuth ? window.MerzeAuth.isVip() : false;

    // 1. Check if movie itself requires VIP
    if (movie.access_type === "VIP" && !isVip) {
      this.renderVipRequiredOverlay(container, "ئەم فیلمە تایبەتە بە بەشداربووانی VIP");
      return;
    }

    // 2. Check 50-Movie Limit for Free users
    if (!isVip) {
      const watchedCount = user ? await window.MerzeDB.getWatchedMoviesCount(user.id) : 0;
      if (watchedCount >= 50) {
        this.isLimitReached = true;
        this.renderLimitReachedOverlay(container, watchedCount);
        return;
      }
    }

    // Determine initial video source
    let videoSrc = movie.video_url;
    if (movie.qualities && movie.qualities[this.activeQuality]) {
      videoSrc = movie.qualities[this.activeQuality];
    } else if (movie.qualities) {
      const firstKey = Object.keys(movie.qualities)[0];
      videoSrc = movie.qualities[firstKey];
      this.activeQuality = firstKey;
    }

    // Render player HTML
    this.renderPlayer(container, movie, videoSrc);
    this.setupPlayerEvents();

    // Log watch in DB
    if (user) {
      window.MerzeDB.recordWatch(user.id, movie.id, 0);
    }
  },

  renderPlayer(container, movie, videoSrc) {
    const qualities = movie.qualities || { "1080p": videoSrc };
    const qualityOptions = Object.keys(qualities).map(q => 
      `<option value="${q}" ${q === this.activeQuality ? 'selected' : ''}>${q}</option>`
    ).join('');

    container.innerHTML = `
      <div class="player-main-card paused" id="player-wrapper">
        <video id="merze-video" class="video-element" playsinline poster="${movie.backdrop_url || movie.poster_url}">
          <source src="${videoSrc}" type="video/mp4">
          وێبگەڕەکەت پشتگیری پەخشی ئەم ڤیدیۆیە ناکات.
        </video>

        <!-- Custom Controls Overlay -->
        <div class="player-controls-overlay" id="player-controls">
          <!-- Seek Bar -->
          <div class="progress-bar-container" id="player-seek-bar">
            <div class="progress-bar-fill" id="player-progress-fill" style="width: 0%;"></div>
          </div>

          <!-- Controls Row -->
          <div class="controls-row">
            <div class="controls-group">
              <button class="player-btn" id="btn-play-pause" title="دەستپێکردن / ڕاگرتن">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </button>
              <button class="player-btn" id="btn-volume-toggle" title="دەنگ">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
              </button>
              <span class="time-display" id="time-display">00:00 / 00:00</span>
            </div>

            <div class="controls-group">
              <!-- Quality Selector -->
              <select class="quality-badge-select" id="quality-selector">
                ${qualityOptions}
              </select>

              <!-- Speed -->
              <select class="quality-badge-select" id="speed-selector">
                <option value="0.75">0.75x</option>
                <option value="1" selected>1.0x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2.0x</option>
              </select>

              <!-- Theater Mode -->
              <button class="player-btn" id="btn-theater" title="دۆخی سینەمایی">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
              </button>

              <!-- Fullscreen -->
              <button class="player-btn" id="btn-fullscreen" title="پڕاوپڕ">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  setupPlayerEvents() {
    const video = document.getElementById("merze-video");
    const wrapper = document.getElementById("player-wrapper");
    const btnPlayPause = document.getElementById("btn-play-pause");
    const btnVolume = document.getElementById("btn-volume-toggle");
    const seekBar = document.getElementById("player-seek-bar");
    const progressFill = document.getElementById("player-progress-fill");
    const timeDisplay = document.getElementById("time-display");
    const qualitySelector = document.getElementById("quality-selector");
    const speedSelector = document.getElementById("speed-selector");
    const btnFullscreen = document.getElementById("btn-fullscreen");

    if (!video) return;

    const togglePlay = () => {
      if (video.paused) {
        video.play();
        wrapper.classList.remove("paused");
        btnPlayPause.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
      } else {
        video.pause();
        wrapper.classList.add("paused");
        btnPlayPause.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
      }
    };

    btnPlayPause.addEventListener("click", togglePlay);
    video.addEventListener("click", togglePlay);

    // Time update
    video.addEventListener("timeupdate", () => {
      if (video.duration) {
        const pct = (video.currentTime / video.duration) * 100;
        progressFill.style.width = pct + "%";
        timeDisplay.textContent = `${this.formatTime(video.currentTime)} / ${this.formatTime(video.duration)}`;
      }
    });

    // Seek
    seekBar.addEventListener("click", (e) => {
      const rect = seekBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      // In RTL, coordinate starts from right
      const pct = (width - clickX) / width;
      video.currentTime = pct * video.duration;
    });

    // Volume
    btnVolume.addEventListener("click", () => {
      video.muted = !video.muted;
      if (video.muted) {
        btnVolume.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;
      } else {
        btnVolume.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>`;
      }
    });

    // Quality Switcher
    if (qualitySelector) {
      qualitySelector.addEventListener("change", (e) => {
        const quality = e.target.value;
        this.switchQuality(video, quality);
      });
    }

    // Playback Speed
    if (speedSelector) {
      speedSelector.addEventListener("change", (e) => {
        video.playbackRate = parseFloat(e.target.value);
      });
    }

    // Fullscreen
    btnFullscreen.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        wrapper.requestFullscreen().catch(err => console.log(err));
      } else {
        document.exitFullscreen();
      }
    });
  },

  switchQuality(video, quality) {
    if (!this.currentMovie || !this.currentMovie.qualities) return;
    const newSrc = this.currentMovie.qualities[quality];
    if (!newSrc) return;

    const currentTime = video.currentTime;
    const isPaused = video.paused;

    video.src = newSrc;
    video.currentTime = currentTime;
    this.activeQuality = quality;

    if (!isPaused) {
      video.play().catch(() => {});
    }

    if (window.MerzeApp) {
      window.MerzeApp.showToast(`کوالیتی گۆڕدرا بۆ ${quality}`, "vip");
    }
  },

  renderVipRequiredOverlay(container, message) {
    container.innerHTML = `
      <div class="player-main-card">
        <div class="player-limit-overlay">
          <div class="limit-warning-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <h2 style="color:#ffffff; font-weight:800;">ناوەرۆکی تایبەت بە VIP</h2>
          <p style="color:var(--text-secondary); max-width:450px;">${message}</p>
          <div style="display:flex; gap:1rem; margin-top:1rem;">
            <button class="btn btn-vip" onclick="window.MerzeApp.navigate('vip')">
              بەشداریکردنی VIP (٥,٠٠٠ دینار)
            </button>
            <button class="btn btn-secondary" onclick="window.MerzeApp.navigate('home')">
              گەڕانەوە بۆ سەرەکی
            </button>
          </div>
        </div>
      </div>
    `;
  },

  renderLimitReachedOverlay(container, count) {
    container.innerHTML = `
      <div class="player-main-card">
        <div class="player-limit-overlay">
          <div class="limit-warning-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h2 style="color:#ffffff; font-weight:800;">سنووری ٥٠ فیلمی بێبەرامبەر گەیشتە کۆتایی!</h2>
          <p style="color:var(--text-secondary); max-width:500px; line-height:1.8;">
            تۆ تا ئێستا <strong>${count}</strong> فیلمت بە هەژماری ئاسایی سەیرکردووە کە سنووری دیاریکراوە. بۆ ئەوەی بە بێ سنوور تەماشای هەموو فیلم و زنجیرەکان بکەیت بە بەرزترین کوالیتی، هەژمارەکەت بۆ VIP بەرزبکەرەوە.
          </p>
          <div style="display:flex; gap:1rem; margin-top:1rem;">
            <button class="btn btn-vip" onclick="window.MerzeApp.navigate('vip')">
              بەرزکردنەوە بۆ VIP (٥,٠٠٠ دینار / مانگانە)
            </button>
            <button class="btn btn-secondary" onclick="window.MerzeApp.navigate('home')">
              گەڕانەوە
            </button>
          </div>
        </div>
      </div>
    `;
  },

  formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
  }
};

window.MerzePlayer = MerzePlayer;

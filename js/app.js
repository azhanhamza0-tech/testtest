// ==========================================================================
// MERZE MOVIES (مەرزە موڤیز) - MAIN APPLICATION CONTROLLER & ROUTER
// Single-Page Router, UI Rendering, Search, Filters, VIP Flow & Toasts
// ==========================================================================

const MerzeApp = {
  currentRoute: 'home',
  routeParams: {},
  theme: localStorage.getItem('merze_theme') || 'dark',

  async init() {
    console.log("🚀 دەستپێکردنی ئەپڵیکەیشنی مەرزە موڤیز (Merze Movies)...");

    // Apply theme
    this.applyTheme(this.theme);

    // Initialize DB & Auth
    await window.MerzeDB.init();
    window.MerzeAuth.init();

    // Listen to Auth state changes to refresh navbar & controls
    window.MerzeAuth.onAuthChange((user) => {
      this.updateNavbarUser(user);
    });

    // Setup global navbar search events
    this.setupNavbarSearch();

    // Setup Hash router
    window.addEventListener('hashchange', () => this.handleHashRoute());

    // Initial navigation
    if (window.location.hash) {
      this.handleHashRoute();
    } else {
      this.navigate('home');
    }
  },

  // --------------------------------------------------------------------------
  // ROUTER
  // --------------------------------------------------------------------------
  navigate(route, params = {}) {
    this.currentRoute = route;
    this.routeParams = params;
    window.location.hash = route + (params.id ? `/${params.id}` : '');
    this.renderCurrentRoute();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  handleHashRoute() {
    const rawHash = window.location.hash.replace(/^#\/?/, '');
    const parts = rawHash.split('/');
    const route = parts[0] || 'home';
    const id = parts[1] || null;

    this.currentRoute = route;
    this.routeParams = { id };
    this.renderCurrentRoute();
  },

  async renderCurrentRoute() {
    const mainView = document.getElementById("main-view");
    if (!mainView) return;

    // Update active nav links
    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.toggle("active", link.getAttribute("data-route") === this.currentRoute);
    });

    // Close any search dropdown
    this.closeSearchDropdown();

    switch (this.currentRoute) {
      case 'home':
        await this.renderHome(mainView);
        break;
      case 'movies':
        await this.renderMoviesCatalog(mainView);
        break;
      case 'series':
        await this.renderSeriesCatalog(mainView);
        break;
      case 'vip':
        await this.renderVipPage(mainView);
        break;
      case 'search':
        await this.renderSearchView(mainView);
        break;
      case 'movie':
      case 'details':
        await this.renderMovieDetails(mainView, this.routeParams.id);
        break;
      case 'series-details':
        await this.renderSeriesDetails(mainView, this.routeParams.id);
        break;
      case 'watch':
        await this.renderWatchView(mainView, this.routeParams.id);
        break;
      case 'profile':
        await this.renderProfile(mainView);
        break;
      case 'admin':
        await window.MerzeAdmin.render(mainView);
        break;
      default:
        await this.renderHome(mainView);
    }
  },

  // --------------------------------------------------------------------------
  // HOME VIEW
  // --------------------------------------------------------------------------
  async renderHome(container) {
    const movies = await window.MerzeDB.getMovies();
    const series = await window.MerzeDB.getSeries();

    const heroMovie = movies.find(m => m.is_featured) || movies[0];

    // Filter categories
    const latestMovies = [...movies].sort((a, b) => b.year - a.year);
    const topRatedMovies = [...movies].sort((a, b) => b.rating - a.rating);
    const vipMovies = movies.filter(m => m.access_type === 'VIP');
    const kurdishMovies = movies.filter(m => (m.genres || []).includes("سینەمای کوردی"));
    const actionMovies = movies.filter(m => (m.genres || []).includes("ئەکشن"));
    const dramaMovies = movies.filter(m => (m.genres || []).includes("دراما"));

    container.innerHTML = `
      <!-- Hero Section -->
      ${heroMovie ? `
        <section class="hero-section">
          <div class="hero-backdrop-container">
            <img class="hero-backdrop-img" src="${heroMovie.backdrop_url || heroMovie.poster_url}" alt="${heroMovie.title}">
            <div class="hero-gradient-overlay"></div>
          </div>
          <div class="hero-content">
            <div class="hero-badges">
              <span class="badge ${heroMovie.access_type === 'VIP' ? 'badge-vip' : 'badge-free'}">
                ${heroMovie.access_type === 'VIP' ? 'تایبەت بە VIP' : 'بێبەرامبەر'}
              </span>
              <span class="badge badge-rating">⭐ ${heroMovie.rating}</span>
              <span class="badge badge-genre">${(heroMovie.genres || []).join(' • ')}</span>
            </div>
            <h1 class="hero-title">${heroMovie.title}</h1>
            <div class="hero-meta">
              <span>📅 ${heroMovie.year}</span>
              <span>⏱️ ${heroMovie.duration}</span>
              <span>🌍 ${heroMovie.country || 'کوردستان'}</span>
            </div>
            <p class="hero-description">${heroMovie.description}</p>
            <div class="hero-actions">
              <button class="btn btn-primary btn-lg" onclick="MerzeApp.navigate('watch', { id: '${heroMovie.id}' })">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                سەیرکردن
              </button>
              <button class="btn btn-secondary btn-lg" onclick="MerzeApp.navigate('details', { id: '${heroMovie.id}' })">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                زانیاری زیاتر
              </button>
            </div>
          </div>
        </section>
      ` : ''}

      <div class="main-container">
        <!-- نوێترین فیلمەکان -->
        <section>
          <div class="section-header">
            <div class="section-title-wrap">
              <div class="section-indicator"></div>
              <h2 class="section-title">نوێترین فیلمەکان</h2>
            </div>
            <span class="section-count">${latestMovies.length} فیلم</span>
          </div>
          <div class="movies-row">
            ${latestMovies.map(m => this.createMovieCardHtml(m)).join('')}
          </div>
        </section>

        <!-- بەشی تایبەتی VIP -->
        <section>
          <div class="section-header">
            <div class="section-title-wrap vip-section">
              <div class="section-indicator"></div>
              <h2 class="section-title" style="color:var(--vip-gold);">بەشی تایبەتی VIP (فیلمە شازەکان)</h2>
            </div>
            <button class="btn btn-vip btn-sm" onclick="MerzeApp.navigate('vip')">بەشداریکردن</button>
          </div>
          <div class="movies-row">
            ${vipMovies.map(m => this.createMovieCardHtml(m)).join('')}
          </div>
        </section>

        <!-- سینەمای کوردی -->
        <section>
          <div class="section-header">
            <div class="section-title-wrap">
              <div class="section-indicator"></div>
              <h2 class="section-title">شاهکارەکانی سینەمای کوردی</h2>
            </div>
          </div>
          <div class="movies-row">
            ${kurdishMovies.map(m => this.createMovieCardHtml(m)).join('')}
          </div>
        </section>

        <!-- فیلمە بەرزترین نمرەکان -->
        <section>
          <div class="section-header">
            <div class="section-title-wrap">
              <div class="section-indicator"></div>
              <h2 class="section-title">فیلمە بەرزترین نمرەکان (Top Rated)</h2>
            </div>
          </div>
          <div class="movies-row">
            ${topRatedMovies.map(m => this.createMovieCardHtml(m)).join('')}
          </div>
        </section>

        <!-- زنجیرە فیلمەکان -->
        <section>
          <div class="section-header">
            <div class="section-title-wrap">
              <div class="section-indicator"></div>
              <h2 class="section-title">زنجیرە بەناوبانگەکان</h2>
            </div>
          </div>
          <div class="movies-row">
            ${series.map(s => this.createSeriesCardHtml(s)).join('')}
          </div>
        </section>

        <!-- ئەکشن -->
        <section>
          <div class="section-header">
            <div class="section-title-wrap">
              <div class="section-indicator"></div>
              <h2 class="section-title">فیلمەکانی ئەکشن</h2>
            </div>
          </div>
          <div class="movies-row">
            ${actionMovies.map(m => this.createMovieCardHtml(m)).join('')}
          </div>
        </section>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // CARDS GENERATOR
  // --------------------------------------------------------------------------
  createMovieCardHtml(movie) {
    const isVip = movie.access_type === 'VIP';
    return `
      <div class="movie-card ${isVip ? 'vip-card' : ''}" onclick="MerzeApp.navigate('details', { id: '${movie.id}' })">
        <div class="poster-wrap">
          <img class="poster-img" src="${movie.poster_url}" alt="${movie.title}" loading="lazy">
          <div class="poster-badges">
            <span class="badge ${isVip ? 'badge-vip' : 'badge-free'}">${isVip ? 'VIP' : 'بێبەرامبەر'}</span>
          </div>
          <div class="card-play-overlay">
            <div class="play-icon-circle">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        </div>
        <div class="card-info">
          <h3 class="card-title">${movie.title}</h3>
          <div class="card-meta">
            <span>${movie.year}</span>
            <span class="card-rating">⭐ ${movie.rating}</span>
          </div>
        </div>
      </div>
    `;
  },

  createSeriesCardHtml(series) {
    const isVip = series.access_type === 'VIP';
    return `
      <div class="movie-card ${isVip ? 'vip-card' : ''}" onclick="MerzeApp.navigate('series-details', { id: '${series.id}' })">
        <div class="poster-wrap">
          <img class="poster-img" src="${series.poster_url}" alt="${series.title}" loading="lazy">
          <div class="poster-badges">
            <span class="badge ${isVip ? 'badge-vip' : 'badge-free'}">${isVip ? 'VIP' : 'بێبەرامبەر'}</span>
          </div>
          <div class="card-play-overlay">
            <div class="play-icon-circle">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        </div>
        <div class="card-info">
          <h3 class="card-title">${series.title}</h3>
          <div class="card-meta">
            <span>${(series.seasons || []).length} وەرز</span>
            <span class="card-rating">⭐ ${series.rating}</span>
          </div>
        </div>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // MOVIE DETAILS VIEW
  // --------------------------------------------------------------------------
  async renderMovieDetails(container, movieId) {
    const movie = await window.MerzeDB.getMovieById(movieId);
    if (!movie) {
      container.innerHTML = `<div class="p-4 text-center">فیلمەکە نەدۆزرایەوە.</div>`;
      return;
    }

    const user = window.MerzeAuth.getUser();
    const isFav = user ? await window.MerzeDB.isFavorite(user.id, movie.id) : false;
    const reviews = await window.MerzeDB.getReviews(movie.id);

    container.innerHTML = `
      <div class="main-container" style="padding-top:2rem;">
        <!-- Backdrop & Hero Banner -->
        <div class="details-backdrop-hero">
          <img class="details-backdrop-img" src="${movie.backdrop_url || movie.poster_url}" alt="${movie.title}">
          <div class="details-overlay-grad"></div>

          <div class="details-hero-content">
            <div class="details-poster-box">
              <img src="${movie.poster_url}" alt="${movie.title}">
            </div>
            <div class="details-info-box">
              <div class="hero-badges">
                <span class="badge ${movie.access_type === 'VIP' ? 'badge-vip' : 'badge-free'}">
                  ${movie.access_type === 'VIP' ? 'تایبەت بە VIP' : 'بێبەرامبەر'}
                </span>
                <span class="badge badge-rating">⭐ IMDb ${movie.rating}</span>
                <span class="badge badge-genre">${(movie.genres || []).join(' • ')}</span>
              </div>
              <h1 style="font-size:2.4rem; font-weight:900;">${movie.title}</h1>
              <div class="hero-meta">
                <span>📅 ساڵ: ${movie.year}</span>
                <span>⏱️ ماوە: ${movie.duration}</span>
                <span>🌍 وڵات: ${movie.country}</span>
                <span>👁️ ${Number(movie.views || 0).toLocaleString()} بینەر</span>
              </div>
              <p style="color:#cbd5e1; line-height:1.8; max-width:750px;">${movie.description}</p>
              
              <div style="display:flex; gap:1rem; flex-wrap:wrap; margin-top:0.5rem;">
                <button class="btn btn-primary btn-lg" onclick="MerzeApp.navigate('watch', { id: '${movie.id}' })">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  سەیرکردنی فیلم
                </button>
                <button class="btn btn-secondary btn-lg" id="btn-fav-toggle" onclick="MerzeApp.toggleFavoriteAction('${movie.id}')">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" style="color:${isFav ? 'var(--accent-pink)' : 'inherit'}"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  ${isFav ? 'لە دڵخوازەکاندایە' : 'زیادکردن بۆ دڵخوازەکان'}
                </button>
                ${movie.trailer_url ? `
                  <button class="btn btn-secondary btn-lg" onclick="MerzeApp.openTrailerModal('${movie.trailer_url}', '${movie.title}')">
                    ترەیلەری فەرمی
                  </button>
                ` : ''}
              </div>
            </div>
          </div>
        </div>

        <!-- Cast & Staff -->
        <section>
          <div class="section-header">
            <div class="section-title-wrap">
              <div class="section-indicator"></div>
              <h2 class="section-title">ئەکتەران و کارەکتەرەکان</h2>
            </div>
          </div>
          <div class="details-cast-grid">
            ${(movie.cast || []).map(c => `
              <div class="cast-card">
                <img class="cast-avatar" src="${c.image_url}" alt="${c.name}">
                <strong style="font-size:0.88rem;">${c.name}</strong>
                <span style="font-size:0.75rem; color:var(--text-muted);">${c.character_description}</span>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Reviews Section -->
        <section class="reviews-container">
          <div class="section-header">
            <div class="section-title-wrap">
              <div class="section-indicator"></div>
              <h2 class="section-title">هەڵسەنگاندن و سەرنجەکانی بینەران (${reviews.length})</h2>
            </div>
          </div>

          <!-- Add Review Form -->
          <div class="review-form-card">
            <h3 style="font-size:1.1rem; font-weight:700;">سەرنج و نمرەی خۆت بنووسە</h3>
            ${user ? `
              <div style="display:flex; flex-direction:column; gap:1rem;">
                <div style="display:flex; align-items:center; gap:1rem;">
                  <span>نمرەکەت:</span>
                  <div class="rating-stars-input" id="review-stars-input">
                    <span class="star-btn active" data-val="1">★</span>
                    <span class="star-btn active" data-val="2">★</span>
                    <span class="star-btn active" data-val="3">★</span>
                    <span class="star-btn active" data-val="4">★</span>
                    <span class="star-btn active" data-val="5">★</span>
                  </div>
                </div>
                <textarea id="review-text-input" class="form-textarea" placeholder="ڕای خۆت لەسەر ئەم فیلمە لێرە بنووسە..."></textarea>
                <div>
                  <button class="btn btn-primary btn-sm" onclick="MerzeApp.submitReviewAction('${movie.id}')">ناردنی هەڵسەنگاندن</button>
                </div>
              </div>
            ` : `
              <p style="color:var(--text-secondary);">
                بۆ ناردنی هەڵسەنگاندن پێویستە سەرەتا 
                <a href="javascript:void(0)" onclick="MerzeApp.openLoginModal()" style="color:var(--accent-purple); text-decoration:underline; font-weight:bold;">بچیتە ژوورەوە</a>.
              </p>
            `}
          </div>

          <!-- Reviews List -->
          <div style="display:flex; flex-direction:column; gap:1rem;">
            ${reviews.map(r => `
              <div class="review-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <strong>${r.user_name}</strong>
                  <span style="color:var(--vip-gold); font-weight:700;">${'★'.repeat(r.rating)}</span>
                </div>
                <p style="color:#cbd5e1; font-size:0.92rem; line-height:1.7;">${r.review}</p>
                <div style="display:flex; justify-content:space-between; font-size:0.78rem; color:var(--text-muted);">
                  <span>📅 ${r.created_at}</span>
                  <span>❤️ ${r.likes || 0} لایک</span>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // SERIES DETAILS VIEW
  // --------------------------------------------------------------------------
  async renderSeriesDetails(container, seriesId) {
    const series = await window.MerzeDB.getSeriesById(seriesId);
    if (!series) {
      container.innerHTML = `<div class="p-4 text-center">زنجیرەکە نەدۆزرایەوە.</div>`;
      return;
    }

    const seasons = series.seasons || [];
    const firstSeason = seasons[0] || { episodes: [] };

    container.innerHTML = `
      <div class="main-container" style="padding-top:2rem;">
        <div class="details-backdrop-hero">
          <img class="details-backdrop-img" src="${series.backdrop_url || series.poster_url}" alt="${series.title}">
          <div class="details-overlay-grad"></div>
          <div class="details-hero-content">
            <div class="details-poster-box">
              <img src="${series.poster_url}" alt="${series.title}">
            </div>
            <div class="details-info-box">
              <span class="badge ${series.access_type === 'VIP' ? 'badge-vip' : 'badge-free'}">${series.access_type}</span>
              <h1 style="font-size:2.4rem; font-weight:900;">${series.title}</h1>
              <div class="hero-meta">
                <span>📅 ساڵ: ${series.year}</span>
                <span>⭐ نمرە: ${series.rating}</span>
                <span>📺 ${seasons.length} وەرز</span>
              </div>
              <p style="color:#cbd5e1; line-height:1.8; max-width:700px;">${series.description}</p>
            </div>
          </div>
        </div>

        <!-- Seasons & Episodes -->
        <section style="margin-top:2rem;">
          <div class="section-header">
            <div class="section-title-wrap">
              <div class="section-indicator"></div>
              <h2 class="section-title">ئەڵقەکانی زنجیرە</h2>
            </div>
          </div>

          <div class="season-tabs">
            ${seasons.map((s, idx) => `
              <button class="season-tab-btn ${idx === 0 ? 'active' : ''}" onclick="MerzeApp.switchSeasonTab(${idx})">
                ${s.title || `وەرزی ${s.season_number}`}
              </button>
            `).join('')}
          </div>

          <div class="episodes-grid" id="episodes-container" style="margin-top:1.5rem;">
            ${(firstSeason.episodes || []).map(ep => `
              <div class="episode-card" onclick="MerzeApp.navigate('watch', { id: '${series.id}' })">
                <div class="episode-thumb-wrap">
                  <img class="episode-thumb-img" src="${ep.thumbnail_url}" alt="${ep.title}">
                </div>
                <div class="episode-info">
                  <span style="font-size:0.8rem; color:var(--accent-purple); font-weight:700;">ئەڵقەی ${ep.episode_number}</span>
                  <strong style="font-size:0.95rem;">${ep.title}</strong>
                  <p style="font-size:0.82rem; color:var(--text-muted); line-height:1.6;">${ep.description}</p>
                  <span style="font-size:0.75rem; color:var(--text-muted); margin-top:0.4rem;">⏱️ ${ep.duration}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // WATCH / PLAYER VIEW
  // --------------------------------------------------------------------------
  async renderWatchView(container, movieId) {
    container.innerHTML = `
      <div class="main-container" style="padding-top:2rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <button class="btn btn-secondary btn-sm" onclick="history.back()">
            ← گەڕانەوە
          </button>
        </div>
        <div id="player-container"></div>
      </div>
    `;

    // Initialize custom player
    await window.MerzePlayer.init(movieId);
  },

  // --------------------------------------------------------------------------
  // VIP SUBSCRIPTION & QI CARD PAYMENT PAGE
  // --------------------------------------------------------------------------
  async renderVipPage(container) {
    const settings = await window.MerzeDB.getPaymentSettings();
    const user = window.MerzeAuth.getUser();
    const isVip = window.MerzeAuth.isVip();

    container.innerHTML = `
      <div class="main-container" style="padding-top:2.5rem;">
        <div class="vip-page-wrap">
          <!-- Hero Banner -->
          <div class="vip-hero-banner">
            <span class="vip-badge-lg">👑 خزمەتگوزارییە تایبەتەکانی VIP</span>
            <h1 class="vip-hero-title">تەماشاکردنی بێ سنوور لەگەڵ مەرزە موڤیز</h1>
            <p class="vip-hero-subtitle">
              دەستگەیشتن بە هەموو فیلم و زنجیرە نایابەکان بە کوالیتی 1080p Full HD، بە بێ هیچ سنووردارکردنێکی ٥٠ فیلم.
            </p>
          </div>

          <!-- Pricing Grid -->
          <div class="pricing-grid">
            <!-- FREE Card -->
            <div class="plan-card">
              <div class="plan-header">
                <span class="plan-name">پلانی بێبەرامبەر (FREE)</span>
                <div class="plan-price">
                  0 IQD <span class="plan-period">/ بۆ هەتاهەتایە</span>
                </div>
              </div>
              <ul class="plan-features">
                <li class="plan-feature-item active">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                  سەیرکردنی تا ٥٠ فیلم
                </li>
                <li class="plan-feature-item active">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                  کوالیتی ئاسایی ڤیدیۆ
                </li>
                <li class="plan-feature-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  دەستگەیشتن بە فیلمە تایبەتەکانی VIP
                </li>
                <li class="plan-feature-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  کوالیتی بەرزترین 1080p
                </li>
              </ul>
              <button class="btn btn-secondary" disabled>پلانی ئێستاتە</button>
            </div>

            <!-- VIP Card -->
            <div class="plan-card vip-plan">
              <div class="plan-header">
                <span class="plan-name" style="color:var(--vip-gold);">پاکێجی زێڕینی VIP</span>
                <div class="plan-price" style="color:var(--vip-gold);">
                  ${Number(settings.amount || 5000).toLocaleString()} IQD <span class="plan-period">/ مانگانە</span>
                </div>
              </div>
              <ul class="plan-features">
                <li class="plan-feature-item active vip-active">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  سەیرکردنی بێ سنووری فیلمەکان (لابردنی سنووری ٥٠ فیلم)
                </li>
                <li class="plan-feature-item active vip-active">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  دەستگەیشتن بە هەموو فیلم و زنجیرە تایبەتەکانی VIP
                </li>
                <li class="plan-feature-item active vip-active">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  بەرزترین کوالیتی 1080p بەبێ پچڕان
                </li>
                <li class="plan-feature-item active vip-active">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  باجی زێڕینی VIP لە پڕۆفایلەکەت
                </li>
              </ul>
              <button class="btn btn-vip" onclick="document.getElementById('payment-flow-section').scrollIntoView({behavior:'smooth'})">
                ${isVip ? 'هەژمارەکەت لە ئێستادا VIP یە' : 'بەشداریکردن بە QI Card'}
              </button>
            </div>
          </div>

          <!-- Payment Submission Card -->
          <div class="payment-flow-card" id="payment-flow-section">
            <div class="qi-card-header">
              <div class="qi-brand-logo">
                <div class="qi-logo-img">QI</div>
                <div>
                  <h3 style="font-weight:800; font-size:1.1rem;">پارەدان لە ڕێگەی کی کارت (QI Card)</h3>
                  <span style="font-size:0.8rem; color:var(--text-muted);">بڕی پارە: ٥,٠٠٠ دیناری عێراقی</span>
                </div>
              </div>
              <span class="badge badge-vip">فەرمی و پشتڕاستکراو</span>
            </div>

            <!-- Dynamic QR Code Container -->
            <div class="qr-code-box">
              <img class="qr-img" src="${settings.qr_code_url}" alt="QI Card QR Code">
              <span style="font-size:0.75rem; color:#475569; font-weight:600;">سکان بکە لە ڕێگەی ئەپی QI Card</span>
            </div>

            <!-- Instructions -->
            <div class="payment-instructions-text">
              <strong>ڕێنمایییەکانی تەواوکردنی پارەدان:</strong>
              <p style="margin-top:6px;">${settings.instructions}</p>
            </div>

            <!-- Submission Form -->
            <div style="display:flex; flex-direction:column; gap:1.25rem;">
              <div class="form-group">
                <label class="form-label">ژمارەی مامەڵە یان پسوولە (Transaction ID):</label>
                <input type="text" id="pay-tx-id" class="form-input" placeholder="نموونە: TX-9948271049" required>
              </div>

              <div class="form-group">
                <label class="form-label">بەستەر یان ناوی وێنەی پسوولە (Payment Proof URL):</label>
                <input type="text" id="pay-proof-url" class="form-input" placeholder="https://... وێنەی پسوولەی پارەدانەکە" value="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400">
              </div>

              ${user ? `
                <button class="btn btn-vip btn-lg" onclick="MerzeApp.submitPaymentAction()">
                  ناردنی داواکاریی چالاککردن
                </button>
              ` : `
                <div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:var(--radius-md); padding:1rem; text-align:center;">
                  تکایە سەرەتا 
                  <a href="javascript:void(0)" onclick="MerzeApp.openLoginModal()" style="color:var(--accent-purple); text-decoration:underline; font-weight:bold;">بچۆ ژوورەوە</a>
                  تا بتوانیت داواکاری پارەدانەکە بە ناوی هەژمارەکەت بنێریت.
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async submitPaymentAction() {
    const user = window.MerzeAuth.getUser();
    if (!user) {
      this.showToast("تکایە بچۆ ژوورەوە سەرەتا.", "error");
      return;
    }

    const txId = document.getElementById("pay-tx-id").value.trim();
    const proofUrl = document.getElementById("pay-proof-url").value.trim();

    if (!txId) {
      alert("تکایە ژمارەی مامەڵە (Transaction ID) بنووسە.");
      return;
    }

    const paymentData = {
      user_id: user.id,
      username: user.username,
      email: user.email,
      amount: 5000,
      payment_method: "QI Card",
      transaction_id: txId,
      payment_proof_url: proofUrl
    };

    await window.MerzeDB.submitPaymentRequest(paymentData);
    this.showToast("داواکارییەکەت نێردرا! لە کەمترین ماوەدا دوای وردبینی ئەدمین هەژمارەکەت دەبێتە VIP.", "vip");
    document.getElementById("pay-tx-id").value = "";
  },

  // --------------------------------------------------------------------------
  // USER PROFILE VIEW
  // --------------------------------------------------------------------------
  async renderProfile(container) {
    const user = window.MerzeAuth.getUser();
    if (!user) {
      container.innerHTML = `
        <div class="p-4 text-center" style="margin:4rem auto; max-width:400px;">
          <h2>پێویستە بچیتە ژوورەوە</h2>
          <button class="btn btn-primary" style="margin-top:1rem;" onclick="MerzeApp.openLoginModal()">چوونەژوورەوە</button>
        </div>
      `;
      return;
    }

    const isVip = window.MerzeAuth.isVip();
    const watchedCount = await window.MerzeDB.getWatchedMoviesCount(user.id);
    const favorites = await window.MerzeDB.getFavorites(user.id);
    const allMovies = await window.MerzeDB.getMovies();
    const favMovies = allMovies.filter(m => favorites.some(f => f.movie_id === m.id));

    container.innerHTML = `
      <div class="main-container" style="padding-top:2.5rem;">
        <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:2rem; display:flex; gap:2rem; align-items:center; flex-wrap:wrap;">
          <img src="${user.avatar_url}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:3px solid var(--accent-purple);" alt="">
          <div style="display:flex; flex-direction:column; gap:0.5rem; flex-grow:1;">
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <h1 style="font-size:1.8rem; font-weight:800;">${user.username}</h1>
              <span class="badge ${isVip ? 'badge-vip' : 'badge-free'}">${isVip ? '👑 VIP چالاکە' : 'هەژماری بێبەرامبەر (Free)'}</span>
            </div>
            <span style="color:var(--text-muted); font-size:0.9rem;">${user.email}</span>
            ${isVip && user.vip_expires_at ? `
              <span style="color:var(--vip-gold); font-size:0.85rem; font-weight:600;">
                بەرواری بەسەرچوونی VIP: ${new Date(user.vip_expires_at).toLocaleDateString('ku-IQ')}
              </span>
            ` : ''}
          </div>
          <div>
            ${!isVip ? `
              <button class="btn btn-vip" onclick="MerzeApp.navigate('vip')">بەرزکردنەوە بۆ VIP</button>
            ` : ''}
          </div>
        </div>

        <!-- 50-Movie Limit Status Card for Free users -->
        ${!isVip ? `
          <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1.5rem; margin-top:2rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem;">
              <strong style="font-size:1.05rem;">سنووری سەیرکردنی فیلمی بێبەرامبەر</strong>
              <span style="color:var(--vip-gold); font-weight:bold;">${watchedCount} / 50 فیلم</span>
            </div>
            <div style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:var(--radius-full); overflow:hidden;">
              <div style="width:${Math.min((watchedCount/50)*100, 100)}%; height:100%; background:linear-gradient(90deg, var(--accent-purple), var(--vip-gold));"></div>
            </div>
            <span style="font-size:0.8rem; color:var(--text-muted); display:inline-block; margin-top:0.5rem;">
              کاتێک دەگەیتە ٥٠ فیلم، پێویستت بە بەرزکردنەوەی هەژمارەکەت دەبێت بۆ VIP.
            </span>
          </div>
        ` : ''}

        <!-- Favorites Section -->
        <section style="margin-top:3rem;">
          <div class="section-header">
            <div class="section-title-wrap">
              <div class="section-indicator"></div>
              <h2 class="section-title">لیستی دڵخوازەکانت (${favMovies.length})</h2>
            </div>
          </div>
          ${favMovies.length === 0 ? `
            <div style="padding:2rem; text-align:center; color:var(--text-muted); background:var(--bg-surface); border-radius:var(--radius-md);">
              هیچ فیلمێکت زیاد نەکردووە بۆ دڵخوازەکان.
            </div>
          ` : `
            <div class="movies-grid">
              ${favMovies.map(m => this.createMovieCardHtml(m)).join('')}
            </div>
          `}
        </section>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // SEARCH & FILTERS VIEW
  // --------------------------------------------------------------------------
  async renderSearchView(container) {
    const movies = await window.MerzeDB.getMovies();
    const series = await window.MerzeDB.getSeries();

    container.innerHTML = `
      <div class="main-container" style="padding-top:2.5rem;">
        <div class="search-view-container">
          <div class="search-header-bar">
            <div class="search-main-input">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" id="catalog-search-input" placeholder="گەڕان بەدوای ناوی فیلم، زنجیرە، ئەکتەر یان ژانەر...">
            </div>

            <div class="filters-row">
              <select class="filter-select" id="filter-genre">
                <option value="">هەموو ژانەرەکان</option>
                <option value="ئەکشن">ئەکشن</option>
                <option value="کۆمیدی">کۆمیدی</option>
                <option value="دراما">دراما</option>
                <option value="سینەمای کوردی">سینەمای کوردی</option>
                <option value="ترسناک">ترسناک</option>
                <option value="زانستی خەیاڵی">زانستی خەیاڵی</option>
              </select>

              <select class="filter-select" id="filter-access">
                <option value="">هەموو پاکێجەکان</option>
                <option value="FREE">بێبەرامبەر (Free)</option>
                <option value="VIP">تایبەت بە VIP</option>
              </select>

              <select class="filter-select" id="filter-sort">
                <option value="latest">نوێترین</option>
                <option value="rating">بەرزترین نمرە</option>
                <option value="views">زۆرترین بینەر</option>
              </select>
            </div>
          </div>

          <div id="search-results-grid" class="movies-grid">
            ${movies.map(m => this.createMovieCardHtml(m)).join('')}
          </div>
        </div>
      </div>
    `;

    // Bind search event listeners
    const searchInput = document.getElementById("catalog-search-input");
    const genreSelect = document.getElementById("filter-genre");
    const accessSelect = document.getElementById("filter-access");
    const sortSelect = document.getElementById("filter-sort");

    const runFilter = () => {
      const q = searchInput.value.toLowerCase().trim();
      const genre = genreSelect.value;
      const access = accessSelect.value;
      const sort = sortSelect.value;

      let results = [...movies];

      if (q) {
        results = results.filter(m => 
          m.title.toLowerCase().includes(q) || 
          (m.description && m.description.toLowerCase().includes(q)) ||
          (m.director && m.director.toLowerCase().includes(q))
        );
      }

      if (genre) {
        results = results.filter(m => (m.genres || []).includes(genre));
      }

      if (access) {
        results = results.filter(m => m.access_type === access);
      }

      if (sort === 'rating') {
        results.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'views') {
        results.sort((a, b) => (b.views || 0) - (a.views || 0));
      } else {
        results.sort((a, b) => b.year - a.year);
      }

      const grid = document.getElementById("search-results-grid");
      if (grid) {
        if (results.length === 0) {
          grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--text-muted);">هیچ ئەنجامێک نەدۆزرایەوە بەم مەرجانە.</div>`;
        } else {
          grid.innerHTML = results.map(m => this.createMovieCardHtml(m)).join('');
        }
      }
    };

    searchInput.addEventListener("input", runFilter);
    genreSelect.addEventListener("change", runFilter);
    accessSelect.addEventListener("change", runFilter);
    sortSelect.addEventListener("change", runFilter);
  },

  // --------------------------------------------------------------------------
  // ACTIONS & INTERACTIONS
  // --------------------------------------------------------------------------
  async toggleFavoriteAction(movieId) {
    const user = window.MerzeAuth.getUser();
    if (!user) {
      this.openLoginModal();
      return;
    }
    const isFav = await window.MerzeDB.toggleFavorite(user.id, movieId);
    const btn = document.getElementById("btn-fav-toggle");
    if (btn) {
      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" style="color:${isFav ? 'var(--accent-pink)' : 'inherit'}"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        ${isFav ? 'لە دڵخوازەکاندایە' : 'زیادکردن بۆ دڵخوازەکان'}
      `;
    }
    this.showToast(isFav ? "زیادکرا بۆ دڵخوازەکان" : "لە دڵخوازەکان سڕدرایەوە", "success");
  },

  async submitReviewAction(movieId) {
    const user = window.MerzeAuth.getUser();
    const textInput = document.getElementById("review-text-input");
    const text = textInput ? textInput.value.trim() : "";

    if (!text) {
      alert("تکایە سەرنجەکەت بنووسە.");
      return;
    }

    const reviewObj = {
      movie_id: movieId,
      user_id: user.id,
      user_name: user.username,
      rating: 5,
      review: text
    };

    await window.MerzeDB.addReview(reviewObj);
    this.showToast("سەرنجەکەت بە سەرکەوتوویی تۆمارکرا!", "success");
    this.renderMovieDetails(document.getElementById("main-view"), movieId);
  },

  openTrailerModal(trailerUrl, title) {
    this.openModal(`
      <div class="modal-header">
        <h3 class="modal-title">ترەیلەری: ${title}</h3>
        <button class="player-btn" onclick="MerzeApp.closeModal()">✕</button>
      </div>
      <div class="modal-body" style="padding:0;">
        <div style="aspect-ratio:16/9; width:100%;">
          <iframe src="${trailerUrl}?autoplay=1" style="width:100%; height:100%; border:none;" allowfullscreen allow="autoplay"></iframe>
        </div>
      </div>
    `);
  },

  // --------------------------------------------------------------------------
  // AUTH MODALS
  // --------------------------------------------------------------------------
  openLoginModal() {
    this.openModal(`
      <div class="modal-header">
        <h3 class="modal-title">چوونەژوورەوە لە مەرزە موڤیز</h3>
        <button class="player-btn" onclick="MerzeApp.closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">ئیمەیڵ:</label>
          <input type="email" id="auth-email" class="form-input" placeholder="admin@merzemovies.com" required>
        </div>
        <div class="form-group">
          <label class="form-label">وشەی نهێنی:</label>
          <input type="password" id="auth-pass" class="form-input" placeholder="••••••••" required>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.85rem; color:var(--text-secondary);">
          <label style="display:flex; align-items:center; gap:0.4rem; cursor:pointer;">
            <input type="checkbox" checked> لەبیرم مەبە
          </label>
          <a href="javascript:void(0)" onclick="alert('تکایە پەیوەندی بە بەڕێوەبەرایەتی مەرزە موڤیز بکە بۆ هێنانەوەی هەژمارەکەت.')" style="color:var(--accent-purple);">وشەی نهێنیت لەبیرچووە؟</a>
        </div>
        <button class="btn btn-primary btn-lg" onclick="MerzeApp.submitLogin()">چوونەژوورەوە</button>
        <div style="text-align:center; font-size:0.88rem; color:var(--text-secondary); margin-top:0.5rem;">
          هێشتا هەژمارت نییە؟ 
          <a href="javascript:void(0)" onclick="MerzeApp.openSignupModal()" style="color:var(--accent-purple); font-weight:bold;">دروستکردنی هەژمار</a>
        </div>
      </div>
    `);
  },

  openSignupModal() {
    this.openModal(`
      <div class="modal-header">
        <h3 class="modal-title">دروستکردنی هەژماری نوێ</h3>
        <button class="player-btn" onclick="MerzeApp.closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">ناوی بەکارهێنەر:</label>
          <input type="text" id="reg-name" class="form-input" placeholder="ناوی خۆت بنووسە" required>
        </div>
        <div class="form-group">
          <label class="form-label">ئیمەیڵ:</label>
          <input type="email" id="reg-email" class="form-input" placeholder="user@gmail.com" required>
        </div>
        <div class="form-group">
          <label class="form-label">وشەی نهێنی:</label>
          <input type="password" id="reg-pass" class="form-input" placeholder="بە لایەنی کەم ٦ پیت" required>
        </div>
        <div class="form-group">
          <label class="form-label">دووبارەکردنەوەی وشەی نهێنی:</label>
          <input type="password" id="reg-pass2" class="form-input" placeholder="دووبارەی بکەرەوە" required>
        </div>
        <button class="btn btn-primary btn-lg" onclick="MerzeApp.submitSignup()">تۆمارکردنی هەژمار</button>
        <div style="text-align:center; font-size:0.88rem; color:var(--text-secondary); margin-top:0.5rem;">
          پێشتر هەژمارت هەبووە؟ 
          <a href="javascript:void(0)" onclick="MerzeApp.openLoginModal()" style="color:var(--accent-purple); font-weight:bold;">چوونەژوورەوە</a>
        </div>
      </div>
    `);
  },

  async submitLogin() {
    const email = document.getElementById("auth-email").value.trim();
    const pass = document.getElementById("auth-pass").value;

    try {
      await window.MerzeAuth.login(email, pass);
      this.closeModal();
      this.showToast("بە خێربێیتەوە بۆ مەرزە موڤیز!", "success");
      this.renderCurrentRoute();
    } catch (err) {
      alert(err.message);
    }
  },

  async submitSignup() {
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const pass = document.getElementById("reg-pass").value;
    const pass2 = document.getElementById("reg-pass2").value;

    try {
      await window.MerzeAuth.signup(name, email, pass, pass2);
      this.closeModal();
      this.showToast("هەژمارەکەت بە سەرکەوتوویی دروستکرا!", "success");
      this.renderCurrentRoute();
    } catch (err) {
      alert(err.message);
    }
  },

  // --------------------------------------------------------------------------
  // NAVBAR & GLOBAL UI
  // --------------------------------------------------------------------------
  updateNavbarUser(user) {
    const userWrap = document.getElementById("nav-user-area");
    if (!userWrap) return;

    if (user) {
      const isAdmin = window.MerzeAuth.isAdmin();
      const isVip = window.MerzeAuth.isVip();
      userWrap.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.6rem;">
          ${isAdmin ? `
            <button class="btn btn-secondary btn-sm" onclick="MerzeApp.navigate('admin')">
              🛠️ بەڕێوەبەرایەتی
            </button>
          ` : ''}
          <div class="user-menu-btn" onclick="MerzeApp.navigate('profile')">
            <img class="user-avatar-sm" src="${user.avatar_url}" alt="${user.username}">
            <span class="user-name-label">${user.username}</span>
            ${isVip ? '<span style="color:var(--vip-gold); font-size:0.75rem;">👑</span>' : ''}
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.MerzeAuth.logout(); MerzeApp.showToast('دەرچوویت لە هەژمارەکەت', 'info');">
            دەرچوون
          </button>
        </div>
      `;
    } else {
      userWrap.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <button class="btn btn-secondary btn-sm" onclick="MerzeApp.openLoginModal()">چوونەژوورەوە</button>
          <button class="btn btn-primary btn-sm" onclick="MerzeApp.openSignupModal()">دروستکردنی هەژمار</button>
        </div>
      `;
    }
  },

  setupNavbarSearch() {
    const input = document.getElementById("nav-search-input");
    const dropdown = document.getElementById("nav-search-dropdown");
    if (!input || !dropdown) return;

    input.addEventListener("input", async (e) => {
      const val = e.target.value.toLowerCase().trim();
      if (!val) {
        dropdown.classList.remove("show");
        return;
      }

      const movies = await window.MerzeDB.getMovies();
      const matches = movies.filter(m => m.title.toLowerCase().includes(val)).slice(0, 5);

      if (matches.length === 0) {
        dropdown.innerHTML = `<div style="padding:1rem; text-align:center; color:var(--text-muted); font-size:0.85rem;">هیچ فیلمێک نەدۆزرایەوە.</div>`;
      } else {
        dropdown.innerHTML = matches.map(m => `
          <div class="search-dropdown-item" onclick="MerzeApp.navigate('details', { id: '${m.id}' })">
            <img class="search-dropdown-thumb" src="${m.poster_url}" alt="">
            <div style="display:flex; flex-direction:column;">
              <strong style="font-size:0.88rem;">${m.title}</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">${m.year} • ⭐ ${m.rating}</span>
            </div>
          </div>
        `).join('');
      }
      dropdown.classList.add("show");
    });

    document.addEventListener("click", (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove("show");
      }
    });
  },

  closeSearchDropdown() {
    const dropdown = document.getElementById("nav-search-dropdown");
    if (dropdown) dropdown.classList.remove("show");
  },

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(this.theme);
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('merze_theme', theme);
  },

  // --------------------------------------------------------------------------
  // MODALS & TOASTS
  // --------------------------------------------------------------------------
  openModal(htmlContent) {
    const overlay = document.getElementById("modal-overlay");
    const card = document.getElementById("modal-card");
    if (!overlay || !card) return;

    card.innerHTML = htmlContent;
    overlay.classList.add("active");
  },

  closeModal() {
    const overlay = document.getElementById("modal-overlay");
    if (overlay) overlay.classList.remove("active");
  },

  showToast(message, type = 'info') {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = '0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

window.MerzeApp = MerzeApp;

// Auto initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  window.MerzeApp.init();
});

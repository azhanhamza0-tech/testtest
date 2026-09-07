// ==========================================================================
// MERZE MOVIES (مەرزە موڤیز) - ADMIN DASHBOARD
// Powerful Kurdish Sorani management panel for movies, series, payments, QR & users
// ==========================================================================

const MerzeAdmin = {
  currentTab: 'overview',

  async render(container) {
    if (!window.MerzeAuth.isAdmin()) {
      container.innerHTML = `
        <div class="p-4 text-center" style="margin: 4rem auto; max-width: 500px;">
          <h2 style="color:var(--danger); font-weight:800; margin-bottom:1rem;">ڕێگەپێدراو نییە!</h2>
          <p style="color:var(--text-secondary); margin-bottom:1.5rem;">تەنها بەڕێوەبەرانی ماڵپەڕ دەتوانن دەستیان بگات بەم بەشە.</p>
          <button class="btn btn-primary" onclick="window.MerzeApp.navigate('home')">گەڕانەوە بۆ سەرەکی</button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="admin-container">
        <!-- Admin Top Bar -->
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
          <div>
            <h1 style="font-size:2rem; font-weight:900;">کۆنتڕۆڵ پەنێڵی مەرزە موڤیز</h1>
            <p style="color:var(--text-secondary); font-size:0.9rem;">بەڕێوەبردنی تەواوی فیلم، زنجیرەکان، بەشداربووان و پارەدان</p>
          </div>
          <div style="display:flex; gap:0.75rem;">
            <button class="btn btn-primary" onclick="MerzeAdmin.openAddMovieModal()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              زیادکردنی فیلمی نوێ
            </button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="admin-nav-tabs">
          <button class="admin-tab-btn ${this.currentTab === 'overview' ? 'active' : ''}" onclick="MerzeAdmin.switchTab('overview')">
            داشبۆردی گشتی
          </button>
          <button class="admin-tab-btn ${this.currentTab === 'movies' ? 'active' : ''}" onclick="MerzeAdmin.switchTab('movies')">
            فیلمەکان
          </button>
          <button class="admin-tab-btn ${this.currentTab === 'series' ? 'active' : ''}" onclick="MerzeAdmin.switchTab('series')">
            زنجیرەکان
          </button>
          <button class="admin-tab-btn ${this.currentTab === 'payments' ? 'active' : ''}" onclick="MerzeAdmin.switchTab('payments')">
            داواکارییەکانی پارەدان
          </button>
          <button class="admin-tab-btn ${this.currentTab === 'qr_settings' ? 'active' : ''}" onclick="MerzeAdmin.switchTab('qr_settings')">
            ڕێکخستنی QR و پارەدان
          </button>
          <button class="admin-tab-btn ${this.currentTab === 'users' ? 'active' : ''}" onclick="MerzeAdmin.switchTab('users')">
            بەکارهێنەران
          </button>
          <button class="admin-tab-btn ${this.currentTab === 'reviews' ? 'active' : ''}" onclick="MerzeAdmin.switchTab('reviews')">
            هەڵسەنگاندنەکان
          </button>
        </div>

        <!-- Tab Content View -->
        <div id="admin-tab-content">
          <div class="p-4 text-center">لە بارکردندایە...</div>
        </div>
      </div>
    `;

    this.loadTabContent();
  },

  async switchTab(tabName) {
    this.currentTab = tabName;
    const btns = document.querySelectorAll(".admin-tab-btn");
    btns.forEach(b => b.classList.remove("active"));
    const content = document.getElementById("admin-tab-content");
    if (content) {
      content.innerHTML = `<div class="p-4 text-center">لە بارکردندایە...</div>`;
    }
    this.loadTabContent();
  },

  async loadTabContent() {
    const content = document.getElementById("admin-tab-content");
    if (!content) return;

    if (this.currentTab === 'overview') {
      await this.renderOverview(content);
    } else if (this.currentTab === 'movies') {
      await this.renderMovies(content);
    } else if (this.currentTab === 'series') {
      await this.renderSeries(content);
    } else if (this.currentTab === 'payments') {
      await this.renderPayments(content);
    } else if (this.currentTab === 'qr_settings') {
      await this.renderQrSettings(content);
    } else if (this.currentTab === 'users') {
      await this.renderUsers(content);
    } else if (this.currentTab === 'reviews') {
      await this.renderReviews(content);
    }
  },

  // 1. Overview Tab
  async renderOverview(container) {
    const movies = await window.MerzeDB.getMovies();
    const series = await window.MerzeDB.getSeries();
    const payments = await window.MerzeDB.getPayments();

    const pendingPayments = payments.filter(p => p.status === 'Pending').length;
    const approvedPayments = payments.filter(p => p.status === 'Approved');
    const totalRevenue = approvedPayments.reduce((sum, p) => sum + (Number(p.amount) || 5000), 0);
    const totalViews = movies.reduce((sum, m) => sum + (Number(m.views) || 0), 0);

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:2rem;">
        <!-- Stats Grid -->
        <div class="admin-stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
            </div>
            <div class="stat-data">
              <span class="stat-value">${movies.length}</span>
              <span class="stat-label">کۆی فیلمەکان</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
            <div class="stat-data">
              <span class="stat-value">${series.length}</span>
              <span class="stat-label">کۆی زنجیرەکان</span>
            </div>
          </div>

          <div class="stat-card vip-stat">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <div class="stat-data">
              <span class="stat-value">${totalRevenue.toLocaleString()} IQD</span>
              <span class="stat-label">داهاتی فەرمی VIP</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="color:var(--warning);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div class="stat-data">
              <span class="stat-value" style="color:var(--warning);">${pendingPayments}</span>
              <span class="stat-label">پارەدانی چاوەڕوانکراو</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <div class="stat-data">
              <span class="stat-value">${totalViews.toLocaleString()}</span>
              <span class="stat-label">کۆی بینینەکان</span>
            </div>
          </div>
        </div>

        <!-- Quick Payments Notification Box -->
        ${pendingPayments > 0 ? `
          <div style="background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); border-radius:var(--radius-md); padding:1.25rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
            <div>
              <strong style="color:var(--vip-gold); font-size:1.05rem;">داواکاری نوێی پارەدانی QI Card هەیە!</strong>
              <p style="color:var(--text-secondary); font-size:0.88rem; margin-top:4px;">تکایە پێداچوونەوە بکە بە وێنەی پسوولە و ژمارەی مامەڵەکان تا هەژمارەکان چالاک بکرێن.</p>
            </div>
            <button class="btn btn-vip btn-sm" onclick="MerzeAdmin.switchTab('payments')">پشکنینی داواکارییەکان (${pendingPayments})</button>
          </div>
        ` : ''}
      </div>
    `;
  },

  // 2. Movies Tab
  async renderMovies(container) {
    const movies = await window.MerzeDB.getMovies();
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h2 style="font-size:1.3rem; font-weight:800;">لیستی هەموو فیلمەکان (${movies.length})</h2>
          <button class="btn btn-primary btn-sm" onclick="MerzeAdmin.openAddMovieModal()">+ فیلمی نوێ</button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>پۆستەر</th>
                <th>ناونیشان</th>
                <th>ساڵ</th>
                <th>نمرە</th>
                <th>جۆری پاکێج</th>
                <th>بینین</th>
                <th>کردارەکان</th>
              </tr>
            </thead>
            <tbody>
              ${movies.map(m => `
                <tr>
                  <td>
                    <img src="${m.poster_url}" style="width:40px; height:55px; object-fit:cover; border-radius:6px;" alt="">
                  </td>
                  <td>
                    <strong>${m.title}</strong>
                    <div style="font-size:0.78rem; color:var(--text-muted);">${m.director || 'دەرهێنەر نەزانراو'}</div>
                  </td>
                  <td>${m.year}</td>
                  <td>⭐ ${m.rating}</td>
                  <td>
                    <span class="badge ${m.access_type === 'VIP' ? 'badge-vip' : 'badge-free'}">
                      ${m.access_type === 'VIP' ? 'VIP' : 'بێبەرامبەر'}
                    </span>
                  </td>
                  <td>${Number(m.views || 0).toLocaleString()}</td>
                  <td>
                    <div style="display:flex; gap:0.5rem;">
                      <button class="btn btn-secondary btn-sm" onclick="MerzeAdmin.editMovie('${m.id}')">دەستکاری</button>
                      <button class="btn btn-danger btn-sm" onclick="MerzeAdmin.confirmDeleteMovie('${m.id}')">سڕینەوە</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 3. Series Tab
  async renderSeries(container) {
    const seriesList = await window.MerzeDB.getSeries();
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h2 style="font-size:1.3rem; font-weight:800;">لیستی زنجیرەکان (${seriesList.length})</h2>
          <button class="btn btn-primary btn-sm" onclick="MerzeAdmin.openAddSeriesModal()">+ زنجیرەی نوێ</button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>پۆستەر</th>
                <th>ناونیشانی زنجیرە</th>
                <th>ساڵ</th>
                <th>وەرزەکان</th>
                <th>ئەڵقەکان</th>
                <th>پاکێج</th>
                <th>کردارەکان</th>
              </tr>
            </thead>
            <tbody>
              ${seriesList.map(s => {
                const totalEpisodes = (s.seasons || []).reduce((sum, season) => sum + (season.episodes ? season.episodes.length : 0), 0);
                return `
                  <tr>
                    <td><img src="${s.poster_url}" style="width:40px; height:55px; object-fit:cover; border-radius:6px;"></td>
                    <td><strong>${s.title}</strong></td>
                    <td>${s.year}</td>
                    <td>${(s.seasons || []).length} وەرز</td>
                    <td>${totalEpisodes} ئەڵقە</td>
                    <td><span class="badge ${s.access_type === 'VIP' ? 'badge-vip' : 'badge-free'}">${s.access_type}</span></td>
                    <td>
                      <div style="display:flex; gap:0.5rem;">
                        <button class="btn btn-danger btn-sm" onclick="MerzeAdmin.deleteSeries('${s.id}')">سڕینەوە</button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 4. Payments Tab
  async renderPayments(container) {
    const payments = await window.MerzeDB.getPayments();
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        <h2 style="font-size:1.3rem; font-weight:800;">داواکارییەکانی بەشداریکردنی VIP بە QI Card</h2>
        
        ${payments.length === 0 ? `
          <div style="padding:2.5rem; text-align:center; background:var(--bg-surface); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            هیچ داواکارییەکی پارەدان تۆمار نەکراوە.
          </div>
        ` : `
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>بەکارهێنەر</th>
                  <th>بڕی پارە</th>
                  <th>ڕێگەی پارەدان</th>
                  <th>ژمارەی پسوولە (Transaction ID)</th>
                  <th>وێنەی پسوولە</th>
                  <th>بەروار</th>
                  <th>دۆخ</th>
                  <th>بڕیار</th>
                </tr>
              </thead>
              <tbody>
                ${payments.map(p => `
                  <tr>
                    <td>
                      <strong>${p.username}</strong>
                      <div style="font-size:0.78rem; color:var(--text-muted);">${p.email || p.user_id}</div>
                    </td>
                    <td><strong style="color:var(--vip-gold);">${Number(p.amount).toLocaleString()} IQD</strong></td>
                    <td>${p.payment_method}</td>
                    <td><code>${p.transaction_id}</code></td>
                    <td>
                      ${p.payment_proof_url ? `
                        <a href="${p.payment_proof_url}" target="_blank" style="color:var(--accent-purple); text-decoration:underline;">
                          بینینی پسوولە
                        </a>
                      ` : '<span style="color:var(--text-muted);">نییە</span>'}
                    </td>
                    <td>${new Date(p.created_at).toLocaleDateString('ku-IQ')}</td>
                    <td>
                      <span class="badge ${p.status === 'Approved' ? 'badge-free' : (p.status === 'Pending' ? 'badge-rating' : 'badge-danger')}">
                        ${p.status === 'Approved' ? 'پەسەندکراو' : (p.status === 'Pending' ? 'چاوەڕوانکراو' : 'ڕەتکراوە')}
                      </span>
                    </td>
                    <td>
                      ${p.status === 'Pending' ? `
                        <div style="display:flex; gap:0.4rem;">
                          <button class="btn btn-vip btn-sm" onclick="MerzeAdmin.approvePayment('${p.id}')">پەسەندکردن</button>
                          <button class="btn btn-danger btn-sm" onclick="MerzeAdmin.rejectPayment('${p.id}')">ڕەتکردنەوە</button>
                        </div>
                      ` : `
                        <span style="font-size:0.8rem; color:var(--text-muted);">${p.approved_by ? 'لەلایەن: ' + p.approved_by : 'تەواوکراو'}</span>
                      `}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;
  },

  // 5. QR & Payment Settings Tab
  async renderQrSettings(container) {
    const settings = await window.MerzeDB.getPaymentSettings();
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.75rem; max-width:800px;">
        <div>
          <h2 style="font-size:1.3rem; font-weight:800;">ڕێکخستنەکانی QR Code و پارەدان</h2>
          <p style="color:var(--text-secondary); font-size:0.88rem;">لێرەوە دەتوانیت وێنەی QR کۆدی کی کارت و ڕێنمایییەکانی پارەدان بگۆڕیت.</p>
        </div>

        <div style="background:var(--bg-surface); padding:2rem; border-radius:var(--radius-lg); border:1px solid var(--border-subtle); display:flex; flex-direction:column; gap:1.5rem;">
          <div style="display:flex; gap:2rem; align-items:center; flex-wrap:wrap;">
            <div style="background:#ffffff; padding:1rem; border-radius:var(--radius-md); text-align:center;">
              <img id="qr-preview-img" src="${settings.qr_code_url}" style="width:160px; height:160px; object-fit:contain;" alt="QR Code">
              <div style="font-size:0.75rem; color:#333; margin-top:4px; font-weight:bold;">QI Card QR Code</div>
            </div>
            <div style="flex-grow:1; display:flex; flex-direction:column; gap:0.75rem;">
              <div class="form-group">
                <label class="form-label">بەستەری وێنەی QR Code (URL):</label>
                <input type="text" id="settings-qr-url" class="form-input" value="${settings.qr_code_url}">
              </div>
              <div class="form-group">
                <label class="form-label">بڕی پارە (دیناری عێراقی):</label>
                <input type="number" id="settings-amount" class="form-input" value="${settings.amount || 5000}">
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">ڕێگەی پارەدان:</label>
            <input type="text" id="settings-method" class="form-input" value="${settings.payment_method || 'QI Card'}">
          </div>

          <div class="form-group">
            <label class="form-label">ڕێنمایییەکانی پارەدان بۆ بەکارهێنەران:</label>
            <textarea id="settings-instructions" class="form-textarea" rows="4">${settings.instructions}</textarea>
          </div>

          <div style="display:flex; justify-content:flex-end;">
            <button class="btn btn-primary" onclick="MerzeAdmin.savePaymentSettings()">
              پاشەکەوتکردنی گۆڕانکارییەکان
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // 6. Users Tab
  async renderUsers(container) {
    const currentUser = window.MerzeAuth.getUser();
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        <h2 style="font-size:1.3rem; font-weight:800;">بەکارهێنەرانی سیستم</h2>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ناوی بەکارهێنەر</th>
                <th>ئیمەیڵ</th>
                <th>ڕۆڵ</th>
                <th>جۆری هەژمار</th>
                <th>بەرواری بەسەرچوونی VIP</th>
                <th>کردارەکان</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${currentUser.username} (ئێستا)</strong></td>
                <td>${currentUser.email}</td>
                <td><span class="badge badge-rating">${currentUser.role}</span></td>
                <td><span class="badge badge-vip">${currentUser.account_type}</span></td>
                <td>${currentUser.vip_expires_at ? new Date(currentUser.vip_expires_at).toLocaleDateString('ku-IQ') : 'هەمیشەیی'}</td>
                <td><span style="color:var(--success);">چالاکە</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 7. Reviews Tab
  async renderReviews(container) {
    const reviews = await window.MerzeDB.getReviews();
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        <h2 style="font-size:1.3rem; font-weight:800;">هەڵسەنگاندن و سەرنجەکان (${reviews.length})</h2>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>بەکارهێنەر</th>
                <th>فیلم</th>
                <th>نمرە</th>
                <th>دەقی ڕا</th>
                <th>بەروار</th>
                <th>کردار</th>
              </tr>
            </thead>
            <tbody>
              ${reviews.map(r => `
                <tr>
                  <td><strong>${r.user_name}</strong></td>
                  <td>${r.movie_id}</td>
                  <td>⭐ ${r.rating}</td>
                  <td>${r.review}</td>
                  <td>${r.created_at}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" onclick="MerzeAdmin.deleteReview('${r.id}')">سڕینەوە</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // Payment Actions
  async approvePayment(paymentId) {
    if (!confirm("ئایا دڵنیایت لە پەسەندکردنی ئەم پارەدانە و بەرزکردنەوەی هەژماری بەکارهێنەر بۆ VIP؟")) return;
    const res = await window.MerzeDB.approvePayment(paymentId, window.MerzeAuth.getUser().username);
    if (res) {
      window.MerzeApp.showToast("داواکارییەکە پەسەندکرا و هەژمارەکە بووە VIP!", "vip");
      this.loadTabContent();
    }
  },

  async rejectPayment(paymentId) {
    if (!confirm("ئایا دڵنیایت لە ڕەتکردنەوەی ئەم داواکارییە؟")) return;
    await window.MerzeDB.rejectPayment(paymentId);
    window.MerzeApp.showToast("داواکارییەکە ڕەتکرایەوە.", "error");
    this.loadTabContent();
  },

  async savePaymentSettings() {
    const qrUrl = document.getElementById("settings-qr-url").value.trim();
    const amount = Number(document.getElementById("settings-amount").value) || 5000;
    const method = document.getElementById("settings-method").value.trim();
    const instructions = document.getElementById("settings-instructions").value.trim();

    const updated = {
      id: "default_qi_settings",
      payment_method: method,
      amount,
      qr_code_url: qrUrl,
      instructions,
      is_active: true
    };

    await window.MerzeDB.updatePaymentSettings(updated);
    window.MerzeApp.showToast("ڕێکخستنەکانی پارەدان و QR کۆد پاشەکەوتکران!", "success");
    this.loadTabContent();
  },

  // Movie CRUD Modals
  openAddMovieModal() {
    window.MerzeApp.openModal(`
      <div class="modal-header">
        <h3 class="modal-title">زیادکردنی فیلمی نوێ بۆ مەرزە موڤیز</h3>
        <button class="player-btn" onclick="window.MerzeApp.closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">ناونیشانی فیلم (کوردی / ئینگلیزی):</label>
            <input type="text" id="m-title" class="form-input" placeholder="نموونە: بێکەس (Bekas)" required>
          </div>
          <div class="form-group">
            <label class="form-label">نازناو (Slug):</label>
            <input type="text" id="m-slug" class="form-input" placeholder="bekas">
          </div>
          <div class="form-group">
            <label class="form-label">ساڵی دەرچوون:</label>
            <input type="number" id="m-year" class="form-input" value="2024">
          </div>
          <div class="form-group">
            <label class="form-label">نمرەی فیلم (Rating):</label>
            <input type="number" step="0.1" id="m-rating" class="form-input" value="8.0">
          </div>
          <div class="form-group">
            <label class="form-label">جۆری پاکێج:</label>
            <select id="m-access" class="form-select">
              <option value="FREE">بێبەرامبەر (FREE)</option>
              <option value="VIP">تایبەت بە VIP</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">ماوەی فیلم:</label>
            <input type="text" id="m-duration" class="form-input" placeholder="2h 15m">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">پوختە و کورتەی فیلم (بە زمانی کوردی):</label>
          <textarea id="m-desc" class="form-textarea" rows="3" placeholder="کورتەی فیلمەکە لێرە بنووسە..."></textarea>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">بەستەری پۆستەر (Poster URL):</label>
            <input type="text" id="m-poster" class="form-input" placeholder="https://...">
          </div>
          <div class="form-group">
            <label class="form-label">بەستەری باکدراپ (Backdrop URL):</label>
            <input type="text" id="m-backdrop" class="form-input" placeholder="https://...">
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">بەستەری ڤیدیۆ 1080p (MP4 / Stream):</label>
            <input type="text" id="m-video-1080" class="form-input" placeholder="https://..." value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4">
          </div>
          <div class="form-group">
            <label class="form-label">بەستەری ترەیلەر (Trailer URL):</label>
            <input type="text" id="m-trailer" class="form-input" placeholder="https://www.youtube.com/embed/...">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="window.MerzeApp.closeModal()">پاشگەزبوونەوە</button>
        <button class="btn btn-primary" onclick="MerzeAdmin.submitAddMovie()">زیادکردنی فیلم</button>
      </div>
    `);
  },

  async submitAddMovie() {
    const titleInput = document.getElementById("m-title");
    const title = titleInput ? titleInput.value.trim() : "";
    const rawSlug = document.getElementById("m-slug").value.trim();
    const slug = rawSlug ? rawSlug.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF\-]/g, '') : "movie-" + Date.now();
    const year = Number(document.getElementById("m-year").value) || 2024;
    const rating = Number(document.getElementById("m-rating").value) || 8.0;
    const access_type = document.getElementById("m-access").value;
    const duration = document.getElementById("m-duration").value.trim() || "1h 50m";
    const description = document.getElementById("m-desc").value.trim();
    const poster_url = document.getElementById("m-poster").value.trim() || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80";
    const backdrop_url = document.getElementById("m-backdrop").value.trim() || poster_url;
    const video_1080 = document.getElementById("m-video-1080").value.trim();
    const trailer_url = document.getElementById("m-trailer").value.trim();

    if (!title) {
      alert("تکایە ناونیشانی فیلم بنووسە.");
      return;
    }

    const movieObj = {
      id: slug,
      title,
      slug,
      year,
      rating,
      access_type,
      duration,
      description,
      poster_url,
      backdrop_url,
      trailer_url,
      video_url: video_1080,
      qualities: {
        "1080p": video_1080,
        "720p": video_1080,
        "480p": video_1080
      },
      views: 0,
      genres: ["ئەکشن", "دراما"],
      director: "دەرهێنەر",
      cast: []
    };

    window.MerzeApp.showToast("پاشەکەوت دەکرێت لە ناو داتابەیسی Firebase...", "info");
    await window.MerzeDB.addMovie(movieObj);
    window.MerzeApp.closeModal();
    window.MerzeApp.showToast("فیلمەکە بە سەرکەوتوویی زیادکرا و لە داتابەیس پاشەکەوتکرا!", "success");
    await this.loadTabContent();
  },

  async confirmDeleteMovie(id) {
    const movie = await window.MerzeDB.getMovieById(id);
    const movieTitle = movie ? movie.title : id;
    if (confirm(`ئایا دڵنیایت لە سڕینەوەی فیلمی "${movieTitle}"؟ ئەم کردارە لە ناو داتابەیسی Firebase بە تەواوی دەیسڕێتەوە.`)) {
      window.MerzeApp.showToast("لە سڕینەوەدایە لە داتابەیس...", "info");
      await window.MerzeDB.deleteMovie(id);
      window.MerzeApp.showToast("فیلمەکە بە تەواوی لە داتابەیس سڕدرایەوە.", "error");
      await this.loadTabContent();
    }
  },

  async deleteSeries(id) {
    if (confirm("ئایا دڵنیایت لە سڕینەوەی ئەم زنجیرەیە؟")) {
      await window.MerzeDB.deleteSeries(id);
      window.MerzeApp.showToast("زنجیرەکە سڕدرایەوە.", "error");
      this.loadTabContent();
    }
  },

  async deleteReview(id) {
    if (confirm("ئایا دڵنیایت لە سڕینەوەی ئەم هەڵسەنگاندنە؟")) {
      await window.MerzeDB.deleteReview(id);
      window.MerzeApp.showToast("سەرنجەکە سڕدرایەوە.", "error");
      this.loadTabContent();
    }
  }
};

window.MerzeAdmin = MerzeAdmin;

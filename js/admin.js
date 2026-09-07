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
                      <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                        <button class="btn btn-secondary btn-sm" onclick="MerzeAdmin.editSeries('${s.id}')">دەستکاری</button>
                        <button class="btn btn-primary btn-sm" onclick="MerzeAdmin.manageEpisodes('${s.id}')">ئەڵقەکان (${totalEpisodes})</button>
                        <button class="btn btn-danger btn-sm" onclick="MerzeAdmin.confirmDeleteSeries('${s.id}')">سڕینەوە</button>
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
    const users = await window.MerzeDB.getUsers();
    const currentUser = window.MerzeAuth.getUser();

    // Ensure currently logged-in user or admin is present in list
    const combinedUsers = [...users];
    if (currentUser && !combinedUsers.some(u => u.id === currentUser.id || u.email === currentUser.email)) {
      combinedUsers.unshift(currentUser);
    }

    const totalCount = combinedUsers.length;
    const vipCount = combinedUsers.filter(u => u.account_type === 'VIP').length;
    const freeCount = totalCount - vipCount;
    const adminCount = combinedUsers.filter(u => u.role === 'ADMIN').length;

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.5rem;">
        <!-- Top Statistics Cards -->
        <div class="admin-stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
          <div class="stat-card">
            <div class="stat-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
            <div class="stat-data">
              <span class="stat-value">${totalCount}</span>
              <span class="stat-label">کۆی بەکارهێنەران</span>
            </div>
          </div>
          <div class="stat-card vip-stat">
            <div class="stat-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>
            <div class="stat-data">
              <span class="stat-value">${vipCount}</span>
              <span class="stat-label">بەشداربووانی VIP</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="color:var(--text-muted);"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
            <div class="stat-data">
              <span class="stat-value">${freeCount}</span>
              <span class="stat-label">هەژماری بێبەرامبەر (Free)</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="color:var(--accent-purple);"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
            <div class="stat-data">
              <span class="stat-value">${adminCount}</span>
              <span class="stat-label">بەڕێوەبەران (Admins)</span>
            </div>
          </div>
        </div>

        <!-- Action Bar with Search, Refresh, and Grant VIP -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; background:var(--bg-surface); padding:1rem 1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center;">
            <input type="text" id="admin-user-search" class="form-input" style="width:260px;" placeholder="گەڕان بەپێی ناو یان ئیمەیڵ..." oninput="MerzeAdmin.filterUsersTable()">
            <button class="btn btn-secondary btn-sm" onclick="MerzeAdmin.setUserStatusFilter('all')" id="filter-btn-all" style="border-color:var(--accent-purple);">هەموو (${totalCount})</button>
            <button class="btn btn-secondary btn-sm" onclick="MerzeAdmin.setUserStatusFilter('vip')" id="filter-btn-vip">👑 VIP (${vipCount})</button>
            <button class="btn btn-secondary btn-sm" onclick="MerzeAdmin.setUserStatusFilter('free')" id="filter-btn-free">Free (${freeCount})</button>
            <button class="btn btn-secondary btn-sm" onclick="MerzeAdmin.setUserStatusFilter('admin')" id="filter-btn-admin">Admins (${adminCount})</button>
          </div>
          <div style="display:flex; gap:0.6rem;">
            <button class="btn btn-secondary btn-sm" onclick="MerzeAdmin.refreshUsers()" title="هێنانی ڕاستەوخۆ لە ناو Firestore">
              🔄 نوێکردنەوە لە داتابەیس
            </button>
            <button class="btn btn-vip btn-sm" onclick="MerzeAdmin.openDirectGrantVipModal()">
              👑 + بەخشینی VIP بە بەکارهێنەر
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table" id="admin-users-table">
            <thead>
              <tr>
                <th>بەکارهێنەر</th>
                <th>ئیمەیڵ</th>
                <th>ڕۆڵ</th>
                <th>جۆری هەژمار</th>
                <th>بەسەرچوونی VIP</th>
                <th>بەرواری دروستبوون</th>
                <th>کردارەکانی VIP و دەسەڵات</th>
              </tr>
            </thead>
            <tbody>
              ${combinedUsers.map(u => {
                const isVip = u.account_type === 'VIP';
                const expDate = u.vip_expires_at ? new Date(u.vip_expires_at).toLocaleDateString('ku-IQ') : (isVip ? 'هەمیشەیی' : '—');
                const createdDate = u.created_at ? new Date(u.created_at).toLocaleDateString('ku-IQ') : '—';
                const statusCategory = isVip ? 'vip' : 'free';
                const roleCategory = u.role === 'ADMIN' ? 'admin' : 'user';
                return `
                  <tr class="user-row" data-search="${(u.username || '').toLowerCase()} ${(u.email || '').toLowerCase()}" data-status="${statusCategory}" data-role="${roleCategory}">
                    <td>
                      <div style="display:flex; align-items:center; gap:0.6rem;">
                        <img src="${u.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}" style="width:34px; height:34px; border-radius:50%; object-fit:cover;" alt="">
                        <div>
                          <strong>${u.username}</strong>
                          <div style="font-size:0.7rem; color:var(--text-muted);">${u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td><code>${u.email}</code></td>
                    <td>
                      <span class="badge ${u.role === 'ADMIN' ? 'badge-rating' : 'badge-free'}">${u.role || 'USER'}</span>
                    </td>
                    <td>
                      <span class="badge ${isVip ? 'badge-vip' : 'badge-free'}">
                        ${isVip ? '👑 VIP' : 'بێبەرامبەر (Free)'}
                      </span>
                    </td>
                    <td><strong style="color:${isVip ? 'var(--vip-gold)' : 'var(--text-muted)'}; font-size:0.85rem;">${expDate}</strong></td>
                    <td style="font-size:0.8rem; color:var(--text-muted);">${createdDate}</td>
                    <td>
                      <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
                        <button class="btn btn-vip btn-sm" onclick="MerzeAdmin.grantVip('${u.id}', 30)" title="بەخشینی ٣٠ ڕۆژ VIP">+٣٠ ڕۆژ</button>
                        <button class="btn btn-vip btn-sm" onclick="MerzeAdmin.grantVip('${u.id}', 90)" title="بەخشینی ٩٠ ڕۆژ VIP">+٩٠ ڕۆژ</button>
                        <button class="btn btn-vip btn-sm" onclick="MerzeAdmin.grantVip('${u.id}', 'lifetime')" title="بەخشینی VIP ی هەمیشەیی">👑 هەمیشەیی</button>
                        ${isVip ? `
                          <button class="btn btn-secondary btn-sm" onclick="MerzeAdmin.removeVip('${u.id}')" title="لابردنی VIP و گۆڕین بۆ Free">لابردنی VIP</button>
                        ` : ''}
                        <button class="btn btn-secondary btn-sm" onclick="MerzeAdmin.toggleRole('${u.id}')" title="گۆڕینی ڕۆڵ بۆ Admin یان User">ڕۆڵ</button>
                        <button class="btn btn-danger btn-sm" onclick="MerzeAdmin.deleteUser('${u.id}')" title="سڕینەوە لە داتابەیسی Firebase">سڕینەوە</button>
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

    window.MerzeApp.openModal(`
      <div class="modal-header">
        <h3 class="modal-title" style="color:var(--danger);">⚠️ دووپاتکردنەوەی سڕینەوەی فیلم</h3>
        <button class="player-btn" onclick="window.MerzeApp.closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <p style="font-size:1.05rem; line-height:1.7;">
          ئایا بە ڕاستی دڵنیایت لە سڕینەوەی فیلمی <strong>"${movieTitle}"</strong>؟
        </p>
        <p style="color:var(--danger); font-size:0.85rem; margin-top:0.75rem;">
          ئەم کردارە ڕاستەوخۆ لە ناو داتابەیسی Firestore ئەنجام دەدرێت و ناگەڕێتەوە!
        </p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="window.MerzeApp.closeModal()">پاشگەزبوونەوە</button>
        <button class="btn btn-danger" onclick="MerzeAdmin.executeDeleteMovie('${id}')">بەڵێ، بە تەواوی بیسڕەوە</button>
      </div>
    `);
  },

  async executeDeleteMovie(id) {
    window.MerzeApp.closeModal();
    window.MerzeApp.showToast("لە سڕینەوەدایە لە داتابەیس...", "info");
    await window.MerzeDB.deleteMovie(id);
    window.MerzeApp.showToast("فیلمەکە بە تەواوی لە داتابەیس سڕدرایەوە.", "error");
    await this.loadTabContent();
  },

  async deleteSeries(id) {
    await this.confirmDeleteSeries(id);
  },

  async deleteReview(id) {
    window.MerzeApp.openModal(`
      <div class="modal-header">
        <h3 class="modal-title" style="color:var(--danger);">⚠️ سڕینەوەی هەڵسەنگاندن</h3>
        <button class="player-btn" onclick="window.MerzeApp.closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <p>ئایا دڵنیایت لە سڕینەوەی ئەم سەرنج و هەڵسەنگاندنە لە داتابەیس؟</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="window.MerzeApp.closeModal()">پاشگەزبوونەوە</button>
        <button class="btn btn-danger" onclick="MerzeAdmin.executeDeleteReview('${id}')">بیسڕەوە</button>
      </div>
    `);
  },

  async executeDeleteReview(id) {
    window.MerzeApp.closeModal();
    await window.MerzeDB.deleteReview(id);
    window.MerzeApp.showToast("سەرنجەکە سڕدرایەوە.", "error");
    await this.loadTabContent();
  },
  // --------------------------------------------------------------------------
  // USER ACTIONS & VIP MANAGEMENT
  // --------------------------------------------------------------------------
  filterUsersTable() {
    const q = (document.getElementById("admin-user-search").value || "").toLowerCase().trim();
    const rows = document.querySelectorAll(".user-row");
    rows.forEach(r => {
      const text = r.getAttribute("data-search") || "";
      r.style.display = text.includes(q) ? "" : "none";
    });
  },

  setUserStatusFilter(filter) {
    const rows = document.querySelectorAll(".user-row");
    const q = (document.getElementById("admin-user-search") ? document.getElementById("admin-user-search").value : "").toLowerCase().trim();
    rows.forEach(r => {
      const searchMatch = (r.getAttribute("data-search") || "").includes(q);
      const status = r.getAttribute("data-status");
      const role = r.getAttribute("data-role");
      let statusMatch = true;
      if (filter === 'vip') statusMatch = (status === 'vip');
      else if (filter === 'free') statusMatch = (status === 'free');
      else if (filter === 'admin') statusMatch = (role === 'admin');
      r.style.display = (searchMatch && statusMatch) ? "" : "none";
    });
  },

  async refreshUsers() {
    window.MerzeApp.showToast("هێنانی زانیاری نوێی بەکارهێنەران لە داتابەیسی Firestore...", "info");
    await window.MerzeDB.getUsers(true);
    await this.loadTabContent();
    window.MerzeApp.showToast("لیستی بەکارهێنەران لە داتابەیس بە سەرکەوتوویی نوێکرایەوە!", "success");
  },

  async openDirectGrantVipModal() {
    const users = await window.MerzeDB.getUsers();
    window.MerzeApp.openModal(`
      <div class="modal-header">
        <h3 class="modal-title">👑 بەخشینی ڕاستەوخۆی VIP بە بەکارهێنەر</h3>
        <button class="player-btn" onclick="window.MerzeApp.closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <p style="color:var(--text-secondary); font-size:0.88rem; margin-bottom:1.25rem;">
          دەتوانیت هەر بەکارهێنەرێک هەڵبژێریت و بۆ ماوەی دیاریکراو بیبەخشیتە پلەی VIP. گۆڕانکارییەکە دەستبەجێ لە ناو داتابەیسی Firestore پاشەکەوت دەبێت.
        </p>
        <div class="form-group">
          <label class="form-label">هەڵبژاردنی بەکارهێنەر:</label>
          <select id="direct-vip-user" class="form-select">
            ${users.map(u => `
              <option value="${u.id}">${u.username} (${u.email}) [${u.account_type === 'VIP' ? '👑 VIP' : 'بێبەرامبەر'}]</option>
            `).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">ماوەی بەشداری VIP:</label>
          <select id="direct-vip-days" class="form-select">
            <option value="30">٣٠ ڕۆژ (١ مانگ)</option>
            <option value="60">٦٠ ڕۆژ (٢ مانگ)</option>
            <option value="90">٩٠ ڕۆژ (٣ مانگ)</option>
            <option value="180">١٨٠ ڕۆژ (٦ مانگ)</option>
            <option value="365">٣٦٥ ڕۆژ (١ ساڵ)</option>
            <option value="lifetime">👑 هەمیشەیی (Lifetime - بەسەرناچێت)</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="window.MerzeApp.closeModal()">پاشگەزبوونەوە</button>
        <button class="btn btn-vip" onclick="MerzeAdmin.submitDirectGrantVip()">بەخشینی VIP</button>
      </div>
    `);
  },

  async submitDirectGrantVip() {
    const userId = document.getElementById("direct-vip-user").value;
    const days = document.getElementById("direct-vip-days").value;
    if (!userId) {
      alert("تکایە بەکارهێنەرێک هەڵبژێرە.");
      return;
    }
    window.MerzeApp.showToast("لە پاشەکەوتکردندایە لە ناو داتابەیسی Firestore...", "info");
    await window.MerzeDB.grantVip(userId, days);
    window.MerzeApp.closeModal();
    window.MerzeApp.showToast("👑 بە سەرکەوتوویی پلەی VIP بە بەکارهێنەر بەخشرا و لە داتابەیس تۆمارکرا!", "vip");
    await this.loadTabContent();
  },

  async grantVip(userId, days = 30) {
    window.MerzeApp.showToast("لە پاشەکەوتکردندایە لە داتابەیس...", "info");
    await window.MerzeDB.grantVip(userId, days);
    const label = days === 'lifetime' ? 'هەمیشەیی' : `${days} ڕۆژ`;
    window.MerzeApp.showToast(`👑 بە سەرکەوتوویی VIP (${label}) لە داتابەیس پاشەکەوتکرا!`, "vip");
    await this.loadTabContent();
  },

  async removeVip(userId) {
    if (!confirm("ئایا دڵنیایت لە لابردنی VIP و گەڕاندنەوەی بۆ بێبەرامبەر؟")) return;
    window.MerzeApp.showToast("لە نوێکردنەوەدایە لە داتابەیس...", "info");
    await window.MerzeDB.removeVip(userId);
    window.MerzeApp.showToast("VIP لابرا و هەژمارەکە گەڕێندرایەوە بۆ بێبەرامبەر لە داتابەیس.", "info");
    await this.loadTabContent();
  },

  async toggleRole(userId) {
    const users = await window.MerzeDB.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!confirm(`ئایا دڵنیایت لە گۆڕینی ڕۆڵی بەکارهێنەر بۆ ${newRole}؟`)) return;

    await window.MerzeDB.updateUser(userId, { role: newRole });
    window.MerzeApp.showToast(`ڕۆڵی بەکارهێنەر گۆڕدرا بۆ ${newRole} و لە داتابەیس نوێکرایەوە!`, "success");
    await this.loadTabContent();
  },

  async deleteUser(userId) {
    window.MerzeApp.openModal(`
      <div class="modal-header">
        <h3 class="modal-title" style="color:var(--danger);">⚠️ سڕینەوەی بەکارهێنەر</h3>
        <button class="player-btn" onclick="window.MerzeApp.closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <p style="font-size:1.05rem; line-height:1.7;">
          ئایا دڵنیایت لە سڕینەوەی یەکجارەکی ئەم بەکارهێنەرە لە داتابەیسی Firebase؟
        </p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="window.MerzeApp.closeModal()">پاشگەزبوونەوە</button>
        <button class="btn btn-danger" onclick="MerzeAdmin.executeDeleteUser('${userId}')">بەڵێ، بیسڕەوە</button>
      </div>
    `);
  },

  async executeDeleteUser(userId) {
    window.MerzeApp.closeModal();
    window.MerzeApp.showToast("لە سڕینەوەدایە لە داتابەیس...", "info");
    await window.MerzeDB.deleteUser(userId);
    window.MerzeApp.showToast("بەکارهێنەرەکە لە داتابەیس سڕدرایەوە.", "error");
    await this.loadTabContent();
  },

  // --------------------------------------------------------------------------
  // MOVIE EDITING MODAL
  // --------------------------------------------------------------------------
  async editMovie(movieId) {
    const movie = await window.MerzeDB.getMovieById(movieId);
    if (!movie) {
      alert("فیلمەکە نەدۆزرایەوە.");
      return;
    }

    const video1080 = (movie.qualities && movie.qualities["1080p"]) ? movie.qualities["1080p"] : (movie.video_url || "");
    const video720 = (movie.qualities && movie.qualities["720p"]) ? movie.qualities["720p"] : "";
    const video480 = (movie.qualities && movie.qualities["480p"]) ? movie.qualities["480p"] : "";

    window.MerzeApp.openModal(`
      <div class="modal-header">
        <h3 class="modal-title">دەستکاریکردنی فیلم: ${movie.title}</h3>
        <button class="player-btn" onclick="window.MerzeApp.closeModal()">✕</button>
      </div>
      <div class="modal-body" style="max-height:75vh; overflow-y:auto;">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">ناونیشانی فیلم (کوردی / سەرەکی):</label>
            <input type="text" id="edit-m-title" class="form-input" value="${movie.title || ''}" required>
          </div>
          <div class="form-group">
            <label class="form-label">نازناو (Slug / ID):</label>
            <input type="text" id="edit-m-slug" class="form-input" value="${movie.slug || movie.id || ''}" readonly style="opacity:0.7;">
          </div>
          <div class="form-group">
            <label class="form-label">ساڵی دەرچوون:</label>
            <input type="number" id="edit-m-year" class="form-input" value="${movie.year || 2024}">
          </div>
          <div class="form-group">
            <label class="form-label">نمرەی فیلم (Rating):</label>
            <input type="number" step="0.1" id="edit-m-rating" class="form-input" value="${movie.rating || 8.0}">
          </div>
          <div class="form-group">
            <label class="form-label">جۆری پاکێج:</label>
            <select id="edit-m-access" class="form-select">
              <option value="FREE" ${movie.access_type === 'FREE' ? 'selected' : ''}>بێبەرامبەر (FREE)</option>
              <option value="VIP" ${movie.access_type === 'VIP' ? 'selected' : ''}>تایبەت بە VIP</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">ماوەی فیلم:</label>
            <input type="text" id="edit-m-duration" class="form-input" value="${movie.duration || '2h 00m'}">
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">دەرهێنەر (Director):</label>
            <input type="text" id="edit-m-director" class="form-input" value="${movie.director || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">نووسەر (Writer):</label>
            <input type="text" id="edit-m-writer" class="form-input" value="${movie.writer || ''}">
          </div>
          <div class="form-group" style="grid-column: 1 / -1;">
            <label class="form-label">ژانەرەکان (بە کۆما جیابکەرەوە):</label>
            <input type="text" id="edit-m-genres" class="form-input" value="${(movie.genres || []).join(', ')}" placeholder="ئەکشن, دراما, سینەمای کوردی">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">پوختە و کورتەی فیلم (بە زمانی کوردی):</label>
          <textarea id="edit-m-desc" class="form-textarea" rows="3">${movie.description || ''}</textarea>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">بەستەری پۆستەر (Poster URL):</label>
            <input type="text" id="edit-m-poster" class="form-input" value="${movie.poster_url || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">بەستەری باکدراپ (Backdrop URL):</label>
            <input type="text" id="edit-m-backdrop" class="form-input" value="${movie.backdrop_url || ''}">
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">بەستەری ڤیدیۆ 1080p (MP4 / Stream):</label>
            <input type="text" id="edit-m-video" class="form-input" value="${video1080}">
          </div>
          <div class="form-group">
            <label class="form-label">بەستەری ڤیدیۆ 720p (ئارەزوومەندانە):</label>
            <input type="text" id="edit-m-video-720" class="form-input" value="${video720}">
          </div>
          <div class="form-group">
            <label class="form-label">بەستەری ترەیلەر (Trailer URL):</label>
            <input type="text" id="edit-m-trailer" class="form-input" value="${movie.trailer_url || ''}">
          </div>
          <div class="form-group" style="display:flex; align-items:center; gap:0.5rem; margin-top:1.8rem;">
            <input type="checkbox" id="edit-m-featured" ${movie.is_featured ? 'checked' : ''} style="width:18px; height:18px; cursor:pointer;">
            <label for="edit-m-featured" style="cursor:pointer; font-weight:bold;">نیشاندان لە بانەری سەرەکی هۆم پەیج (Featured Hero)</label>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="window.MerzeApp.closeModal()">پاشگەزبوونەوە</button>
        <button class="btn btn-primary" onclick="MerzeAdmin.submitEditMovie('${movieId}')">
          پاشەکەوتکردنی دەستکارییەکان
        </button>
      </div>
    `);
  },

  async submitEditMovie(movieId) {
    const title = document.getElementById("edit-m-title").value.trim();
    const year = Number(document.getElementById("edit-m-year").value) || 2024;
    const rating = Number(document.getElementById("edit-m-rating").value) || 8.0;
    const access_type = document.getElementById("edit-m-access").value;
    const duration = document.getElementById("edit-m-duration").value.trim();
    const director = document.getElementById("edit-m-director").value.trim();
    const writer = document.getElementById("edit-m-writer").value.trim();
    const genresRaw = document.getElementById("edit-m-genres").value.trim();
    const genres = genresRaw ? genresRaw.split(',').map(g => g.trim()).filter(Boolean) : ["دراما"];
    const description = document.getElementById("edit-m-desc").value.trim();
    const poster_url = document.getElementById("edit-m-poster").value.trim();
    const backdrop_url = document.getElementById("edit-m-backdrop").value.trim() || poster_url;
    const video_1080 = document.getElementById("edit-m-video").value.trim();
    const video_720 = document.getElementById("edit-m-video-720").value.trim() || video_1080;
    const trailer_url = document.getElementById("edit-m-trailer").value.trim();
    const is_featured = document.getElementById("edit-m-featured").checked;

    if (!title) {
      alert("تکایە ناونیشانی فیلم بنووسە.");
      return;
    }

    const updates = {
      title,
      year,
      rating,
      access_type,
      duration,
      director,
      writer,
      genres,
      description,
      poster_url,
      backdrop_url,
      trailer_url,
      video_url: video_1080,
      is_featured,
      qualities: {
        "1080p": video_1080,
        "720p": video_720,
        "480p": video_720
      }
    };

    window.MerzeApp.showToast("لە پاشەکەوتکردندایە لە ناو داتابەیسی Firestore...", "info");
    await window.MerzeDB.updateMovie(movieId, updates);
    window.MerzeApp.closeModal();
    window.MerzeApp.showToast("دەستکارییەکان بە سەرکەوتوویی لە داتابەیس پاشەکەوتکران!", "success");
    await this.loadTabContent();
  },

  // --------------------------------------------------------------------------
  // SERIES MANAGEMENT
  // --------------------------------------------------------------------------
  openAddSeriesModal() {
    window.MerzeApp.openModal(`
      <div class="modal-header">
        <h3 class="modal-title">زیادکردنی زنجیرەی نوێ بۆ مەرزە موڤیز</h3>
        <button class="player-btn" onclick="window.MerzeApp.closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">ناونیشانی زنجیرە:</label>
            <input type="text" id="s-title" class="form-input" placeholder="نموونە: یاریی تەختە پاشایەتییەکان" required>
          </div>
          <div class="form-group">
            <label class="form-label">نازناو (Slug):</label>
            <input type="text" id="s-slug" class="form-input" placeholder="got-kurdish">
          </div>
          <div class="form-group">
            <label class="form-label">ساڵ:</label>
            <input type="number" id="s-year" class="form-input" value="2024">
          </div>
          <div class="form-group">
            <label class="form-label">نمرەی زنجیرە:</label>
            <input type="number" step="0.1" id="s-rating" class="form-input" value="9.0">
          </div>
          <div class="form-group">
            <label class="form-label">پاکێج:</label>
            <select id="s-access" class="form-select">
              <option value="FREE">بێبەرامبەر</option>
              <option value="VIP">تایبەت بە VIP</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">کورتەی زنجیرە:</label>
          <textarea id="s-desc" class="form-textarea" rows="3" placeholder="کورتەی چیرۆکی زنجیرەکە..."></textarea>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">بەستەری پۆستەر (Poster URL):</label>
            <input type="text" id="s-poster" class="form-input" placeholder="https://...">
          </div>
          <div class="form-group">
            <label class="form-label">بەستەری باکدراپ (Backdrop URL):</label>
            <input type="text" id="s-backdrop" class="form-input" placeholder="https://...">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="window.MerzeApp.closeModal()">پاشگەزبوونەوە</button>
        <button class="btn btn-primary" onclick="MerzeAdmin.submitAddSeries()">زیادکردنی زنجیرە</button>
      </div>
    `);
  },

  async submitAddSeries() {
    const title = document.getElementById("s-title").value.trim();
    const rawSlug = document.getElementById("s-slug").value.trim();
    const slug = rawSlug ? rawSlug.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF\-]/g, '') : "series-" + Date.now();
    const year = Number(document.getElementById("s-year").value) || 2024;
    const rating = Number(document.getElementById("s-rating").value) || 9.0;
    const access_type = document.getElementById("s-access").value;
    const description = document.getElementById("s-desc").value.trim();
    const poster_url = document.getElementById("s-poster").value.trim() || "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=600";
    const backdrop_url = document.getElementById("s-backdrop").value.trim() || poster_url;

    if (!title) {
      alert("تکایە ناونیشانی زنجیرە بنووسە.");
      return;
    }

    const seriesObj = {
      id: slug,
      title,
      slug,
      year,
      rating,
      access_type,
      description,
      poster_url,
      backdrop_url,
      genres: ["دراما", "سەرکێشی"],
      seasons: [
        {
          season_number: 1,
          title: "وەرزی یەکەم",
          episodes: [
            {
              episode_number: 1,
              title: "ئەڵقەی دەستپێک",
              description: "دەستپێکی ڕووداوە سەرنجڕاکێشەکان",
              thumbnail_url: poster_url,
              video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              duration: "55m",
              release_date: "2024-01-01"
            }
          ]
        }
      ]
    };

    window.MerzeApp.showToast("زنجیرەکە لە داتابەیس پاشەکەوت دەکرێت...", "info");
    await window.MerzeDB.addSeries(seriesObj);
    window.MerzeApp.closeModal();
    window.MerzeApp.showToast("زنجیرەکە لە داتابەیسی Firestore پاشەکەوتکرا!", "success");
    await this.loadTabContent();
  },

  async editSeries(seriesId) {
    const s = await window.MerzeDB.getSeriesById(seriesId);
    if (!s) {
      alert("زنجیرەکە نەدۆزرایەوە.");
      return;
    }

    window.MerzeApp.openModal(`
      <div class="modal-header">
        <h3 class="modal-title">دەستکاریکردنی زنجیرە: ${s.title}</h3>
        <button class="player-btn" onclick="window.MerzeApp.closeModal()">✕</button>
      </div>
      <div class="modal-body" style="max-height:75vh; overflow-y:auto;">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">ناونیشانی زنجیرە:</label>
            <input type="text" id="edit-s-title" class="form-input" value="${s.title || ''}" required>
          </div>
          <div class="form-group">
            <label class="form-label">نازناو (Slug):</label>
            <input type="text" id="edit-s-slug" class="form-input" value="${s.slug || s.id || ''}" readonly style="opacity:0.7;">
          </div>
          <div class="form-group">
            <label class="form-label">ساڵ:</label>
            <input type="number" id="edit-s-year" class="form-input" value="${s.year || 2024}">
          </div>
          <div class="form-group">
            <label class="form-label">نمرە (Rating):</label>
            <input type="number" step="0.1" id="edit-s-rating" class="form-input" value="${s.rating || 9.0}">
          </div>
          <div class="form-group">
            <label class="form-label">پاکێج:</label>
            <select id="edit-s-access" class="form-select">
              <option value="FREE" ${s.access_type === 'FREE' ? 'selected' : ''}>بێبەرامبەر</option>
              <option value="VIP" ${s.access_type === 'VIP' ? 'selected' : ''}>تایبەت بە VIP</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">ژانەرەکان (بە کۆما جیابکەرەوە):</label>
            <input type="text" id="edit-s-genres" class="form-input" value="${(s.genres || []).join(', ')}">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">کورتەی زنجیرە:</label>
          <textarea id="edit-s-desc" class="form-textarea" rows="3">${s.description || ''}</textarea>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">بەستەری پۆستەر (Poster URL):</label>
            <input type="text" id="edit-s-poster" class="form-input" value="${s.poster_url || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">بەستەری باکدراپ (Backdrop URL):</label>
            <input type="text" id="edit-s-backdrop" class="form-input" value="${s.backdrop_url || ''}">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="window.MerzeApp.closeModal()">پاشگەزبوونەوە</button>
        <button class="btn btn-primary" onclick="MerzeAdmin.submitEditSeries('${seriesId}')">پاشەکەوتکردنی دەستکارییەکان</button>
      </div>
    `);
  },

  async submitEditSeries(seriesId) {
    const title = document.getElementById("edit-s-title").value.trim();
    const year = Number(document.getElementById("edit-s-year").value) || 2024;
    const rating = Number(document.getElementById("edit-s-rating").value) || 9.0;
    const access_type = document.getElementById("edit-s-access").value;
    const genresRaw = document.getElementById("edit-s-genres").value.trim();
    const genres = genresRaw ? genresRaw.split(',').map(g => g.trim()).filter(Boolean) : ["دراما"];
    const description = document.getElementById("edit-s-desc").value.trim();
    const poster_url = document.getElementById("edit-s-poster").value.trim();
    const backdrop_url = document.getElementById("edit-s-backdrop").value.trim() || poster_url;

    if (!title) {
      alert("تکایە ناونیشانی زنجیرە بنووسە.");
      return;
    }

    const updates = {
      title,
      year,
      rating,
      access_type,
      genres,
      description,
      poster_url,
      backdrop_url
    };

    window.MerzeApp.showToast("لە پاشەکەوتکردندایە لە داتابەیس...", "info");
    await window.MerzeDB.updateSeries(seriesId, updates);
    window.MerzeApp.closeModal();
    window.MerzeApp.showToast("زنجیرەکە بە سەرکەوتوویی لە داتابەیس نوێکرایەوە!", "success");
    await this.loadTabContent();
  },

  async confirmDeleteSeries(seriesId) {
    const s = await window.MerzeDB.getSeriesById(seriesId);
    const title = s ? s.title : seriesId;

    window.MerzeApp.openModal(`
      <div class="modal-header">
        <h3 class="modal-title" style="color:var(--danger);">⚠️ سڕینەوەی زنجیرە</h3>
        <button class="player-btn" onclick="window.MerzeApp.closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <p style="font-size:1.05rem; line-height:1.7;">
          ئایا دڵنیایت لە سڕینەوەی زنجیرەی <strong>"${title}"</strong> لە ناو داتابەیسی Firebase؟
        </p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="window.MerzeApp.closeModal()">پاشگەزبوونەوە</button>
        <button class="btn btn-danger" onclick="MerzeAdmin.executeDeleteSeries('${seriesId}')">بەڵێ، بیسڕەوە</button>
      </div>
    `);
  },

  async executeDeleteSeries(seriesId) {
    window.MerzeApp.closeModal();
    window.MerzeApp.showToast("لە سڕینەوەدایە لە داتابەیس...", "info");
    await window.MerzeDB.deleteSeries(seriesId);
    window.MerzeApp.showToast("زنجیرەکە بە تەواوی لە داتابەیس سڕدرایەوە.", "error");
    await this.loadTabContent();
  },

  async manageEpisodes(seriesId) {
    const s = await window.MerzeDB.getSeriesById(seriesId);
    if (!s) return;

    const seasons = s.seasons || [];

    window.MerzeApp.openModal(`
      <div class="modal-header">
        <h3 class="modal-title">بەڕێوەبردنی ئەڵقەکانی: ${s.title}</h3>
        <button class="player-btn" onclick="window.MerzeApp.closeModal()">✕</button>
      </div>
      <div class="modal-body" style="max-height:75vh; overflow-y:auto;">
        <!-- Add Episode Form -->
        <div style="background:rgba(255,255,255,0.03); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle); margin-bottom:1.5rem;">
          <h4 style="margin-bottom:0.75rem; color:var(--accent-purple); font-weight:800;">+ زیادکردنی ئەڵقەی نوێ</h4>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">ژمارەی وەرز:</label>
              <input type="number" id="ep-season-num" class="form-input" value="1" min="1">
            </div>
            <div class="form-group">
              <label class="form-label">ژمارەی ئەڵقە:</label>
              <input type="number" id="ep-num" class="form-input" value="1" min="1">
            </div>
            <div class="form-group">
              <label class="form-label">ناونیشانی ئەڵقە:</label>
              <input type="text" id="ep-title" class="form-input" placeholder="نموونە: بەشی یەکەم">
            </div>
            <div class="form-group">
              <label class="form-label">ماوە:</label>
              <input type="text" id="ep-duration" class="form-input" placeholder="50m" value="50m">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">بەستەری ڤیدیۆ (MP4 / Direct Stream URL):</label>
            <input type="text" id="ep-video" class="form-input" value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4">
          </div>
          <div style="display:flex; justify-content:flex-end; margin-top:0.75rem;">
            <button class="btn btn-primary btn-sm" onclick="MerzeAdmin.submitAddEpisode('${seriesId}')">
              زیادکردن بۆ ناو داتابەیس
            </button>
          </div>
        </div>

        <!-- Episodes List -->
        <h4 style="margin-bottom:0.75rem; font-weight:800;">لیستی وەرز و ئەڵقەکانی ئێستا:</h4>
        ${seasons.length === 0 ? '<p style="color:var(--text-muted);">هیچ ئەڵقەیەک بوونی نییە.</p>' : ''}
        ${seasons.map(sea => `
          <div style="margin-bottom:1.25rem;">
            <div style="font-weight:bold; color:var(--vip-gold); margin-bottom:0.5rem;">${sea.title || 'وەرزی ' + sea.season_number} (${(sea.episodes || []).length} ئەڵقە)</div>
            <div style="display:flex; flex-direction:column; gap:0.4rem;">
              ${(sea.episodes || []).map(ep => `
                <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-surface); padding:0.6rem 1rem; border-radius:6px; border:1px solid var(--border-subtle);">
                  <div>
                    <strong>ئەڵقەی ${ep.episode_number}: ${ep.title}</strong>
                    <span style="font-size:0.75rem; color:var(--text-muted); margin-right:0.5rem;">⏱️ ${ep.duration || '—'}</span>
                  </div>
                  <button class="btn btn-danger btn-sm" onclick="MerzeAdmin.deleteEpisode('${seriesId}', ${sea.season_number}, ${ep.episode_number})">سڕینەوە</button>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="window.MerzeApp.closeModal()">داخستن</button>
      </div>
    `);
  },

  async submitAddEpisode(seriesId) {
    const seasonNum = Number(document.getElementById("ep-season-num").value) || 1;
    const epNum = Number(document.getElementById("ep-num").value) || 1;
    const title = document.getElementById("ep-title").value.trim() || `ئەڵقەی ${epNum}`;
    const duration = document.getElementById("ep-duration").value.trim() || '50m';
    const video_url = document.getElementById("ep-video").value.trim();

    window.MerzeApp.showToast("لە زیادکردندایە لە داتابەیس...", "info");
    await window.MerzeDB.addEpisode(seriesId, seasonNum, {
      episode_number: epNum,
      title,
      duration,
      video_url
    });
    window.MerzeApp.showToast("ئەڵقەکە بە سەرکەوتوویی لە داتابەیس پاشەکەوتکرا!", "success");
    await this.manageEpisodes(seriesId);
  },

  async deleteEpisode(seriesId, seasonNum, epNum) {
    if (!confirm(`ئایا دڵنیایت لە سڕینەوەی ئەڵقەی ${epNum} لە داتابەیس؟`)) return;
    window.MerzeApp.showToast("لە سڕینەوەدایە لە داتابەیس...", "info");
    await window.MerzeDB.deleteEpisode(seriesId, seasonNum, epNum);
    window.MerzeApp.showToast("ئەڵقەکە لە داتابەیس سڕدرایەوە.", "error");
    await this.manageEpisodes(seriesId);
  }
};

window.MerzeAdmin = MerzeAdmin;

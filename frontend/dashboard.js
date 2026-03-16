/**
 * dashboard.js – Dashboard page renderer.
 */

async function renderDashboard() {
    const main = document.getElementById("main-content");
    try {
        const [sales, gst] = await Promise.all([api.salesReport(), api.gstReport()]);
        const userName = localStorage.getItem("nb_full_name") || "User";
        main.innerHTML = `
      <div class="page-header" style="margin-bottom: 2.5rem;">
        <div>
          <div class="page-title">Welcome back, ${userName}!</div>
          <div class="page-subtitle">Continue your business journey where you left off</div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrapper bg-blue-light" style="display:flex;align-items:center;justify-content:center;">
            <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">${sales.total_invoices}</div>
            <div class="stat-label">Total Invoices</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper bg-green-light" style="display:flex;align-items:center;justify-content:center;">
            <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div class="stat-info">
            <div class="stat-value" style="font-size:1.4rem">${fmt(sales.total_sales)}</div>
            <div class="stat-label">Total Sales</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper bg-amber-light" style="display:flex;align-items:center;justify-content:center;">
            <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div class="stat-info">
            <div class="stat-value" style="font-size:1.4rem">${fmt(sales.total_paid)}</div>
            <div class="stat-label">Amount Collected</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper bg-purple-light" style="display:flex;align-items:center;justify-content:center;">
            <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div class="stat-info">
            <div class="stat-value" style="font-size:1.4rem">${fmt(sales.total_outstanding)}</div>
            <div class="stat-label">Outstanding</div>
          </div>
        </div>
      </div>

      <div class="dashboard-layout">
        <div class="card" style="overflow: hidden; display: flex; align-items: center; background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%); border: none; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);">
          <div class="card-body" style="display: flex; align-items: center; gap: 2rem; padding: 2.5rem;">
            <div style="flex: 1;">
              <h2 style="font-size: 1.75rem; color: #1e293b; margin-bottom: 1rem; font-weight: 800;">Scale Your Business <span style="color: var(--brand);">Effortlessly</span></h2>
              <p style="color: #64748b; line-height: 1.6; font-size: 1.05rem; margin-bottom: 0;">NeuraBills is tracking your growth in real-time. Boost your productivity by managing invoices and customers from one premium dashboard.</p>
            </div>
            <div style="flex: 1; display: flex; justify-content: flex-end;">
              <img src="./dashboard_hero.png" alt="Business Growth" style="max-width: 280px; height: auto; filter: drop-shadow(0 20px 30px rgba(0,0,0,0.1)); transform: perspective(1000px) rotateY(-10deg) rotateX(5deg); transition: transform 0.5s ease;" onmouseover="this.style.transform='perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1.05)'" onmouseout="this.style.transform='perspective(1000px) rotateY(-10deg) rotateX(5deg) scale(1)'">
            </div>
          </div>
        </div>
        
        <div style="display:flex;flex-direction:column;gap:1.25rem">
          <div class="card">
            <div class="card-header"><div class="card-title">Quick Actions</div></div>
            <div class="card-body">
              <button class="quick-action-btn qa-green" onclick="navigate('invoices')">
                <span style="display:flex;align-items:center;gap:0.5rem;"><span class="qa-icon" style="display:flex"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg></span> Create Invoice</span>
                <span class="qa-arrow">→</span>
              </button>
              <button class="quick-action-btn qa-red" onclick="navigate('customers')">
                <span style="display:flex;align-items:center;gap:0.5rem;"><span class="qa-icon" style="display:flex"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></span> Manage Customers</span>
                <span class="qa-arrow">→</span>
              </button>
              <button class="quick-action-btn qa-blue" onclick="navigate('reports')">
                <span style="display:flex;align-items:center;gap:0.5rem;"><span class="qa-icon" style="display:flex"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg></span> View Reports</span>
                <span class="qa-arrow">→</span>
              </button>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><div class="card-title">Status Summary</div></div>
            <div class="card-body">
              <div style="display:flex;flex-direction:column;gap:1.2rem">
                ${statusBar("Paid Invoices", sales.paid_count, sales.total_invoices, "var(--accent-green)")}
                ${statusBar("Sent Invoices", sales.sent_count, sales.total_invoices, "var(--accent-blue)")}
                ${statusBar("Drafts", sales.draft_count, sales.total_invoices, "var(--text-muted)")}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    } catch (err) {
        main.innerHTML = emptyState("⚠️", "Could not load dashboard", err.message);
    }
}

function statusBar(label, count, total, color) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return `
    <div>
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:0.85rem">
        <span class="text-secondary">${label}</span>
        <span style="font-weight:600">${count} <span class="text-muted">(${pct}%)</span></span>
      </div>
      <div style="background:var(--bg-base);border-radius:4px;height:8px;overflow:hidden">
        <div style="width:${pct}%;height:100%;background:${color};border-radius:4px;transition:width 0.5s ease"></div>
      </div>
    </div>`;
}

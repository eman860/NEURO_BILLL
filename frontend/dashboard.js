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
        <div class="card">
          <div class="card-header"><div class="card-title">Weekly Progress <span style="font-weight:400;color:var(--text-muted);font-size:0.85rem">(from Database)</span></div></div>
          <div class="card-body" style="display:flex;align-items:center;justify-content:center;min-height:300px">
             <!-- Chart graphic exactly imitating screenshot -->
             <div style="width:100%;height:100%;border-left:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;position:relative;margin-top:20px;margin-left:20px;margin-bottom:20px">
                <div style="position:absolute;left:-25px;top:0;font-size:0.7rem;color:#94a3b8">100</div>
                <div style="position:absolute;left:-20px;bottom:50%;font-size:0.7rem;color:#94a3b8">50</div>
                <div style="position:absolute;left:-20px;bottom:25%;font-size:0.7rem;color:#94a3b8">25</div>
                <div style="position:absolute;left:-15px;bottom:-5px;font-size:0.7rem;color:#94a3b8">0</div>
                
                <!-- grid lines horizontal -->
                <div style="position:absolute;left:0;top:0;width:100%;border-top:1px dashed #e2e8f0"></div>
                <div style="position:absolute;left:0;top:50%;width:100%;border-top:1px dashed #e2e8f0"></div>
                <div style="position:absolute;left:0;top:75%;width:100%;border-top:1px dashed #e2e8f0"></div>
                
                <!-- dot -->
                <div style="position:absolute;left:50%;top:10%;width:10px;height:10px;background:var(--brand);border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 0 4px rgba(37,99,235,0.2)"></div>
                
                <!-- x-axis label -->
                <div style="position:absolute;left:50%;bottom:-25px;font-size:0.7rem;color:#94a3b8;transform:translateX(-50%)">Fri</div>
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

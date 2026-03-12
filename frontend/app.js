/**
 * app.js – Core SPA router, auth handlers, toast, modal utilities.
 */

// ── State ─────────────────────────────────────────────────────────────────────
let currentPage = "dashboard";

// ── Init ──────────────────────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
    if (isLoggedIn()) {
        showApp();
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const resetToken = urlParams.get('reset_token');
        
        if (resetToken) {
            document.getElementById("auth-overlay").classList.remove("hidden");
            showAuthView('reset');
            document.getElementById("reset-token").value = resetToken;
        } else {
            document.getElementById("auth-overlay").classList.remove("hidden");
        }
    }

    // Hamburger Menu Toggle
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const sidebar = document.getElementById("sidebar");
    
    if (hamburgerBtn && sidebar) {
        hamburgerBtn.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle("open");
            } else {
                sidebar.classList.toggle("collapsed");
            }
        });
    }
});

function showApp() {
    document.getElementById("auth-overlay").classList.add("hidden");
    document.getElementById("app-shell").classList.remove("hidden");
    const name = localStorage.getItem("nb_full_name") || "User";
    const email = localStorage.getItem("nb_email") || "";
    const initial = name.charAt(0).toUpperCase();
    
    document.getElementById("user-name-sidebar").textContent = name;
    document.getElementById("user-email-sidebar").textContent = email;
    document.getElementById("user-avatar").textContent = initial;
    
    const headerName = document.getElementById("header-name");
    const headerAvatar = document.getElementById("header-avatar");
    if (headerName) headerName.textContent = name;
    if (headerAvatar) headerAvatar.textContent = initial;

    navigate("dashboard");
}

// ── Auth Tab ──────────────────────────────────────────────────────────────────
function showAuthTab(tab) {
    showAuthView(tab);
}

function showAuthView(view) {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const forgotForm = document.getElementById("forgot-password-form");
    const resetForm = document.getElementById("reset-password-form");
    const tabs = document.querySelector(".auth-tabs");

    [loginForm, registerForm, forgotForm, resetForm].forEach(f => f.classList.add("hidden"));
    
    if (view === 'login') {
        loginForm.classList.remove("hidden");
        tabs.classList.remove("hidden");
        document.getElementById("tab-login").classList.add("active");
        document.getElementById("tab-register").classList.remove("active");
    } else if (view === 'register') {
        registerForm.classList.remove("hidden");
        tabs.classList.remove("hidden");
        document.getElementById("tab-register").classList.add("active");
        document.getElementById("tab-login").classList.remove("active");
    } else if (view === 'forgot') {
        forgotForm.classList.remove("hidden");
        tabs.classList.add("hidden");
    } else if (view === 'reset') {
        resetForm.classList.remove("hidden");
        tabs.classList.add("hidden");
    }
}

// ── Auth Handlers ─────────────────────────────────────────────────────────────
async function handleLogin(e) {
    e.preventDefault();
    const btn = document.getElementById("login-btn");
    const errEl = document.getElementById("login-error");
    errEl.classList.add("hidden");
    setLoading(btn, true);
    try {
        const data = await api.login({
            email: document.getElementById("login-email").value.trim(),
            password: document.getElementById("login-password").value,
        });
        setSession(data);
        showApp();
    } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.remove("hidden");
    } finally {
        setLoading(btn, false);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const btn = document.getElementById("register-btn");
    const errEl = document.getElementById("register-error");
    errEl.classList.add("hidden");
    setLoading(btn, true);
    try {
        const data = await api.register({
            full_name: document.getElementById("reg-name").value.trim(),
            email: document.getElementById("reg-email").value.trim(),
            business_name: document.getElementById("reg-business").value.trim(),
            password: document.getElementById("reg-password").value,
        });
        setSession(data);
        showApp();
    } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.remove("hidden");
    } finally {
        setLoading(btn, false);
    }
}

async function handleForgotPassword(e) {
    e.preventDefault();
    const btn = document.getElementById("forgot-btn");
    const errEl = document.getElementById("forgot-error");
    const successEl = document.getElementById("forgot-success");
    errEl.classList.add("hidden");
    successEl.classList.add("hidden");
    setLoading(btn, true);
    try {
        const email = document.getElementById("forgot-email").value.trim();
        const res = await api.forgotPassword(email);
        successEl.textContent = res.message;
        successEl.classList.remove("hidden");
    } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.remove("hidden");
    } finally {
        setLoading(btn, false);
    }
}

async function handleResetPassword(e) {
    e.preventDefault();
    const btn = document.getElementById("reset-btn");
    const errEl = document.getElementById("reset-error");
    const pass = document.getElementById("reset-password").value;
    const confirm = document.getElementById("reset-confirm").value;

    if (pass !== confirm) {
        errEl.textContent = "Passwords do not match";
        errEl.classList.remove("hidden");
        return;
    }

    errEl.classList.add("hidden");
    setLoading(btn, true);
    try {
        const token = document.getElementById("reset-token").value;
        const res = await api.resetPassword(token, pass);
        toast(res.message, "success");
        setTimeout(() => {
            showAuthView('login');
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 1500);
    } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.remove("hidden");
    } finally {
        setLoading(btn, false);
    }
}

function logout() {
    clearSession();
    location.reload();
}

// ── Router ────────────────────────────────────────────────────────────────────
function navigate(page, el) {
    currentPage = page;
    document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
    if (el) el.classList.add("active");
    else {
        const target = document.querySelector(`.nav-item[data-page="${page}"]`);
        if (target) target.classList.add("active");
    }
    const main = document.getElementById("main-content");
    main.innerHTML = `<div class="page-loading"><div class="spinner"></div></div>`;
    const renderers = {
        dashboard: renderDashboard,
        customers: renderCustomers,
        products: renderProducts,
        invoices: renderInvoices,
        payments: renderPayments,
        reports: renderReports,
        settings: renderSettings,
    };
    (renderers[page] || renderDashboard)();
    return false;
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function openModal(title, bodyHTML, large = false) {
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-body").innerHTML = bodyHTML;
    const modal = document.getElementById("modal");
    modal.classList.toggle("modal-lg", large);
    document.getElementById("modal-overlay").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal-overlay").classList.add("hidden");
    document.getElementById("modal-body").innerHTML = "";
}

function closeModalOnBackdrop(e) {
    if (e.target === document.getElementById("modal-overlay")) closeModal();
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function toast(msg, type = "info") {
    const icons = { 
        success: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`, 
        error: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`, 
        info: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>` 
    };
    const el = document.createElement("div");
    el.className = `toast toast-${type}`;
    el.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
    document.getElementById("toast-container").prepend(el);
    setTimeout(() => el.remove(), 3500);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function setLoading(btn, loading) {
    btn.querySelector(".btn-text").classList.toggle("hidden", loading);
    btn.querySelector(".btn-loader").classList.toggle("hidden", !loading);
    btn.disabled = loading;
}

function fmt(n) {
    return "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function statusBadge(s) {
    const cls = { draft: "badge-draft", sent: "badge-sent", paid: "badge-paid" };
    return `<span class="badge ${cls[s] || "badge-draft"}">${s}</span>`;
}

function emptyState(icon, title, sub, btnHTML = "") {
    const iconMap = {
        "⚠️": `<svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`,
        "👥": `<svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`,
        "📦": `<svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>`,
        "💳": `<svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>`,
        "🧾": `<svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`,
    };
    const mappedIcon = iconMap[icon] || icon;
    return `<div class="empty-state">
    <div class="empty-icon">${mappedIcon}</div>
    <div class="empty-title">${title}</div>
    <div class="empty-sub">${sub}</div>
    ${btnHTML}
  </div>`;
}

function pageShell(titleHTML, actionsHTML, bodyHTML) {
    return `<div class="page-header">${titleHTML}</div>${bodyHTML}`;
}

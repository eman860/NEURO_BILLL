/**
 * customers.js – Customer management page.
 */

let _customers = [];

async function renderCustomers() {
    const main = document.getElementById("main-content");
    main.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Customers</div>
        <div class="page-subtitle">Manage your GST & non-GST customers</div>
      </div>
      <div class="page-actions">
        <div class="search-bar">
          <input type="text" id="cust-search" placeholder="Search customers…" oninput="filterCustomers(this.value)" />
        </div>
        <button class="btn btn-primary" onclick="openCustomerModal()">+ Add Customer</button>
      </div>
    </div>
    <div class="card">
      <div class="card-body" style="padding:0">
        <div class="table-wrap" id="customers-table-wrap">
          <div class="page-loading"><div class="spinner"></div></div>
        </div>
      </div>
    </div>`;
    await loadCustomers();
}

async function loadCustomers(search) {
    try {
        _customers = await api.getCustomers(search);
        renderCustomerTable(_customers);
    } catch (err) {
        document.getElementById("customers-table-wrap").innerHTML =
            emptyState("⚠️", "Failed to load", err.message);
    }
}

function filterCustomers(val) {
    clearTimeout(window._custTimer);
    window._custTimer = setTimeout(() => loadCustomers(val), 300);
}

function renderCustomerTable(customers) {
    const wrap = document.getElementById("customers-table-wrap");
    if (!customers.length) {
        wrap.innerHTML = emptyState("👥", "No customers yet", "Add your first customer to get started.",
            `<button class="btn btn-primary" onclick="openCustomerModal()">+ Add Customer</button>`);
        return;
    }
    wrap.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Name</th><th>Phone</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${customers.map(c => `
        <tr>
          <td><strong>${esc(c.name)}</strong></td>
          <td class="text-secondary">${esc(c.phone || "—")}</td>
          <td>
            <div class="table-actions">
              <button class="btn btn-secondary btn-sm" onclick="openCustomerModal(${c.id})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${c.id}, '${esc(c.name)}')">Delete</button>
            </div>
          </td>
        </tr>`).join("")}
      </tbody>
    </table>`;
}

function openCustomerModal(id) {
    const c = id ? _customers.find(x => x.id === id) : null;
    const title = c ? "Edit Customer" : "Add Customer";
    openModal(title, `
    <form id="customer-form" onsubmit="saveCustomer(event, ${id || 'null'})">
      <div class="form-group">
        <label>Name *</label>
        <input type="text" id="cf-name" value="${esc(c?.name || "")}" required />
      </div>
      <div class="form-group">
        <label>Phone</label>
        <input type="tel" id="cf-phone" value="${esc(c?.phone || "")}" />
      </div>
      <div class="form-group">
        <label>Address</label>
        <textarea id="cf-address" rows="2">${esc(c?.address || "")}</textarea>
      </div>
      <div id="customer-form-error" class="form-error hidden"></div>
      <div class="modal-footer" style="padding:1rem 0 0">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">${c ? "Save Changes" : "Add Customer"}</button>
      </div>
    </form>`);
}

async function saveCustomer(e, id) {
    e.preventDefault();
    const errEl = document.getElementById("customer-form-error");
    errEl.classList.add("hidden");
    const payload = {
        name: document.getElementById("cf-name").value.trim(),
        phone: document.getElementById("cf-phone").value.trim() || null,
        address: document.getElementById("cf-address").value.trim() || null,
        is_gst: false,
    };
    try {
        if (id) {
            await api.updateCustomer(id, payload);
            toast("Customer updated", "success");
        } else {
            await api.createCustomer(payload);
            toast("Customer added", "success");
        }
        closeModal();
        await loadCustomers();
    } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.remove("hidden");
    }
}

async function deleteCustomer(id, name) {
    if (!confirm(`Delete customer "${name}"? This cannot be undone.`)) return;
    try {
        await api.deleteCustomer(id);
        toast("Customer deleted", "success");
        await loadCustomers();
    } catch (err) {
        toast(err.message, "error");
    }
}

function esc(s) {
    if (!s) return "";
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

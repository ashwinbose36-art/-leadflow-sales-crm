// Initial Leads Data
let leadsData = [
    { id: 1, name: "Sarah Jenkins", company: "Apex Global Corp", email: "sarah@apexglobal.com", status: "Qualified", value: 45000, owner: "Alex Morgan" },
    { id: 2, name: "Marcus Vance", company: "Starlight AI Systems", email: "marcus@starlight.ai", status: "Contacted", value: 28000, owner: "Elena Rostova" },
    { id: 3, name: "Elena Rostova", company: "Nexus Financial Cloud", email: "elena@nexusfin.com", status: "Proposal", value: 62000, owner: "Alex Morgan" },
    { id: 4, name: "Liam Thorne", company: "Vortex Dynamics", email: "liam@vortext.io", status: "New", value: 55000, owner: "Sarah Jenkins" },
    { id: 5, name: "Chloe Bennett", company: "Horizon BioTech", email: "chloe@horizon.bio", status: "Qualified", value: 38000, owner: "Alex Morgan" }
];

document.addEventListener("DOMContentLoaded", () => {
    renderLeadsTable();
    initCharts();
});

// View Navigation
function navigateTo(pageId) {
    const pages = ["dashboard", "leads", "pipeline", "landing", "login"];
    pages.forEach(p => {
        const pageEl = document.getElementById(`page-${p}`);
        const navBtn = document.getElementById(`nav-${p}`);
        if (pageEl) pageEl.classList.add("hidden");
        if (navBtn) navBtn.classList.remove("nav-item-active");
    });

    const targetPage = document.getElementById(`page-${pageId}`);
    const targetNav = document.getElementById(`nav-${pageId}`);
    if (targetPage) targetPage.classList.remove("hidden");
    if (targetNav) targetNav.classList.add("nav-item-active");
    window.scrollTo(0,0);
}

// Render Leads Directory
function renderLeadsTable(filtered = null) {
    const data = filtered || leadsData;
    const tbody = document.getElementById("leads-table-body");
    if (!tbody) return;

    tbody.innerHTML = data.map(item => `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td class="p-4">
                <p class="font-bold text-slate-900 dark:text-white">${item.name}</p>
                <p class="text-xs text-slate-400">${item.email}</p>
            </td>
            <td class="p-4 text-slate-600 dark:text-slate-300 font-medium">${item.company}</td>
            <td class="p-4">
                <span class="px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(item.status)}">${item.status}</span>
            </td>
            <td class="p-4 font-bold text-slate-900 dark:text-white">$${item.value.toLocaleString()}</td>
            <td class="p-4 text-xs font-semibold text-slate-500">${item.owner}</td>
            <td class="p-4 text-right">
                <button onclick="deleteLead(${item.id})" class="text-slate-400 hover:text-red-500 transition-colors">
                    <span class="material-symbols-outlined text-lg">delete</span>
                </button>
            </td>
        </tr>
    `).join("");

    const badge = document.getElementById("badge-leads");
    const dashBadge = document.getElementById("dash-leads-count");
    if (badge) badge.innerText = leadsData.length;
    if (dashBadge) dashBadge.innerText = 480 + leadsData.length;
}

function getStatusStyle(status) {
    switch (status) {
        case "New": return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
        case "Contacted": return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300";
        case "Qualified": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
        case "Proposal": return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
        default: return "bg-slate-100 text-slate-700";
    }
}

function filterLeadsTable() {
    const search = document.getElementById("lead-search-input").value.toLowerCase();
    const status = document.getElementById("lead-status-filter").value;

    const filtered = leadsData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search) || item.company.toLowerCase().includes(search) || item.email.toLowerCase().includes(search);
        const matchesStatus = (status === "ALL") || (item.status === status);
        return matchesSearch && matchesStatus;
    });

    renderLeadsTable(filtered);
}

function openAddLeadModal() {
    document.getElementById("modal-add-lead").classList.remove("hidden");
    document.getElementById("modal-add-lead").classList.add("flex");
}

function closeAddLeadModal() {
    document.getElementById("modal-add-lead").classList.add("hidden");
    document.getElementById("modal-add-lead").classList.remove("flex");
}

function handleCreateLead(e) {
    e.preventDefault();
    const newLead = {
        id: Date.now(),
        name: document.getElementById("form-lead-name").value,
        company: document.getElementById("form-lead-company").value,
        email: document.getElementById("form-lead-email").value,
        value: parseInt(document.getElementById("form-lead-value").value) || 0,
        status: document.getElementById("form-lead-status").value,
        owner: "Alex Morgan"
    };

    leadsData.unshift(newLead);
    renderLeadsTable();
    closeAddLeadModal();
    alert("New lead added successfully!");
}

function deleteLead(id) {
    if (confirm("Are you sure you want to delete this lead?")) {
        leadsData = leadsData.filter(item => item.id !== id);
        renderLeadsTable();
    }
}

function exportLeadsCSV() {
    let csv = "ID,Name,Company,Email,Status,Value,Owner\n";
    leadsData.forEach(l => {
        csv += `${l.id},"${l.name}","${l.company}","${l.email}",${l.status},${l.value},"${l.owner}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LeadFlow_Leads_Export.csv';
    a.click();
}

function toggleDarkMode() {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    document.getElementById("theme-status").innerText = isDark ? "Dark" : "Light";
}

function initCharts() {
    const revCtx = document.getElementById('revenueChart');
    if (revCtx) {
        new Chart(revCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                datasets: [{
                    label: 'Revenue 2026 ($k)',
                    data: [65, 78, 92, 88, 105, 114, 118, 124.5],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    const srcCtx = document.getElementById('sourceChart');
    if (srcCtx) {
        new Chart(srcCtx, {
            type: 'doughnut',
            data: {
                labels: ['Inbound Web', 'Outbound Sales', 'Referrals', 'Paid Search'],
                datasets: [{
                    data: [42, 28, 18, 12],
                    backgroundColor: ['#2563eb', '#10b981', '#8b5cf6', '#f59e0b']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

const DEPLOYMENT_ID = "AKfycbxaGLAuht4RE-bgn1qla20dbejPIkhCc1KtdHnh8AlcSdvBPc0GNvFl6u7k4MFhCUwXFQ";
const API_GET = `https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec?action=getAllData`;

let cachedRows = [];
let chartInst = null;

async function fetchRows() {
  try {
    const res = await fetch(API_GET);
    const json = await res.json();
    return Array.isArray(json) ? json : json.records || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

function setSync(ok) {
  document.getElementById('syncDot').style.background = ok ? '#22c55e' : '#f87171';
}

function renderSummary(rows) {
  document.getElementById('totalRecords').innerText = rows.length;
  const total = rows.reduce((s, r) => s + (parseFloat(r.Price) || 0), 0);
  document.getElementById('totalSpend').innerText = `৳${total.toFixed(2)}`;
  const avg = rows.length ? total / rows.length : 0;
  document.getElementById('dailyAvg').innerText = `৳${avg.toFixed(2)}`;
  const shops = new Set(rows.map(r => r.Shop?.trim()).filter(Boolean));
  document.getElementById('shopCount').innerText = shops.size;
  document.getElementById('lastUpdated').innerText = "Last Updated: " + new Date().toLocaleString();
}

function renderRecent(rows) {
  const wrap = document.getElementById('recentTable');
  if (!rows.length) {
    wrap.innerHTML = "<p class='muted'>No records found.</p>";
    return;
  }
  const recent = rows.slice(-5).reverse();
  const headers = Object.keys(recent[0]);
  let html = "<table><thead><tr>";
  headers.forEach(h => (html += `<th>${h}</th>`));
  html += "</tr></thead><tbody>";
  recent.forEach(r => {
    html += "<tr>";
    headers.forEach(h => (html += `<td>${r[h] || ""}</td>`));
    html += "</tr>";
  });
  html += "</tbody></table>";
  wrap.innerHTML = html;
}

function drawChart(rows) {
  const ctx = document.getElementById("spendChart").getContext("2d");
  const labels = rows.map(r => r["Product Name"] || "—");
  const data = rows.map(r => parseFloat(r.Price) || 0);
  const type = document.getElementById("chartType").value;
  if (chartInst) chartInst.destroy();
  chartInst = new Chart(ctx, {
    type,
    data: {
      labels,
      datasets: [{
        label: "Spend",
        data,
        backgroundColor: "#2563eb88",
        borderColor: "#2563eb"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

async function loadAll() {
  setSync(false);
  const rows = await fetchRows();
  cachedRows = rows;
  renderSummary(rows);
  renderRecent(rows);
  drawChart(rows);
  setSync(true);
}

document.getElementById("applyFilter").addEventListener("click", () => {
  const s = document.getElementById("startDate").value;
  const e = document.getElementById("endDate").value;
  if (!s || !e) return showToast("Pick both dates");
  const filtered = cachedRows.filter(r => {
    const d = new Date(r.Date);
    return d >= new Date(s) && d <= new Date(e);
  });
  renderSummary(filtered);
  renderRecent(filtered);
  drawChart(filtered);
  showToast("Filter applied");
});

document.getElementById("clearFilter").addEventListener("click", () => {
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
  loadAll();
});

document.getElementById("chartType").addEventListener("change", () => drawChart(cachedRows));

document.getElementById("exportPdf").addEventListener("click", () => {
  const w = window.open("", "_blank");
  w.document.write("<h1>DailyBazar Report</h1>");
  w.document.write("<p>Generated: " + new Date().toLocaleString() + "</p>");
  w.print();
});

setInterval(loadAll, 30000);
window.addEventListener("load", loadAll);

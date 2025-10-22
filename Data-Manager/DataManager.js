const DEPLOYMENT_ID = "AKfycbxaGLAuht4RE-bgn1qla20dbejPIkhCc1KtdHnh8AlcSdvBPc0GNvFl6u7k4MFhCUwXFQ";
const API_URL = `https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec`;

const form = document.getElementById("recordForm");
const tableBody = document.querySelector("#recordsTable tbody");
const toast = document.getElementById("toast");
const recordCount = document.getElementById("recordCount");
const saveSound = document.getElementById("saveSound");

let records = [];

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

async function fetchData() {
  try {
    const res = await fetch(`${API_URL}?action=getAllData`);
    const json = await res.json();
    records = json.records || json;
    renderTable(records);
  } catch (e) {
    console.error(e);
    showToast("⚠️ Offline mode — showing local data");
    records = JSON.parse(localStorage.getItem("records") || "[]");
    renderTable(records);
  }
}

function saveToLocal() {
  localStorage.setItem("records", JSON.stringify(records));
}

function renderTable(data) {
  tableBody.innerHTML = "";
  data.forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r["Item Name"] || r.item}</td>
      <td>৳${r.Price || r.price}</td>
      <td>${r.Category || r.category}</td>
      <td>${r.Date || r.date}</td>
      <td>${r.AddedBy || r.addedBy}</td>
      <td>
        <button class="btn ghost del" data-i="${i}"><i data-lucide="trash-2"></i></button>
      </td>`;
    tableBody.appendChild(tr);
  });
  recordCount.textContent = data.length;
  lucide.createIcons();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const record = {
    item: form.itemName.value.trim(),
    price: parseFloat(form.price.value),
    category: form.category.value,
    date: form.date.value,
    addedBy: form.addedBy.value.trim()
  };

  if (!record.item || !record.price) return showToast("⚠️ Fill all fields!");

  try {
    await fetch(API_URL, {
      method: "POST",
      body: new URLSearchParams({ action: "addData", ...record })
    });
    showToast("✅ Record Saved!");
    saveSound.play();
    fetchData();
  } catch {
    records.push(record);
    saveToLocal();
    showToast("💾 Saved Offline");
    renderTable(records);
  }

  form.reset();
});

tableBody.addEventListener("click", (e) => {
  if (e.target.closest(".del")) {
    const i = e.target.closest(".del").dataset.i;
    if (confirm("🗑️ Delete this record?")) {
      records.splice(i, 1);
      saveToLocal();
      renderTable(records);
      showToast("🗑️ Deleted");
    }
  }
});

document.getElementById("clearFilter").addEventListener("click", () => {
  fetchData();
  document.getElementById("searchInput").value = "";
});

document.addEventListener("DOMContentLoaded", fetchData);

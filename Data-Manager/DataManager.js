document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("recordForm");
  const tableBody = document.querySelector("#recordsTable tbody");
  const toast = document.getElementById("toast");
  const recordCount = document.getElementById("recordCount");
  const visibleCount = document.getElementById("visibleCount");
  const totalCount = document.getElementById("totalCount");

  let records = JSON.parse(localStorage.getItem("records") || "[]");

  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  };

  const updateTable = () => {
    tableBody.innerHTML = "";
    records.forEach((r, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td contenteditable="true" data-field="item">${r.item}</td>
        <td contenteditable="true" data-field="price">${r.price}</td>
        <td>${r.category}</td>
        <td>${r.date}</td>
        <td>${r.addedBy}</td>
        <td>
          <button class="btn btn-sm edit" data-i="${i}"><i data-lucide="edit-2"></i></button>
          <button class="btn btn-sm ghost delete" data-i="${i}"><i data-lucide="trash-2"></i></button>
        </td>`;
      tableBody.appendChild(tr);
    });
    recordCount.textContent = records.length;
    visibleCount.textContent = records.length;
    totalCount.textContent = records.length;
    lucide.createIcons();
  };

  const saveToLocal = () => localStorage.setItem("records", JSON.stringify(records));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newRecord = {
      item: form.itemName.value.trim(),
      price: parseFloat(form.price.value),
      category: form.category.value,
      date: form.date.value,
      addedBy: form.addedBy.value.trim()
    };
    if (!newRecord.item || !newRecord.price) return showToast("Fill all fields!");
    records.push(newRecord);
    saveToLocal();
    updateTable();
    form.reset();
    showToast("✅ Record Saved!");
  });

  tableBody.addEventListener("click", (e) => {
    if (e.target.closest(".delete")) {
      const i = e.target.closest(".delete").dataset.i;
      records.splice(i, 1);
      saveToLocal();
      updateTable();
      showToast("🗑️ Record Deleted");
    }
  });

  updateTable();
});

document.addEventListener("DOMContentLoaded", () => {
  const rows = [...document.querySelectorAll(".row")];
  const search = document.getElementById("search");
  const reset = document.getElementById("reset");
  const chips = document.getElementById("active-chips");
  const noResults = document.getElementById("no-results");
  const sidebar = document.getElementById("sidebar");
  const mobileBtn = document.getElementById("mobile-menu-btn");

  let selectedCategories = [];
  let selectedToolkits = [];
  let selectedWayland = [];
  let sortState = { column: null, direction: 1 };

  function norm(s) {
    return (s || "").toLowerCase();
  }

  function apply() {
    const s = norm(search.value);
    let visible = 0;

    rows.forEach(r => {
      const name = norm(r.dataset.name);
      const notes = norm(r.dataset.notes);
      const cat = r.dataset.category;
      const tk = r.dataset.toolkit;
      const wl = r.dataset.wayland;

      let ok = true;

      if (s && !`${name} ${notes}`.includes(s)) ok = false;

      if (selectedCategories.length > 0 && !selectedCategories.includes(cat)) ok = false;
      if (selectedToolkits.length > 0 && !selectedToolkits.includes(tk)) ok = false;
      if (selectedWayland.length > 0 && !selectedWayland.includes(wl)) ok = false;

      r.style.display = ok ? "" : "none";
      if (ok) visible++;
    });

    noResults.classList.toggle("hidden", visible !== 0);
    updateChips();
  }

  function updateChips() {
    chips.innerHTML = "";

    const active = [];

    if (search.value.trim() !== "") {
      active.push({ type: "search", label: `Search: ${search.value}`, color: "neonBlue" });
    }

    selectedCategories.forEach(v =>
      active.push({ type: "category", label: v, value: v, color: "neonPurple" })
    );

    selectedToolkits.forEach(v =>
      active.push({ type: "toolkit", label: v, value: v, color: "neonCyan" })
    );

    selectedWayland.forEach(v =>
      active.push({ type: "wayland", label: v, value: v, color: "neonPink" })
    );

    active.forEach(f => {
      const chip = document.createElement("span");

      chip.className = `
        inline-flex items-center gap-2 px-4 py-1.5 rounded-full
        border border-${f.color} text-${f.color}
        bg-${f.color}/10 shadow-${f.color}
        backdrop-blur-md text-sm font-medium
        hover:bg-${f.color}/20 hover:shadow-${f.color}
        transition cursor-pointer
      `;

      chip.innerHTML = `
        ${f.label}
        <span class="text-${f.color} hover:text-white">✕</span>
      `;

      chip.addEventListener("click", () => {
        if (f.type === "search") {
          search.value = "";
        } else if (f.type === "category") {
          selectedCategories = selectedCategories.filter(x => x !== f.value);
          syncButtons("category-options", selectedCategories);
        } else if (f.type === "toolkit") {
          selectedToolkits = selectedToolkits.filter(x => x !== f.value);
          syncButtons("toolkit-options", selectedToolkits);
        } else if (f.type === "wayland") {
          selectedWayland = selectedWayland.filter(x => x !== f.value);
          syncButtons("wayland-options", selectedWayland);
        }
        apply();
      });

      chips.appendChild(chip);
    });
  }

  function setupMultiSelect(id, targetArray) {
    const container = document.getElementById(id);
    const buttons = container.querySelectorAll(".option-btn");

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const value = btn.dataset.value;

        if (targetArray.includes(value)) {
          targetArray.splice(targetArray.indexOf(value), 1);
        } else {
          targetArray.push(value);
        }

        syncButtons(id, targetArray);
        apply();
      });
    });
  }

  function syncButtons(id, targetArray) {
    const container = document.getElementById(id);
    const buttons = container.querySelectorAll(".option-btn");

    buttons.forEach(btn => {
      const value = btn.dataset.value;
      if (targetArray.includes(value)) {
        btn.classList.add("bg-neonBlue/20", "border-neonBlue", "text-neonBlue", "shadow-neonBlue");
      } else {
        btn.classList.remove("bg-neonBlue/20", "border-neonBlue", "text-neonBlue", "shadow-neonBlue");
      }
    });
  }

  const headers = document.querySelectorAll("th.sortable");

  headers.forEach(h => {
    h.addEventListener("click", () => {
      const col = h.dataset.col;

      if (sortState.column === col) {
        sortState.direction *= -1;
      } else {
        sortState.column = col;
        sortState.direction = 1;
      }

      sortTable(col, sortState.direction);
      updateSortIndicators();
    });
  });

  function sortTable(col, dir) {
    const tbody = document.querySelector("tbody");
    const rowsArr = [...tbody.querySelectorAll("tr")];

    rowsArr.sort((a, b) => {
      const A = a.querySelector(`td:nth-child(${getColIndex(col)})`).innerText.toLowerCase();
      const B = b.querySelector(`td:nth-child(${getColIndex(col)})`).innerText.toLowerCase();
      return A.localeCompare(B) * dir;
    });

    rowsArr.forEach(r => tbody.appendChild(r));
  }

  function getColIndex(col) {
    const map = {
      name: 1,
      category: 2,
      toolkit: 3,
      resource: 4,
      wayland: 5,
      customization: 6,
      notes: 7
    };
    return map[col];
  }

  function updateSortIndicators() {
    headers.forEach(h => {
      h.innerHTML = h.innerText;
    });

    if (sortState.column) {
      const active = document.querySelector(`th[data-col="${sortState.column}"]`);
      const arrow = sortState.direction === 1 ? "▲" : "▼";
      active.innerHTML = `${active.innerText} <span class="text-neonBlue">${arrow}</span>`;
    }
  }

  reset.addEventListener("click", () => {
    search.value = "";
    selectedCategories = [];
    selectedToolkits = [];
    selectedWayland = [];

    ["category-options", "toolkit-options", "wayland-options"].forEach(id =>
      syncButtons(id, [])
    );

    apply();
  });

  setupMultiSelect("category-options", selectedCategories);
  setupMultiSelect("toolkit-options", selectedToolkits);
  setupMultiSelect("wayland-options", selectedWayland);

  if (mobileBtn && sidebar) {
    mobileBtn.addEventListener("click", () => {
      sidebar.classList.toggle("-translate-x-full");
    });
  }

  apply();
});

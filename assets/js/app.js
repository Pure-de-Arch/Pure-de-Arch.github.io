document.addEventListener("DOMContentLoaded", () => {

  const cards = [...document.querySelectorAll(".de-card")];
  const search = document.getElementById("search");
  const reset = document.getElementById("reset");
  const chips = document.getElementById("active-chips");
  const noResults = document.getElementById("no-results");
  const sidebar = document.getElementById("sidebar");
  const mobileBtn = document.getElementById("mobile-menu-btn");

  let selectedCategories = [];
  let selectedToolkits = [];
  let selectedWayland = [];

  function norm(s) {
    return (s || "").toLowerCase();
  }

  function apply() {
    const s = norm(search.value);
    let visible = 0;

    cards.forEach(card => {
      const name = norm(card.dataset.name);
      const notes = norm(card.dataset.notes);
      const cat = card.dataset.category;
      const tk = card.dataset.toolkit;
      const wl = card.dataset.wayland;

      let ok = true;

      if (s && !`${name} ${notes}`.includes(s)) ok = false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(cat)) ok = false;
      if (selectedToolkits.length > 0 && !selectedToolkits.includes(tk)) ok = false;
      if (selectedWayland.length > 0 && !selectedWayland.includes(wl)) ok = false;

      card.style.display = ok ? "" : "none";
      if (ok) visible++;
    });

    noResults.classList.toggle("hidden", visible !== 0);
    updateChips();
  }

  function updateChips() {
    chips.innerHTML = "";

    const active = [];

    if (search.value.trim() !== "") {
      active.push({ type: "search", label: `Keresés: ${search.value}`, color: "neonBlue" });
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

  // Bottom info panel toggle
  const toggleBtn = document.getElementById("toggle-info");
  const infoPanel = document.getElementById("info-panel");

  if (toggleBtn && infoPanel) {
    toggleBtn.addEventListener("click", () => {
      infoPanel.classList.toggle("hidden");
      if (infoPanel.classList.contains("hidden")) {
        toggleBtn.textContent = "Telepítési útmutató megnyitása";
      } else {
        toggleBtn.textContent = "Telepítési útmutató bezárása";
      }
    });
  }

  apply();
});

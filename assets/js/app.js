(function () {
  const searchInput = document.querySelector('[data-filter="search"]');
  const categorySelect = document.querySelector('[data-filter="category"]');
  const layoutSelect = document.querySelector('[data-filter="layout"]');
  const osChipContainer = document.querySelector('[data-filter="os"]');
  const cards = Array.from(document.querySelectorAll(".de-card"));
  const totalCountEl = document.getElementById("total-count");
  const visibleCountEl = document.getElementById("visible-count");
  const emptyStateEl = document.getElementById("empty-state");

  let state = {
    search: "",
    category: "",
    layout: "",
    os: "",
    compositor: "",
    performance: ""
  };

  function normalize(str) {
    return (str || "").toString().toLowerCase();
  }

  function applyFilters() {
    let visibleCount = 0;
    const search = normalize(state.search);
    const category = normalize(state.category);
    const layout = normalize(state.layout);
    const os = normalize(state.os);
    const compositor = normalize(state.compositor);
    const performance = normalize(state.performance);

    cards.forEach((card) => {
      const name = card.dataset.name || "";
      const cat = card.dataset.category || "";
      const lay = card.dataset.layout || "";
      const osList = card.dataset.os || "";
      const tags = card.dataset.tags || "";
      const compositorField = card.dataset.compositor || "";
      const performanceField = card.dataset.performance || "";

      let visible = true;

      if (search) {
        const haystack = [name, cat, lay, osList, tags, compositorField, performanceField].join(" ");
        if (!haystack.includes(search)) visible = false;
      }

      if (category && !cat.includes(category)) visible = false;
      if (layout && !lay.includes(layout)) visible = false;
      if (os && !osList.includes(os)) visible = false;

      if (compositor && !compositorField.includes(compositor)) visible = false;

      if (performance) {
        // "Lightweight only" → performance mező tartalmazza a "high" szót
        if (!performanceField.includes(performance)) visible = false;
      }

      card.style.display = visible ? "" : "none";
      if (visible) visibleCount++;
    });

    visibleCountEl.textContent = visibleCount;
    emptyStateEl.style.display = visibleCount === 0 ? "block" : "none";
  }

  // Search
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.search = e.target.value;
      applyFilters();
    });
  }

  // Category
  if (categorySelect) {
    categorySelect.addEventListener("change", (e) => {
      state.category = e.target.value;
      applyFilters();
    });
  }

  // Layout
  if (layoutSelect) {
    layoutSelect.addEventListener("change", (e) => {
      state.layout = e.target.value;
      applyFilters();
    });
  }

  // Generic chip filter setup
  function setupChipFilter(containerSelector, stateKey) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-chip");
      if (!btn) return;

      Array.from(container.querySelectorAll(".filter-chip")).forEach((chip) =>
        chip.classList.remove("active")
      );

      btn.classList.add("active");
      state[stateKey] = btn.dataset.value || "";
      applyFilters();
    });

    const firstChip = container.querySelector('.filter-chip[data-value=""]');
    if (firstChip) firstChip.classList.add("active");
  }

  // OS chips
  setupChipFilter('[data-filter="os"]', "os");
  // Compositor chips (Wayland only)
  setupChipFilter('[data-filter="compositor"]', "compositor");
  // Performance chips (Lightweight only)
  setupChipFilter('[data-filter="performance"]', "performance");

  // Init counts
  if (totalCountEl) {
    totalCountEl.textContent = cards.length;
  }
  if (visibleCountEl) {
    visibleCountEl.textContent = cards.length;
  }
})();

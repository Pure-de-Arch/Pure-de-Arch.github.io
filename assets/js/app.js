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

    cards.forEach((card) => {
      const name = card.dataset.name || "";
      const cat = card.dataset.category || "";
      const lay = card.dataset.layout || "";
      const osList = card.dataset.os || "";
      const tags = card.dataset.tags || "";

      let visible = true;

      if (search) {
        const haystack = [name, cat, lay, osList, tags].join(" ");
        if (!haystack.includes(search)) visible = false;
      }

      if (category && !cat.includes(category)) visible = false;
      if (layout && !lay.includes(layout)) visible = false;
      if (os && !osList.includes(os)) visible = false;

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

  // OS chips
  if (osChipContainer) {
    osChipContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-chip");
      if (!btn) return;

      const value = btn.dataset.value || "";

      // toggle active
      Array.from(osChipContainer.querySelectorAll(".filter-chip")).forEach((chip) =>
        chip.classList.remove("active")
      );
      btn.classList.add("active");

      state.os = value;
      applyFilters();
    });

    // set "All" active by default
    const firstChip = osChipContainer.querySelector('.filter-chip[data-value=""]');
    if (firstChip) firstChip.classList.add("active");
  }

  // Init counts
  if (totalCountEl) {
    totalCountEl.textContent = cards.length;
  }
  if (visibleCountEl) {
    visibleCountEl.textContent = cards.length;
  }
})();

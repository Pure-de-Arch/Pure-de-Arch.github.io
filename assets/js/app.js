(function () {
  const searchInput = document.querySelector('[data-filter="search"]');
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
    performance: "",
    toolkit: "",
    config_style: "",
    target_usage: ""
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
    const toolkit = normalize(state.toolkit);
    const configStyle = normalize(state.config_style);
    const targetUsage = normalize(state.target_usage);

    cards.forEach((card) => {
      const name = card.dataset.name || "";
      const cat = card.dataset.category || "";
      const lay = card.dataset.layout || "";
      const osList = card.dataset.os || "";
      const tags = card.dataset.tags || "";
      const compositorField = card.dataset.compositor || "";
      const performanceField = card.dataset.performance || "";
      const toolkitField = card.dataset.toolkit || "";
      const configField = card.dataset.config_style || "";
      const targetField = card.dataset.target_usage || "";

      let visible = true;

      if (search) {
        const haystack = [
          name,
          cat,
          lay,
          osList,
          tags,
          compositorField,
          performanceField,
          toolkitField,
          configField,
          targetField
        ].join(" ");
        if (!haystack.includes(search)) visible = false;
      }

      if (category && !cat.includes(category)) visible = false;
      if (layout && !lay.includes(layout)) visible = false;
      if (os && !osList.includes(os)) visible = false;
      if (compositor && !compositorField.includes(compositor)) visible = false;

      if (performance) {
        if (!performanceField.includes(performance)) visible = false;
      }

      if (toolkit && !toolkitField.includes(toolkit)) visible = false;
      if (configStyle && !configField.includes(configStyle)) visible = false;
      if (targetUsage && !targetField.includes(targetUsage)) visible = false;

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

  setupChipFilter('[data-filter="category"]', "category");
  setupChipFilter('[data-filter="layout"]', "layout");
  setupChipFilter('[data-filter="os"]', "os");
  setupChipFilter('[data-filter="compositor"]', "compositor");
  setupChipFilter('[data-filter="performance"]', "performance");
  setupChipFilter('[data-filter="toolkit"]', "toolkit");
  setupChipFilter('[data-filter="config_style"]', "config_style");
  setupChipFilter('[data-filter="target_usage"]', "target_usage");

  if (totalCountEl) totalCountEl.textContent = cards.length;
  if (visibleCountEl) visibleCountEl.textContent = cards.length;
})();

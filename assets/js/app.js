document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const categorySelect = document.getElementById("filter-category");
  const toolkitSelect = document.getElementById("filter-toolkit");
  const waylandSelect = document.getElementById("filter-wayland");
  const resetButton = document.getElementById("reset-filters");
  const rows = Array.from(document.querySelectorAll(".desktop-row"));
  const noResults = document.getElementById("no-results");

  function normalize(str) {
    return (str || "").toLowerCase();
  }

  function applyFilters() {
    const search = normalize(searchInput.value);
    const category = categorySelect.value;
    const toolkit = toolkitSelect.value;
    const wayland = waylandSelect.value;

    let visibleCount = 0;

    rows.forEach((row) => {
      const name = normalize(row.dataset.name);
      const notes = normalize(row.dataset.notes);
      const rowCategory = row.dataset.category;
      const rowToolkit = row.dataset.toolkit;
      const rowWayland = row.dataset.wayland;

      let matches = true;

      if (search) {
        const combined = `${name} ${notes}`;
        if (!combined.includes(search)) {
          matches = false;
        }
      }

      if (category && rowCategory !== category) {
        matches = false;
      }

      if (toolkit && rowToolkit !== toolkit) {
        matches = false;
      }

      if (wayland && rowWayland !== wayland) {
        matches = false;
      }

      if (matches) {
        row.style.display = "";
        visibleCount++;
      } else {
        row.style.display = "none";
      }
    });

    noResults.style.display = visibleCount === 0 ? "block" : "none";
  }

  searchInput.addEventListener("input", applyFilters);
  categorySelect.addEventListener("change", applyFilters);
  toolkitSelect.addEventListener("change", applyFilters);
  waylandSelect.addEventListener("change", applyFilters);

  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    categorySelect.value = "";
    toolkitSelect.value = "";
    waylandSelect.value = "";
    applyFilters();
  });

  applyFilters();
});

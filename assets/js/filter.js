document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("filter-display");
  const type = document.getElementById("filter-type");
  const layout = document.getElementById("filter-layout");
  const search = document.getElementById("search");
  const cards = [...document.querySelectorAll(".card")];

  function applyFilters() {
    const d = display.value;
    const t = type.value;
    const l = layout.value;
    const q = search.value.toLowerCase();

    cards.forEach(card => {
      const matchDisplay = d === "all" || card.dataset.display === d;
      const matchType = t === "all" || card.dataset.type === t;
      const matchLayout = l === "all" || card.dataset.layout === l;
      const matchSearch = card.innerText.toLowerCase().includes(q);

      card.style.display =
        matchDisplay && matchType && matchLayout && matchSearch
          ? ""
          : "none";
    });
  }

  display.onchange = applyFilters;
  type.onchange = applyFilters;
  layout.onchange = applyFilters;
  search.oninput = applyFilters;
});

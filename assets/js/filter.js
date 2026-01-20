document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("filter-display");
  const type = document.getElementById("filter-type");
  const layout = document.getElementById("filter-layout");
  const search = document.getElementById("search");
  const tagContainer = document.getElementById("tag-filters");
  const cards = [...document.querySelectorAll(".card")];

  /* --- 1) TAG LISTA AUTOMATIKUS GENERÁLÁSA --- */
  const allTags = new Set();

  cards.forEach(card => {
    const tags = card.dataset.tags.split(",");
    tags.forEach(t => allTags.add(t.trim()));
  });

  allTags.forEach(tag => {
    const id = `tag-${tag}`;
    tagContainer.insertAdjacentHTML(
      "beforeend",
      `
      <label class="tag-option">
        <input type="checkbox" value="${tag}" class="tag-checkbox">
        <span>${tag}</span>
      </label>
      `
    );
  });

  const tagCheckboxes = [...document.querySelectorAll(".tag-checkbox")];

  /* --- 2) SZŰRŐ FUNKCIÓ --- */
  function applyFilters() {
    const d = display.value;
    const t = type.value;
    const l = layout.value;
    const q = search.value.toLowerCase();

    const activeTags = tagCheckboxes
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    cards.forEach(card => {
      const matchDisplay = d === "all" || card.dataset.display === d;
      const matchType = t === "all" || card.dataset.type === t;
      const matchLayout = l === "all" || card.dataset.layout === l;
      const matchSearch = card.innerText.toLowerCase().includes(q);

      const cardTags = card.dataset.tags.split(",");

      const matchTags =
        activeTags.length === 0 ||
        activeTags.every(tag => cardTags.includes(tag));

      card.style.display =
        matchDisplay && matchType && matchLayout && matchSearch && matchTags
          ? ""
          : "none";
    });
  }

  /* --- 3) ESEMÉNYEK --- */
  display.onchange = applyFilters;
  type.onchange = applyFilters;
  layout.onchange = applyFilters;
  search.oninput = applyFilters;
  tagCheckboxes.forEach(cb => cb.onchange = applyFilters);
});

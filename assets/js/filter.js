document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("filter-display");
  const type = document.getElementById("filter-type");
  const layout = document.getElementById("filter-layout");
  const search = document.getElementById("search");
  const tagContainer = document.getElementById("tag-filters");
  const cards = [...document.querySelectorAll(".card")];

  // Build tag set from cards
  const allTags = new Set();
  cards.forEach(card => {
    const tags = (card.dataset.tags || "").split(",").map(t => t.trim()).filter(Boolean);
    tags.forEach(t => allTags.add(t));
  });

  // Render tag checkboxes
  if (tagContainer) {
    const fragment = document.createDocumentFragment();
    Array.from(allTags).sort().forEach(tag => {
      const label = document.createElement("label");
      label.className = "tag-option";
      label.innerHTML = `<input type="checkbox" value="${tag}" class="tag-checkbox"> <span>${tag}</span>`;
      fragment.appendChild(label);
    });
    tagContainer.appendChild(fragment);
  }

  // Query checkboxes after insertion
  let tagCheckboxes = [...document.querySelectorAll(".tag-checkbox")];

  // Apply filters function
  function applyFilters() {
    const d = display ? display.value : "all";
    const t = type ? type.value : "all";
    const l = layout ? layout.value : "all";
    const q = search ? search.value.toLowerCase() : "";

    const activeTags = tagCheckboxes.filter(cb => cb.checked).map(cb => cb.value);

    cards.forEach(card => {
      const matchDisplay = d === "all" || card.dataset.display === d;
      const matchType = t === "all" || card.dataset.type === t;
      const matchLayout = l === "all" || card.dataset.layout === l;
      const matchSearch = q === "" || card.innerText.toLowerCase().includes(q);

      const cardTags = (card.dataset.tags || "").split(",").map(s => s.trim()).filter(Boolean);

      const matchTags = activeTags.length === 0 || activeTags.every(tag => cardTags.includes(tag));

      card.style.display = (matchDisplay && matchType && matchLayout && matchSearch && matchTags) ? "" : "none";
    });
  }

  // Attach events
  if (display) display.addEventListener("change", applyFilters);
  if (type) type.addEventListener("change", applyFilters);
  if (layout) layout.addEventListener("change", applyFilters);
  if (search) search.addEventListener("input", applyFilters);

  // Re-query tagCheckboxes and attach change listeners
  tagCheckboxes = [...document.querySelectorAll(".tag-checkbox")];
  tagCheckboxes.forEach(cb => cb.addEventListener("change", applyFilters));

  // Initial filter pass
  applyFilters();

  // Optional: observe DOM for dynamic card changes and rebuild tags
  const observer = new MutationObserver(() => {
    // rebuild tag set and checkboxes if cards change
    const newCards = [...document.querySelectorAll(".card")];
    if (newCards.length !== cards.length) {
      // reload page to simplify state or implement dynamic rebuild
      window.location.reload();
    }
  });
  observer.observe(document.getElementById("cards") || document.body, { childList: true, subtree: true });
});

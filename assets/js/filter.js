// assets/js/filter.js
document.addEventListener("DOMContentLoaded", () => {
  const displayEl = document.getElementById("filter-display");
  const typeEl = document.getElementById("filter-type");
  const layoutEl = document.getElementById("filter-layout");
  const searchEl = document.getElementById("search");
  const tagContainer = document.getElementById("tag-filters");
  const cardsContainer = document.getElementById("cards");
  let cards = Array.from(document.querySelectorAll(".card"));

  // If no cards, nothing to do
  if (!cards.length) return;

  // Build tag set from cards (normalize to lower-case for matching)
  const allTags = new Set();
  cards.forEach(card => {
    const raw = card.dataset.tags || "";
    raw.split(",").map(t => t.trim()).filter(Boolean).forEach(t => allTags.add(t));
  });

  // Render tag toggles (checkbox + visual switch)
  if (tagContainer) {
    tagContainer.innerHTML = ""; // clear
    const frag = document.createDocumentFragment();
    Array.from(allTags).sort((a,b) => a.localeCompare(b)).forEach(tag => {
      const safeId = `tag-${tag.toLowerCase().replace(/[^a-z0-9\-]/g,'-')}`;
      const label = document.createElement("label");
      label.className = "tag-option";
      label.innerHTML = `
        <span class="tag-name">${tag}</span>
        <input type="checkbox" id="${safeId}" class="tag-checkbox" value="${tag}">
        <span class="tag-switch" aria-hidden="true"></span>
      `;
      frag.appendChild(label);
    });
    tagContainer.appendChild(frag);
  }

  // Query checkboxes after render
  let tagCheckboxes = Array.from(document.querySelectorAll(".tag-checkbox"));

  // Normalize helper
  const norm = s => (String(s || "")).toLowerCase().trim();

  // Core filter function
  function applyFilters() {
    // re-query cards in case DOM changed
    cards = Array.from(document.querySelectorAll(".card"));

    const displayVal = displayEl ? norm(displayEl.value) : "all";
    const typeVal = typeEl ? norm(typeEl.value) : "all";
    const layoutVal = layoutEl ? norm(layoutEl.value) : "all";
    const q = searchEl ? norm(searchEl.value) : "";

    const activeTags = tagCheckboxes.filter(cb => cb.checked).map(cb => norm(cb.value));

    cards.forEach(card => {
      const cd = norm(card.dataset.display);
      const ct = norm(card.dataset.type);
      const cl = norm(card.dataset.layout);
      const cardText = norm(card.innerText);

      const matchDisplay = displayVal === "all" || cd === displayVal;
      const matchType = typeVal === "all" || ct === typeVal;
      const matchLayout = layoutVal === "all" || cl === layoutVal;
      const matchSearch = !q || cardText.includes(q);

      const cardTags = (card.dataset.tags || "").split(",").map(t => norm(t)).filter(Boolean);
      const matchTags = activeTags.length === 0 || activeTags.every(t => cardTags.includes(t));

      const show = matchDisplay && matchType && matchLayout && matchSearch && matchTags;
      card.style.display = show ? "" : "none";
    });
  }

  // Attach events
  if (displayEl) displayEl.addEventListener("change", applyFilters);
  if (typeEl) typeEl.addEventListener("change", applyFilters);
  if (layoutEl) layoutEl.addEventListener("change", applyFilters);
  if (searchEl) searchEl.addEventListener("input", applyFilters);

  // Attach change listeners to tag checkboxes (re-query in case of dynamic changes)
  function bindTagEvents() {
    tagCheckboxes = Array.from(document.querySelectorAll(".tag-checkbox"));
    tagCheckboxes.forEach(cb => {
      cb.removeEventListener("change", applyFilters);
      cb.addEventListener("change", applyFilters);
    });
  }
  bindTagEvents();

  // Observe cards container for dynamic changes (rebuild tags if cards change)
  if (cardsContainer) {
    const mo = new MutationObserver(muts => {
      const changed = muts.some(m => m.addedNodes.length || m.removedNodes.length);
      if (changed) {
        // rebuild tag list and rebind events
        const newCards = Array.from(document.querySelectorAll(".card"));
        // rebuild tag set
        const newTags = new Set();
        newCards.forEach(card => {
          (card.dataset.tags || "").split(",").map(t => t.trim()).filter(Boolean).forEach(t => newTags.add(t));
        });
        // if tags changed, re-render
        const oldTags = Array.from(allTags).sort().join(",");
        const curTags = Array.from(newTags).sort().join(",");
        if (oldTags !== curTags) {
          // update DOM: simple approach — reload page to keep state consistent
          // (or you can implement incremental rebuild here)
          window.location.reload();
        } else {
          // otherwise just rebind events and re-run filters
          bindTagEvents();
          applyFilters();
        }
      }
    });
    mo.observe(cardsContainer, { childList: true, subtree: false });
  }

  // Initial pass
  applyFilters();
});

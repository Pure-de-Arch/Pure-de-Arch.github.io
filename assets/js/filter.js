document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("filter-display");
  const type = document.getElementById("filter-type");
  const layout = document.getElementById("filter-layout");
  const search = document.getElementById("search");
  const tagContainer = document.getElementById("tag-filters");
  const cards = [...document.querySelectorAll(".card")];

  /* --- TAG LISTA AUTOMATIKUS GENERÁLÁSA --- */
  const allTags = new Set();

  cards.forEach(card => {
    const tags = (card.dataset.tags || "").split(",").filter(Boolean);
    tags.forEach(t => allTags.add(t.trim()));
  });

  if (tagContainer) {
    allTags.forEach(tag => {
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
  }

  const tagCheckboxes = [...document.querySelectorAll(".tag-checkbox")];

  /* --- SZŰRŐ FUNKCIÓ --- */
  function applyFilters() {
    const d = display ? display.value : "all";
    const t = type ? type.value : "all";
    const l = layout ? layout.value : "all";
    const q = search ? search.value.toLowerCase() : "";

    const activeTags = tagCheckboxes
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    cards.forEach(card => {
      const matchDisplay = d === "all" || card.dataset.display === d;
      const matchType = t === "all" || card.dataset.type === t;
      const matchLayout = l === "all" || card.dataset.layout === l;
      const matchSearch = q === "" || card.innerText.toLowerCase().includes(q);

      const cardTags = (card.dataset.tags || "").split(",").filter(Boolean);
      const matchTags =
        activeTags.length === 0 ||
        activeTags.every(tag => cardTags.includes(tag));

      card.style.display =
        matchDisplay && matchType && matchLayout && matchSearch && matchTags
          ? ""
          : "none";
    });
  }

  if (display) display.onchange = applyFilters;
  if (type) type.onchange = applyFilters;
  if (layout) layout.onchange = applyFilters;
  if (search) search.oninput = applyFilters;
  tagCheckboxes.forEach(cb => (cb.onchange = applyFilters));

  /* --- ÖSSZEHASONLÍTÁS --- */
  const selectA = document.getElementById("compare-a");
  const selectB = document.getElementById("compare-b");
  const panelA = document.getElementById("compare-panel-a");
  const panelB = document.getElementById("compare-panel-b");

  const dataMap = {};
  cards.forEach(card => {
    const id = card.getAttribute("id");
  });

  // A Jekyll adatokat a DOM-ból olvassuk ki a kártyák alapján
  const cardData = {};
  cards.forEach(card => {
    const id = card.getAttribute("data-id");
    if (!id) return;
    cardData[id] = {
      name: card.querySelector("h3")?.innerText || "",
      meta: card.querySelector(".meta")?.innerText || "",
      features: card.querySelector(".features")?.innerText || "",
      link: card.querySelector(".link")?.getAttribute("href") || "#"
    };
  });

  function renderCompare(panel, id) {
    if (!panel) return;
    if (!id || !cardData[id]) {
      panel.classList.add("empty");
      panel.innerHTML = `<span class="placeholder">Válassz egy elemet</span>`;
      return;
    }
    const item = cardData[id];
    panel.classList.remove("empty");
    panel.innerHTML = `
      <h3>${item.name}</h3>
      <p class="meta">${item.meta}</p>
      <p class="features">${item.features}</p>
      <a href="${item.link}" target="_blank" class="link">Részletek</a>
    `;
  }

  if (selectA) {
    selectA.onchange = () => renderCompare(panelA, selectA.value);
  }
  if (selectB) {
    selectB.onchange = () => renderCompare(panelB, selectB.value);
  }
});

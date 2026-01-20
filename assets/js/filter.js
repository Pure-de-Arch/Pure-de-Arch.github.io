document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------
     ALAP SZŰRŐK
  ----------------------------- */

  const display = document.getElementById("filter-display");
  const type = document.getElementById("filter-type");
  const layout = document.getElementById("filter-layout");
  const search = document.getElementById("search");
  const tagContainer = document.getElementById("tag-filters");
  const cards = [...document.querySelectorAll(".card")];

  /* TAG LISTA */
  const allTags = new Set();
  cards.forEach(card => {
    const tags = (card.dataset.tags || "").split(",").filter(Boolean);
    tags.forEach(t => allTags.add(t.trim()));
  });

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

  const tagCheckboxes = [...document.querySelectorAll(".tag-checkbox")];

  /* SZŰRÉS */
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

  display.onchange = applyFilters;
  type.onchange = applyFilters;
  layout.onchange = applyFilters;
  search.oninput = applyFilters;
  tagCheckboxes.forEach(cb => cb.onchange = applyFilters);

  /* -----------------------------
     ÖSSZEHASONLÍTÁS + DIAGRAMOK
  ----------------------------- */

  const selectA = document.getElementById("compare-a");
  const selectB = document.getElementById("compare-b");

  const cardData = {};

  cards.forEach(card => {
    const id = card.dataset.id;
    cardData[id] = {
      name: card.querySelector("h3").innerText,
      meta: card.querySelector(".meta").innerText,
      features: card.querySelector(".features").innerText,
      tags: (card.dataset.tags || "").split(","),
      layout: card.dataset.layout,
      display: card.dataset.display,
      type: card.dataset.type,
      resources: card.dataset.resources || "Medium"
    };
  });

  /* --- DIAGRAMOK --- */

  const ctxResources = document.getElementById("chart-resources");
  const ctxLayout = document.getElementById("chart-layout");
  const ctxTags = document.getElementById("chart-tags");

  let chartResources, chartLayout, chartTags;

  function updateCharts() {
    const idA = selectA.value;
    const idB = selectB.value;

    if (!idA || !idB) return;

    const A = cardData[idA];
    const B = cardData[idB];

    /* RESOURCE DIAGRAM */
    const resourceMap = { Low: 1, Medium: 2, High: 3 };

    if (chartResources) chartResources.destroy();
    chartResources = new Chart(ctxResources, {
      type: "bar",
      data: {
        labels: [A.name, B.name],
        datasets: [{
          label: "Erőforrás igény",
          data: [resourceMap[A.resources], resourceMap[B.resources]],
          backgroundColor: ["#4da3ff88", "#7bc0ff88"],
          borderColor: ["#4da3ff", "#7bc0ff"],
          borderWidth: 2
        }]
      },
      options: { responsive: true }
    });

    /* LAYOUT DIAGRAM */
    const layoutMap = { Tiling: 1, Stacking: 2, Dynamic: 3 };

    if (chartLayout) chartLayout.destroy();
    chartLayout = new Chart(ctxLayout, {
      type: "radar",
      data: {
        labels: ["Tiling", "Stacking", "Dynamic"],
        datasets: [
          {
            label: A.name,
            data: [
              A.layout === "Tiling" ? 1 : 0,
              A.layout === "Stacking" ? 1 : 0,
              A.layout === "Dynamic" ? 1 : 0
            ],
            backgroundColor: "#4da3ff33",
            borderColor: "#4da3ff"
          },
          {
            label: B.name,
            data: [
              B.layout === "Tiling" ? 1 : 0,
              B.layout === "Stacking" ? 1 : 0,
              B.layout === "Dynamic" ? 1 : 0
            ],
            backgroundColor: "#7bc0ff33",
            borderColor: "#7bc0ff"
          }
        ]
      },
      options: { responsive: true }
    });

    /* TAG DIAGRAM */
    const all = [...new Set([...A.tags, ...B.tags])];

    if (chartTags) chartTags.destroy();
    chartTags = new Chart(ctxTags, {
      type: "bar",
      data: {
        labels: all,
        datasets: [
          {
            label: A.name,
            data: all.map(t => A.tags.includes(t) ? 1 : 0),
            backgroundColor: "#4da3ff88"
          },
          {
            label: B.name,
            data: all.map(t => B.tags.includes(t) ? 1 : 0),
            backgroundColor: "#7bc0ff88"
          }
        ]
      },
      options: { responsive: true }
    });
  }

  selectA.onchange = updateCharts;
  selectB.onchange = updateCharts;

});

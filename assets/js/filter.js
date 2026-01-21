document.addEventListener("DOMContentLoaded", () => {

  // Elems
  const display = document.getElementById("filter-display");
  const type = document.getElementById("filter-type");
  const layout = document.getElementById("filter-layout");
  const search = document.getElementById("search");
  const tagContainer = document.getElementById("tag-filters");
  const cards = [...document.querySelectorAll(".card")];

  // Build tag set
  const allTags = new Set();
  cards.forEach(card => {
    const tags = (card.dataset.tags || "").split(",").map(t => t.trim()).filter(Boolean);
    tags.forEach(t => allTags.add(t));
  });

  // Render tag checkboxes
  if (tagContainer) {
    const frag = document.createDocumentFragment();
    Array.from(allTags).sort().forEach(tag => {
      const label = document.createElement("label");
      label.className = "tag-option";
      label.innerHTML = `<input type="checkbox" value="${tag}" class="tag-checkbox"> <span>${tag}</span>`;
      frag.appendChild(label);
    });
    tagContainer.appendChild(frag);
  }

  // Query checkboxes
  let tagCheckboxes = [...document.querySelectorAll(".tag-checkbox")];

  // Apply filters
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

  // Events
  if (display) display.addEventListener("change", applyFilters);
  if (type) type.addEventListener("change", applyFilters);
  if (layout) layout.addEventListener("change", applyFilters);
  if (search) search.addEventListener("input", applyFilters);
  tagCheckboxes.forEach(cb => cb.addEventListener("change", applyFilters));

  // Initial
  applyFilters();

  // Prepare compare data
  const selectA = document.getElementById("compare-a");
  const selectB = document.getElementById("compare-b");
  const ctxResources = document.getElementById("chart-resources");
  const ctxLayout = document.getElementById("chart-layout");
  const ctxTags = document.getElementById("chart-tags");
  const statsList = document.getElementById("compare-stats");

  const cardData = {};
  cards.forEach(card => {
    const id = card.dataset.id;
    cardData[id] = {
      id,
      name: card.querySelector("h3")?.innerText || id,
      meta: card.querySelector(".meta")?.innerText || "",
      features: card.querySelector(".features")?.innerText || "",
      tags: (card.dataset.tags || "").split(",").map(s => s.trim()).filter(Boolean),
      layout: card.dataset.layout || "",
      display: card.dataset.display || "",
      type: card.dataset.type || "",
      resources: card.dataset.resources || "Medium",
      link: card.querySelector(".link")?.href || "#"
    };
  });

  // Chart instances
  let chartResources = null;
  let chartLayout = null;
  let chartTags = null;

  function destroyIfExists(c) { if (c && typeof c.destroy === "function") c.destroy(); }

  function updateStats(A, B) {
    if (!statsList) return;
    statsList.innerHTML = "";
    if (!A || !B) {
      statsList.innerHTML = "<li>Válassz két elemet a részletes statisztikákhoz</li>";
      return;
    }

    // Quick comparisons
    const sameLayout = A.layout === B.layout;
    const sameDisplay = A.display === B.display;
    const sharedTags = A.tags.filter(t => B.tags.includes(t));
    const uniqueA = A.tags.filter(t => !B.tags.includes(t));
    const uniqueB = B.tags.filter(t => !A.tags.includes(t));

    const li = (html) => {
      const el = document.createElement("li");
      el.innerHTML = html;
      statsList.appendChild(el);
    };

    li(`<strong>${A.name}</strong> vs <strong>${B.name}</strong>`);
    li(`Közös layout: ${sameLayout ? "igen" : "nem"} (${A.layout} / ${B.layout})`);
    li(`Közös display server: ${sameDisplay ? "igen" : "nem"} (${A.display} / ${B.display})`);
    li(`Közös tagek: ${sharedTags.length > 0 ? sharedTags.join(", ") : "nincs közös tag"}`);
    li(`Egyedi tagek ${A.name}: ${uniqueA.length > 0 ? uniqueA.join(", ") : "nincs"}`);
    li(`Egyedi tagek ${B.name}: ${uniqueB.length > 0 ? uniqueB.join(", ") : "nincs"}`);
    li(`Erőforrások: ${A.resources} vs ${B.resources}`);
  }

  function updateCharts() {
    const idA = selectA.value;
    const idB = selectB.value;

    if (!idA || !idB) {
      destroyIfExists(chartResources); destroyIfExists(chartLayout); destroyIfExists(chartTags);
      updateStats(null, null);
      return;
    }

    const A = cardData[idA];
    const B = cardData[idB];
    if (!A || !B) return;

    // Resources mapping
    const resourceMap = { "Very Low": 0.5, "Very Low": 0.5, "Very Low": 0.5, "Low": 1, "Medium": 2, "High": 3, "Very High": 4 };
    const valA = resourceMap[A.resources] || 2;
    const valB = resourceMap[B.resources] || 2;

    // Resources bar
    destroyIfExists(chartResources);
    chartResources = new Chart(ctxResources, {
      type: "bar",
      data: {
        labels: [A.name, B.name],
        datasets: [{
          label: "Erőforrás igény (relatív)",
          data: [valA, valB],
          backgroundColor: ["#4da3ff88", "#7bc0ff88"],
          borderColor: ["#4da3ff", "#7bc0ff"],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });

    // Layout radar
    destroyIfExists(chartLayout);
    chartLayout = new Chart(ctxLayout, {
      type: "radar",
      data: {
        labels: ["Tiling", "Stacking", "Dynamic"],
        datasets: [
          {
            label: A.name,
            data: [A.layout === "Tiling" ? 1 : 0, A.layout === "Stacking" ? 1 : 0, A.layout === "Dynamic" ? 1 : 0],
            backgroundColor: "#4da3ff33",
            borderColor: "#4da3ff",
            pointBackgroundColor: "#4da3ff"
          },
          {
            label: B.name,
            data: [B.layout === "Tiling" ? 1 : 0, B.layout === "Stacking" ? 1 : 0, B.layout === "Dynamic" ? 1 : 0],
            backgroundColor: "#7bc0ff33",
            borderColor: "#7bc0ff",
            pointBackgroundColor: "#7bc0ff"
          }
        ]
      },
      options: { responsive: true, scales: { r: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });

    // Tags bar
    const all = Array.from(new Set([...A.tags, ...B.tags]));
    destroyIfExists(chartTags);
    chartTags = new Chart(ctxTags, {
      type: "bar",
      data: {
        labels: all,
        datasets: [
          { label: A.name, data: all.map(t => A.tags.includes(t) ? 1 : 0), backgroundColor: "#4da3ff88" },
          { label: B.name, data: all.map(t => B.tags.includes(t) ? 1 : 0), backgroundColor: "#7bc0ff88" }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });

    // Update textual stats
    updateStats(A, B);
  }

  if (selectA) selectA.addEventListener("change", updateCharts);
  if (selectB) selectB.addEventListener("change", updateCharts);

});

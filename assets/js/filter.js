/**
 * assets/js/filter.js
 * Pure‑DE‑Arch — filters, tag toggles, compare + Chart.js charts & stats
 */

document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------
     DOM elemek
  ------------------------- */
  const displayEl = document.getElementById("filter-display");
  const typeEl = document.getElementById("filter-type");
  const layoutEl = document.getElementById("filter-layout");
  const searchEl = document.getElementById("search");
  const tagContainer = document.getElementById("tag-filters");
  const cardsContainer = document.getElementById("cards");
  const cards = Array.from(document.querySelectorAll(".card"));

  /* Compare elements */
  const selectA = document.getElementById("compare-a");
  const selectB = document.getElementById("compare-b");
  const ctxResources = document.getElementById("chart-resources");
  const ctxLayout = document.getElementById("chart-layout");
  const ctxTags = document.getElementById("chart-tags");
  const statsList = document.getElementById("compare-stats");

  /* Safety: if no cards, nothing to do */
  if (!cards.length) return;

  /* -------------------------
     TAGS: gyűjtés és render
  ------------------------- */
  const allTags = new Set();
  cards.forEach(card => {
    const raw = card.dataset.tags || "";
    raw.split(",").map(t => t.trim()).filter(Boolean).forEach(t => allTags.add(t));
  });

  // Render tag toggles (label > [name][input.checkbox][span.switch])
  if (tagContainer) {
    const fragment = document.createDocumentFragment();
    Array.from(allTags).sort().forEach(tag => {
      const label = document.createElement("label");
      label.className = "tag-option";

      const nameSpan = document.createElement("span");
      nameSpan.textContent = tag;
      nameSpan.className = "tag-name";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = tag;
      input.className = "tag-checkbox";
      input.id = `tag-${cssSafeId(tag)}`;
      input.setAttribute("aria-label", `Tag: ${tag}`);

      const switchSpan = document.createElement("span");
      switchSpan.className = "tag-switch";

      // Structure: [nameSpan][input(hidden)][switchSpan]
      label.appendChild(nameSpan);
      label.appendChild(input);
      label.appendChild(switchSpan);

      fragment.appendChild(label);
    });
    tagContainer.appendChild(fragment);
  }

  // Helper to create safe id from tag
  function cssSafeId(s) {
    return s.toLowerCase().replace(/[^a-z0-9\-_]/g, "-");
  }

  // Query checkboxes after render
  let tagCheckboxes = Array.from(document.querySelectorAll(".tag-checkbox"));

  /* -------------------------
     FILTER LOGIC
  ------------------------- */
  function applyFilters() {
    const displayVal = displayEl ? displayEl.value : "all";
    const typeVal = typeEl ? typeEl.value : "all";
    const layoutVal = layoutEl ? layoutEl.value : "all";
    const q = searchEl ? searchEl.value.trim().toLowerCase() : "";

    const activeTags = tagCheckboxes.filter(cb => cb.checked).map(cb => cb.value);

    cards.forEach(card => {
      const cardDisplay = card.dataset.display || "";
      const cardType = card.dataset.type || "";
      const cardLayout = card.dataset.layout || "";
      const cardText = card.innerText.toLowerCase();

      const matchDisplay = displayVal === "all" || cardDisplay === displayVal;
      const matchType = typeVal === "all" || cardType === typeVal;
      const matchLayout = layoutVal === "all" || cardLayout === layoutVal;
      const matchSearch = q === "" || cardText.includes(q);

      const cardTags = (card.dataset.tags || "").split(",").map(s => s.trim()).filter(Boolean);
      const matchTags = activeTags.length === 0 || activeTags.every(t => cardTags.includes(t));

      card.style.display = (matchDisplay && matchType && matchLayout && matchSearch && matchTags) ? "" : "none";
    });
  }

  // Attach filter events
  if (displayEl) displayEl.addEventListener("change", applyFilters);
  if (typeEl) typeEl.addEventListener("change", applyFilters);
  if (layoutEl) layoutEl.addEventListener("change", applyFilters);
  if (searchEl) searchEl.addEventListener("input", applyFilters);
  tagCheckboxes.forEach(cb => cb.addEventListener("change", applyFilters));

  // Initial filter pass
  applyFilters();

  /* -------------------------
     COMPARE DATA PREP
  ------------------------- */
  const cardData = {};
  cards.forEach(card => {
    const id = card.dataset.id || card.id || null;
    if (!id) return;
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

  /* -------------------------
     CHARTS: helpers + instances
  ------------------------- */
  let chartResources = null;
  let chartLayout = null;
  let chartTags = null;

  function destroyChart(c) { if (c && typeof c.destroy === "function") c.destroy(); }

  // Map resource labels to numeric scale
  const resourceMap = {
    "very low": 0.5, "very-low": 0.5, "very_low": 0.5,
    "low": 1, "medium": 2, "high": 3, "very high": 4, "very-high": 4
  };

  /* -------------------------
     UPDATE STATS (textual)
  ------------------------- */
  function updateStats(A, B) {
    if (!statsList) return;
    statsList.innerHTML = "";

    if (!A || !B) {
      const li = document.createElement("li");
      li.textContent = "Válassz két elemet a részletes statisztikákhoz";
      statsList.appendChild(li);
      return;
    }

    const sameLayout = A.layout === B.layout;
    const sameDisplay = A.display === B.display;
    const sharedTags = A.tags.filter(t => B.tags.includes(t));
    const uniqueA = A.tags.filter(t => !B.tags.includes(t));
    const uniqueB = B.tags.filter(t => !A.tags.includes(t));

    const add = (html) => {
      const li = document.createElement("li");
      li.innerHTML = html;
      statsList.appendChild(li);
    };

    add(`<strong>${escapeHtml(A.name)}</strong> vs <strong>${escapeHtml(B.name)}</strong>`);
    add(`Layout egyezés: <strong>${sameLayout ? "igen" : "nem"}</strong> (${escapeHtml(A.layout)} / ${escapeHtml(B.layout)})`);
    add(`Display server egyezés: <strong>${sameDisplay ? "igen" : "nem"}</strong> (${escapeHtml(A.display)} / ${escapeHtml(B.display)})`);
    add(`Közös tagek: <strong>${sharedTags.length ? escapeHtml(sharedTags.join(", ")) : "nincs"}</strong>`);
    add(`${escapeHtml(A.name)} egyedi tagek: <strong>${uniqueA.length ? escapeHtml(uniqueA.join(", ")) : "nincs"}</strong>`);
    add(`${escapeHtml(B.name)} egyedi tagek: <strong>${uniqueB.length ? escapeHtml(uniqueB.join(", ")) : "nincs"}</strong>`);
    add(`Erőforrás igény: <strong>${escapeHtml(A.resources)}</strong> vs <strong>${escapeHtml(B.resources)}</strong>`);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  /* -------------------------
     UPDATE CHARTS
  ------------------------- */
  function updateCharts() {
    if (!selectA || !selectB) return;

    const idA = selectA.value;
    const idB = selectB.value;

    if (!idA || !idB) {
      destroyChart(chartResources); destroyChart(chartLayout); destroyChart(chartTags);
      updateStats(null, null);
      return;
    }

    const A = cardData[idA];
    const B = cardData[idB];
    if (!A || !B) return;

    // Resources chart (bar)
    const valA = resourceMap[(A.resources || "").toLowerCase()] || 2;
    const valB = resourceMap[(B.resources || "").toLowerCase()] || 2;

    destroyChart(chartResources);
    if (ctxResources && window.Chart) {
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
    }

    // Layout chart (radar)
    destroyChart(chartLayout);
    if (ctxLayout && window.Chart) {
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

        const compareToggle = document.getElementById("compare-toggle");
const compareSection = document.getElementById("compare");

if (compareToggle && compareSection) {
  compareToggle.addEventListener("click", (e) => {
    e.preventDefault();
    compareSection.hidden = false;
    compareSection.scrollIntoView({ behavior: "smooth" });
  });
}


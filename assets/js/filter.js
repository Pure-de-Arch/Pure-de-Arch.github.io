document.addEventListener("DOMContentLoaded", () => {
  const displayEl = document.getElementById("filter-display");
  const typeEl = document.getElementById("filter-type");
  const layoutEl = document.getElementById("filter-layout");
  const searchEl = document.getElementById("search");
  const tagContainer = document.getElementById("tag-filters");
  const cards = Array.from(document.querySelectorAll(".card"));

  const comparePanel = document.getElementById("compare-panel");
  const etcherPanel = document.getElementById("etcher-panel");
  const compareToggle = document.getElementById("compare-toggle");
  const etcherToggle = document.getElementById("etcher-toggle");
  const closeButtons = Array.from(document.querySelectorAll(".panel-close"));

  const selectA = document.getElementById("compare-a");
  const selectB = document.getElementById("compare-b");
  const statsList = document.getElementById("compare-stats");
  const ctxResources = document.getElementById("chart-resources");
  const ctxLayout = document.getElementById("chart-layout");

  if (!cards.length) return;

  /* TAGS */

  const allTags = new Set();
  cards.forEach(card => {
    (card.dataset.tags || "")
      .split(",")
      .map(t => t.trim())
      .filter(Boolean)
      .forEach(t => allTags.add(t));
  });

  if (tagContainer) {
    const frag = document.createDocumentFragment();
    Array.from(allTags).sort().forEach(tag => {
      const label = document.createElement("label");
      label.className = "tag-option";

      const nameSpan = document.createElement("span");
      nameSpan.className = "tag-name";
      nameSpan.textContent = tag;

      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = tag;
      input.className = "tag-checkbox";
      input.id = `tag-${tag.toLowerCase().replace(/[^a-z0-9\-]/g,"-")}`;

      const switchSpan = document.createElement("span");
      switchSpan.className = "tag-switch";

      label.appendChild(nameSpan);
      label.appendChild(input);
      label.appendChild(switchSpan);

      frag.appendChild(label);
    });
    tagContainer.appendChild(frag);
  }

  let tagCheckboxes = Array.from(document.querySelectorAll(".tag-checkbox"));

  /* FILTERS */

  function applyFilters() {
    const displayVal = displayEl ? displayEl.value : "all";
    const typeVal = typeEl ? typeEl.value : "all";
    const layoutVal = layoutEl ? layoutEl.value : "all";
    const q = (searchEl ? searchEl.value : "").toLowerCase().trim();

    const activeTags = tagCheckboxes.filter(cb => cb.checked).map(cb => cb.value);

    cards.forEach(card => {
      const cd = card.dataset.display || "";
      const ct = card.dataset.type || "";
      const cl = card.dataset.layout || "";
      const text = card.innerText.toLowerCase();

      const matchDisplay = displayVal === "all" || cd === displayVal;
      const matchType = typeVal === "all" || ct === typeVal;
      const matchLayout = layoutVal === "all" || cl === layoutVal;
      const matchSearch = !q || text.includes(q);

      const cardTags = (card.dataset.tags || "").split(",").map(s => s.trim()).filter(Boolean);
      const matchTags = activeTags.length === 0 || activeTags.every(t => cardTags.includes(t));

      card.style.display = (matchDisplay && matchType && matchLayout && matchSearch && matchTags) ? "" : "none";
    });
  }

  if (displayEl) displayEl.addEventListener("change", applyFilters);
  if (typeEl) typeEl.addEventListener("change", applyFilters);
  if (layoutEl) layoutEl.addEventListener("change", applyFilters);
  if (searchEl) searchEl.addEventListener("input", applyFilters);
  tagCheckboxes.forEach(cb => cb.addEventListener("change", applyFilters));

  applyFilters();

  /* PANELS TOGGLE */

  function openPanel(panel) {
    if (!panel) return;
    panel.hidden = false;
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closePanel(panel) {
    if (!panel) return;
    panel.hidden = true;
  }

  if (compareToggle && comparePanel) {
    compareToggle.addEventListener("click", () => openPanel(comparePanel));
  }
  if (etcherToggle && etcherPanel) {
    etcherToggle.addEventListener("click", () => openPanel(etcherPanel));
  }

  closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const panel = document.getElementById(targetId);
      closePanel(panel);
    });
  });

  /* COMPARE DATA */

  const cardData = {};
  cards.forEach(card => {
    const id = card.dataset.id;
    if (!id) return;
    cardData[id] = {
      id,
      name: card.querySelector("h3")?.innerText || id,
      type: card.dataset.type || "",
      display: card.dataset.display || "",
      layout: card.dataset.layout || "",
      ram: parseFloat(card.dataset.ram || "0"),
      cpu: parseFloat(card.dataset.cpu || "0"),
      disk: parseFloat(card.dataset.disk || "0"),
      tags: (card.dataset.tags || "").split(",").map(s => s.trim()).filter(Boolean)
    };
  });

  let chartResources = null;
  let chartLayout = null;

  function destroyChart(c) {
    if (c && typeof c.destroy === "function") c.destroy();
  }

  function updateStats(A, B) {
    if (!statsList) return;
    statsList.innerHTML = "";

    if (!A || !B) {
      const li = document.createElement("li");
      li.textContent = "Válassz ki két elemet az összehasonlításhoz.";
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

    add(`<strong>${A.name}</strong> vs <strong>${B.name}</strong>`);
    add(`Layout: ${A.layout} / ${B.layout} (${sameLayout ? "azonos" : "eltérő"})`);
    add(`Display: ${A.display} / ${B.display} (${sameDisplay ? "azonos" : "eltérő"})`);
    add(`Közös tagek: ${sharedTags.length ? sharedTags.join(", ") : "nincs"}`);
    add(`Egyedi tagek (A): ${uniqueA.length ? uniqueA.join(", ") : "nincs"}`);
    add(`Egyedi tagek (B): ${uniqueB.length ? uniqueB.join(", ") : "nincs"}`);
    add(`RAM: ${A.ram} MB vs ${B.ram} MB`);
    add(`CPU: ${A.cpu}% vs ${B.cpu}%`);
    add(`Disk: ${A.disk} MB vs ${B.disk} MB`);
  }

  function updateCharts() {
    if (!selectA || !selectB) return;

    const idA = selectA.value;
    const idB = selectB.value;

    const A = cardData[idA];
    const B = cardData[idB];

    destroyChart(chartResources);
    destroyChart(chartLayout);

    if (!A || !B) {
      updateStats(null, null);
      return;
    }

    if (ctxResources && window.Chart) {
      chartResources = new Chart(ctxResources, {
        type: "bar",
        data: {
          labels: ["RAM (MB)", "CPU (%)", "Disk (MB)"],
          datasets: [
            {
              label: A.name,
              data: [A.ram, A.cpu, A.disk],
              backgroundColor: "rgba(99,102,241,0.6)",
              borderColor: "rgba(129,140,248,1)",
              borderWidth: 1
            },
            {
              label: B.name,
              data: [B.ram, B.cpu, B.disk],
              backgroundColor: "rgba(56,189,248,0.6)",
              borderColor: "rgba(56,189,248,1)",
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" } },
          scales: { y: { beginAtZero: true } }
        }
      });
    }

    if (ctxLayout && window.Chart) {
      chartLayout = new Chart(ctxLayout, {
        type: "radar",
        data: {
          labels: ["Tiling", "Stacking", "Dynamic", "Wayland", "X11"],
          datasets: [
            {
              label: A.name,
              data: [
                A.layout === "Tiling" ? 1 : 0,
                A.layout === "Stacking" ? 1 : 0,
                A.layout === "Dynamic" ? 1 : 0,
                A.display === "Wayland" ? 1 : 0,
                A.display === "X11" ? 1 : 0
              ],
              backgroundColor: "rgba(99,102,241,0.25)",
              borderColor: "rgba(129,140,248,1)",
              pointBackgroundColor: "rgba(129,140,248,1)"
            },
            {
              label: B.name,
              data: [
                B.layout === "Tiling" ? 1 : 0,
                B.layout === "Stacking" ? 1 : 0,
                B.layout === "Dynamic" ? 1 : 0,
                B.display === "Wayland" ? 1 : 0,
                B.display === "X11" ? 1 : 0
              ],
              backgroundColor: "rgba(56,189,248,0.25)",
              borderColor: "rgba(56,189,248,1)",
              pointBackgroundColor: "rgba(56,189,248,1)"
            }
          ]
        },
        options: {
          responsive: true,
          scales: { r: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
      });
    }

    updateStats(A, B);
  }

  if (selectA) selectA.addEventListener("change", updateCharts);
  if (selectB) selectB.addEventListener("change", updateCharts);
});

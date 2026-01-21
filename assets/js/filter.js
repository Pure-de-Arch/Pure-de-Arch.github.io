document.addEventListener("DOMContentLoaded", () => {
  const searchEl = document.getElementById("search");
  const cardsContainer = document.getElementById("cards");
  let cards = Array.from(document.querySelectorAll(".card"));

  const chipGroups = document.querySelectorAll(".chip-row");
  const tagContainer = document.getElementById("tag-filters");

  const btnGuide = document.getElementById("btn-guide");
  const btnCompare = document.getElementById("btn-compare");
  const btnToggleFilters = document.getElementById("btn-toggle-filters");
  const sidebarFilters = document.getElementById("sidebar-filters");

  const panelCompare = document.getElementById("panel-compare");
  const panelGuide = document.getElementById("panel-guide");
  const overlayCloses = document.querySelectorAll(".overlay-close");

  const selectA = document.getElementById("compare-a");
  const selectB = document.getElementById("compare-b");
  const statsList = document.getElementById("compare-stats");
  const ctxResources = document.getElementById("chart-resources");
  const ctxLayout = document.getElementById("chart-layout");

  let chartResources = null;
  let chartLayout = null;

  const norm = s => String(s || "").toLowerCase().trim();

  // Build tag bubbles from cards
  const allTags = new Set();
  cards.forEach(card => {
    (card.dataset.tags || "").split(",").map(t => t.trim()).filter(Boolean).forEach(t => allTags.add(t));
  });

  if (tagContainer) {
    tagContainer.innerHTML = "";
    Array.from(allTags).sort().forEach(tag => {
      const btn = document.createElement("button");
      btn.className = "tag-bubble";
      btn.textContent = tag;
      btn.dataset.value = tag;
      tagContainer.appendChild(btn);
    });
  }

  function getActiveFilters() {
    const filters = {
      type: "all",
      display: "all",
      layout: "all",
      resources: "all",
      testable: "all",
      tags: []
    };

    chipGroups.forEach(group => {
      const groupName = group.dataset.filterGroup;
      const active = group.querySelector(".chip-active");
      if (active && groupName && filters.hasOwnProperty(groupName)) {
        filters[groupName] = active.dataset.value || "all";
      }
    });

    const activeTags = Array.from(document.querySelectorAll(".tag-bubble.active")).map(b => b.dataset.value);
    filters.tags = activeTags;

    filters.search = norm(searchEl ? searchEl.value : "");

    return filters;
  }

  function applyFilters() {
    cards = Array.from(document.querySelectorAll(".card"));
    const f = getActiveFilters();

    cards.forEach(card => {
      const type = card.dataset.type || "";
      const display = card.dataset.display || "";
      const layout = card.dataset.layout || "";
      const resources = card.dataset.resources || "";
      const testable = card.dataset.testable || "";
      const tags = (card.dataset.tags || "").split(",").map(t => t.trim()).filter(Boolean);
      const text = norm(card.innerText);

      let ok = true;

      if (f.type !== "all" && type !== f.type) ok = false;
      if (f.display !== "all" && display !== f.display) ok = false;
      if (f.layout !== "all" && layout !== f.layout) ok = false;
      if (f.resources !== "all" && resources !== f.resources) ok = false;
      if (f.testable !== "all" && testable !== f.testable) ok = false;

      if (f.tags.length > 0) {
        const lowerTags = tags.map(t => norm(t));
        const required = f.tags.map(t => norm(t));
        if (!required.every(t => lowerTags.includes(t))) ok = false;
      }

      if (f.search && !text.includes(f.search)) ok = false;

      card.style.display = ok ? "" : "none";
    });
  }

  // Chip click
  chipGroups.forEach(group => {
    group.addEventListener("click", e => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      group.querySelectorAll(".chip").forEach(c => c.classList.remove("chip-active"));
      btn.classList.add("chip-active");
      applyFilters();
    });
  });

  // Tag bubble click
  if (tagContainer) {
    tagContainer.addEventListener("click", e => {
      const btn = e.target.closest(".tag-bubble");
      if (!btn) return;
      btn.classList.toggle("active");
      applyFilters();
    });
  }

  // Search
  if (searchEl) {
    searchEl.addEventListener("input", applyFilters);
  }

  // Sidebar toggle (mobile)
  if (btnToggleFilters && sidebarFilters) {
    btnToggleFilters.addEventListener("click", () => {
      sidebarFilters.classList.toggle("sidebar-open");
    });
  }

  // Overlay helpers
  function openPanel(panel) {
    if (!panel) return;
    panel.classList.add("open");
  }

  function closePanel(panel) {
    if (!panel) return;
    panel.classList.remove("open");
  }

  if (btnGuide) {
    btnGuide.addEventListener("click", () => openPanel(panelGuide));
  }

  if (btnCompare) {
    btnCompare.addEventListener("click", () => openPanel(panelCompare));
  }

  overlayCloses.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.target;
      const panel = document.getElementById(id);
      closePanel(panel);
    });
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closePanel(panelGuide);
      closePanel(panelCompare);
    }
  });

  // Compare data from cards
  const cardData = {};
  cards.forEach(card => {
    const id = card.dataset.id;
    if (!id) return;
    cardData[id] = {
      id,
      name: card.dataset.name || card.querySelector(".card-title")?.innerText || id,
      type: card.dataset.type || "",
      display: card.dataset.display || "",
      layout: card.dataset.layout || "",
      ram: parseFloat(card.dataset.ram || "0"),
      cpu: parseFloat(card.dataset.cpu || "0"),
      disk: parseFloat(card.dataset.disk || "0"),
      tags: (card.dataset.tags || "").split(",").map(t => t.trim()).filter(Boolean)
    };
  });

  function destroyChart(c) {
    if (c && typeof c.destroy === "function") c.destroy();
  }

  function updateCompare() {
    const idA = selectA ? selectA.value : "";
    const idB = selectB ? selectB.value : "";
    const A = cardData[idA] || null;
    const B = cardData[idB] || null;

    if (!statsList) return;

    statsList.innerHTML = "";

    if (!A || !B) {
      const li = document.createElement("li");
      li.textContent = "Válassz ki két elemet az összehasonlításhoz.";
      statsList.appendChild(li);
      destroyChart(chartResources);
      destroyChart(chartLayout);
      return;
    }

    const add = html => {
      const li = document.createElement("li");
      li.innerHTML = html;
      statsList.appendChild(li);
    };

    const shared = A.tags.filter(t => B.tags.includes(t));
    const uniqueA = A.tags.filter(t => !B.tags.includes(t));
    const uniqueB = B.tags.filter(t => !A.tags.includes(t));

    add(`<strong>${A.name}</strong> vs <strong>${B.name}</strong>`);
    add(`Layout: ${A.layout} / ${B.layout}`);
    add(`Display: ${A.display} / ${B.display}`);
    add(`Közös tagek: ${shared.length ? shared.join(", ") : "nincs"}`);
    add(`${A.name} egyedi tagek: ${uniqueA.length ? uniqueA.join(", ") : "nincs"}`);
    add(`${B.name} egyedi tagek: ${uniqueB.length ? uniqueB.join(", ") : "nincs"}`);
    add(`RAM: ${A.ram} MB vs ${B.ram} MB`);
    add(`CPU: ${A.cpu}% vs ${B.cpu}%`);
    add(`Disk: ${A.disk} MB vs ${B.disk} MB`);

    destroyChart(chartResources);
    destroyChart(chartLayout);

    if (window.Chart && ctxResources && ctxLayout) {
      chartResources = new Chart(ctxResources, {
        type: "bar",
        data: {
          labels: ["RAM (MB)", "CPU (%)", "Disk (MB)"],
          datasets: [
            { label: A.name, data: [A.ram, A.cpu, A.disk], backgroundColor: "rgba(59,130,246,0.7)" },
            { label: B.name, data: [B.ram, B.cpu, B.disk], backgroundColor: "rgba(56,189,248,0.7)" }
          ]
        },
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { position: "top" } }
        }
      });

      chartLayout = new Chart(ctxLayout, {
        type: "radar",
        data: {
          labels: ["Tiling", "Stacking", "Dynamic", "Manual", "Wayland", "X11"],
          datasets: [
            {
              label: A.name,
              data: [
                A.layout === "Tiling" ? 1 : 0,
                A.layout === "Stacking" ? 1 : 0,
                A.layout === "Dynamic" ? 1 : 0,
                A.layout === "Manual" ? 1 : 0,
                A.display.includes("Wayland") ? 1 : 0,
                A.display.includes("X11") ? 1 : 0
              ],
              backgroundColor: "rgba(59,130,246,0.25)",
              borderColor: "rgba(59,130,246,1)"
            },
            {
              label: B.name,
              data: [
                B.layout === "Tiling" ? 1 : 0,
                B.layout === "Stacking" ? 1 : 0,
                B.layout === "Dynamic" ? 1 : 0,
                B.layout === "Manual" ? 1 : 0,
                B.display.includes("Wayland") ? 1 : 0,
                B.display.includes("X11") ? 1 : 0
              ],
              backgroundColor: "rgba(56,189,248,0.25)",
              borderColor: "rgba(56,189,248,1)"
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            r: {
              beginAtZero: true,
              ticks: { stepSize: 1 }
            }
          }
        }
      });
    }
  }

  if (selectA) selectA.addEventListener("change", updateCompare);
  if (selectB) selectB.addEventListener("change", updateCompare);

  applyFilters();
});

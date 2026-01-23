// Normalizáló maximumok (igény szerint állítható)
const MAX_CPU = 25;    // %
const MAX_RAM = 3000;  // MB
const MAX_HDD = 3500;  // MB

function normalize(value, max) {
  const ratio = Math.min(value / max, 1);
  return (ratio * 100).toFixed(0) + "%";
}

document.addEventListener("DOMContentLoaded", () => {
  const data = window.DEWM_DATA || [];

  const activeFilters = {
    type: [],
    toolkit: [],
    tags: []
  };

  function updateFilter(filterName, value) {
    const list = activeFilters[filterName];
    const index = list.indexOf(value);

    if (index === -1) list.push(value);
    else list.splice(index, 1);
  }

  function matchesBubbleFilters(item) {
    // type
    if (activeFilters.type.length > 0 &&
        !activeFilters.type.includes(item.type)) return false;

    // toolkit
    if (activeFilters.toolkit.length > 0 &&
        !activeFilters.toolkit.includes(item.toolkit)) return false;

    // tags (legalább egy egyezés kell)
    if (activeFilters.tags.length > 0) {
      const hasTag = (item.tags || []).some(t => activeFilters.tags.includes(t));
      if (!hasTag) return false;
    }

    return true;
  }

  function renderCards() {
    const container = document.getElementById("cards");
    container.innerHTML = "";

    const filtered = data.filter(matchesBubbleFilters);

    if (!filtered.length) {
      container.innerHTML = "<p>Nincs találat a megadott szűrőkkel.</p>";
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement("article");
      card.className = "card";

      const cpuWidth = normalize(item.cpu, MAX_CPU);
      const ramWidth = normalize(item.ram, MAX_RAM);
      const hddWidth = normalize(item.hdd, MAX_HDD);

      card.innerHTML = `
        <div class="card-header">
          <div class="card-title">${item.name}</div>
          <div class="card-pill">${item.type}</div>
        </div>
        <div class="card-meta">
          Toolkit: <strong>${item.toolkit}</strong> &nbsp;•&nbsp;
          CPU: ${item.cpu}% &nbsp;•&nbsp;
          RAM: ${item.ram} MB &nbsp;•&nbsp;
          HDD: ${item.hdd} MB
        </div>
        <div class="tags">
          ${(item.tags || []).map(t => `<span class="tag">${t}</span>`).join("")}
        </div>
        <div class="metrics">
          <div>
            <div class="metric-row">
              <span class="metric-label">CPU</span>
              <span class="metric-value">${item.cpu}%</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill" style="width:${cpuWidth}"></div>
            </div>
          </div>
          <div>
            <div class="metric-row">
              <span class="metric-label">RAM</span>
              <span class="metric-value">${item.ram} MB</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill" style="width:${ramWidth}"></div>
            </div>
          </div>
          <div>
            <div class="metric-row">
              <span class="metric-label">HDD</span>
              <span class="metric-value">${item.hdd} MB</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill" style="width:${hddWidth}"></div>
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  // Buborékok eseménykezelése
  document.querySelectorAll(".bubble").forEach(btn => {
    btn.addEventListener("click", () => {
      const group = btn.closest(".filter-group").dataset.filter;
      const value = btn.dataset.value;

      btn.classList.toggle("active");
      updateFilter(group, value);
      renderCards();
    });
  });

  renderCards();
});

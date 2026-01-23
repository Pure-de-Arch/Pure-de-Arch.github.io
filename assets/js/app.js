// Normalizáló maximumok (igény szerint állítható)
const MAX_CPU = 25;    // %
const MAX_RAM = 3000;  // MB
const MAX_HDD = 3500;  // MB

function normalize(value, max) {
  const ratio = Math.min(value / max, 1);
  return (ratio * 100).toFixed(0) + "%";
}

function matchesFilters(item, filters) {
  if (filters.type && filters.type !== "all" && item.type !== filters.type) {
    return false;
  }
  if (filters.toolkit && filters.toolkit !== "all" && item.toolkit !== filters.toolkit) {
    return false;
  }
  if (filters.maxRam && Number(item.ram) > Number(filters.maxRam)) {
    return false;
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    const haystack = [
      item.name,
      item.type,
      item.toolkit,
      ...(item.tags || [])
    ].join(" ").toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

function renderCards(data, filters) {
  const container = document.getElementById("cards");
  container.innerHTML = "";

  const filtered = data.filter(item => matchesFilters(item, filters));

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

document.addEventListener("DOMContentLoaded", () => {
  const data = window.DEWM_DATA || [];

  const typeSelect = document.getElementById("filter-type");
  const toolkitSelect = document.getElementById("filter-toolkit");
  const maxRamInput = document.getElementById("filter-max-ram");
  const searchInput = document.getElementById("filter-search");

  function currentFilters() {
    return {
      type: typeSelect.value,
      toolkit: toolkitSelect.value,
      maxRam: maxRamInput.value,
      search: searchInput.value.trim()
    };
  }

  [typeSelect, toolkitSelect, maxRamInput, searchInput].forEach(el => {
    el.addEventListener("input", () => renderCards(data, currentFilters()));
  });

  renderCards(data, currentFilters());
});

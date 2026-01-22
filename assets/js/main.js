document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".card"));
  const typeChips = Array.from(document.querySelectorAll(".chip-type"));
  const compChips = Array.from(document.querySelectorAll(".chip-comp"));
  const wayChips = Array.from(document.querySelectorAll(".chip-way"));
  const compareButtons = Array.from(document.querySelectorAll(".compare-toggle"));
  const ctx = document.getElementById("compareChart");
  let selectedIds = new Set();
  let chart = null;

  const state = {
    type: "all",
    compositing: null,
    wayland: null,
  };

  function applyFilters() {
    cards.forEach(card => {
      const type = card.dataset.type;
      const compositing = card.dataset.compositing;
      const wayland = card.dataset.wayland;

      let visible = true;

      if (state.type !== "all" && type !== state.type) visible = false;
      if (state.compositing !== null && compositing !== String(state.compositing)) visible = false;
      if (state.wayland !== null && wayland !== String(state.wayland)) visible = false;

      card.style.display = visible ? "" : "none";
    });
  }

  typeChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const filterType = chip.dataset.filterType;
      typeChips.forEach(c => c.classList.remove("bg-sky-500/80", "text-slate-900"));
      chip.classList.add("bg-sky-500/80", "text-slate-900");
      state.type = filterType;
      applyFilters();
    });
  });

  compChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const filterComp = chip.dataset.filterCompositing;
      compChips.forEach(c => c.classList.remove("bg-sky-500/80", "text-slate-900"));
      chip.classList.add("bg-sky-500/80", "text-slate-900");
      state.compositing = filterComp === "true";
      applyFilters();
    });
  });

  wayChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const filterWay = chip.dataset.filterWayland;
      wayChips.forEach(c => c.classList.remove("bg-sky-500/80", "text-slate-900"));
      chip.classList.add("bg-sky-500/80", "text-slate-900");
      state.wayland = filterWay === "true";
      applyFilters();
    });
  });

  function updateChart() {
    if (!ctx) return;

    const selectedCards = cards.filter(card => selectedIds.has(card.dataset.id));

    const labels = selectedCards.map(card => card.querySelector("h2").textContent);
    const cpu = selectedCards.map(card => Number(card.dataset.cpu));
    const ram = selectedCards.map(card => Number(card.dataset.ram));
    const disk = selectedCards.map(card => Number(card.dataset.disk));

    if (chart) {
      chart.destroy();
    }

    chart = new Chart(ctx, {
      type: "radar",
      data: {
        labels,
        datasets: [
          {
            label: "CPU (relatív)",
            data: cpu,
            borderColor: "#38bdf8",
            backgroundColor: "rgba(56, 189, 248, 0.25)",
          },
          {
            label: "RAM (MB)",
            data: ram,
            borderColor: "#a855f7",
            backgroundColor: "rgba(168, 85, 247, 0.25)",
          },
          {
            label: "Disk (MB)",
            data: disk,
            borderColor: "#f97316",
            backgroundColor: "rgba(249, 115, 22, 0.25)",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          r: {
            angleLines: { color: "rgba(148, 163, 184, 0.4)" },
            grid: { color: "rgba(30, 64, 175, 0.5)" },
            pointLabels: { color: "#e5e7eb" },
            ticks: { display: false },
          },
        },
        plugins: {
          legend: {
            labels: { color: "#e5e7eb" },
          },
        },
      },
    });
  }

  compareButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (selectedIds.has(id)) {
        selectedIds.delete(id);
        btn.textContent = "Hozzáadás az összehasonlításhoz";
        btn.classList.remove("bg-sky-500/80", "text-slate-900", "border-transparent");
      } else {
        selectedIds.add(id);
        btn.textContent = "Eltávolítás az összehasonlításból";
        btn.classList.add("bg-sky-500/80", "text-slate-900", "border-transparent");
      }
      updateChart();
    });
  });

  applyFilters();
  updateChart();
});

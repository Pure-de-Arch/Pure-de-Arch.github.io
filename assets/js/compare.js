let selected = [];
let chartInstance = null;

document.addEventListener("click", e => {
  if (e.target.classList.contains("selectBtn")) {
    const id = e.target.dataset.id;
    if (!selected.includes(id)) selected.push(id);
    updateChart();
  }
});

function updateChart() {
  const items = environments.filter(e => selected.includes(e.id));

  const labels = items.map(i => i.name);
  const cpu = items.map(i => i.cpu);
  const ram = items.map(i => i.ram);
  const hdd = items.map(i => i.hdd);

  const ctx = document.getElementById("compareChart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "CPU", data: cpu, backgroundColor: "#00eaff" },
        { label: "RAM", data: ram, backgroundColor: "#ff4dff" },
        { label: "HDD", data: hdd, backgroundColor: "#7dff4d" }
      ]
    },
    options: {
      plugins: {
        legend: { labels: { color: "#ffffff" } }
      },
      scales: {
        x: { ticks: { color: "#ffffff" } },
        y: { ticks: { color: "#ffffff" } }
      }
    }
  });
}

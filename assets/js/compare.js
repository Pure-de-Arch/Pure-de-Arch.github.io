let selected = [];

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

  new Chart(document.getElementById("compareChart"), {
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
        legend: { labels: { color: "#fff" } }
      },
      scales: {
        x: { ticks: { color: "#fff" } },
        y: { ticks: { color: "#fff" } }
      }
    }
  });
}

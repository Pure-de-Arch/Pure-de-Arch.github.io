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
        { label: "CPU", data: cpu, backgroundColor: "red" },
        { label: "RAM", data: ram, backgroundColor: "blue" },
        { label: "HDD", data: hdd, backgroundColor: "green" }
      ]
    }
  });
}

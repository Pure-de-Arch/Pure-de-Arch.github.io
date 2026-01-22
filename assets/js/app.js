document.addEventListener("DOMContentLoaded", () => {
  const rows = [...document.querySelectorAll(".row")];
  const search = document.getElementById("search");
  const cat = document.getElementById("filter-category");
  const toolkit = document.getElementById("filter-toolkit");
  const wayland = document.getElementById("filter-wayland");
  const reset = document.getElementById("reset");
  const noResults = document.getElementById("no-results");

  function norm(s) {
    return (s || "").toLowerCase();
  }

  function apply() {
    const s = norm(search.value);
    const c = cat.value;
    const t = toolkit.value;
    const w = wayland.value;

    let visible = 0;

    rows.forEach(r => {
      const name = norm(r.dataset.name);
      const notes = norm(r.dataset.notes);

      let ok = true;

      if (s && !`${name} ${notes}`.includes(s)) ok = false;
      if (c && r.dataset.category !== c) ok = false;
      if (t && r.dataset.toolkit !== t) ok = false;
      if (w && r.dataset.wayland !== w) ok = false;

      r.style.display = ok ? "" : "none";
      if (ok) visible++;
    });

    noResults.classList.toggle("hidden", visible !== 0);
  }

  search.addEventListener("input", apply);
  cat.addEventListener("change", apply);
  toolkit.addEventListener("change", apply);
  wayland.addEventListener("change", apply);

  reset.addEventListener("click", () => {
    search.value = "";
    cat.value = "";
    toolkit.value = "";
    wayland.value = "";
    apply();
  });

  apply();
});

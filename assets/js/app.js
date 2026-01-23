(function () {
  const cards = [...document.querySelectorAll(".de-card")];
  const searchInput = document.querySelector('[data-filter="search"]');
  const themeToggleBtn = document.getElementById("theme-toggle");

  // Multi-select filter state
  const multiFilters = {
    category: new Set(),
    layout: new Set(),
    os: new Set(),
    toolkit: new Set(),
    compositor: new Set(),
    target_usage: new Set()
  };

  let searchTerm = "";

  function normalize(v) {
    return (v || "").toLowerCase();
  }

  function applyFilters() {
    cards.forEach((card) => {
      const fields = {
        name: normalize(card.dataset.name),
        category: normalize(card.dataset.category),
        layout: normalize(card.dataset.layout),
        os: normalize(card.dataset.os),
        toolkit: normalize(card.dataset.toolkit),
        compositor: normalize(card.dataset.compositor),
        target_usage: normalize(card.dataset.target_usage),
        tags: normalize(card.dataset.tags)
      };

      let visible = true;

      // Search
      if (searchTerm) {
        const haystack = Object.values(fields).join(" ");
        if (!haystack.includes(searchTerm)) visible = false;
      }

      // Multi-select filters: AND over groups, OR inside group
      for (const key in multiFilters) {
        const active = multiFilters[key];
        if (active.size > 0) {
          let match = false;
          active.forEach((val) => {
            if (fields[key].includes(val)) match = true;
          });
          if (!match) visible = false;
        }
      }

      // Animated show/hide
      if (visible) {
        card.style.display = "";
        requestAnimationFrame(() => {
          card.classList.remove("hidden");
        });
      } else {
        card.classList.add("hidden");
        setTimeout(() => {
          if (card.classList.contains("hidden")) {
            card.style.display = "none";
          }
        }, 200);
      }
    });
  }

  // Search input
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchTerm = normalize(e.target.value);
      applyFilters();
    });
  }

  // Chip filters (multi-select)
  document.querySelectorAll(".filter-chips").forEach((group) => {
    const key = group.dataset.filter;
    if (!multiFilters[key]) return;

    group.addEventListener("click", (e) => {
      const chip = e.target.closest(".filter-chip");
      if (!chip) return;
      const value = normalize(chip.dataset.value);

      if (chip.classList.contains("active")) {
        chip.classList.remove("active");
        multiFilters[key].delete(value);
      } else {
        chip.classList.add("active");
        multiFilters[key].add(value);
      }

      applyFilters();
    });
  });

  // Card flip
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
  });

  // Theme toggle + persistence
  function applyTheme(theme) {
    if (theme === "light") {
      document.body.classList.add("theme-light");
    } else {
      document.body.classList.remove("theme-light");
    }
  }

  const savedTheme = localStorage.getItem("de_theme");
  if (savedTheme) applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isLight = document.body.classList.toggle("theme-light");
      localStorage.setItem("de_theme", isLight ? "light" : "dark");
    });
  }

  // Initial filter pass
  applyFilters();
})();

// Buborékos feature szűrők generálása

const allFeatures = [...new Set(
  environments.flatMap(env => env.features)
)];

const featureContainer = document.getElementById("featureFilters");

allFeatures.forEach(feature => {
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerText = feature;
  bubble.dataset.feature = feature;

  bubble.onclick = () => {
    bubble.classList.toggle("active");
    applyFilters();
  };

  featureContainer.appendChild(bubble);
});

function applyFilters() {
  const activeFeatures = [...document.querySelectorAll(".bubble.active")]
    .map(b => b.dataset.feature);

  const filtered = environments.filter(env =>
    activeFeatures.every(f => env.features.includes(f))
  );

  renderCards(filtered);
}

// Kártyák renderelése

function renderCards(list) {
  const container = document.getElementById("cards");
  container.innerHTML = "";

  list.forEach(env => {
    container.innerHTML += `
      <div class="card">
        <img src="${env.image}" alt="${env.name}">
        <h3>${env.name}</h3>
        <p>${env.description}</p>

        <button class="selectBtn btn" data-id="${env.id}">
          Hozzáadás az összehasonlításhoz
        </button>

        <a href="${env.homepage}" target="_blank" style="display:block;margin-top:10px;color:#00eaff;text-decoration:none;">
          Hivatalos oldal →
        </a>
      </div>
    `;
  });
}

// induláskor minden megjelenik
renderCards(environments);

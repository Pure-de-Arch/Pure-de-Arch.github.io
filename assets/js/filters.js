document.getElementById("applyFilters").onclick = () => {
  const cat = categoryFilter.value;
  const type = typeFilter.value;

  const filtered = environments.filter(env =>
    (cat === "" || env.category === cat) &&
    (type === "" || env.subtype === type)
  );

  renderCards(filtered);
};

function renderCards(list) {
  const container = document.getElementById("cards");
  container.innerHTML = "";

  list.forEach(env => {
    container.innerHTML += `
      <div class="card">
        <img src="${env.image}" class="rounded mb-4">
        <h3 class="text-xl font-bold mb-2">${env.name}</h3>
        <p class="text-gray-300 mb-4">${env.description}</p>

        <button class="selectBtn btn w-full" data-id="${env.id}">
          Hozzáadás az összehasonlításhoz
        </button>

        <a href="${env.homepage}" class="block mt-4 text-blue-300 hover:text-pink-400">
          Hivatalos oldal →
        </a>
      </div>
    `;
  });
}

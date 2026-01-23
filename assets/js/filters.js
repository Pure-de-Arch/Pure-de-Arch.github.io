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
      <div class="bg-gray-800 p-4 rounded shadow">
        <img src="${env.image}" class="rounded mb-4">
        <h3 class="text-xl font-bold mb-2">${env.name}</h3>
        <p class="text-gray-400 mb-4">${env.description}</p>
        <button class="selectBtn bg-green-600 px-4 py-2 rounded w-full" data-id="${env.id}">
          Hozzáadás az összehasonlításhoz
        </button>
        <a href="${env.homepage}" class="block text-blue-400 mt-4">Hivatalos oldal</a>
      </div>
    `;
  });
}

---
layout: home
title: Pure DE Arch
---

<div class="text-center mb-10">
  <p class="text-lg">Keresd meg a számodra ideális Desktop Environment-et vagy Window Manager-t.</p>
  <p class="text-lg">Szűrj jellemzők alapján és hasonlítsd össze az erőforrás-használatot.</p>
</div>

<!-- Filters -->
<div id="filters" class="bg-gray-800 p-4 rounded mb-6">
  <h2 class="text-xl font-bold mb-4">Szűrők</h2>

  <label class="block mb-2">Fő kategória:</label>
  <select id="categoryFilter" class="text-black p-2 rounded w-full mb-4">
    <option value="">Mind</option>
    <option value="wayland">Wayland</option>
    <option value="xorg">Xorg</option>
  </select>

  <label class="block mb-2">Altípus:</label>
  <select id="typeFilter" class="text-black p-2 rounded w-full mb-4">
    <option value="">Mind</option>
    <option value="tiling">Tiling</option>
    <option value="dynamic">Dynamic</option>
    <option value="stacking">Stacking</option>
  </select>

  <button id="applyFilters" class="bg-blue-600 px-4 py-2 rounded">Szűrés</button>
</div>

<!-- Cards -->
<div id="cards" class="grid md:grid-cols-3 gap-6"></div>

<!-- Comparison -->
<div id="comparison" class="mt-10 bg-gray-800 p-4 rounded">
  <h2 class="text-xl font-bold mb-4">Összehasonlítás</h2>
  <canvas id="compareChart" class="w-full h-64"></canvas>
</div>

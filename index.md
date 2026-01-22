---
layout: default
title: "Pure de Arch"
---

<div class="hero">
  <h1>Pure de Arch</h1>
  <p>Fedezd fel a Linux Desktop világát.</p>
  <p>Keresd meg a számodra ideális Desktop Environment-et vagy Window Manager-t. Szűrj jellemzők alapján és hasonlítsd össze az erőforrás-használatot.</p>
  <p class="hero-sub">
    A rendszer Arch Linux alapra épül, és minimális módosítással igyekszik visszaadni a DE vagy WM eredeti megjelenését.
  </p>
</div>

<div class="filters">
  <div class="filter-group">
    <label>Típus</label>
    <button class="chip active" data-filter-type="all">Mind</button>
    <button class="chip" data-filter-type="DE">DE</button>
    <button class="chip" data-filter-type="WM">WM</button>
  </div>

  <div class="filter-group">
    <label>Kompozitálás</label>
    <button class="chip" data-filter-compositing="true">Van</button>
    <button class="chip" data-filter-compositing="false">Nincs</button>
  </div>

  <div class="filter-group">
    <label>Wayland támogatás</label>
    <button class="chip" data-filter-wayland="true">Van</button>
    <button class="chip" data-filter-wayland="false">Nincs</button>
  </div>
</div>

<div class="cards-grid" id="env-cards">
  {% assign all_de = site.data.desktop_environments %}
  {% assign all_wm = site.data.window_managers %}
  {% assign all_env = all_de | concat: all_wm %}

  {% for env in all_env %}
  <div class="card" 
       data-type="{{ env.type }}"
       data-compositing="{{ env.compositing }}"
       data-wayland="{{ env.wayland }}"
       data-cpu="{{ env.cpu }}"
       data-ram="{{ env.ram }}"
       data-disk="{{ env.disk }}"
       data-id="{{ env.id }}">
    <div class="badge badge-{{ env.type | downcase }}">{{ env.type }}</div>
    <h2>{{ env.name }}</h2>
    <p class="card-desc">{{ env.description }}</p>
    <p class="card-meta">
      CPU: {{ env.cpu }} • RAM: {{ env.ram }} MB • Disk: {{ env.disk }} MB
    </p>
    <a href="{{ env.arch_wiki }}" target="_blank" class="wiki-link">Arch Wiki</a>
    <button class="compare-toggle" data-id="{{ env.id }}">Hozzáadás az összehasonlításhoz</button>
  </div>
  {% endfor %}
</div>

<div class="compare-panel">
  <h2>Összehasonlítás</h2>
  <p>Válassz ki több környezetet a kártyákról, és nézd meg az erőforrás-használatot diagramon.</p>
  <canvas id="compareChart"></canvas>
</div>

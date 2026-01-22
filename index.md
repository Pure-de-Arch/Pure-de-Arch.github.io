---
layout: default
title: "Pure de Arch"
---

<div class="bg-slate-900/80 border border-slate-700/70 rounded-3xl p-6 md:p-8 shadow-2xl mb-8
            backdrop-blur-xl relative overflow-hidden">
  <div class="absolute -top-24 -left-24 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl"></div>
  <div class="absolute -top-24 -right-24 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl"></div>

  <div class="relative">
    <h1 class="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-sky-400 via-fuchsia-400 to-orange-400 bg-clip-text text-transparent">
      Pure de Arch
    </h1>
    <p class="mt-3 text-slate-200 text-sm md:text-base">
      Fedezd fel a Linux Desktop világát.
    </p>
    <p class="mt-1 text-slate-300 text-sm md:text-base">
      Keresd meg a számodra ideális Desktop Environment-et vagy Window Manager-t. Szűrj jellemzők alapján és hasonlítsd össze az erőforrás-használatot.
    </p>
    <p class="mt-3 text-slate-400 text-xs md:text-sm max-w-2xl">
      A rendszer Arch Linux alapra épül, és minimális módosítással igyekszik visszaadni a DE vagy WM eredeti megjelenését.
    </p>
  </div>
</div>

<div class="flex flex-wrap gap-3 mb-6">

  <div class="flex items-center gap-2 bg-slate-900/80 border border-slate-700/70 rounded-full px-3 py-2 text-xs md:text-sm backdrop-blur-xl">
    <span class="uppercase tracking-wide text-slate-400 text-[0.65rem] md:text-[0.7rem]">Típus</span>
    <button class="chip-type px-3 py-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-700/80 transition text-xs md:text-sm bg-sky-500/80 text-slate-900"
            data-filter-type="all">
      Mind
    </button>
    <button class="chip-type px-3 py-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-700/80 transition text-xs md:text-sm"
            data-filter-type="DE">
      DE
    </button>
    <button class="chip-type px-3 py-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-700/80 transition text-xs md:text-sm"
            data-filter-type="WM">
      WM
    </button>
  </div>

  <div class="flex items-center gap-2 bg-slate-900/80 border border-slate-700/70 rounded-full px-3 py-2 text-xs md:text-sm backdrop-blur-xl">
    <span class="uppercase tracking-wide text-slate-400 text-[0.65rem] md:text-[0.7rem]">Kompozitálás</span>
    <button class="chip-comp px-3 py-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-700/80 transition text-xs md:text-sm"
            data-filter-compositing="true">
      Van
    </button>
    <button class="chip-comp px-3 py-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-700/80 transition text-xs md:text-sm"
            data-filter-compositing="false">
      Nincs
    </button>
  </div>

  <div class="flex items-center gap-2 bg-slate-900/80 border border-slate-700/70 rounded-full px-3 py-2 text-xs md:text-sm backdrop-blur-xl">
    <span class="uppercase tracking-wide text-slate-400 text-[0.65rem] md:text-[0.7rem]">Wayland</span>
    <button class="chip-way px-3 py-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-700/80 transition text-xs md:text-sm"
            data-filter-wayland="true">
      Van
    </button>
    <button class="chip-way px-3 py-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-700/80 transition text-xs md:text-sm"
            data-filter-wayland="false">
      Nincs
    </button>
  </div>

</div>

<div id="env-cards" class="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
  {% assign all_de = site.de %}
  {% assign all_wm = site.wm %}
  {% assign all_env = all_de | concat: all_wm %}

  {% for env in all_env %}
  <div class="card relative bg-slate-900/80 border border-slate-700/70 rounded-2xl p-4 md:p-5 shadow-xl
              backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl hover:border-sky-500/70"
       data-type="{{ env.type }}"
       data-compositing="{{ env.compositing }}"
       data-wayland="{{ env.wayland }}"
       data-cpu="{{ env.cpu }}"
       data-ram="{{ env.ram }}"
       data-disk="{{ env.disk }}"
       data-id="{{ env.slug }}">

    <div class="absolute top-3 right-3 px-2 py-1 rounded-full text-[0.65rem] uppercase tracking-wide border
                {% if env.type == 'DE' %}
                  border-sky-400/80 text-sky-300
                {% else %}
                  border-rose-400/80 text-rose-300
                {% endif %}
                bg-slate-950/80">
      {{ env.type }}
    </div>

    <h2 class="text-base md:text-lg font-semibold mb-1 pr-16">
      {{ env.name }}
    </h2>
    <p class="text-xs md:text-sm text-slate-300 mb-2">
      {{ env.description }}
    </p>
    <p class="text-[0.7rem] md:text-xs text-slate-400 mb-3">
      CPU: {{ env.cpu }} • RAM: {{ env.ram }} MB • Disk: {{ env.disk }} MB
    </p>

    <div class="flex gap-2 mt-auto">
      <a href="{{ env.url | relative_url }}"
         class="inline-flex items-center px-3 py-1.5 rounded-full text-xs md:text-sm
                bg-slate-800/80 text-sky-300 hover:bg-slate-700/80 transition">
        Részletek →
      </a>
      <button class="compare-toggle flex-1 inline-flex items-center justify-center px-3 py-1.5 rounded-full
                     text-xs md:text-sm border border-slate-600/80 text-slate-200 hover:border-sky-400/80
                     hover:text-white transition"
              data-id="{{ env.slug }}">
        Hozzáadás az összehasonlításhoz
      </button>
    </div>
  </div>
  {% endfor %}
</div>

<div class="bg-slate-900/80 border border-slate-700/70 rounded-3xl p-5 md:p-6 shadow-2xl backdrop-blur-xl">
  <h2 class="text-lg md:text-xl font-semibold mb-2">Összehasonlítás</h2>
  <p class="text-xs md:text-sm text-slate-300 mb-4">
    Válassz ki több környezetet a kártyákról, és nézd meg az erőforrás-használatot diagramon.
  </p>
  <div class="w-full max-w-3xl">
    <canvas id="compareChart" class="w-full"></canvas>
  </div>
</div>

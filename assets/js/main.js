document.addEventListener('DOMContentLoaded',()=>{
  const buttons = document.querySelectorAll('[data-filter]');
  const applied = document.getElementById('applied-filters');
  buttons.forEach(b=>b.addEventListener('click',()=>{
    buttons.forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    applied.textContent = 'Applied: ' + b.dataset.filter;
    applyFilter(b.dataset.filter);
  }));
  document.getElementById('search').addEventListener('input',e=>{
    applySearch(e.target.value);
  });
});
function applyFilter(f){ /* DOM szűrés logika: mutat/elrejt elemeket */ }
function applySearch(q){ /* debounced keresés a listán */ }

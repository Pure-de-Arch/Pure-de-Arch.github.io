document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.item-card');
    const emptyState = document.getElementById('empty-state');
    const grid = document.getElementById('items-grid');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Gomb stílusok frissítése (Aktív állapot)
            filterBtns.forEach(b => {
                b.classList.remove('bg-blue-500', 'text-white');
                b.classList.add('text-gray-600', 'hover:bg-gray-200');
            });
            btn.classList.remove('text-gray-600', 'hover:bg-gray-200');
            btn.classList.add('bg-blue-500', 'text-white');

            // 2. Szűrési logika
            const category = btn.getAttribute('data-filter');
            let visibleCount = 0;

            items.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || category === itemCategory) {
                    item.style.display = 'block';
                    // Kis animáció hozzáadása megjelenéskor
                    item.classList.add('animate-fade-in');
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                    item.classList.remove('animate-fade-in');
                }
            });

            // 3. Üres állapot kezelése
            if (visibleCount === 0) {
                grid.classList.add('hidden');
                emptyState.classList.remove('hidden');
            } else {
                grid.classList.remove('hidden');
                emptyState.classList.add('hidden');
            }
        });
    });
});

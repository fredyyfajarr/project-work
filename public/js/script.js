/* =============================================
   SCRIPT.JS — OOP-based JavaScript
   LLD UNPAM Website
   ============================================= */

// ==========================
// CLASS: NavbarController
// Mengatur dropdown menu & active state
// ==========================
class NavbarController {
    constructor() {
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.init();
    }

    init() {
        this._initDropdowns();
        this._setActiveMenu();
        this._closeOnOutsideClick();
    }

    _initDropdowns() {
        document.querySelectorAll('.dropdown > a').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const submenu = trigger.nextElementSibling;

                // Tutup semua submenu lain
                document.querySelectorAll('.submenu').forEach(el => {
                    if (el !== submenu) el.classList.remove('show');
                });

                // Toggle submenu yang diklik
                submenu.classList.toggle('show');
            });
        });
    }

    _setActiveMenu() {
        document.querySelectorAll('.menu li a').forEach(link => {
            if (link.getAttribute('href') === this.currentPage) {
                link.closest('li').classList.add('active');
            }
        });
    }

    _closeOnOutsideClick() {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.submenu').forEach(el => {
                    el.classList.remove('show');
                });
            }
        });
    }
}




// ==========================
// CLASS: NavbarSearchController
// Mengaktifkan form search di navbar.
// Klik ikon search pertama membuka input, klik/enter berikutnya melakukan pencarian.
// ==========================
class NavbarSearchController {
    constructor(formSelector = '.nav-search-form') {
        this.form = document.querySelector(formSelector);
        if (!this.form) return;

        this.input = this.form.querySelector('.nav-search-input');
        this.button = this.form.querySelector('.nav-search-button');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            const isActive = this.form.classList.contains('active');
            const keyword = this.input.value.trim();

            if (!isActive || keyword.length === 0) {
                e.preventDefault();
                this.open();
            }
        });

        document.addEventListener('click', (e) => {
            if (!this.form.contains(e.target) && this.input.value.trim() === '') {
                this.close();
            }
        });

        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.input.value = '';
                this.close();
            }
        });
    }

    open() {
        this.form.classList.add('active');
        this.input.focus();
    }

    close() {
        this.form.classList.remove('active');
        this.input.blur();
    }
}


// ==========================
// CLASS: CounterAnimation
// Animasi angka counter di halaman Home
// ==========================
class CounterAnimation {
    constructor(selector = '.counter') {
        this.counters = document.querySelectorAll(selector);
        if (this.counters.length === 0) return;
        this._useIntersectionObserver
            ? this._observeCounters()
            : this._runAllCounters();
    }

    get _useIntersectionObserver() {
        return 'IntersectionObserver' in window;
    }

    _observeCounters() {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.done) {
                    entry.target.dataset.done = true;
                    this._animateSingle(entry.target);
                }
            });
        }, { threshold: 0.3 });

        this.counters.forEach(c => observer.observe(c));
    }

    _runAllCounters() {
        this.counters.forEach(c => this._animateSingle(c));
    }

    _animateSingle(counter) {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // ms
        const steps = 100;
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current = Math.min(Math.ceil(increment * step), target);
            counter.innerText = current;
            if (current >= target) clearInterval(timer);
        }, duration / steps);
    }
}


// ==========================
// CLASS: SliderPause
// Pause/resume CSS animation slider on hover
// (handled via CSS, ini untuk future toggle support)
// ==========================
class SliderPause {
    constructor(containerSelector = '.slider-container') {
        this.container = document.querySelector(containerSelector);
        // Sudah di-handle via CSS :hover — class ini reserved untuk extensibility
    }
}


// ==========================
// CLASS: PublicStatsRealtime
// Update statistik home dari endpoint Laravel tanpa reload halaman
// ==========================
class PublicStatsRealtime {
    constructor(containerSelector = '#publicStats') {
        this.container = document.querySelector(containerSelector);
        if (!this.container || !this.container.dataset.url) return;

        this.url = this.container.dataset.url;
        this.refreshInterval = 15000;
        this._refresh();
        setInterval(() => this._refresh(), this.refreshInterval);
    }

    async _refresh() {
        try {
            const response = await fetch(this.url, {
                headers: { 'Accept': 'application/json' },
                cache: 'no-store'
            });

            if (!response.ok) return;

            const data = await response.json();
            if (!data.cards) return;

            Object.keys(data.cards).forEach(key => {
                const counter = this.container.querySelector(`[data-stat-key="${key}"]`);
                if (!counter) return;

                const value = Number(data.cards[key].value || 0);
                counter.dataset.target = value;
                counter.textContent = value;
            });
        } catch (error) {
            // Jika database/server belum siap, statistik awal dari Blade tetap ditampilkan.
        }
    }
}


// ==========================
// INIT — Jalankan semua controller
// ==========================
document.addEventListener('DOMContentLoaded', () => {
    new NavbarController();
    new NavbarSearchController();
    new CounterAnimation();
    new SliderPause();
    new PublicStatsRealtime();
});

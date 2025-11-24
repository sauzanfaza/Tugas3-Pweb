document.addEventListener('DOMContentLoaded', async () => {
    // 1. Ambil data dari service
    const initialData = await window.dataService.fetchData();

    // 2. Inisialisasi Root Vue Instance
    const app = new Vue({
        el: '#app',
        data: {
            // Global State
            sapaan: 'Halo, SITTA UT!',
            tab: 'dashboard', // default tab
            state: initialData,

            // Slider Dashboard
            images: [
                '/assets/img/latar.jpg',
                '/assets/img/latar2.jpg',
                '/assets/img/latar3.jpg',
                '/assets/img/latar4.jpg',
            ],
            index: 0
        },
        filters: {
            currency(value) {
                if (typeof value !== "number") return value;
                // Menggunakan IDR dan toLocaleString untuk format uang Indonesia
                return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
            },
            qtyBuah(value) {
                if (typeof value !== "number") return value;
                return value.toLocaleString('id-ID') + " buah";
            }
        },
        methods: {
    // --- Slider Methods ---
    startSlider() {
        if (this.sliderInterval) {
            clearInterval(this.sliderInterval);
        }
        this.sliderInterval = setInterval(() => {
            this.index = (this.index + 1) % this.images.length;
        }, 5000);
    },

    // --- Handlers for Stock Table (CRUD) ---
    handleItemAdded(newItem) {
        this.state.stok.push(newItem);
    },

    handleItemUpdated(updatedItem) {
        const index = this.state.stok.findIndex(item => item.kode === updatedItem.kode);
        if (index !== -1) {
            Vue.set(this.state.stok, index, updatedItem);
        }
    },

    handleItemDeleted(kode) {
        const index = this.state.stok.findIndex(item => item.kode === kode);
        if (index !== -1) {
            this.state.stok.splice(index, 1);
        }
    },

    // --- NEW: Add Tracking DO (versi form object) ---
   handleNewDO(form) {
    const newDoNumber = form.do;

    const formatted = {
        [newDoNumber]: {
            nim: form.nim,
            nama: form.nama,
            ekspedisi: form.ekspedisiKode,
            tanggalKirim: form.tanggalKirim,
            paket: form.paketKode,
            total: form.total,
            perjalanan: form.progress || []
        }
    };

    this.state.tracking.push(formatted);

    // KURANGI STOK berdasarkan isi paket
    const paketDetail = this.state.paket.find(p => p.kode === form.paketKode);
    if (paketDetail && paketDetail.isi) {
        paketDetail.isi.forEach(kodeMK => {
            const item = this.state.stok.find(i => i.kode === kodeMK);
            if (item) {
                Vue.set(item, 'qty', Math.max(0, item.qty - 1));
            }
        });
    }
},



    // --- Handler for Tracking DO Progress ---
    handleProgressAdded(doNumber, progressUpdate) {
    const idx = this.state.tracking.findIndex(obj => Object.keys(obj)[0] === doNumber);
    if (idx === -1) return;

    const key = Object.keys(this.state.tracking[idx])[0];
    const detail = this.state.tracking[idx][key];

    if (!detail.perjalanan) {
        Vue.set(detail, 'perjalanan', []);
    }

    detail.perjalanan.push(progressUpdate);
}
        },
        mounted() {
            this.startSlider();
        }
    });

    // Event listener untuk tombol 'Enter' pada form Tambah/Edit
    document.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const stockTable = app.$children.find(c => c.$options.name === 'ba-stock-table');
            if (stockTable && app.tab === 'stok') {
                if (stockTable.itemToEdit) {
                    stockTable.updateItem();
                } else if (stockTable.isAdding) {
                    stockTable.addItem();
                }
            }
        }
    });
});
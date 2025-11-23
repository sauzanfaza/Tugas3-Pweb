Vue.component('ba-stock-table', {
    template: '#tpl-stock',
    props: ['items', 'upbjjList', 'kategoriList'],
    data() {
        return {
            // Filter State
            filterUpbjj: 'all',
            filterKategori: 'all',
            filterReorder: false,
            
            // Sort State
            sortBy: 'judul',
            sortDirection: 'asc', // 'asc' atau 'desc'

            // CRUD State
            isAdding: false,
            newItem: this.getNewItemDefaults(),
            itemToEdit: null,
            itemToDelete: null,

            // Tooltip State (Hover pada Status)
            hoverNote: {
                show: false,
                content: ''
            }
        };
    },
    computed: {
        availableCategories() {
            if (this.filterUpbjj === 'all') {
                return this.kategoriList;
            }
            // Filter kategori yang hanya ada di UT-Daerah yang dipilih
            const filteredItems = this.items.filter(item => item.upbjj === this.filterUpbjj);
            const categories = [...new Set(filteredItems.map(item => item.kategori))];
            return categories;
        },
        filteredItems() {
            let filtered = this.items;

            // 1. Filter UT-Daerah
            if (this.filterUpbjj !== 'all') {
                filtered = filtered.filter(item => item.upbjj === this.filterUpbjj);
            }

            // 2. Filter Kategori (Dependent on UT-Daerah)
            if (this.filterUpbjj !== 'all' && this.filterKategori !== 'all') {
                 filtered = filtered.filter(item => item.kategori === this.filterKategori);
            }

            // 3. Filter Re-order
            if (this.filterReorder) {
                filtered = filtered.filter(item => item.qty === 0 || item.qty < item.safety);
            }

            return filtered;
        },
        filteredAndSortedItems() {
            const sorted = [...this.filteredItems];
            
            // Lakukan pengurutan di sini
            sorted.sort((a, b) => {
                let valA = a[this.sortBy];
                let valB = b[this.sortBy];

                if (typeof valA === 'string') {
                    valA = valA.toLowerCase();
                    valB = valB.toLowerCase();
                }

                if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
                if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });

            return sorted;
        }
    },
    methods: {
        getNewItemDefaults() {
            return {
                kode: '',
                judul: '',
                qty: 0,
                safety: 0,
                lokasiRak: '',
                harga: 0,
                upbjj: this.upbjjList[0] || 'UT Jakarta',
                kategori: this.kategoriList[0] || 'FE',
                catatanHTML: ''
            };
        },
        resetFilters() {
            this.filterUpbjj = 'all';
            this.filterKategori = 'all';
            this.filterReorder = false;
        },
        showNote(content) {
            this.hoverNote.content = content;
            this.hoverNote.show = true;
        },
        hideNote() {
            this.hoverNote.show = false;
        },
        
        // --- CRUD --- 
        addItem() {
            const newItem = { ...this.newItem };
            // Validasi Sederhana
            if (!newItem.kode || !newItem.judul || newItem.qty < 0) {
                this.$root.$refs.modal.showModal('Validasi Gagal', 'Kode dan Judul tidak boleh kosong, Stok harus >= 0.');
                return;
            }

            // Cek duplikasi kode (validasi)
            if (this.items.some(item => item.kode === newItem.kode)) {
                this.$root.$refs.modal.showModal('Validasi Gagal', `Kode ${newItem.kode} sudah ada.`);
                return;
            }

            // Emit event ke Root Vue Instance untuk menambahkan data
            this.$emit('item-added', newItem);

            // Reset form
            this.newItem = this.getNewItemDefaults();
            this.isAdding = false;
            this.$root.$refs.modal.showModal('Sukses', `Bahan Ajar **${newItem.judul}** berhasil ditambahkan.`);
        },
        startEdit(item) {
            // Buat salinan objek agar tidak langsung memodifikasi data asli
            this.itemToEdit = { ...item };
            this.isAdding = false;
        },
        updateItem() {
            const item = this.itemToEdit;
            if (!item.judul || item.qty < 0) {
                this.$root.$refs.modal.showModal('Validasi Gagal', 'Judul tidak boleh kosong, Stok harus >= 0.');
                return;
            }

            // Emit event ke Root Vue Instance untuk update data
            this.$emit('item-updated', item);
            this.itemToEdit = null;
            this.$root.$refs.modal.showModal('Sukses', `Bahan Ajar **${item.judul}** berhasil diperbarui.`);
        },
        confirmDelete(item) {
            this.itemToDelete = item;
        },
        deleteItem() {
            const item = this.itemToDelete;
            this.$emit('item-deleted', item.kode);
            this.$root.$refs.modal.showModal('Sukses', `Bahan Ajar **${item.judul}** berhasil dihapus.`);
            this.itemToDelete = null;
        }
    },
    watch: {
        // WATCHER 1: Otomatis reset filter Kategori jika UT-Daerah berubah ke 'all'
        filterUpbjj(newVal) {
            if (newVal === 'all') {
                this.filterKategori = 'all';
            }
        },
        // WATCHER 2: Otomatis menyinkronkan newItem.safety saat qty diubah jika safety 0
        'newItem.qty': function(newQty) {
            if (this.newItem.safety === 0) {
                 this.newItem.safety = newQty > 0 ? Math.floor(newQty / 2) : 0;
            }
        }
    },
    
});
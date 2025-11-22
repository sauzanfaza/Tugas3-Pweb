Vue.component('ba-stock-table', {
  template: '#tpl-stock-table',
  data() {
    return {
      data: [],
      filter: {
        upbjj: '',
        kategori: '',
        reorderOnly: false,
        kosongOnly: false
      },
      sortBy: '',
      upbjjList: [],
      kategoriList: [],
      newItem: {
        kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '',
        harga: 0, qty: 0, safety: 0, catatanHTML: ''
      }
    };
  },
  computed: {
    filteredData() {
      let result = [...this.data];
      if (this.filter.upbjj) result = result.filter(d => d.upbjj === this.filter.upbjj);
      if (this.filter.kategori) result = result.filter(d => d.kategori === this.filter.kategori);
      if (this.filter.reorderOnly) result = result.filter(d => d.qty < d.safety);
      if (this.filter.kosongOnly) result = result.filter(d => d.qty === 0);
      if (this.sortBy) {
        result.sort((a, b) => {
          if (this.sortBy === 'judul') return a.judul.localeCompare(b.judul);
          return a[this.sortBy] - b[this.sortBy];
        });
      }
      return result;
    }
  },
  methods: {
    resetFilter() {
      this.filter = { upbjj: '', kategori: '', reorderOnly: false, kosongOnly: false };
      this.sortBy = '';
    },
    statusClass(item) {
      if (item.qty === 0) return 'status kosong';
      if (item.qty < item.safety) return 'status menipis';
      return 'status aman';
    },
    statusText(item) {
      if (item.qty === 0) return '❌ Kosong';
      if (item.qty < item.safety) return '⚠️ Menipis';
      return '✅ Aman';
    },
    addItem() {
      if (!this.newItem.kode || !this.newItem.judul) return;
      this.data.push({ ...this.newItem });
      this.newItem = { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: 0, qty: 0, safety: 0 };
    },
    editItem(i) {
      const updated = prompt('Update jumlah stok:', this.data[i].qty);
      if (updated !== null) this.data[i].qty = parseInt(updated);
    },
    confirmDelete(i) {
      if (confirm('Yakin hapus data ini?')) this.data.splice(i, 1);
    }
  },
  mounted() {
  fetch('assets/data/dataBahanAjar.json')
    .then(res => res.json())
    .then(json => {
      this.data = json.stok;
      this.upbjjList = json.upbjjList;
      this.kategoriList = json.kategoriList;
    });
}
});

new Vue({ el: '#app' });
Vue.component('ba-stock-table', {
  props: ['items', 'upbjjList', 'kategoriList'],

  data() {
    return {
      filterUpbjj: '',
      filterKategori: '',
      filterWarning: false,
      sortBy: 'judul'
    };
  },

  async mounted() {
    try {
      const html = await fetch('templates/stock-table.html').then(r => r.text());

      // compile template string jadi render function
      const compiled = Vue.compile(html);
      this.$options.render = compiled.render;
      this.$options.staticRenderFns = compiled.staticRenderFns;

      this.$forceUpdate();
    } catch(err) {
      console.error("Gagal load template:", err);
      this.$options.template = `<div style="color:red">⚠ Template ERROR: ${err.message}</div>`;
      this.$forceUpdate();
    }
  },

  computed: {
    filteredItems() {
      let data = this.items;

      if (this.filterUpbjj) data = data.filter(i => i.upbjj === this.filterUpbjj);
      if (this.filterKategori) data = data.filter(i => i.kategori === this.filterKategori);
      if (this.filterWarning) data = data.filter(i => i.qty < i.safety || i.qty === 0);

      return [...data].sort((a, b) => {
        if (this.sortBy === 'judul') return a.judul.localeCompare(b.judul);
        if (this.sortBy === 'harga') return a.harga - b.harga;
        if (this.sortBy === 'qty') return a.qty - b.qty;
      });
    }
  },

  methods: {
    formatHarga(h) {
      return 'Rp ' + h.toLocaleString('id-ID');
    },
    status(item) {
      if (item.qty === 0) return 'kosong';
      if (item.qty < item.safety) return 'menipis';
      return 'aman';
    },
    resetFilter() {
      this.filterUpbjj = '';
      this.filterKategori = '';
      this.filterWarning = false;
      this.sortBy = 'judul';
    },
    showCatatan(html) {
      console.log("CATATAN:", html);
    }
  }
});

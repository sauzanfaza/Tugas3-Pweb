
new Vue({
  el: '#app',
  data() {
    return {
      tab: 'dashboard',
      sapaan: '',
      index: 0,
      images: [
        'assets/img/latar.jpg',
        'assets/img/latar2.jpg',
        'assets/img/latar3.jpg',
        'assets/img/latar4.jpg'
      ],
      state: {
        stok: [],
        upbjjList: [],
        kategoriList: [],
        paket: [],
        pengirimanList: [],
        tracking: []
      }
    };
  },

  async created() {
  const data = await ApiService.loadData();

  this.state.stok = data.stok;               // FIX ☑
  this.state.upbjjList = data.upbjjList;     // FIX ☑
  this.state.kategoriList = data.kategoriList; // FIX ☑
  this.state.paket = data.paket;             
  this.state.pengirimanList = data.pengirimanList;
  this.state.tracking = data.tracking;
},


  mounted() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) this.sapaan = "Selamat Pagi";
    else if (hour >= 12 && hour < 15) this.sapaan = "Selamat Siang";
    else if (hour >= 15 && hour < 18) this.sapaan = "Selamat Sore";
    else this.sapaan = "Selamat Malam";

    setInterval(() => {
      this.index = (this.index + 1) % this.images.length;
    }, 4000);
  }
});
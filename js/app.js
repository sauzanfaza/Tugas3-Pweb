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
      ]
    };
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
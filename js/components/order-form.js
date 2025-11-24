Vue.component('order-form', {
    template: '#tpl-order',
    props: ['paket', 'ekspedisi'],
    data() {
        return {
            newOrder: this.getNewOrderDefaults()
        };
    },
    computed: {
    nextDONumber() {
        const totalTracking = this.$root.state.tracking.length;
        const sequence = (totalTracking + 1).toString().padStart(4, '0');
        const year = new Date().getFullYear();
        return `DO${year}-${sequence}`;
    },
    selectedPackage() {
        return this.paket.find(p => p.kode === this.newOrder.paketKode) 
            || { nama: 'Pilih Paket', isi: [], harga: 0 };
    },
    selectedExpedition() {
        return this.ekspedisi.find(e => e.kode === this.newOrder.ekspedisiKode)
            || { nama: 'Tidak Diketahui', harga: 0 };
    }
},
    methods: {
        getNewOrderDefaults() {
            // Menggunakan format tanggal yang sama dengan API Service
            const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            return {
                nim: '',
                nama: '',
                paketKode: this.paket[0] ? this.paket[0].kode : '',
                ekspedisiKode: this.ekspedisi[0] ? this.ekspedisi[0].kode : '',
                tanggalKirim: today,
            };
        },
        submitOrder() {
            const newDO = {
                do: this.nextDONumber,
                nim: this.newOrder.nim.trim(),
                nama: this.newOrder.nama.trim(),
                paketKode: this.selectedPackage.kode,
                paketNama: this.selectedPackage.nama,
                paketHarga: this.selectedPackage.harga,
                ekspedisiKode: this.selectedExpedition.kode,
                ekspedisiNama: this.selectedExpedition.nama,
                ekspedisiHarga: this.selectedExpedition.harga,

                tanggalKirim: this.newOrder.tanggalKirim,

                total: this.selectedPackage.harga,
                progress: [
                    {
                        waktu: new Date().toLocaleString('id-ID'),
                        keterangan: `Pesanan dibuat untuk NIM ${this.newOrder.nim} dengan paket ${this.selectedPackage.nama}.`
                    }
                ]
            };


            // Validasi Sederhana
            if (!newDO.nim || !newDO.nama || !newDO.paketKode || !newDO.ekspedisiKode) {
                this.$root.$refs.modal.showModal('Validasi Gagal', 'Semua field (NIM, Nama, Paket, Ekspedisi) wajib diisi.');
                return;
            }
            
            // Emit event ke Root Vue Instance
            this.$emit('created', newDO);

            // Reset form
            this.newOrder = this.getNewOrderDefaults();
            this.$root.$refs.modal.showModal('Sukses', `Order DO **${newDO.do}** berhasil dibuat untuk ${newDO.nama}.`);
        }
    }
});
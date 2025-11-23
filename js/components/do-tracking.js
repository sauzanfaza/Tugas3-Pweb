Vue.component('do-tracking', {
    template: '#tpl-tracking',
    props: ['data', 'paket', 'ekspedisi'],
    data() {
        return {
            searchQuery: ''
        };
    },
    computed: {
    parsedData() {
        return this.data.map(item => {
            const doKey = Object.keys(item)[0];      
            const detail = item[doKey];             
            
            return {
                do: doKey,
                nim: detail.nim,
                nama: detail.nama,
                ekspedisi: detail.ekspedisi,
                tanggalKirim: detail.tanggalKirim,
                paketKode: detail.paket,
                total: detail.total,
                progress: detail.perjalanan,
                newProgress: ''
            };
        });
    },

    filteredTracking() {
        const query = this.searchQuery.toLowerCase().trim();
        if (!query) return this.parsedData;

        return this.parsedData.filter(item => 
            item.do.toLowerCase().includes(query) ||
            String(item.nim).toLowerCase().includes(query) ||
            String(item.nama).toLowerCase().includes(query)
        );
    }
},

    methods: {
        getPaketDetail(kode) {
            return this.paket.find(p => p.kode === kode) || { nama: 'N/A', isi: [] };
        },
        getEkspedisiDetail(kode) {
            return this.ekspedisi.find(e => e.kode === kode) || { nama: 'N/A' };
        },
        clearSearch(event) {
            if (event.key === 'Escape') {
                this.searchQuery = '';
            }
        },
        addProgress(item) {
            // Pastikan setiap item punya input sendiri
            if (item.newProgress === undefined) item.newProgress = '';

            const newEntry = item.newProgress.trim();
            if (!newEntry) {
                this.$root.$refs.modal?.showModal('Validasi', 'Keterangan progress tidak boleh kosong.');
                return;
            }

            const now = new Date();
            const timeString = now.toLocaleString('id-ID', { 
                year: 'numeric', month: '2-digit', day: '2-digit', 
                hour: '2-digit', minute: '2-digit', second: '2-digit' 
            }).replace(/\./g, '/');

            const progressUpdate = {
                waktu: timeString,
                keterangan: newEntry
            };

            // Emit ke Root Vue Instance
            this.$emit('progress-added', item.do, progressUpdate);

            item.progress.push(progressUpdate)
            // Reset input hanya untuk item ini
            item.newProgress = '';

            this.$root.$refs.modal?.showModal('Sukses', `Progress untuk DO **${item.do}** berhasil ditambahkan.`);
        }
    }
});

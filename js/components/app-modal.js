Vue.component('app-modal', {
    template: '#tpl-modal',
    data() {
        return {
            isVisible: false,
            title: '',
            message: '',
            resolve: null // Promise resolver untuk konfirmasi
        };
    },
    methods: {
        /**
         * Menampilkan modal dengan pesan.
         * @param {string} title Judul modal.
         * @param {string} message Pesan modal (dapat mengandung HTML).
         * @returns {Promise<boolean>} Promise yang resolve ketika modal ditutup.
         */
        showModal(title, message) {
            this.title = title;
            this.message = message;
            this.isVisible = true;

            // Menggunakan Promise agar bisa menunggu input pengguna
            return new Promise(r => {
                this.resolve = r;
            });
        },
        closeModal() {
            this.isVisible = false;
            if (this.resolve) {
                this.resolve(false); // Resolve dengan false jika hanya alert/info
                this.resolve = null;
            }
        },
    }
});
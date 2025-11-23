Vue.component('status-badge', {
    template: '#tpl-badge',
    props: {
        qty: { type: Number, required: true },
        safety: { type: Number, required: true }
    },
    computed: {
        status() {
            if (this.qty === 0) {
                return {
                    text: 'Kosong',
                    class: 'status-danger',
                    symbol: '❌'
                };
            } else if (this.qty < this.safety) {
                return {
                    text: 'Menipis',
                    class: 'status-warning',
                    symbol: '⚠️'
                };
            } else {
                return {
                    text: 'Aman',
                    class: 'status-safe',
                    symbol: '✅'
                };
            }
        }
    }
});
Vue.component('status-badge', {
  props: ['status'],
  template: null,
  mounted() {
    fetch('templates/badge.html')
      .then(r => r.text())
      .then(t => this.$options.template = t);
  }
});

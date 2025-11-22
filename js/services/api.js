const ApiService = {
  async loadData() {
    const res = await fetch('data/dataBahanAjar.json');
    return res.json();
  }
}
// js/services/api.js
/**
 * Modul untuk menangani pengambilan data dari sumber JSON.
 */

const API_ENDPOINT = 'data/dataBahanAjar.json';

/**
 * Mengambil semua data dari file JSON.
 * @returns {Promise<Object>} Data lengkap dari JSON.
 */
async function fetchData() {
    try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Normalisasi data tracking: Format tanggal pengiriman
        data.tracking = data.tracking.map(item => ({
            ...item,
            tanggalKirim: formatDate(item.tanggalKirim)
        }));

        return data;
    } catch (error) {
        console.error("Gagal mengambil data dari API:", error);
        return {
            stok: [],
            tracking: [],
            paket: [],
            upbjjList: [],
            kategoriList: [],
            pengirimanList: []
        };
    }
}

/**
 * Helper untuk memformat tanggal YYYY-MM-DD menjadi format Indonesia.
 * @param {string} dateString Tanggal dalam format YYYY-MM-DD.
 * @returns {string} Tanggal dalam format "Tanggal Bulan Tahun".
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

// Global exposure untuk digunakan di app.js
window.dataService = {
    fetchData: fetchData
};
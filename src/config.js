// File: src/config.js

// GANTI IP INI SESUAI HASIL TERMINAL (ipconfig getifaddr en0)
const IP_ADDRESS = "192.168.100.182";
const PORT = "8000";

// PERHATIKAN: Saya ubah API_URL menjadi API_BASE_URL agar cocok dengan file lain
export const API_BASE_URL = `http://${IP_ADDRESS}:${PORT}/`;
export const IMAGE_URL = `http://${IP_ADDRESS}:${PORT}/images/`;

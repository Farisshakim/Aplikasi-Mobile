<?php
// Header ini WAJIB ada biar React Native (Expo) diizinkan akses
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json; charset=UTF-8");

// Konfigurasi Database 
$host = "127.0.0.1";
$user = "root";
$pass = "";       // Password default 
$db   = "db_kos"; // Nama database 

$koneksi = mysqli_connect($host, $user, $pass, $db);

if (!$koneksi) {
    // Jika gagal, kirim pesan error JSON
    echo json_encode(["status" => "error", "message" => "Gagal koneksi: " . mysqli_connect_error()]);
    exit();
}
?>
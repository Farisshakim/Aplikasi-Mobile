<?php
include 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

// 1. GET: Untuk mengambil data kos
if ($method == 'GET') {
    $query = "SELECT * FROM kosts ORDER BY id DESC";
    $result = mysqli_query($koneksi, $query);
    
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }
    
    // Kirim data JSON ke React Native
    echo json_encode([
        "status" => "success",
        "data" => $data
    ]);
}
// Nanti kita tambahkan POST (Tambah Data) di sini
?>
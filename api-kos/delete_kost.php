<?php
include 'koneksi.php';

$id = $_GET['id'];

// 1. Hapus file gambar dulu biar server tidak penuh
$query = "SELECT gambar FROM kosts WHERE id='$id'";
$result = mysqli_query($koneksi, $query);
$row = mysqli_fetch_assoc($result);

if ($row) {
    $file_path = "uploads/" . $row['gambar'];
    if (file_exists($file_path)) {
        unlink($file_path); 
    }
}

// 2. Hapus data dari database
$delete = "DELETE FROM kosts WHERE id='$id'";
if (mysqli_query($koneksi, $delete)) {
    echo json_encode(["status" => "success", "message" => "Kost berhasil dihapus"]);
} else {
    echo json_encode(["status" => "error", "message" => "Gagal menghapus data"]);
}
?>
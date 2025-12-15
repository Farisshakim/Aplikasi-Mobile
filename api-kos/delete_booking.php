<?php
// File: api-kos/delete_booking.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id_booking = $_POST['id_booking'];

    if (empty($id_booking)) {
        echo json_encode(["status" => "error", "message" => "ID Booking tidak ditemukan"]);
        exit();
    }

    // Hapus data booking berdasarkan ID
    $query = "DELETE FROM bookings WHERE id = '$id_booking'";
    
    if (mysqli_query($koneksi, $query)) {
        echo json_encode(["status" => "success", "message" => "Riwayat pesanan dihapus"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal menghapus data"]);
    }
}
?>

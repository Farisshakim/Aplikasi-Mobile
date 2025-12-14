<?php
// File: api-kos/confirm_payment.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    // Ambil ID Booking
    $id = $_POST['id'];

    if (empty($id)) {
        echo json_encode(["status" => "error", "message" => "ID tidak ditemukan"]);
        exit();
    }

    // Update status jadi 'Confirmed'
    $query = "UPDATE bookings SET status='Confirmed' WHERE id='$id'";

    if (mysqli_query($koneksi, $query)) {
        echo json_encode(["status" => "success", "message" => "Pembayaran Berhasil!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal update: " . mysqli_error($koneksi)]);
    }
}
?>
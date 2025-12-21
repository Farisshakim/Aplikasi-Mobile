<?php
include 'koneksi.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // Pastikan ID Booking dikirim
    if (!isset($_POST['id_booking'])) {
        echo json_encode(["status" => "error", "message" => "ID Booking tidak ditemukan."]);
        exit();
    }

    $id_booking = $_POST['id_booking'];
    $metode_pembayaran = $_POST['metode'] ?? 'Bank Transfer'; // Default
    
    // Update status booking menjadi 'dibayar' (Menunggu Konfirmasi Admin/Pemilik)
    // Atau bisa langsung 'lunas' jika ini simulasi sukses
    $status_baru = 'lunas'; // Kita buat langsung LUNAS untuk simulasi sukses

    $query = "UPDATE bookings SET status='$status_baru' WHERE id='$id_booking'";

    if (mysqli_query($koneksi, $query)) {
        $response['status'] = 'success';
        $response['message'] = 'Pembayaran Berhasil!';
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Gagal update database: ' . mysqli_error($koneksi);
    }

} else {
    $response['status'] = 'error';
    $response['message'] = 'Invalid Request';
}

echo json_encode($response);
?>
<?php
include 'koneksi.php';
$method = $_SERVER['REQUEST_METHOD'];

// 1. GET: Ambil Riwayat Pesanan
if ($method == 'GET') {
    $query = "SELECT * FROM bookings ORDER BY id DESC";
    $result = mysqli_query($koneksi, $query);
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $data]);
}

// 2. POST: Buat Pesanan Baru (Ajukan Sewa)
elseif ($method == 'POST') {
    $nama = $_POST['nama_pemesan'];
    $kost_id = $_POST['kost_id'];
    $nama_kos = $_POST['nama_kos'];
    $tgl = $_POST['tanggal_masuk']; // Format YYYY-MM-DD
    $lama = $_POST['lama_sewa'];
    $total = $_POST['total_harga'];

    $q = "INSERT INTO bookings (nama_pemesan, kost_id, nama_kos, tanggal_masuk, lama_sewa, total_harga) 
          VALUES ('$nama', '$kost_id', '$nama_kos', '$tgl', '$lama', '$total')";
    
    if(mysqli_query($koneksi, $q)) echo json_encode(["status" => "success"]);
    else echo json_encode(["status" => "error", "message" => mysqli_error($koneksi)]);
}

// 3. DELETE: Batalkan Pesanan
elseif ($method == 'DELETE') {
    $id = $_GET['id'];
    $q = "DELETE FROM bookings WHERE id='$id'";
    if(mysqli_query($koneksi, $q)) echo json_encode(["status" => "success"]);
    else echo json_encode(["status" => "error"]);
}
?>
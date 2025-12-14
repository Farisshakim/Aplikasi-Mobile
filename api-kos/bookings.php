<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, DELETE");

include 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

// 1. GET: Ambil Data Pesanan
if ($method == 'GET') {
    $query = "SELECT * FROM bookings ORDER BY id DESC";
    $result = mysqli_query($koneksi, $query);
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $data]);
}

// 2. POST: Buat Pesanan Baru (DENGAN CEK STOK)
elseif ($method == 'POST') {
    $nama = $_POST['nama_pemesan'];
    $kost_id = $_POST['kost_id'];
    $nama_kos = $_POST['nama_kos'];
    $tgl = $_POST['tanggal_masuk'];
    $lama = $_POST['lama_sewa'];
    $total = $_POST['total_harga'];

    // A. Cek dulu apakah stok masih ada?
    $cekStok = mysqli_query($koneksi, "SELECT stok_kamar FROM kosts WHERE id='$kost_id'");
    $dataStok = mysqli_fetch_assoc($cekStok);

    if ($dataStok['stok_kamar'] > 0) {
        // B. Stok Aman -> Lakukan Insert
        $q = "INSERT INTO bookings (kost_id, nama_pemesan, nama_kos, tanggal_masuk, lama_sewa, total_harga, status) 
              VALUES ('$kost_id', '$nama', '$nama_kos', '$tgl', '$lama', '$total', 'Pending')";
        
        if(mysqli_query($koneksi, $q)) {
            // C. PENTING: Kurangi Stok Kamar di tabel kosts
            mysqli_query($koneksi, "UPDATE kosts SET stok_kamar = stok_kamar - 1 WHERE id='$kost_id'");
            
            echo json_encode(["status" => "success", "message" => "Berhasil booking"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal simpan DB"]);
        }
    } else {
        // Stok Habis
        echo json_encode(["status" => "error", "message" => "Maaf, kamar sudah penuh!"]);
    }
}

// 3. DELETE: Batalkan Pesanan (KEMBALIKAN STOK)
elseif ($method == 'DELETE') {
    $id = $_GET['id'];

    // Ambil kost_id dulu sebelum dihapus, biar tau stok mana yang ditambah
    $cekBooking = mysqli_query($koneksi, "SELECT kost_id FROM bookings WHERE id='$id'");
    $dataBooking = mysqli_fetch_assoc($cekBooking);
    $kost_id = $dataBooking['kost_id'];

    $q = "DELETE FROM bookings WHERE id='$id'";
    
    if(mysqli_query($koneksi, $q)) {
        // Kembalikan Stok (+1)
        mysqli_query($koneksi, "UPDATE kosts SET stok_kamar = stok_kamar + 1 WHERE id='$kost_id'");
        
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error"]);
    }
}
?>
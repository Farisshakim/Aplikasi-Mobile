<?php
include 'koneksi.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");

// ==========================================
// 1. MENANGANI REQUEST GET (UNTUK HISTORY)
// ==========================================
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    
    if (isset($_GET['id_user'])) {
        $user_id = $_GET['id_user'];
        
        // Query Join agar kita dapat Nama Kost & Gambar juga
        $query = "SELECT bookings.*, kosts.nama_kos, kosts.alamat, kosts.gambar AS gambar_kos 
                  FROM bookings 
                  JOIN kosts ON bookings.kost_id = kosts.id 
                  WHERE bookings.user_id = '$user_id' 
                  ORDER BY bookings.created_at DESC";
                  
        $result = mysqli_query($koneksi, $query);
        $data = array();
        
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = $row;
        }

        echo json_encode(["status" => "success", "data" => $data]);
    } else {
        echo json_encode(["status" => "error", "message" => "Parameter id_user tidak ditemukan"]);
    }
    exit();
}

// ==========================================
// 2. MENANGANI REQUEST POST (UNTUK BOOKING)
// ==========================================
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // Validasi Input Dasar
    if (empty($_POST['user_id']) || empty($_POST['kos_id'])) {
        echo json_encode(["status" => "error", "message" => "Gagal: User ID atau Kost ID kosong."]);
        exit();
    }

    $kos_id = $_POST['kos_id'];
    $user_id = $_POST['user_id'];
    $durasi = $_POST['durasi'];
    $total_harga = $_POST['total_harga'];
    $tanggal_mulai = $_POST['tanggal_mulai'];

    // 1. Cek Stok Dulu
    $cekStok = mysqli_query($koneksi, "SELECT stok_kamar FROM kosts WHERE id='$kos_id'");
    $dataStok = mysqli_fetch_assoc($cekStok);

    if ($dataStok && $dataStok['stok_kamar'] > 0) {
        
        // 2. Simpan ke Booking
        $queryInsert = "INSERT INTO bookings (user_id, kost_id, tanggal_booking, durasi_sewa, total_harga, status) 
                        VALUES ('$user_id', '$kos_id', '$tanggal_mulai', '$durasi', '$total_harga', 'pending')";
        
        if (mysqli_query($koneksi, $queryInsert)) {
            // 3. Kurangi Stok
            mysqli_query($koneksi, "UPDATE kosts SET stok_kamar = stok_kamar - 1 WHERE id='$kos_id'");
            
            echo json_encode(["status" => "success", "message" => "Booking berhasil disimpan!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Database Error: " . mysqli_error($koneksi)]);
        }

    } else {
        echo json_encode(["status" => "error", "message" => "Maaf, stok kamar habis."]);
    }
    exit();
}
?>
<?php
include 'koneksi.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nama_kos = $_POST['nama_kos'];
    $alamat = $_POST['alamat'];
    $harga = $_POST['harga'];
    $deskripsi = $_POST['deskripsi'];
    $fasilitas = $_POST['fasilitas'];
    $stok = $_POST['stok_kamar'];
    $owner_id = $_POST['owner_id']; 

    // MENGAMBIL GENDER (INPUT DARI HP TETAP 'GENDER')
    $gender = $_POST['gender']; 

    // UPLOAD GAMBAR
    $nama_file = $_FILES['gambar']['name'];
    $tmp_file = $_FILES['gambar']['tmp_name'];
    $ext = pathinfo($nama_file, PATHINFO_EXTENSION);
    $nama_file_unik = md5(uniqid(rand(), true)) . "." . $ext;
    $path = "uploads/" . $nama_file_unik;

    if (move_uploaded_file($tmp_file, $path)) {
        // PERBAIKAN QUERY: MENGGUNAKAN KOLOM 'GENDER'
        $query = "INSERT INTO kosts (nama_kos, alamat, harga, deskripsi, gambar, fasilitas, gender, stok_kamar, owner_id) 
                  VALUES ('$nama_kos', '$alamat', '$harga', '$deskripsi', '$nama_file_unik', '$fasilitas', '$gender', '$stok', '$owner_id')";
        
        if (mysqli_query($koneksi, $query)) {
            $response['status'] = 'success';
            $response['message'] = 'Berhasil menambah kost';
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Gagal simpan database: ' . mysqli_error($koneksi);
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Gagal upload gambar';
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Invalid Request';
}

echo json_encode($response);
?>
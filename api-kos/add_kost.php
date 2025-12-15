<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
// Tidak perlu Content-Type: application/json karena kita terima FormData

include 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    $nama      = $_POST['nama_kos'];
    $alamat    = $_POST['alamat'];
    $harga     = $_POST['harga'];
    $deskripsi = $_POST['deskripsi'];
    $gender    = $_POST['gender'];
    $stok      = $_POST['stok_kamar'];
    $fasilitas = $_POST['fasilitas']; // String dipisah koma

    // Upload Gambar
    $dbPath = '';
    if (isset($_FILES['gambar']) && $_FILES['gambar']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['gambar']['tmp_name'];
        $fileName    = $_FILES['gambar']['name'];
        $fileNameCmps = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameCmps));
        
        $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
        $uploadFileDir = './uploads/';
        
        if(move_uploaded_file($fileTmpPath, $uploadFileDir . $newFileName)) {
            $dbPath = $newFileName; // Simpan nama filenya saja
        }
    }

    // Query Insert
    $query = "INSERT INTO kosts (nama_kos, alamat, harga, deskripsi, gambar, gender, stok_kamar, fasilitas) 
              VALUES ('$nama', '$alamat', '$harga', '$deskripsi', '$dbPath', '$gender', '$stok', '$fasilitas')";

    if (mysqli_query($koneksi, $query)) {
        echo json_encode(["status" => "success", "message" => "Kost berhasil ditambahkan"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal simpan DB: " . mysqli_error($koneksi)]);
    }

} else {
    echo json_encode(["status" => "error", "message" => "Invalid Request"]);
}
?>
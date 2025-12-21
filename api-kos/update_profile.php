<?php
include 'koneksi.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // 1. Ambil ID User (Wajib)
    $id = $_POST['id'];
    
    // 2. Ambil data teks lain (Nama, Email, HP, dll)
    $name = $_POST['name'];
    $email = $_POST['email'];
    $no_hp = $_POST['no_hp'];

    // 3. Cek apakah ada file gambar yang diupload?
    $gambar_query = ""; 
    if (isset($_FILES['gambar']) && $_FILES['gambar']['error'] == 0) {
        $target_dir = "uploads/";
        $file_name = time() . "_" . basename($_FILES["gambar"]["name"]); // Beri nama unik
        $target_file = $target_dir . $file_name;

        if (move_uploaded_file($_FILES["gambar"]["tmp_name"], $target_file)) {
            // Jika sukses upload, siapkan query update gambar
            $gambar_query = ", gambar='$file_name'";
        }
    }

    // 4. Query Update Database
    // Perhatikan: $gambar_query hanya akan terisi jika ada upload foto baru
    $sql = "UPDATE users SET name='$name', email='$email', no_hp='$no_hp' $gambar_query WHERE id='$id'";

    if (mysqli_query($koneksi, $sql)) {
        // Ambil data terbaru user untuk update AsyncStorage di HP
        $queryUser = mysqli_query($koneksi, "SELECT * FROM users WHERE id='$id'");
        $userData = mysqli_fetch_assoc($queryUser);

        $response['status'] = 'success';
        $response['message'] = 'Profil berhasil diperbarui';
        $response['data'] = $userData; // Kirim data terbaru balik ke HP
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
<?php
// File: api-kos/update_profile.php
header("Access-Control-Allow-Origin: *");
// Header Content-Type JSON dihapus karena kita akan menerima FormData, bukan JSON string.
header("Access-Control-Allow-Methods: POST");

include 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // 1. Ambil data teks dari $_POST (Karena dikirim via FormData)
    $id    = $_POST['id'];
    $name  = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'] ?? '';

    if (empty($id) || empty($name) || empty($email)) {
        echo json_encode(["status" => "error", "message" => "Data wajib tidak lengkap"]);
        exit();
    }

    // 2. Siapkan Query Dasar (Update teks dulu)
    $queryStr = "UPDATE users SET name = '$name', email = '$email', phone = '$phone'";

    // 3. Cek apakah ada file gambar yang dikirim
    if (isset($_FILES['gambar']) && $_FILES['gambar']['error'] === UPLOAD_ERR_OK) {
        
        $fileTmpPath = $_FILES['gambar']['tmp_name'];
        $fileName    = $_FILES['gambar']['name'];
        $fileSize    = $_FILES['gambar']['size'];
        $fileType    = $_FILES['gambar']['type'];
        $fileNameCmps = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameCmps));

        // Kriteria file yang diperbolehkan
        $allowedfileExtensions = array('jpg', 'gif', 'png', 'jpeg');
        
        if (in_array($fileExtension, $allowedfileExtensions)) {
            // Buat nama file baru yang unik agar tidak bentrok
            $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
            
            // Folder tujuan upload (Pastikan folder 'uploads' sudah ada di dalam api-kos)
            $uploadFileDir = './uploads/';
            $dest_path = $uploadFileDir . $newFileName;
    
            if(move_uploaded_file($fileTmpPath, $dest_path)) {
                // Jika upload sukses, tambahkan update kolom gambar ke query
                // Kita simpan path relatifnya saja: "uploads/namafile.jpg"
                $dbPath = 'uploads/' . $newFileName;
                $queryStr .= ", gambar = '$dbPath'";
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal memindahkan file ke folder uploads"]);
                exit();
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Format file tidak didukung. Gunakan JPG/PNG."]);
            exit();
        }
    }

    // 4. Akhiri Query dengan WHERE
    $queryStr .= " WHERE id = '$id'";

    // 5. Jalankan Query
    if (mysqli_query($koneksi, $queryStr)) {
        // Ambil data user terbaru setelah diupdate untuk dikirim balik ke aplikasi
        $getUser = mysqli_query($koneksi, "SELECT id, name, email, phone, gambar FROM users WHERE id = '$id'");
        $newData = mysqli_fetch_assoc($getUser);

        echo json_encode([
            "status" => "success", 
            "message" => "Profil berhasil diperbarui",
            "data" => $newData // Kirim data terbaru ke React Native untuk disimpan di AsyncStorage
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Database error: " . mysqli_error($koneksi)]);
    }

} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
?>
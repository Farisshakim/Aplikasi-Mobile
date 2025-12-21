<?php
include 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, TRUE);

    $name = $input['name'];
    $email = $input['email'];
    $password = $input['password']; // Disarankan pakai password_hash()
    $no_hp = $input['no_hp'];
    
    // AMBIL ROLE (Default: penyewa jika tidak dipilih)
    $role = isset($input['role']) ? $input['role'] : 'penyewa';

    $cekEmail = "SELECT * FROM users WHERE email='$email'";
    $resEmail = mysqli_query($koneksi, $cekEmail);

    if (mysqli_num_rows($resEmail) > 0) {
        echo json_encode(["status" => "error", "message" => "Email sudah terdaftar"]);
    } else {
        // QUERY INSERT DENGAN ROLE
        $query = "INSERT INTO users (name, email, password, no_hp, role) VALUES ('$name', '$email', '$password', '$no_hp', '$role')";
        
        if (mysqli_query($koneksi, $query)) {
            echo json_encode(["status" => "success", "message" => "Register Berhasil"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal Register: " . mysqli_error($koneksi)]);
        }
    }
}
?>
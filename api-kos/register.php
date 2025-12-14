<?php
include 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    // Terima data JSON dari React Native
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, TRUE);

    if(isset($input['name']) && isset($input['email']) && isset($input['password'])){
        $name = $input['name'];
        $email = $input['email'];
        $password = $input['password']; // Sebaiknya di-hash pakai password_hash(), tapi untuk tugas ini plain text tidak apa-apa dulu

        // Cek email ganda
        $cek = mysqli_query($koneksi, "SELECT id FROM users WHERE email='$email'");
        if(mysqli_num_rows($cek) > 0){
            echo json_encode(["status" => "error", "message" => "Email sudah terdaftar!"]);
            exit();
        }

        $query = "INSERT INTO users (name, email, password) VALUES ('$name', '$email', '$password')";
        
        if (mysqli_query($koneksi, $query)) {
            echo json_encode(["status" => "success", "message" => "Register berhasil"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal daftar: " . mysqli_error($koneksi)]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
    }
}
?>
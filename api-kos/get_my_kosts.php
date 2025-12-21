<?php
include 'koneksi.php';

// Ambil ID Pemilik dari URL parameter
$owner_id = $_GET['owner_id'];

$query = "SELECT * FROM kosts WHERE owner_id = '$owner_id' ORDER BY id DESC";
$result = mysqli_query($koneksi, $query);

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

echo json_encode(["status" => "success", "data" => $data]);
?>
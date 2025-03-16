<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';

$user_id = null;

// Handle GET and POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data['user_id'])) {
        echo json_encode(["status" => "error", "message" => "User ID is required"]);
        exit();
    }
    $user_id = intval($data['user_id']);
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['user_id'])) {
        echo json_encode(["status" => "error", "message" => "User ID is required"]);
        exit();
    }
    $user_id = intval($_GET['user_id']);
}

// 🔹 Trigger update_user_amount.php before fetching wallets
file_get_contents("http://localhost/Crypto/update_user_amount.php?user_id=$user_id");

// Prepare SQL query
$stmt = $conn->prepare("SELECT wallet_id, currency_type, balance FROM wallet WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$wallets = $result->fetch_all(MYSQLI_ASSOC);

if (count($wallets) > 0) {
    echo json_encode(["status" => "success", "wallets" => $wallets]);
} else {
    echo json_encode(["status" => "error", "message" => "No wallets found"]);
}

$stmt->close();
$conn->close();
?>

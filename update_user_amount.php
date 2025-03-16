<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include 'db.php';

// SQL query to correctly update user amounts for multiple wallets
$sql = "
    UPDATE users u
    JOIN (
        SELECT w.user_id, SUM(w.balance * c.current_value) AS total_value
        FROM wallet w
        JOIN currency c ON w.wallet_id = c.wallet_id
        GROUP BY w.user_id
    ) calc ON u.user_id = calc.user_id
    SET u.balance = calc.total_value
";

// Debugging: Log SQL query
error_log("SQL Query: " . $sql);

$execute = $conn->query($sql);

if ($execute) {
    echo json_encode(["status" => "success", "message" => "User balance updated correctly"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error executing query: " . $conn->error]);
}

$conn->close();
?>

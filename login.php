<?php

// CORS Headers
function set_cors_headers() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");
}

// Handle Preflight Request
function handle_preflight() {
    if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
        http_response_code(200);
        exit();
    }
}

// Establish Database Connection
function connect_db() {
    include 'db.php';
    return isset($conn) ? $conn : null;
}

// Read and decode JSON input
function get_request_data() {
    $json = file_get_contents("php://input");
    return json_decode($json, true);
}

// Validate input data
function validate_input($data) {
    return !empty($data['email']) && !empty($data['password']);
}

// Fetch user details by email
function get_user_by_email($conn, $email) {
    $sql = "SELECT user_id, username, password FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) return null;
    
    $stmt->bind_param("s", $email);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

// Verify password
function verify_password($input_password, $stored_password) {
    return password_verify($input_password, $stored_password);
}

// Send JSON response
function send_response($status, $message, $data = []) {
    echo json_encode(array_merge(["status" => $status, "message" => $message], $data));
    exit();
}

// Main execution
set_cors_headers();
handle_preflight();
$conn = connect_db();
if (!$conn) send_response("error", "Database connection error");

$data = get_request_data();
if (!$data) send_response("error", "No JSON received");
if (!validate_input($data)) send_response("error", "Missing email or password");

$user = get_user_by_email($conn, $data['email']);
if (!$user) send_response("error", "User not found");

if (!verify_password($data['password'], $user['password'])) send_response("error", "Invalid password");

send_response("success", "Login successful", ["user_id" => $user['user_id'], "username" => $user['username']]);

$conn->close();
?>

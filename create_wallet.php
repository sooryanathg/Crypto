<?php
// Allow CORS
function set_cors_headers() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");
}

// Handle preflight requests
function handle_preflight() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
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
    return json_decode(file_get_contents("php://input"), true);
}

// Validate input data
function validate_input($data) {
    return isset($data['user_id'], $data['currency_type'], $data['balance']);
}

// Check if user exists
function user_exists($conn, $user_id) {
    $stmt = $conn->prepare("SELECT user_id FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->store_result();
    return $stmt->num_rows > 0;
}

// Insert new wallet
function create_wallet($conn, $user_id, $currency_type, $balance) {
    $stmt = $conn->prepare("INSERT INTO wallet (user_id, currency_type, balance) VALUES (?, ?, ?)");
    $stmt->bind_param("isi", $user_id, $currency_type, $balance);
    if ($stmt->execute()) {
        return $stmt->insert_id;
    }
    return false;
}

// Insert currency details
function create_currency($conn, $currency_type, $wallet_id) {
    $currency_data = [
        "Bitcoin"  => ["symbol" => "₿", "value" => 50000],
        "Ethereum" => ["symbol" => "Ξ", "value" => 3000],
        "Litecoin" => ["symbol" => "Ł", "value" => 150]
    ];
    
    $symbol = $currency_data[$currency_type]["symbol"] ?? "";
    $current_value = $currency_data[$currency_type]["value"] ?? 0.00;
    
    $stmt = $conn->prepare("INSERT INTO currency (currency_type, symbol, current_value, wallet_id) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssdi", $currency_type, $symbol, $current_value, $wallet_id);
    return $stmt->execute();
}

// Send JSON response
function send_response($status, $message) {
    echo json_encode(["status" => $status, "message" => $message]);
    exit();
}

// Main Execution Function
function process_request() {
    set_cors_headers();
    handle_preflight();

    $conn = connect_db();
    if (!$conn) send_response("error", "Database connection error");

    $data = get_request_data();
    if (!validate_input($data)) send_response("error", "Missing required fields");

    if (!user_exists($conn, $data['user_id'])) send_response("error", "User not found");

    $wallet_id = create_wallet($conn, $data['user_id'], $data['currency_type'], $data['balance']);
    if (!$wallet_id) send_response("error", "Failed to create wallet");

    if (!create_currency($conn, $data['currency_type'], $wallet_id)) send_response("error", "Failed to insert currency data");

    send_response("success", "Wallet and currency created successfully");

    $conn->close();
}

// Execute the main function
process_request();
?>

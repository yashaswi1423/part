<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database configuration
$db_file = 'participants.db';

// Initialize SQLite database
function initDatabase() {
    global $db_file;
    
    try {
        $pdo = new PDO("sqlite:$db_file");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Create participants table if it doesn't exist
        $sql = "CREATE TABLE IF NOT EXISTS participants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            team_name TEXT NOT NULL,
            domain TEXT NOT NULL,
            lead_name TEXT NOT NULL,
            lead_usn TEXT NOT NULL,
            lead_gender TEXT NOT NULL,
            lead_mobile TEXT NOT NULL,
            lead_email TEXT NOT NULL,
            college_name TEXT NOT NULL,
            state TEXT NOT NULL,
            country TEXT NOT NULL,
            member2_name TEXT,
            member2_usn TEXT,
            member2_gender TEXT,
            member2_mobile TEXT,
            member3_name TEXT,
            member3_usn TEXT,
            member3_gender TEXT,
            member3_mobile TEXT,
            member4_name TEXT,
            member4_usn TEXT,
            member4_gender TEXT,
            member4_mobile TEXT,
            member5_name TEXT,
            member5_usn TEXT,
            member5_gender TEXT,
            payment_transaction_id TEXT,
            payment_amount TEXT,
            payment_method TEXT,
            payment_status TEXT DEFAULT 'completed',
            payment_timestamp TEXT,
            registration_date DATETIME DEFAULT CURRENT_TIMESTAMP
        )";
        
        $pdo->exec($sql);
        return $pdo;
    } catch (Exception $e) {
        error_log("Database initialization error: " . $e->getMessage());
        throw $e;
    }
}

// Get all participants
function getParticipants() {
    try {
        $pdo = initDatabase();
        
        // First, let's check if the table exists and has data
        $countStmt = $pdo->query("SELECT COUNT(*) as count FROM participants");
        $count = $countStmt->fetch(PDO::FETCH_ASSOC);
        
        $stmt = $pdo->query("SELECT * FROM participants ORDER BY registration_date DESC");
        $participants = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return [
            'success' => true,
            'data' => $participants,
            'debug' => [
                'table_count' => $count['count'],
                'db_file_exists' => file_exists($GLOBALS['db_file']),
                'db_file_size' => file_exists($GLOBALS['db_file']) ? filesize($GLOBALS['db_file']) : 0
            ]
        ];
    } catch (Exception $e) {
        error_log("Get participants error: " . $e->getMessage());
        return [
            'success' => false,
            'error' => $e->getMessage(),
            'debug' => [
                'db_file_exists' => file_exists($GLOBALS['db_file']),
                'db_file_size' => file_exists($GLOBALS['db_file']) ? filesize($GLOBALS['db_file']) : 0
            ]
        ];
    }
}

// Save participant registration
function saveParticipant($data) {
    try {
        $pdo = initDatabase();
        
        // First, check if the selected theme is still available
        $domain = $data['domain'] ?? '';
        if (empty($domain)) {
            return [
                'success' => false,
                'error' => 'Theme selection is required'
            ];
        }
        
        // Count current registrations for this theme
        $countSql = "SELECT COUNT(*) as count FROM participants WHERE domain = :domain AND payment_status = 'completed'";
        $countStmt = $pdo->prepare($countSql);
        $countStmt->execute([':domain' => $domain]);
        $currentCount = $countStmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        // Check if theme is full (100 teams limit)
        if ($currentCount >= 100) {
            return [
                'success' => false,
                'error' => 'This theme is full (100/100 teams). Please select another theme.',
                'theme_full' => true,
                'current_count' => $currentCount
            ];
        }
        
        $sql = "INSERT INTO participants (
            team_name, domain, lead_name, lead_usn, lead_gender, lead_mobile, lead_email, college_name, state, country,
            member2_name, member2_usn, member2_gender, member2_mobile,
            member3_name, member3_usn, member3_gender, member3_mobile,
            member4_name, member4_usn, member4_gender, member4_mobile,
            member5_name, member5_usn, member5_gender,
            payment_transaction_id, payment_amount, payment_method, payment_status, payment_timestamp
        ) VALUES (
            :team_name, :domain, :lead_name, :lead_usn, :lead_gender, :lead_mobile, :lead_email, :college_name, :state, :country,
            :member2_name, :member2_usn, :member2_gender, :member2_mobile,
            :member3_name, :member3_usn, :member3_gender, :member3_mobile,
            :member4_name, :member4_usn, :member4_gender, :member4_mobile,
            :member5_name, :member5_usn, :member5_gender,
            :payment_transaction_id, :payment_amount, :payment_method, :payment_status, :payment_timestamp
        )";
        
        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute([
            ':team_name' => $data['teamName'] ?? '',
            ':domain' => $data['domain'] ?? '',
            ':lead_name' => $data['leadName'] ?? '',
            ':lead_usn' => $data['leadUsn'] ?? '',
            ':lead_gender' => $data['leadGender'] ?? '',
            ':lead_mobile' => $data['leadMobile'] ?? '',
            ':lead_email' => $data['leadEmail'] ?? '',
            ':college_name' => $data['collegeName'] ?? '',
            ':state' => $data['state'] ?? '',
            ':country' => $data['country'] ?? '',
            ':member2_name' => $data['member2Name'] ?? null,
            ':member2_usn' => $data['member2Usn'] ?? null,
            ':member2_gender' => $data['member2Gender'] ?? null,
            ':member2_mobile' => $data['member2Mobile'] ?? null,
            ':member3_name' => $data['member3Name'] ?? null,
            ':member3_usn' => $data['member3Usn'] ?? null,
            ':member3_gender' => $data['member3Gender'] ?? null,
            ':member3_mobile' => $data['member3Mobile'] ?? null,
            ':member4_name' => $data['member4Name'] ?? null,
            ':member4_usn' => $data['member4Usn'] ?? null,
            ':member4_gender' => $data['member4Gender'] ?? null,
            ':member4_mobile' => $data['member4Mobile'] ?? null,
            ':member5_name' => $data['member5Name'] ?? null,
            ':member5_usn' => $data['member5Usn'] ?? null,
            ':member5_gender' => $data['member5Gender'] ?? null,
            ':payment_transaction_id' => $data['payment']['transactionId'] ?? null,
            ':payment_amount' => $data['payment']['amount'] ?? null,
            ':payment_method' => $data['payment']['paymentMethod'] ?? null,
            ':payment_status' => $data['payment']['status'] ?? 'completed',
            ':payment_timestamp' => $data['payment']['timestamp'] ?? null
        ]);
        
        if ($result) {
            return [
                'success' => true,
                'message' => 'Registration saved successfully',
                'id' => $pdo->lastInsertId(),
                'theme_count_after' => $currentCount + 1,
                'debug' => [
                    'data_received' => $data
                ]
            ];
        } else {
            return [
                'success' => false,
                'error' => 'Failed to execute insert statement'
            ];
        }
    } catch (Exception $e) {
        error_log("Save participant error: " . $e->getMessage());
        return [
            'success' => false,
            'error' => $e->getMessage(),
            'debug' => [
                'data_received' => $data
            ]
        ];
    }
}

// Handle requests
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    echo json_encode(getParticipants());
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input === null) {
        echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
    } else {
        echo json_encode(saveParticipant($input));
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}
?>
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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

// Get theme registration counts
function getThemeCounts() {
    global $db_file;
    
    try {
        $pdo = new PDO("sqlite:$db_file");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Get counts for each theme
        $sql = "SELECT domain, COUNT(*) as count FROM participants WHERE payment_status = 'completed' GROUP BY domain";
        $stmt = $pdo->query($sql);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Initialize all themes with 0 count
        $themes = [
            'agriculture' => ['name' => 'Agriculture and Rural Development', 'count' => 0, 'available' => true],
            'healthtech' => ['name' => 'Health Tech', 'count' => 0, 'available' => true],
            'spacetech' => ['name' => 'SpaceTech', 'count' => 0, 'available' => true],
            'smartcity' => ['name' => 'Smart City, Vehicles and Automation', 'count' => 0, 'available' => true],
            'fintech' => ['name' => 'FinTech', 'count' => 0, 'available' => true]
        ];
        
        // Update counts from database
        foreach ($results as $row) {
            if (isset($themes[$row['domain']])) {
                $themes[$row['domain']]['count'] = (int)$row['count'];
                // Mark as unavailable if count reaches 100
                $themes[$row['domain']]['available'] = $row['count'] < 100;
            }
        }
        
        return [
            'success' => true,
            'themes' => $themes,
            'total_registrations' => array_sum(array_column($themes, 'count')),
            'max_per_theme' => 100
        ];
        
    } catch (Exception $e) {
        error_log("Get theme counts error: " . $e->getMessage());
        return [
            'success' => false,
            'error' => $e->getMessage()
        ];
    }
}

// Handle requests
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    echo json_encode(getThemeCounts());
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}
?>
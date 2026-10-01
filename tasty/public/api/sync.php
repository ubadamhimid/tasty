<?php
/**
 * TASTY Hilversum - Central Server Sync API
 * Provides reliable, permanent server-side storage for the Admin Dashboard.
 */

// Allow CORS for development & production
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataDir = __DIR__ . '/data';
$backupsDir = $dataDir . '/backups';
$dbFile = $dataDir . '/tasty_database.json';
$htaccessFile = $dataDir . '/.htaccess';

// Ensure data and backup directories exist
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}
if (!is_dir($backupsDir)) {
    @mkdir($backupsDir, 0755, true);
}

// Secure the data folder so raw JSON cannot be opened directly from URL
if (!file_exists($htaccessFile)) {
    @file_put_contents($htaccessFile, "# Deny direct web access to json files\n<IfModule mod_authz_core.c>\n    Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n    Order deny,allow\n    Deny from all\n</IfModule>\n");
}



// -------------------------------------------------------------
// 1. GET: Retrieve server database
// -------------------------------------------------------------
if ($method === 'GET') {
    if (!file_exists($dbFile)) {
        // Return initial clean empty state
        echo json_encode([
            'status' => 'empty',
            'message' => 'No database exists yet on server.',
            'lastUpdated' => null,
            'data' => null
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $raw = @file_get_contents($dbFile);
    if ($raw === false) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Could not read server database.']);
        exit;
    }

    $decoded = json_decode($raw, true);
    if ($decoded === null) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Server database JSON corrupted.']);
        exit;
    }

    echo json_encode([
        'status' => 'success',
        'lastUpdated' => date('c', filemtime($dbFile)),
        'data' => $decoded
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// -------------------------------------------------------------
// 2. POST: Save updated state from client
// -------------------------------------------------------------
if ($method === 'POST') {
    $inputJSON = file_get_contents('php://input');
    if (empty($inputJSON)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Empty request body.']);
        exit;
    }

    $data = json_decode($inputJSON, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON payload.']);
        exit;
    }

    // Attach server timestamp
    $data['_serverSyncedAt'] = date('c');

    $encoded = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    // Atomic write with file locking
    $writeSuccess = @file_put_contents($dbFile, $encoded, LOCK_EX);

    if ($writeSuccess === false) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to write to server database.']);
        exit;
    }

    // Create automatic daily backup copy if not already made today
    $todayBackup = $backupsDir . '/backup-' . date('Y-m-d') . '.json';
    @copy($dbFile, $todayBackup);

    echo json_encode([
        'status' => 'success',
        'message' => 'تم حفظ ومزامنة البيانات على السيرفر بنجاح!',
        'serverSyncedAt' => date('c'),
        'bytesWritten' => $writeSuccess,
        'hasDailyBackup' => file_exists($todayBackup)
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
exit;

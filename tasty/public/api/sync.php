<?php
/**
 * TASTY Hilversum - Central SQLite Database & Sync Engine
 * High-performance, transactional SQL storage unifying all devices in real-time.
 */

error_reporting(0);
ini_set('display_errors', '0');

// Comprehensive CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// -------------------------------------------------------------
// Directory & Path Setup
// -------------------------------------------------------------
$dataDir = __DIR__ . '/data';
$backupsDir = $dataDir . '/backups';

if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0777, true);
}
if (!is_dir($backupsDir)) {
    @mkdir($backupsDir, 0777, true);
}
@chmod($dataDir, 0777);
@chmod($backupsDir, 0777);

// Secure directories from direct browser downloads
$htaccess = $dataDir . '/.htaccess';
if (!file_exists($htaccess)) {
    @file_put_contents($htaccess, "# Deny direct access\n<IfModule mod_authz_core.c>\n    Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n    Order deny,allow\n    Deny from all\n</IfModule>\n");
}

// Database paths (primary in data/, secondary in __DIR__)
$sqlitePrimary = $dataDir . '/tasty.sqlite';
$sqliteSecondary = __DIR__ . '/tasty.sqlite';
$jsonPrimary = $dataDir . '/tasty_database.json';
$jsonSecondary = __DIR__ . '/tasty_database.json';

// Diagnostic mode (?diag=1)
if (isset($_GET['diag'])) {
    $hasSqlite = extension_loaded('pdo_sqlite');
    echo json_encode([
        'engine' => $hasSqlite ? 'SQLite PDO' : 'JSON Engine',
        'php_version' => PHP_VERSION,
        'sqlite_primary' => $sqlitePrimary,
        'sqlite_primary_exists' => file_exists($sqlitePrimary),
        'data_dir_writable' => is_writable($dataDir),
        'server_time' => date('Y-m-d H:i:s')
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// -------------------------------------------------------------
// SQLite Database Helper
// -------------------------------------------------------------
function getDatabaseConnection() {
    global $sqlitePrimary, $sqliteSecondary, $dataDir;

    if (!extension_loaded('pdo_sqlite')) {
        return null;
    }

    $dbFile = (is_dir($dataDir) && is_writable($dataDir)) ? $sqlitePrimary : $sqliteSecondary;

    try {
        $pdo = new PDO('sqlite:' . $dbFile);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        
        // Performance & concurrency settings
        $pdo->exec("PRAGMA journal_mode = WAL;");
        $pdo->exec("PRAGMA busy_timeout = 5000;");
        $pdo->exec("PRAGMA synchronous = NORMAL;");

        // Initialize schema if not present
        initializeSchema($pdo);

        return ['pdo' => $pdo, 'file' => $dbFile];
    } catch (Exception $e) {
        // Fallback to secondary if primary failed
        if ($dbFile === $sqlitePrimary) {
            try {
                $pdo = new PDO('sqlite:' . $sqliteSecondary);
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                initializeSchema($pdo);
                return ['pdo' => $pdo, 'file' => $sqliteSecondary];
            } catch (Exception $e2) {
                return null;
            }
        }
        return null;
    }
}

function initializeSchema($pdo) {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS system_metadata (
            key TEXT PRIMARY KEY,
            value TEXT,
            updated_at TEXT
        );

        CREATE TABLE IF NOT EXISTS master_items (
            id TEXT PRIMARY KEY,
            name TEXT,
            category TEXT,
            unit TEXT,
            default_qty REAL,
            notes TEXT,
            is_active INTEGER DEFAULT 1,
            created_at TEXT
        );

        CREATE TABLE IF NOT EXISTS purchase_orders (
            id TEXT PRIMARY KEY,
            order_number TEXT,
            title TEXT,
            date TEXT,
            status TEXT,
            items_json TEXT,
            notes TEXT,
            created_at TEXT,
            completed_at TEXT
        );

        CREATE TABLE IF NOT EXISTS daily_sales (
            id TEXT PRIMARY KEY,
            date TEXT UNIQUE,
            cash_amount REAL,
            card_amount REAL,
            total_amount REAL,
            cash_percentage REAL,
            card_percentage REAL,
            notes TEXT,
            recorded_at TEXT
        );

        CREATE TABLE IF NOT EXISTS debts (
            id TEXT PRIMARY KEY,
            party_name TEXT,
            type TEXT,
            category TEXT,
            phone TEXT,
            total_amount REAL,
            paid_amount REAL,
            remaining_amount REAL,
            status TEXT,
            created_date TEXT,
            due_date TEXT,
            notes TEXT,
            description TEXT,
            payments_json TEXT
        );

        CREATE TABLE IF NOT EXISTS employees (
            id TEXT PRIMARY KEY,
            name TEXT,
            phone TEXT,
            role TEXT,
            wage_type TEXT,
            rate REAL,
            schedule_type TEXT,
            default_hours REAL,
            default_start_time TEXT,
            default_end_time TEXT,
            default_break_minutes INTEGER,
            working_days_json TEXT,
            is_active INTEGER DEFAULT 1,
            start_date TEXT,
            notes TEXT,
            created_at TEXT
        );

        CREATE TABLE IF NOT EXISTS employee_shifts (
            id TEXT PRIMARY KEY,
            employee_id TEXT,
            employee_name TEXT,
            date TEXT,
            start_time TEXT,
            end_time TEXT,
            break_minutes INTEGER,
            total_hours REAL,
            hourly_rate REAL,
            total_earned REAL,
            payment_status TEXT,
            paid_amount REAL,
            notes TEXT,
            created_at TEXT
        );

        CREATE TABLE IF NOT EXISTS employee_advances (
            id TEXT PRIMARY KEY,
            employee_id TEXT,
            employee_name TEXT,
            amount REAL,
            date TEXT,
            payment_method TEXT,
            payment_type TEXT,
            notes TEXT,
            created_at TEXT
        );
    ");
}

// -------------------------------------------------------------
// Database Query: Load All Data
// -------------------------------------------------------------
function loadAllFromDatabase($pdo) {
    $data = [
        'masterItems' => [],
        'purchaseOrders' => [],
        'dailySales' => [],
        'debts' => [],
        'employees' => [],
        'employeeShifts' => [],
        'employeeAdvances' => [],
    ];

    // 1. Master Items
    $stmt = $pdo->query("SELECT * FROM master_items ORDER BY created_at DESC");
    while ($row = $stmt->fetch()) {
        $data['masterItems'][] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'category' => $row['category'],
            'unit' => $row['unit'],
            'defaultQty' => (float)$row['default_qty'],
            'notes' => $row['notes'],
            'isActive' => (bool)$row['is_active'],
            'createdAt' => $row['created_at'],
        ];
    }

    // 2. Purchase Orders
    $stmt = $pdo->query("SELECT * FROM purchase_orders ORDER BY created_at DESC");
    while ($row = $stmt->fetch()) {
        $data['purchaseOrders'][] = [
            'id' => $row['id'],
            'orderNumber' => $row['order_number'],
            'title' => $row['title'],
            'date' => $row['date'],
            'status' => $row['status'],
            'items' => json_decode($row['items_json'] ?? '[]', true) ?: [],
            'notes' => $row['notes'],
            'createdAt' => $row['created_at'],
            'completedAt' => $row['completed_at'],
        ];
    }

    // 3. Daily Sales
    $stmt = $pdo->query("SELECT * FROM daily_sales ORDER BY date DESC");
    while ($row = $stmt->fetch()) {
        $data['dailySales'][] = [
            'id' => $row['id'],
            'date' => $row['date'],
            'cashAmount' => (float)$row['cash_amount'],
            'cardAmount' => (float)$row['card_amount'],
            'totalAmount' => (float)$row['total_amount'],
            'cashPercentage' => (float)$row['cash_percentage'],
            'cardPercentage' => (float)$row['card_percentage'],
            'notes' => $row['notes'],
            'recordedAt' => $row['recorded_at'],
        ];
    }

    // 4. Debts
    $stmt = $pdo->query("SELECT * FROM debts ORDER BY created_date DESC");
    while ($row = $stmt->fetch()) {
        $data['debts'][] = [
            'id' => $row['id'],
            'partyName' => $row['party_name'],
            'type' => $row['type'],
            'category' => $row['category'],
            'phone' => $row['phone'],
            'totalAmount' => (float)$row['total_amount'],
            'paidAmount' => (float)$row['paid_amount'],
            'remainingAmount' => (float)$row['remaining_amount'],
            'status' => $row['status'],
            'createdDate' => $row['created_date'],
            'dueDate' => $row['due_date'],
            'notes' => $row['notes'],
            'description' => $row['description'],
            'payments' => json_decode($row['payments_json'] ?? '[]', true) ?: [],
        ];
    }

    // 5. Employees
    $stmt = $pdo->query("SELECT * FROM employees ORDER BY created_at ASC");
    while ($row = $stmt->fetch()) {
        $data['employees'][] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'phone' => $row['phone'],
            'role' => $row['role'],
            'wageType' => $row['wage_type'],
            'rate' => (float)$row['rate'],
            'scheduleType' => $row['schedule_type'],
            'defaultHours' => (float)$row['default_hours'],
            'defaultStartTime' => $row['default_start_time'],
            'defaultEndTime' => $row['default_end_time'],
            'defaultBreakMinutes' => (int)$row['default_break_minutes'],
            'workingDays' => json_decode($row['working_days_json'] ?? '[]', true) ?: [],
            'isActive' => (bool)$row['is_active'],
            'startDate' => $row['start_date'],
            'notes' => $row['notes'],
            'createdAt' => $row['created_at'],
        ];
    }

    // 6. Employee Shifts
    $stmt = $pdo->query("SELECT * FROM employee_shifts ORDER BY date DESC, created_at DESC");
    while ($row = $stmt->fetch()) {
        $data['employeeShifts'][] = [
            'id' => $row['id'],
            'employeeId' => $row['employee_id'],
            'employeeName' => $row['employee_name'],
            'date' => $row['date'],
            'startTime' => $row['start_time'],
            'endTime' => $row['end_time'],
            'breakMinutes' => (int)$row['break_minutes'],
            'totalHours' => (float)$row['total_hours'],
            'hourlyRate' => (float)$row['hourly_rate'],
            'totalEarned' => (float)$row['total_earned'],
            'paymentStatus' => $row['payment_status'],
            'paidAmount' => (float)$row['paid_amount'],
            'notes' => $row['notes'],
            'createdAt' => $row['created_at'],
        ];
    }

    // 7. Employee Advances
    $stmt = $pdo->query("SELECT * FROM employee_advances ORDER BY date DESC");
    while ($row = $stmt->fetch()) {
        $data['employeeAdvances'][] = [
            'id' => $row['id'],
            'employeeId' => $row['employee_id'],
            'employeeName' => $row['employee_name'],
            'amount' => (float)$row['amount'],
            'date' => $row['date'],
            'paymentMethod' => $row['payment_method'],
            'paymentType' => $row['payment_type'],
            'notes' => $row['notes'],
            'createdAt' => $row['created_at'],
        ];
    }

    return $data;
}

// -------------------------------------------------------------
// Database Save: Atomic Transaction
// -------------------------------------------------------------
function saveAllToDatabase($pdo, $payload) {
    $pdo->beginTransaction();
    try {
        // Save Master Items
        if (isset($payload['masterItems']) && is_array($payload['masterItems'])) {
            $pdo->exec("DELETE FROM master_items");
            $stmt = $pdo->prepare("INSERT INTO master_items (id, name, category, unit, default_qty, notes, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($payload['masterItems'] as $item) {
                $stmt->execute([
                    $item['id'] ?? uniqid('mi_'),
                    $item['name'] ?? '',
                    $item['category'] ?? 'other',
                    $item['unit'] ?? 'piece',
                    (float)($item['defaultQty'] ?? 0),
                    $item['notes'] ?? '',
                    ($item['isActive'] ?? true) ? 1 : 0,
                    $item['createdAt'] ?? date('Y-m-d')
                ]);
            }
        }

        // Save Purchase Orders
        if (isset($payload['purchaseOrders']) && is_array($payload['purchaseOrders'])) {
            $pdo->exec("DELETE FROM purchase_orders");
            $stmt = $pdo->prepare("INSERT INTO purchase_orders (id, order_number, title, date, status, items_json, notes, created_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($payload['purchaseOrders'] as $po) {
                $stmt->execute([
                    $po['id'] ?? uniqid('po_'),
                    $po['orderNumber'] ?? '',
                    $po['title'] ?? '',
                    $po['date'] ?? date('Y-m-d'),
                    $po['status'] ?? 'pending',
                    json_encode($po['items'] ?? [], JSON_UNESCAPED_UNICODE),
                    $po['notes'] ?? '',
                    $po['createdAt'] ?? date('c'),
                    $po['completedAt'] ?? null
                ]);
            }
        }

        // Save Daily Sales
        if (isset($payload['dailySales']) && is_array($payload['dailySales'])) {
            $pdo->exec("DELETE FROM daily_sales");
            $stmt = $pdo->prepare("INSERT INTO daily_sales (id, date, cash_amount, card_amount, total_amount, cash_percentage, card_percentage, notes, recorded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($payload['dailySales'] as $ds) {
                $stmt->execute([
                    $ds['id'] ?? uniqid('ds_'),
                    $ds['date'] ?? date('Y-m-d'),
                    (float)($ds['cashAmount'] ?? 0),
                    (float)($ds['cardAmount'] ?? 0),
                    (float)($ds['totalAmount'] ?? 0),
                    (float)($ds['cashPercentage'] ?? 0),
                    (float)($ds['cardPercentage'] ?? 0),
                    $ds['notes'] ?? '',
                    $ds['recordedAt'] ?? date('c')
                ]);
            }
        }

        // Save Debts
        if (isset($payload['debts']) && is_array($payload['debts'])) {
            $pdo->exec("DELETE FROM debts");
            $stmt = $pdo->prepare("INSERT INTO debts (id, party_name, type, category, phone, total_amount, paid_amount, remaining_amount, status, created_date, due_date, notes, description, payments_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($payload['debts'] as $d) {
                $stmt->execute([
                    $d['id'] ?? uniqid('d_'),
                    $d['partyName'] ?? '',
                    $d['type'] ?? 'payable',
                    $d['category'] ?? 'supplier',
                    $d['phone'] ?? '',
                    (float)($d['totalAmount'] ?? 0),
                    (float)($d['paidAmount'] ?? 0),
                    (float)($d['remainingAmount'] ?? 0),
                    $d['status'] ?? 'unpaid',
                    $d['createdDate'] ?? date('Y-m-d'),
                    $d['dueDate'] ?? null,
                    $d['notes'] ?? '',
                    $d['description'] ?? '',
                    json_encode($d['payments'] ?? [], JSON_UNESCAPED_UNICODE)
                ]);
            }
        }

        // Save Employees
        if (isset($payload['employees']) && is_array($payload['employees'])) {
            $pdo->exec("DELETE FROM employees");
            $stmt = $pdo->prepare("INSERT INTO employees (id, name, phone, role, wage_type, rate, schedule_type, default_hours, default_start_time, default_end_time, default_break_minutes, working_days_json, is_active, start_date, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($payload['employees'] as $emp) {
                $stmt->execute([
                    $emp['id'] ?? uniqid('emp_'),
                    $emp['name'] ?? '',
                    $emp['phone'] ?? '',
                    $emp['role'] ?? '',
                    $emp['wageType'] ?? 'hourly',
                    (float)($emp['rate'] ?? 0),
                    $emp['scheduleType'] ?? 'fixed',
                    (float)($emp['defaultHours'] ?? 8),
                    $emp['defaultStartTime'] ?? '10:00',
                    $emp['defaultEndTime'] ?? '18:00',
                    (int)($emp['defaultBreakMinutes'] ?? 30),
                    json_encode($emp['workingDays'] ?? [1,2,3,4,5,6,0]),
                    ($emp['isActive'] ?? true) ? 1 : 0,
                    $emp['startDate'] ?? date('Y-m-d'),
                    $emp['notes'] ?? '',
                    $emp['createdAt'] ?? date('c')
                ]);
            }
        }

        // Save Employee Shifts
        if (isset($payload['employeeShifts']) && is_array($payload['employeeShifts'])) {
            $pdo->exec("DELETE FROM employee_shifts");
            $stmt = $pdo->prepare("INSERT INTO employee_shifts (id, employee_id, employee_name, date, start_time, end_time, break_minutes, total_hours, hourly_rate, total_earned, payment_status, paid_amount, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($payload['employeeShifts'] as $s) {
                $stmt->execute([
                    $s['id'] ?? uniqid('shift_'),
                    $s['employeeId'] ?? '',
                    $s['employeeName'] ?? '',
                    $s['date'] ?? date('Y-m-d'),
                    $s['startTime'] ?? '10:00',
                    $s['endTime'] ?? '18:00',
                    (int)($s['breakMinutes'] ?? 0),
                    (float)($s['totalHours'] ?? 0),
                    (float)($s['hourlyRate'] ?? 0),
                    (float)($s['totalEarned'] ?? 0),
                    $s['paymentStatus'] ?? 'unpaid',
                    (float)($s['paidAmount'] ?? 0),
                    $s['notes'] ?? '',
                    $s['createdAt'] ?? date('c')
                ]);
            }
        }

        // Save Employee Advances
        if (isset($payload['employeeAdvances']) && is_array($payload['employeeAdvances'])) {
            $pdo->exec("DELETE FROM employee_advances");
            $stmt = $pdo->prepare("INSERT INTO employee_advances (id, employee_id, employee_name, amount, date, payment_method, payment_type, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($payload['employeeAdvances'] as $a) {
                $stmt->execute([
                    $a['id'] ?? uniqid('adv_'),
                    $a['employeeId'] ?? '',
                    $a['employeeName'] ?? '',
                    (float)($a['amount'] ?? 0),
                    $a['date'] ?? date('Y-m-d'),
                    $a['paymentMethod'] ?? 'cash',
                    $a['paymentType'] ?? 'advance',
                    $a['notes'] ?? '',
                    $a['createdAt'] ?? date('c')
                ]);
            }
        }

        // Update system metadata
        $stmtMeta = $pdo->prepare("INSERT OR REPLACE INTO system_metadata (key, value, updated_at) VALUES (?, ?, ?)");
        $stmtMeta->execute(['last_synced_at', date('c'), date('c')]);

        $pdo->commit();
        return true;
    } catch (Exception $e) {
        $pdo->rollBack();
        return false;
    }
}

// -------------------------------------------------------------
// Seed SQLite from JSON database if SQLite is completely empty
// -------------------------------------------------------------
function seedDatabaseIfEmpty($pdo) {
    global $jsonPrimary, $jsonSecondary;

    $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM master_items");
    $cnt = (int)$stmt->fetchColumn();

    if ($cnt === 0) {
        $jsonFile = file_exists($jsonPrimary) ? $jsonPrimary : (file_exists($jsonSecondary) ? $jsonSecondary : null);
        if ($jsonFile) {
            $raw = @file_get_contents($jsonFile);
            if ($raw) {
                $decoded = json_decode($raw, true);
                if (is_array($decoded)) {
                    saveAllToDatabase($pdo, $decoded);
                }
            }
        }
    }
}

// -------------------------------------------------------------
// MAIN REQUEST HANDLER
// -------------------------------------------------------------
$dbInfo = getDatabaseConnection();

if ($dbInfo !== null) {
    $pdo = $dbInfo['pdo'];
    seedDatabaseIfEmpty($pdo);

    if ($method === 'GET') {
        $allData = loadAllFromDatabase($pdo);
        echo json_encode([
            'status' => 'success',
            'engine' => 'sqlite',
            'lastUpdated' => date('c'),
            'data' => $allData
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($method === 'POST') {
        $inputJSON = file_get_contents('php://input');
        $payload = json_decode($inputJSON, true);

        if (!is_array($payload)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON']);
            exit;
        }

        $ok = saveAllToDatabase($pdo, $payload);
        if ($ok) {
            // Also write mirror JSON backup
            @file_put_contents($jsonPrimary, json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            echo json_encode([
                'status' => 'success',
                'engine' => 'sqlite',
                'message' => 'تم الحفظ والمزامنة في قاعدة البيانات المركزية بنجاح!',
                'serverSyncedAt' => date('c')
            ], JSON_UNESCAPED_UNICODE);
            exit;
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to save transaction into SQLite database.']);
            exit;
        }
    }
}

// -------------------------------------------------------------
// Fallback: JSON File Engine (if SQLite extension is disabled)
// -------------------------------------------------------------
$activeJson = file_exists($jsonPrimary) ? $jsonPrimary : $jsonSecondary;

if ($method === 'GET') {
    if (file_exists($activeJson)) {
        $raw = file_get_contents($activeJson);
        $decoded = json_decode($raw, true);
        echo json_encode([
            'status' => 'success',
            'engine' => 'json_fallback',
            'lastUpdated' => date('c', filemtime($activeJson)),
            'data' => $decoded
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    echo json_encode(['status' => 'empty', 'data' => null]);
    exit;
}

if ($method === 'POST') {
    $inputJSON = file_get_contents('php://input');
    $payload = json_decode($inputJSON, true);
    if (is_array($payload)) {
        $encoded = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        
        $targets = [
            $jsonPrimary,
            $jsonSecondary,
            __DIR__ . '/tasty_database.json',
            sys_get_temp_dir() . '/tasty_database.json'
        ];

        $written = false;
        foreach ($targets as $target) {
            $w = @file_put_contents($target, $encoded, LOCK_EX);
            if ($w !== false) {
                $written = true;
                break;
            }
        }

        if ($written) {
            echo json_encode(['status' => 'success', 'engine' => 'json_fallback']);
            exit;
        } else {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Permission denied: server cannot write to files. Please run: chmod -R 777 /var/www/tasty'
            ]);
            exit;
        }
    }
    http_response_code(400);
    echo json_encode(['status' => 'error']);
    exit;
}

<?php
/**
 * TASTY Hilversum - Database Engine (PDO)
 * High resilience database engine supporting MySQL and automatic SQLite fallback.
 */

require_once __DIR__ . '/config.php';

function getDB(): PDO {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $connected = false;

    // 1. Try MySQL if configured
    if (DB_DRIVER === 'mysql' && extension_loaded('pdo_mysql')) {
        try {
            $dsn = sprintf("mysql:host=%s;dbname=%s;charset=%s", DB_HOST, DB_NAME, DB_CHARSET);
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_TIMEOUT => 2,
            ]);
            $connected = true;
        } catch (PDOException $e) {
            // If database doesn't exist on local MySQL, try to auto-create it
            try {
                $dsnNoDb = sprintf("mysql:host=%s;charset=%s", DB_HOST, DB_CHARSET);
                $tempPdo = new PDO($dsnNoDb, DB_USER, DB_PASS, [PDO::ATTR_TIMEOUT => 2]);
                $tempPdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                $dsn = sprintf("mysql:host=%s;dbname=%s;charset=%s", DB_HOST, DB_NAME, DB_CHARSET);
                $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_TIMEOUT => 2,
                ]);
                $connected = true;
            } catch (PDOException $e2) {
                // Fall back to SQLite
                $connected = false;
            }
        }
    }

    // 2. Seamless Fallback: SQLite in storage/tasty.sqlite
    if (!$connected) {
        $sqliteFile = STORAGE_PATH . '/tasty.sqlite';
        $pdo = new PDO('sqlite:' . $sqliteFile, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $pdo->exec("PRAGMA journal_mode = WAL;");
        $pdo->exec("PRAGMA busy_timeout = 5000;");
    }

    // Ensure database schema and seed data exist
    initDBSchema($pdo);

    return $pdo;
}

function initDBSchema(PDO $pdo): void {
    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
    $isMysql = ($driver === 'mysql');

    $autoInc = $isMysql ? "INT AUTO_INCREMENT PRIMARY KEY" : "INTEGER PRIMARY KEY AUTOINCREMENT";
    $textType = "TEXT";

    // 1. Users / Admins Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id $autoInc,
            username VARCHAR(50) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(20) NOT NULL DEFAULT 'manager',
            display_name VARCHAR(100) NOT NULL,
            created_at VARCHAR(50) NOT NULL
        )
    ");

    // 2. Daily Sales Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS daily_sales (
            id VARCHAR(80) PRIMARY KEY,
            date VARCHAR(20) NOT NULL UNIQUE,
            cash_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            card_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            cash_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
            card_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
            notes $textType,
            recorded_at VARCHAR(50) NOT NULL
        )
    ");

    // 3. Employees Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS employees (
            id VARCHAR(80) PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            phone VARCHAR(50),
            role VARCHAR(100),
            wage_type VARCHAR(20) NOT NULL DEFAULT 'hourly',
            rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            schedule_type VARCHAR(20) NOT NULL DEFAULT 'flexible',
            default_hours DECIMAL(5,2) NOT NULL DEFAULT 8.00,
            default_start_time VARCHAR(20) DEFAULT '10:00',
            default_end_time VARCHAR(20) DEFAULT '18:00',
            default_break_minutes INT DEFAULT 30,
            working_days_json $textType,
            is_active TINYINT NOT NULL DEFAULT 1,
            start_date VARCHAR(20),
            notes $textType,
            created_at VARCHAR(50) NOT NULL
        )
    ");

    // 4. Employee Shifts Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS employee_shifts (
            id VARCHAR(80) PRIMARY KEY,
            employee_id VARCHAR(80) NOT NULL,
            employee_name VARCHAR(150) NOT NULL,
            date VARCHAR(20) NOT NULL,
            start_time VARCHAR(20) NOT NULL,
            end_time VARCHAR(20) NOT NULL,
            break_minutes INT NOT NULL DEFAULT 0,
            total_hours DECIMAL(5,2) NOT NULL DEFAULT 0.00,
            hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            total_earned DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            payment_status VARCHAR(30) NOT NULL DEFAULT 'unpaid',
            paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            notes $textType,
            created_at VARCHAR(50) NOT NULL
        )
    ");

    // 5. Employee Advances Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS employee_advances (
            id VARCHAR(80) PRIMARY KEY,
            employee_id VARCHAR(80) NOT NULL,
            employee_name VARCHAR(150) NOT NULL,
            amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            date VARCHAR(20) NOT NULL,
            payment_method VARCHAR(20) NOT NULL DEFAULT 'cash',
            payment_type VARCHAR(30) NOT NULL DEFAULT 'advance',
            notes $textType,
            created_at VARCHAR(50) NOT NULL
        )
    ");

    // 6. Master Items / Inventory Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS master_items (
            id VARCHAR(80) PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            category VARCHAR(50) NOT NULL,
            unit VARCHAR(30) NOT NULL,
            default_qty DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            notes $textType,
            is_active TINYINT NOT NULL DEFAULT 1,
            created_at VARCHAR(50) NOT NULL
        )
    ");

    // 7. Purchase Orders Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS purchase_orders (
            id VARCHAR(80) PRIMARY KEY,
            order_number VARCHAR(50) NOT NULL,
            title VARCHAR(200) NOT NULL,
            date VARCHAR(20) NOT NULL,
            status VARCHAR(30) NOT NULL DEFAULT 'pending',
            items_json $textType,
            notes $textType,
            created_at VARCHAR(50) NOT NULL,
            completed_at VARCHAR(50)
        )
    ");

    // 8. Debts Table (STRICTLY Admin Only!)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS debts (
            id VARCHAR(80) PRIMARY KEY,
            party_name VARCHAR(200) NOT NULL,
            type VARCHAR(20) NOT NULL DEFAULT 'payable',
            category VARCHAR(50) NOT NULL DEFAULT 'supplier',
            phone VARCHAR(50),
            total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            remaining_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            status VARCHAR(30) NOT NULL DEFAULT 'unpaid',
            created_date VARCHAR(20) NOT NULL,
            due_date VARCHAR(20),
            notes $textType,
            description $textType,
            payments_json $textType
        )
    ");

    // Seed Default Users if table is empty
    $userCount = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    if ($userCount == 0) {
        $stmt = $pdo->prepare("INSERT INTO users (username, password_hash, role, display_name, created_at) VALUES (?, ?, ?, ?, ?)");
        // Admin: admin / tasty2025
        $stmt->execute(['admin', password_hash('tasty2025', PASSWORD_DEFAULT), 'admin', 'المدير العام', date('c')]);
        // Manager: manager / tasty123
        $stmt->execute(['manager', password_hash('tasty123', PASSWORD_DEFAULT), 'manager', 'مدير الوردية', date('c')]);
    }

    // Seed Master Items if empty
    $itemsCount = $pdo->query("SELECT COUNT(*) FROM master_items")->fetchColumn();
    if ($itemsCount == 0) {
        seedInitialMasterItems($pdo);
    }

    // Seed Initial Employees if empty
    $empCount = $pdo->query("SELECT COUNT(*) FROM employees")->fetchColumn();
    if ($empCount == 0) {
        seedInitialEmployees($pdo);
    }
}

function seedInitialEmployees(PDO $pdo): void {
    $employees = [
        [
            'id' => 'emp-1',
            'name' => 'أبو أحمد الشامي',
            'phone' => '0612345671',
            'role' => 'معلم شاورما رئيسي',
            'wage_type' => 'hourly',
            'rate' => 14.50,
            'schedule_type' => 'fixed',
            'default_hours' => 8.00,
            'default_start_time' => '10:00',
            'default_end_time' => '18:30',
            'default_break_minutes' => 30,
            'working_days_json' => json_encode([1, 2, 3, 4, 5, 6, 0]),
            'is_active' => 1,
            'start_date' => '2026-01-15',
            'notes' => 'مسؤول سيخ الشاورما وتجهيز التتبيلة الصباحية',
            'created_at' => date('c'),
        ],
        [
            'id' => 'emp-2',
            'name' => 'سامر العلي',
            'phone' => '0687654321',
            'role' => 'كاشير وخدمة صالة',
            'wage_type' => 'hourly',
            'rate' => 12.00,
            'schedule_type' => 'fixed',
            'default_hours' => 7.50,
            'default_start_time' => '11:00',
            'default_end_time' => '19:00',
            'default_break_minutes' => 30,
            'working_days_json' => json_encode([2, 3, 4, 5, 6, 0]),
            'is_active' => 1,
            'start_date' => '2026-03-01',
            'notes' => 'استلام الصندوق وطلبيات الهاتف والزبائن',
            'created_at' => date('c'),
        ],
        [
            'id' => 'emp-3',
            'name' => 'محمود الحلبي',
            'phone' => '0645678912',
            'role' => 'شيف معجنات ومناقيش',
            'wage_type' => 'hourly',
            'rate' => 13.50,
            'schedule_type' => 'fixed',
            'default_hours' => 7.50,
            'default_start_time' => '09:00',
            'default_end_time' => '17:00',
            'default_break_minutes' => 30,
            'working_days_json' => json_encode([2, 3, 4, 5, 6, 0]),
            'is_active' => 1,
            'start_date' => '2026-02-10',
            'notes' => 'فرن المعجنات، العجين، والصفائح الشامية',
            'created_at' => date('c'),
        ],
        [
            'id' => 'emp-4',
            'name' => 'يوسف المصري',
            'phone' => '0698761234',
            'role' => 'مساعد مطبخ وتجهيز وسلطات',
            'wage_type' => 'hourly',
            'rate' => 11.50,
            'schedule_type' => 'flexible',
            'default_hours' => 8.00,
            'default_start_time' => '12:00',
            'default_end_time' => '20:30',
            'default_break_minutes' => 30,
            'working_days_json' => json_encode([5, 6, 0]),
            'is_active' => 1,
            'start_date' => '2026-05-01',
            'notes' => 'تقطيع الخضار والمقالي والتغليف',
            'created_at' => date('c'),
        ]
    ];

    $stmt = $pdo->prepare("INSERT INTO employees (id, name, phone, role, wage_type, rate, schedule_type, default_hours, default_start_time, default_end_time, default_break_minutes, working_days_json, is_active, start_date, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($employees as $e) {
        $stmt->execute([
            $e['id'], $e['name'], $e['phone'], $e['role'], $e['wage_type'],
            $e['rate'], $e['schedule_type'], $e['default_hours'], $e['default_start_time'],
            $e['default_end_time'], $e['default_break_minutes'], $e['working_days_json'],
            $e['is_active'], $e['start_date'], $e['notes'], $e['created_at']
        ]);
    }
}

function seedInitialMasterItems(PDO $pdo): void {
    $items = [
        ['mi-1', 'شاورما دجاج متبلة (جاهزة للشيش)', 'meat', 'kg', 40, 'تتبيلة المستودع المركزية رقم 1'],
        ['mi-2', 'لحم عجل طازج شاورما', 'meat', 'kg', 30, 'قطع رقيقة متبلة بدون دهن زائد'],
        ['mi-3', 'لحم مفروم ناعم للمناقيش والصفائح', 'meat', 'kg', 15, 'مخلوط غنم وعجل 20% دهن'],
        ['mi-4', 'بطاطس فريتس نصف مقلية كريسبي 9x9', 'vegetables', 'box', 12, 'كرتون 10 كغ (ماركة Lutosa أو Farm Frites)'],
        ['mi-5', 'بندورة حمراء قاسية للسلطة والتقطيع', 'vegetables', 'box', 5, 'صندوق 6 كغ'],
        ['mi-6', 'خيار هولندي طازج درجة أولى', 'vegetables', 'box', 4, 'صندوق كرتون كبير'],
        ['mi-7', 'بصل أحمر حلو وبصل أبيض', 'vegetables', 'bag', 4, 'أكياس خيش 10 كغ'],
        ['mi-8', 'خس آيسبيرغ طازج (Iceberg)', 'vegetables', 'box', 6, '10 حبات في الصندوق'],
        ['mi-9', 'ثوم طازج مقشر ونظيف', 'vegetables', 'box', 3, 'علب بلاستيك 5 كغ لصوص الثوم'],
        ['mi-10', 'خبز صاج / سوري طازج رقيق', 'bread', 'bag', 25, 'أكياس 10 أرغفة من المخبز السوري'],
        ['mi-11', 'خبز تورتيلا 30 سم كبير', 'bread', 'box', 8, 'كرتون 72 حبة (للطلبات السريعة)'],
        ['mi-12', 'جبنة قشقوان فاخرة مبشورة', 'dairy_sauces', 'kg', 18, 'للمناقيش والكبسلون'],
        ['mi-13', 'جبنة موزاريلا مبشورة 100%', 'dairy_sauces', 'kg', 20, 'سريعة الذوبان للكبسلون'],
        ['mi-14', 'طحينة سمسم نقية درجة أولى', 'dry_goods', 'box', 3, 'سطل 18 كغ'],
        ['mi-15', 'مخلل خيار ولفت وردي مقرمش', 'dry_goods', 'box', 4, 'براميل بلاستيك 10 كغ'],
        ['mi-16', 'زيت نباتي نقي للقلي العميق', 'dry_goods', 'box', 6, 'علب معدنية 10 لتر'],
        ['mi-17', 'علب كبسولون ألمنيوم مع أغطية حرارية', 'packaging', 'box', 5, 'كرتون 500 علبة حجم وسط وكبير'],
        ['mi-18', 'ورق لف ساندويش مانع للزيوت مطبوع Tasty', 'packaging', 'box', 3, 'كرتون 1000 ورقة'],
        ['mi-19', 'أكياس ورقية كرافت بمقابض تيك أواي', 'packaging', 'box', 4, 'صندوق 250 كيس'],
        ['mi-20', 'مشروبات غازية كوكاكولا وفانتا وسبرايت', 'drinks', 'box', 10, 'علب كانز 330 مل كرتونة 24 حبة'],
        ['mi-21', 'عيران تركي مثلج Yayla', 'drinks', 'box', 6, 'صندوق 20 كوب 250 مل'],
    ];

    $stmt = $pdo->prepare("INSERT INTO master_items (id, name, category, unit, default_qty, notes, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?)");
    foreach ($items as $item) {
        $stmt->execute([$item[0], $item[1], $item[2], $item[3], $item[4], $item[5], date('Y-m-d')]);
    }
}

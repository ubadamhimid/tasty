<?php
/**
 * TASTY Hilversum - Configuration File
 * Configure database connection and restaurant parameters.
 */

// Timezone & Locale
date_default_timezone_set('Europe/Amsterdam');

// Session configuration (Secure session settings)
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// -----------------------------------------------------------------
// Database Configuration
// -----------------------------------------------------------------
// By default, the system will attempt to connect to MySQL.
// If MySQL is not created yet or credentials fail, it seamlessly
// uses SQLite in storage/tasty.sqlite without interrupting operations.
// -----------------------------------------------------------------
define('DB_DRIVER', 'mysql'); // 'mysql' or 'sqlite'
define('DB_HOST', 'localhost');
define('DB_NAME', 'tasty_hilversum');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Restaurant Information
define('RESTAURANT_NAME', 'TASTY Levantine Flavours');
define('RESTAURANT_ADDRESS', 'Groest 50, 1211 EC Hilversum');
define('RESTAURANT_PHONE', '+31 35 204 2001');
define('RESTAURANT_WHATSAPP', '31352042001');
define('RESTAURANT_HOURS', '12:00 - 22:00');

// App Paths & URL Detection (supports both domain root and subfolders like /tasty/)
define('BASE_PATH', __DIR__);
define('STORAGE_PATH', __DIR__ . '/storage');
define('BACKUP_PATH', __DIR__ . '/storage/backups');

$reqScript = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '');
$scriptDir = dirname($reqScript);
if (substr($scriptDir, -6) === '/admin') {
    $scriptDir = substr($scriptDir, 0, -6);
}
define('APP_URL', rtrim($scriptDir, '/\\'));

// Ensure storage directories exist
if (!is_dir(STORAGE_PATH)) {
    @mkdir(STORAGE_PATH, 0777, true);
}
if (!is_dir(BACKUP_PATH)) {
    @mkdir(BACKUP_PATH, 0777, true);
}
@chmod(STORAGE_PATH, 0777);
@chmod(BACKUP_PATH, 0777);

<?php
/**
 * TASTY Hilversum - Admin Authentication & Session Management
 * Role-Based Access Control (Admin vs Manager)
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';

function isLoggedIn(): bool {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

function getCurrentUser(): ?array {
    if (!isLoggedIn()) {
        return null;
    }
    return [
        'id' => $_SESSION['user_id'],
        'username' => $_SESSION['username'],
        'role' => $_SESSION['role'],
        'displayName' => $_SESSION['display_name'],
    ];
}

function isAdmin(): bool {
    return isLoggedIn() && ($_SESSION['role'] === 'admin');
}

function isManager(): bool {
    return isLoggedIn() && ($_SESSION['role'] === 'manager');
}

function requireAuth(): void {
    if (!isLoggedIn()) {
        header('Location: ' . APP_URL . '/admin/login.php');
        exit;
    }
}

function requireAdmin(): void {
    requireAuth();
    if (!isAdmin()) {
        $_SESSION['flash_error'] = 'عذراً، هذا القسم مخصص للمدير العام فقط.';
        header('Location: ' . APP_URL . '/admin/sales.php');
        exit;
    }
}

function loginUser(string $username, string $password): array {
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([trim(strtolower($username))]);
    $user = $stmt->fetch();

    if (!$user) {
        return ['success' => false, 'error' => 'اسم المستخدم غير مسجل.'];
    }

    if (!password_verify($password, $user['password_hash'])) {
        return ['success' => false, 'error' => 'كلمة المرور غير صحيحة.'];
    }

    // Set session variables
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['role'] = $user['role'];
    $_SESSION['display_name'] = $user['display_name'];

    return ['success' => true, 'role' => $user['role']];
}

function logoutUser(): void {
    if (session_status() === PHP_SESSION_ACTIVE) {
        $_SESSION = [];
        session_destroy();
    }
    header('Location: ' . APP_URL . '/admin/login.php');
    exit;
}

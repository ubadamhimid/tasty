<?php
require_once __DIR__ . '/auth.php';
requireAdmin(); // STRICTLY Admin Only

$db = getDB();
$dbDriver = strtoupper($db->getAttribute(PDO::ATTR_DRIVER_NAME));

$successMsg = '';
$errorMsg = '';

// Handle Password Updates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_password') {
    $targetUsername = trim($_POST['username'] ?? '');
    $newPassword = trim($_POST['new_password'] ?? '');
    $confirmPassword = trim($_POST['confirm_password'] ?? '');

    if (empty($targetUsername) || empty($newPassword)) {
        $errorMsg = 'يرجى إدخال اسم المستخدم وكلمة المرور الجديدة.';
    } elseif ($newPassword !== $confirmPassword) {
        $errorMsg = 'كلمة المرور وتأكيد كلمة المرور غير متطابقين.';
    } elseif (strlen($newPassword) < 4) {
        $errorMsg = 'كلمة المرور يجب أن تتكون من 4 خانات على الأقل.';
    } else {
        $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $db->prepare("UPDATE users SET password = ? WHERE username = ?");
        $stmt->execute([$newHash, $targetUsername]);
        if ($stmt->rowCount() > 0) {
            $successMsg = "تم تحديث كلمة المرور للحساب ({$targetUsername}) بنجاح!";
        } else {
            $errorMsg = "الحساب غير موجود أو كلمة المرور لم تتغير.";
        }
    }
}

// Handle Export Backup
if (isset($_GET['action']) && $_GET['action'] === 'export_backup') {
    $tables = [
        'users' => 'SELECT id, username, role, full_name, created_at FROM users',
        'daily_sales' => 'SELECT * FROM daily_sales',
        'employees' => 'SELECT * FROM employees',
        'employee_shifts' => 'SELECT * FROM employee_shifts',
        'employee_advances' => 'SELECT * FROM employee_advances',
        'master_items' => 'SELECT * FROM master_items',
        'purchase_orders' => 'SELECT * FROM purchase_orders',
        'debts' => 'SELECT * FROM debts'
    ];

    $backupData = [
        'version' => '2.0',
        'exported_at' => date('Y-m-d H:i:s'),
        'tables' => []
    ];

    foreach ($tables as $tableName => $query) {
        try {
            $stmt = $db->query($query);
            $backupData['tables'][$tableName] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            $backupData['tables'][$tableName] = [];
        }
    }

    $json = json_encode($backupData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    $filename = 'tasty_backup_' . date('Y-m-d_His') . '.json';

    header('Content-Type: application/json; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    echo $json;
    exit;
}

// Handle Import Backup
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'import_backup') {
    if (isset($_FILES['backup_file']) && $_FILES['backup_file']['error'] === UPLOAD_ERR_OK) {
        $fileContent = file_get_contents($_FILES['backup_file']['tmp_name']);
        $decoded = json_decode($fileContent, true);

        if (!$decoded || !isset($decoded['tables'])) {
            $errorMsg = 'الملف المرفوع غير صالح أو ليس بتنسيق JSON صحيح لنسخ الاحتياطي.';
        } else {
            $importedCounts = [];
            $db->beginTransaction();
            try {
                // Restore daily_sales
                if (!empty($decoded['tables']['daily_sales'])) {
                    $stmt = $db->prepare("INSERT OR REPLACE INTO daily_sales (id, date, cash_amount, pin_amount, total_amount, notes, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
                    // Handle MySQL REPLACE
                    if ($dbDriver === 'MYSQL') {
                        $stmt = $db->prepare("REPLACE INTO daily_sales (id, date, cash_amount, pin_amount, total_amount, notes, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
                    }
                    $c = 0;
                    foreach ($decoded['tables']['daily_sales'] as $row) {
                        $stmt->execute([
                            $row['id'] ?? uniqid('sale_'),
                            $row['date'],
                            $row['cash_amount'] ?? 0,
                            $row['pin_amount'] ?? 0,
                            $row['total_amount'] ?? 0,
                            $row['notes'] ?? '',
                            $row['updated_at'] ?? date('Y-m-d H:i:s')
                        ]);
                        $c++;
                    }
                    $importedCounts['المبيعات'] = $c;
                }

                // Restore employees
                if (!empty($decoded['tables']['employees'])) {
                    $insEmp = ($dbDriver === 'MYSQL') 
                        ? "REPLACE INTO employees (id, name, role, hourly_rate, phone, active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
                        : "INSERT OR REPLACE INTO employees (id, name, role, hourly_rate, phone, active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
                    $stmt = $db->prepare($insEmp);
                    $c = 0;
                    foreach ($decoded['tables']['employees'] as $row) {
                        $stmt->execute([
                            $row['id'],
                            $row['name'],
                            $row['role'] ?? 'موظف',
                            $row['hourly_rate'] ?? 10,
                            $row['phone'] ?? '',
                            $row['active'] ?? 1,
                            $row['created_at'] ?? date('Y-m-d H:i:s')
                        ]);
                        $c++;
                    }
                    $importedCounts['الموظفين'] = $c;
                }

                // Restore shifts
                if (!empty($decoded['tables']['employee_shifts'])) {
                    $insShift = ($dbDriver === 'MYSQL')
                        ? "REPLACE INTO employee_shifts (id, employee_id, date, hours_worked, hourly_rate, total_pay, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
                        : "INSERT OR REPLACE INTO employee_shifts (id, employee_id, date, hours_worked, hourly_rate, total_pay, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    $stmt = $db->prepare($insShift);
                    $c = 0;
                    foreach ($decoded['tables']['employee_shifts'] as $row) {
                        $stmt->execute([
                            $row['id'],
                            $row['employee_id'],
                            $row['date'],
                            $row['hours_worked'],
                            $row['hourly_rate'],
                            $row['total_pay'],
                            $row['notes'] ?? '',
                            $row['created_at'] ?? date('Y-m-d H:i:s')
                        ]);
                        $c++;
                    }
                    $importedCounts['الورديات'] = $c;
                }

                // Restore debts
                if (!empty($decoded['tables']['debts'])) {
                    $insDebt = ($dbDriver === 'MYSQL')
                        ? "REPLACE INTO debts (id, party_type, person_or_supplier_name, phone, original_amount, paid_amount, remaining_amount, due_date, status, notes, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                        : "INSERT OR REPLACE INTO debts (id, party_type, person_or_supplier_name, phone, original_amount, paid_amount, remaining_amount, due_date, status, notes, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    $stmt = $db->prepare($insDebt);
                    $c = 0;
                    foreach ($decoded['tables']['debts'] as $row) {
                        $stmt->execute([
                            $row['id'],
                            $row['party_type'] ?? 'supplier',
                            $row['person_or_supplier_name'],
                            $row['phone'] ?? '',
                            $row['original_amount'],
                            $row['paid_amount'] ?? 0,
                            $row['remaining_amount'] ?? $row['original_amount'],
                            $row['due_date'] ?? null,
                            $row['status'] ?? 'pending',
                            $row['notes'] ?? '',
                            $row['updated_at'] ?? date('Y-m-d H:i:s')
                        ]);
                        $c++;
                    }
                    $importedCounts['الديون'] = $c;
                }

                $db->commit();
                $details = [];
                foreach ($importedCounts as $k => $v) {
                    $details[] = "$k: $v";
                }
                $successMsg = 'تم استيراد واسترجاع البيانات بنجاح (' . implode('، ', $details) . ')!';
            } catch (Exception $e) {
                $db->rollBack();
                $errorMsg = 'فشل الاستيراد: ' . $e->getMessage();
            }
        }
    } else {
        $errorMsg = 'يرجى اختيار ملف JSON صالح للاستيراد.';
    }
}

// Fetch stats for database overview
$stats = [
    'users_count' => $db->query("SELECT COUNT(*) FROM users")->fetchColumn(),
    'sales_count' => $db->query("SELECT COUNT(*) FROM daily_sales")->fetchColumn(),
    'employees_count' => $db->query("SELECT COUNT(*) FROM employees")->fetchColumn(),
    'shifts_count' => $db->query("SELECT COUNT(*) FROM employee_shifts")->fetchColumn(),
    'orders_count' => $db->query("SELECT COUNT(*) FROM purchase_orders")->fetchColumn(),
    'debts_count' => $db->query("SELECT COUNT(*) FROM debts")->fetchColumn(),
];

// Fetch users list
$usersList = $db->query("SELECT id, username, role, full_name FROM users ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);

$pageTitle = 'الإعدادات وقاعدة البيانات - TASTY Hilversum';
require_once __DIR__ . '/header.php';
?>

<div class="space-y-8">
  <!-- Top Header Title -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-tasty-teal/10 pb-6">
    <div>
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-tasty-teal/15 text-tasty-teal border border-tasty-teal/20 mb-2">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
        صلاحيات الإدارة العليا فقط (Admin Only)
      </span>
      <h1 class="text-2xl md:text-3xl font-extrabold text-tasty-charcoal font-tajawal">إعدادات النظام والنسخ الاحتياطي</h1>
      <p class="text-sm text-gray-500 mt-1">إدارة كلمات المرور، حالة قاعدة البيانات المركزية، والنسخ الاحتياطي التلقائي لحماية بيانات المطعم</p>
    </div>

    <!-- Quick Export Button -->
    <a href="?action=export_backup" class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-tasty-teal text-white shadow-lg shadow-tasty-teal/20 hover:bg-tasty-teal-dark transition transform active:scale-95">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
      تحميل نسخة احتياطية فورية (JSON)
    </a>
  </div>

  <?php if (!empty($successMsg)): ?>
    <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-fade-in shadow-sm">
      <svg class="w-6 h-6 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      <span class="font-bold text-sm md:text-base"><?= htmlspecialchars($successMsg) ?></span>
    </div>
  <?php endif; ?>

  <?php if (!empty($errorMsg)): ?>
    <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 animate-fade-in shadow-sm">
      <svg class="w-6 h-6 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      <span class="font-bold text-sm md:text-base"><?= htmlspecialchars($errorMsg) ?></span>
    </div>
  <?php endif; ?>

  <!-- Database Overview Card -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div class="flex items-start gap-4">
        <div class="w-14 h-14 rounded-2xl bg-tasty-teal/10 flex items-center justify-center text-tasty-teal shrink-0">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-bold text-tasty-charcoal">محرك قاعدة البيانات النشط</h2>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase <?= $dbDriver === 'MYSQL' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-blue-100 text-blue-800 border border-blue-300' ?>">
              <?= $dbDriver ?>
            </span>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            <?= $dbDriver === 'MYSQL' 
                ? 'متصل بقاعدة بيانات MySQL السحابية/المحلية (مستقرة ودائمة ولا تتأثر بالتحديثات).' 
                : 'قاعدة بيانات SQLite محلية آمنة وموجودة داخل مجلد storage/tasty.sqlite (لا يتم مسحها أبداً مع git pull).' ?>
          </p>
        </div>
      </div>

      <!-- Quick Metrics Counters -->
      <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
        <div class="bg-gray-50 p-2.5 rounded-xl text-center border border-gray-100">
          <div class="text-lg font-black text-tasty-charcoal"><?= $stats['sales_count'] ?></div>
          <div class="text-[10px] text-gray-500 font-bold">أيام المبيعات</div>
        </div>
        <div class="bg-gray-50 p-2.5 rounded-xl text-center border border-gray-100">
          <div class="text-lg font-black text-tasty-charcoal"><?= $stats['employees_count'] ?></div>
          <div class="text-[10px] text-gray-500 font-bold">الموظفون</div>
        </div>
        <div class="bg-gray-50 p-2.5 rounded-xl text-center border border-gray-100">
          <div class="text-lg font-black text-tasty-charcoal"><?= $stats['shifts_count'] ?></div>
          <div class="text-[10px] text-gray-500 font-bold">سجلات الورديات</div>
        </div>
        <div class="bg-gray-50 p-2.5 rounded-xl text-center border border-gray-100">
          <div class="text-lg font-black text-tasty-charcoal"><?= $stats['orders_count'] ?></div>
          <div class="text-[10px] text-gray-500 font-bold">طلبيات الشراء</div>
        </div>
        <div class="bg-gray-50 p-2.5 rounded-xl text-center border border-gray-100">
          <div class="text-lg font-black text-tasty-charcoal"><?= $stats['debts_count'] ?></div>
          <div class="text-[10px] text-gray-500 font-bold">سجلات الديون</div>
        </div>
        <div class="bg-gray-50 p-2.5 rounded-xl text-center border border-gray-100">
          <div class="text-lg font-black text-tasty-charcoal"><?= $stats['users_count'] ?></div>
          <div class="text-[10px] text-gray-500 font-bold">الحسابات</div>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Section 1: Change Passwords -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <div class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
          </div>
          <h2 class="text-lg font-bold text-tasty-charcoal">تغيير كلمات المرور</h2>
        </div>
        <p class="text-xs text-gray-500 mb-6">
          يمكنك كمدير عام (Admin) تغيير كلمة المرور الخاصة بحسابك أو بحساب المشرف (Manager) في أي وقت لحماية النظام.
        </p>

        <form method="POST" class="space-y-4">
          <input type="hidden" name="action" value="update_password">

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">اختر الحساب المراد تعديل كلمة مروره:</label>
            <select name="username" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tasty-teal focus:bg-white text-sm font-semibold outline-none transition" required>
              <?php foreach ($usersList as $u): ?>
                <option value="<?= htmlspecialchars($u['username']) ?>">
                  <?= htmlspecialchars($u['username']) ?> (<?= $u['role'] === 'admin' ? 'المدير العام - كافة الصلاحيات' : 'مشرف الصالة/الكاشير' ?>)
                </option>
              <?php endforeach; ?>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">كلمة المرور الجديدة:</label>
            <input type="password" name="new_password" placeholder="أدخل كلمة المرور الجديدة..." required minlength="4" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tasty-teal focus:bg-white text-sm outline-none transition">
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">تأكيد كلمة المرور الجديدة:</label>
            <input type="password" name="confirm_password" placeholder="أعد كتابة كلمة المرور للتأكيد..." required minlength="4" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tasty-teal focus:bg-white text-sm outline-none transition">
          </div>

          <button type="submit" class="w-full mt-2 py-3 bg-tasty-teal text-white font-bold rounded-xl shadow-md hover:bg-tasty-teal-dark transition flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            تحديث كلمة المرور الآن
          </button>
        </form>
      </div>

      <div class="mt-6 pt-4 border-t border-gray-100 text-[11px] text-gray-400">
        ملاحظة: كلمات المرور مشفرة بأقوى خوارزميات التشفير (Bcrypt) ولا يمكن قراءتها من أي شخص.
      </div>
    </div>

    <!-- Section 2: Backup & Restore -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <div class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <div class="w-8 h-8 rounded-lg bg-teal-50 text-tasty-teal flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
          </div>
          <h2 class="text-lg font-bold text-tasty-charcoal">النسخ الاحتياطي والاسترجاع</h2>
        </div>
        <p class="text-xs text-gray-500 mb-6">
          يمكنك استخراج نسخة كاملة من بيانات المبيعات، الموظفين، الورديات، والديون بصيغة JSON خفيفة لتخزينها على جهازك الشخصي واستعادتها في أي وقت.
        </p>

        <!-- Export Block -->
        <div class="p-4 rounded-xl bg-gray-50 border border-gray-200 mb-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-bold text-tasty-charcoal">تصدير قاعدة البيانات (Export)</div>
              <div class="text-xs text-gray-500">حفظ جميع البيانات الحالية في ملف JSON فوري</div>
            </div>
            <a href="?action=export_backup" class="px-4 py-2 bg-white border border-tasty-teal text-tasty-teal rounded-xl text-xs font-bold hover:bg-tasty-teal hover:text-white transition">
              تحميل النسخة
            </a>
          </div>
        </div>

        <!-- Import Block -->
        <form method="POST" enctype="multipart/form-data" class="space-y-4" onsubmit="return confirm('هل أنت متأكد من استرجاع البيانات من الملف المختار؟ سيتم تحديث السجلات المطابقة.');">
          <input type="hidden" name="action" value="import_backup">

          <div class="p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center">
            <label class="block cursor-pointer">
              <svg class="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
              <span class="text-xs font-bold text-tasty-teal hover:underline block">اختر ملف نسخة احتياطية (.json)</span>
              <span class="text-[11px] text-gray-400 block mt-1">يجب أن يكون الملف صادر مسبقاً من نظام TASTY</span>
              <input type="file" name="backup_file" accept=".json" required class="hidden" id="backupFileInput" onchange="document.getElementById('fileNameDisplay').textContent = this.files[0] ? this.files[0].name : '';">
            </label>
            <div id="fileNameDisplay" class="text-xs font-bold text-gray-700 mt-2"></div>
          </div>

          <button type="submit" class="w-full py-3 bg-amber-600 text-white font-bold rounded-xl shadow-md hover:bg-amber-700 transition flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            استرجاع ودمج البيانات من الملف
          </button>
        </form>
      </div>

      <div class="mt-6 pt-4 border-t border-gray-100 text-[11px] text-gray-400">
        تنبيه: استرجاع البيانات سيقوم بإضافة السجلات غير الموجودة وتحديث السجلات التي تحمل نفس المعرّف.
      </div>
    </div>
  </div>
</div>

<?php require_once __DIR__ . '/footer.php'; ?>

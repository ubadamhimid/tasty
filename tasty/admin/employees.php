<?php
$pageTitle = 'الموظفون والورديات والأجور — لوحة إدارة TASTY';
require_once __DIR__ . '/header.php';

$db = getDB();
$message = '';
$error = '';
$todayStr = date('Y-m-d');

// Arabic Day Names
$arabicDays = [
    'Sat' => 'السبت', 'Sun' => 'الأحد', 'Mon' => 'الإثنين',
    'Tue' => 'الثلاثاء', 'Wed' => 'الأربعاء', 'Thu' => 'الخميس', 'Fri' => 'الجمعة'
];
$todayDayName = $arabicDays[date('D')] ?? date('l');

// Handle Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];

    // 1. Save or Update Employee
    if ($action === 'save_employee') {
        $id = trim($_POST['id'] ?? '');
        $name = trim($_POST['name'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $role = trim($_POST['role'] ?? 'كادر ومساعد مطبخ');
        $wageType = trim($_POST['wage_type'] ?? 'hourly'); // 'hourly' or 'daily'
        $rate = floatval($_POST['rate'] ?? 0);
        $scheduleType = trim($_POST['schedule_type'] ?? 'flexible'); // 'fixed' or 'flexible'
        $defaultHours = floatval($_POST['default_hours'] ?? 8);
        $defaultStart = trim($_POST['default_start_time'] ?? '10:00');
        $defaultEnd = trim($_POST['default_end_time'] ?? '18:00');
        $defaultBreak = intval($_POST['default_break_minutes'] ?? 30);
        $notes = trim($_POST['notes'] ?? '');

        if (empty($name)) {
            $error = 'يرجى إدخال اسم الموظف.';
        } else {
            if (!empty($id)) {
                $stmt = $db->prepare("UPDATE employees SET name=?, phone=?, role=?, wage_type=?, rate=?, schedule_type=?, default_hours=?, default_start_time=?, default_end_time=?, default_break_minutes=?, notes=? WHERE id=?");
                $stmt->execute([$name, $phone, $role, $wageType, $rate, $scheduleType, $defaultHours, $defaultStart, $defaultEnd, $defaultBreak, $notes, $id]);
                $message = 'تم تحديث بيانات الموظف بنجاح!';
            } else {
                $newId = 'emp-' . time() . '-' . substr(md5(uniqid()), 0, 4);
                $stmt = $db->prepare("INSERT INTO employees (id, name, phone, role, wage_type, rate, schedule_type, default_hours, default_start_time, default_end_time, default_break_minutes, is_active, start_date, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)");
                $stmt->execute([$newId, $name, $phone, $role, $wageType, $rate, $scheduleType, $defaultHours, $defaultStart, $defaultEnd, $defaultBreak, date('Y-m-d'), $notes, date('c')]);
                $message = 'تمت إضافة الموظف الجديد بنجاح!';
            }
        }
    }

    // 2. Delete Employee
    elseif ($action === 'delete_employee') {
        $id = trim($_POST['id'] ?? '');
        if (!empty($id)) {
            $stmt = $db->prepare("DELETE FROM employees WHERE id = ?");
            $stmt->execute([$id]);
            $message = 'تم حذف الموظف بنجاح من القائمة.';
        }
    }

    // 3. Quick 1-Click Attendance for Today
    elseif ($action === 'quick_log_today') {
        $empId = trim($_POST['employee_id'] ?? '');
        $empStmt = $db->prepare("SELECT * FROM employees WHERE id = ?");
        $empStmt->execute([$empId]);
        $empRow = $empStmt->fetch();

        if ($empRow) {
            $chk = $db->prepare("SELECT COUNT(*) FROM employee_shifts WHERE employee_id = ? AND date = ?");
            $chk->execute([$empId, $todayStr]);
            if (!$chk->fetchColumn()) {
                $hours = floatval($empRow['default_hours'] ?: 8);
                $rate = floatval($empRow['rate']);
                $wageType = $empRow['wage_type'] ?? 'hourly';
                $earned = ($wageType === 'daily') ? $rate : round($hours * $rate, 2);
                $start = $empRow['default_start_time'] ?: '10:00';
                $end = $empRow['default_end_time'] ?: '18:00';
                $break = intval($empRow['default_break_minutes'] ?? 30);

                $shiftId = 'shift-' . time() . '-' . substr(md5(uniqid()), 0, 4);
                $ins = $db->prepare("INSERT INTO employee_shifts (id, employee_id, employee_name, date, start_time, end_time, break_minutes, total_hours, hourly_rate, total_earned, payment_status, paid_amount, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unpaid', 0, 'تحضير سريع للدوام', ?)");
                $ins->execute([$shiftId, $empId, $empRow['name'], $todayStr, $start, $end, $break, $hours, $rate, $earned, date('c')]);
                $message = '⚡ تم تسجيل حضور اليوم لـ (' . $empRow['name'] . ') بنجاح (' . $hours . ' ساعة)!';
            } else {
                $error = 'الموظف (' . $empRow['name'] . ') مسجل حضوره لليوم مسبقاً.';
            }
        }
    }

    // 4. Quick 1-Click Attendance for ALL Fixed Staff Today
    elseif ($action === 'quick_log_all_fixed_today') {
        $fixed = $db->query("SELECT * FROM employees WHERE schedule_type = 'fixed' AND is_active = 1")->fetchAll();
        $added = 0;
        foreach ($fixed as $empRow) {
            $chk = $db->prepare("SELECT COUNT(*) FROM employee_shifts WHERE employee_id = ? AND date = ?");
            $chk->execute([$empRow['id'], $todayStr]);
            if (!$chk->fetchColumn()) {
                $hours = floatval($empRow['default_hours'] ?: 8);
                $rate = floatval($empRow['rate']);
                $wageType = $empRow['wage_type'] ?? 'hourly';
                $earned = ($wageType === 'daily') ? $rate : round($hours * $rate, 2);
                $start = $empRow['default_start_time'] ?: '10:00';
                $end = $empRow['default_end_time'] ?: '18:00';
                $break = intval($empRow['default_break_minutes'] ?? 30);

                $shiftId = 'shift-' . time() . '-' . substr(md5(uniqid()), 0, 4);
                $ins = $db->prepare("INSERT INTO employee_shifts (id, employee_id, employee_name, date, start_time, end_time, break_minutes, total_hours, hourly_rate, total_earned, payment_status, paid_amount, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unpaid', 0, 'تحضير سريع للدوام الثابت', ?)");
                $ins->execute([$shiftId, $empRow['id'], $empRow['name'], $todayStr, $start, $end, $break, $hours, $rate, $earned, date('c')]);
                $added++;
            }
        }
        if ($added > 0) {
            $message = "⚡ تم تسجيل حضور ($added) موظف ثابت لليوم بنجاح بضغطة زر واحدة!";
        } else {
            $message = "جميع الموظفين ذوي الدوام الثابت مسجل حضورهم لليوم مسبقاً.";
        }
    }

    // 5. Log Shift (Manual Modal)
    elseif ($action === 'save_shift') {
        $empId = trim($_POST['employee_id'] ?? '');
        $date = trim($_POST['shift_date'] ?? date('Y-m-d'));
        $start = trim($_POST['start_time'] ?? '10:00');
        $end = trim($_POST['end_time'] ?? '18:00');
        $break = intval($_POST['break_minutes'] ?? 0);
        $rate = floatval($_POST['hourly_rate'] ?? 0);
        $customHours = floatval($_POST['total_hours'] ?? 0);
        $status = trim($_POST['payment_status'] ?? 'unpaid');
        $notes = trim($_POST['notes'] ?? '');

        $emp = $db->prepare("SELECT name, rate, wage_type FROM employees WHERE id = ?");
        $emp->execute([$empId]);
        $empRow = $emp->fetch();

        if (!$empRow) {
            $error = 'الموظف المحدد غير موجود.';
        } else {
            if ($rate <= 0) $rate = floatval($empRow['rate']);
            $wageType = $empRow['wage_type'] ?? 'hourly';

            if ($customHours > 0) {
                $totalHours = $customHours;
            } else {
                $startTs = strtotime("2000-01-01 $start");
                $endTs = strtotime("2000-01-01 $end");
                if ($endTs < $startTs) $endTs += 86400; // Overnight
                $diffMinutes = ($endTs - $startTs) / 60;
                $workMinutes = max(0, $diffMinutes - $break);
                $totalHours = round($workMinutes / 60, 2);
            }

            if ($wageType === 'daily') {
                $totalEarned = $rate;
            } else {
                $totalEarned = round($totalHours * $rate, 2);
            }

            $paid = ($status === 'paid_cash' || $status === 'paid_bank') ? $totalEarned : 0;

            $shiftId = 'shift-' . time() . '-' . substr(md5(uniqid()), 0, 4);
            $stmt = $db->prepare("INSERT INTO employee_shifts (id, employee_id, employee_name, date, start_time, end_time, break_minutes, total_hours, hourly_rate, total_earned, payment_status, paid_amount, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$shiftId, $empId, $empRow['name'], $date, $start, $end, $break, $totalHours, $rate, $totalEarned, $status, $paid, $notes, date('c')]);
            $message = 'تم تسجيل الوردية لـ ' . $empRow['name'] . ' بنجاح (' . $totalHours . ' ساعة)!';
        }
    }

    // 6. Delete a Shift
    elseif ($action === 'delete_shift') {
        $id = trim($_POST['id'] ?? '');
        if (!empty($id)) {
            $stmt = $db->prepare("DELETE FROM employee_shifts WHERE id = ?");
            $stmt->execute([$id]);
            $message = 'تم حذف الوردية بنجاح.';
        }
    }

    // 7. Save Advance / Payout
    elseif ($action === 'save_advance') {
        $empId = trim($_POST['employee_id'] ?? '');
        $amount = floatval($_POST['amount'] ?? 0);
        $date = trim($_POST['date'] ?? date('Y-m-d'));
        $method = trim($_POST['payment_method'] ?? 'cash');
        $notes = trim($_POST['notes'] ?? '');

        $emp = $db->prepare("SELECT name FROM employees WHERE id = ?");
        $emp->execute([$empId]);
        $empRow = $emp->fetch();

        if (!$empRow || $amount <= 0) {
            $error = 'يرجى اختيار الموظف وإدخال مبلغ سلفة صحيح.';
        } else {
            $advId = 'adv-' . time() . '-' . substr(md5(uniqid()), 0, 4);
            $stmt = $db->prepare("INSERT INTO employee_advances (id, employee_id, employee_name, amount, date, payment_method, payment_type, notes, created_at) VALUES (?, ?, ?, ?, ?, 'advance', ?, ?)");
            $stmt->execute([$advId, $empId, $empRow['name'], $amount, $date, $method, $notes, date('c')]);
            $message = 'تم تسجيل سلفة بقيمة €' . number_format($amount, 2) . ' للموظف ' . $empRow['name'] . ' بنجاح!';
        }
    }

    // 8. Delete Advance
    elseif ($action === 'delete_advance') {
        $id = trim($_POST['id'] ?? '');
        if (!empty($id)) {
            $stmt = $db->prepare("DELETE FROM employee_advances WHERE id = ?");
            $stmt->execute([$id]);
            $message = 'تم حذف سجل السلفة بنجاح.';
        }
    }
}

// Fetch Employees, Shifts, Advances
$employees = $db->query("SELECT * FROM employees ORDER BY is_active DESC, schedule_type DESC, name ASC")->fetchAll();
$shifts = $db->query("SELECT * FROM employee_shifts ORDER BY date DESC, created_at DESC LIMIT 150")->fetchAll();
$advances = $db->query("SELECT * FROM employee_advances ORDER BY date DESC LIMIT 100")->fetchAll();

// Month Aggregates
$currentMonth = date('Y-m');
$totalEarnedMonth = 0;
$totalHoursMonth = 0;
$totalAdvancesMonth = 0;
$unpaidWagesTotal = 0;

foreach ($shifts as $s) {
    if (strpos($s['date'], $currentMonth) === 0) {
        $totalEarnedMonth += floatval($s['total_earned']);
        $totalHoursMonth += floatval($s['total_hours']);
    }
    if ($s['payment_status'] === 'unpaid') {
        $unpaidWagesTotal += (floatval($s['total_earned']) - floatval($s['paid_amount']));
    }
}

foreach ($advances as $a) {
    if (strpos($a['date'], $currentMonth) === 0) {
        $totalAdvancesMonth += floatval($a['amount']);
    }
}

// Individual Employee Calculated Balances
$empStats = [];
foreach ($employees as $e) {
    $empStats[$e['id']] = [
        'hours' => 0,
        'earned' => 0,
        'advances' => 0,
        'shifts_count' => 0,
    ];
}
foreach ($shifts as $s) {
    if (isset($empStats[$s['employee_id']])) {
        $empStats[$s['employee_id']]['hours'] += floatval($s['total_hours']);
        $empStats[$s['employee_id']]['earned'] += floatval($s['total_earned']);
        $empStats[$s['employee_id']]['shifts_count']++;
    }
}
foreach ($advances as $a) {
    if (isset($empStats[$a['employee_id']])) {
        $empStats[$a['employee_id']]['advances'] += floatval($a['amount']);
    }
}

// Today Attendance Map
$todayShiftsMap = [];
foreach ($shifts as $s) {
    if ($s['date'] === $todayStr) {
        $todayShiftsMap[$s['employee_id']] = $s;
    }
}

// Count unlogged fixed staff today
$unloggedFixedCount = 0;
foreach ($employees as $e) {
    if ($e['schedule_type'] === 'fixed' && !isset($todayShiftsMap[$e['id']]) && $e['is_active']) {
        $unloggedFixedCount++;
    }
}
?>

<div class="space-y-6">

  <!-- 1. Header Banner -->
  <div class="bg-gradient-to-l from-tasty-charcoal via-tasty-teal-dark to-tasty-teal text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
    <div class="absolute -left-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="relative z-10">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-tasty-teal-light text-xs font-bold mb-3 border border-white/20 backdrop-blur-md">
        <svg class="w-3.5 h-3.5 text-tasty-terracotta-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        <span>إدارة الكوادر وساعات العمل</span>
        <span>•</span>
        <span><?= $todayDayName ?> <?= date('j F Y') ?></span>
      </div>
      <h1 class="font-serif font-black text-2xl sm:text-3xl tracking-tight text-white">إدارة الموظفين والورديات والأجور</h1>
      <p class="text-tasty-teal-light/90 text-sm mt-1 max-w-xl leading-relaxed">
        تنظيم عمال الدوام الثابت والورديات المرنة، حساب الأجر بالساعة أو اليومي، وتوثيق السلف واليوميات.
      </p>
    </div>

    <!-- Quick Buttons -->
    <div class="flex items-center gap-2 shrink-0 relative z-10 flex-wrap">
      <button onclick="openShiftModal()" class="px-4 py-2.5 rounded-2xl bg-white text-tasty-teal-dark font-bold text-xs hover:bg-tasty-teal-light shadow-md transition-all active:scale-95 flex items-center gap-1.5">
        <svg class="w-4 h-4 text-tasty-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        <span>تسجيل وردية</span>
      </button>
      <button onclick="openEmpModal()" class="px-4 py-2.5 rounded-2xl bg-tasty-terracotta text-white font-bold text-xs hover:bg-tasty-terracotta-dark shadow-md transition-all active:scale-95 flex items-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
        <span>إضافة موظف جديد</span>
      </button>
    </div>
  </div>

  <!-- Messages -->
  <?php if (!empty($message)): ?>
    <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
      <span><?= htmlspecialchars($message) ?></span>
      <button onclick="this.parentElement.remove();" class="text-emerald-600">&times;</button>
    </div>
  <?php endif; ?>
  <?php if (!empty($error)): ?>
    <div class="p-4 rounded-2xl bg-tasty-terracotta-light border border-tasty-terracotta/40 text-tasty-terracotta-dark text-xs font-bold flex items-center justify-between">
      <span><?= htmlspecialchars($error) ?></span>
      <button onclick="this.parentElement.remove();" class="text-tasty-terracotta-dark">&times;</button>
    </div>
  <?php endif; ?>

  <!-- 2. Summary KPI Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    
    <!-- Card 1: Total Earned This Month -->
    <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs text-tasty-charcoal font-bold">أجور شهر <?= date('m / Y') ?></span>
        <span class="px-2.5 py-0.5 rounded-full bg-tasty-teal-light text-tasty-teal-dark border border-tasty-teal/25 text-[10px] font-bold">إجمالي الأجور</span>
      </div>
      <div dir="ltr" class="flex items-baseline justify-end gap-1">
        <span class="text-xs font-bold text-gray-400 font-sans">€</span>
        <span class="text-2xl sm:text-3xl font-black font-sans tracking-tight text-tasty-charcoal tabular-nums">
          <?= number_format($totalEarnedMonth, 2) ?>
        </span>
      </div>
      <p class="text-[11px] text-gray-400 mt-3 pt-2.5 border-t border-gray-100">إجمالي (<?= number_format($totalHoursMonth, 1) ?>) ساعة عمل مسجلة</p>
    </div>

    <!-- Card 2: Pending Wages -->
    <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs text-tasty-charcoal font-bold">مستحقات معلقة (غير مسددة)</span>
        <span class="px-2.5 py-0.5 rounded-full bg-tasty-terracotta-light text-tasty-terracotta-dark border border-tasty-terracotta/25 text-[10px] font-bold">مطلوب صرفها</span>
      </div>
      <div dir="ltr" class="flex items-baseline justify-end gap-1">
        <span class="text-xs font-bold text-tasty-terracotta-dark font-sans">€</span>
        <span class="text-2xl sm:text-3xl font-black font-sans tracking-tight text-tasty-terracotta-dark tabular-nums">
          <?= number_format($unpaidWagesTotal, 2) ?>
        </span>
      </div>
      <p class="text-[11px] text-gray-400 mt-3 pt-2.5 border-t border-gray-100">ورديات مسجلة لم تسلم رواتبها بعد</p>
    </div>

    <!-- Card 3: Cash Advances -->
    <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs text-tasty-charcoal font-bold">السلف المسحوبة هذا الشهر</span>
        <span class="px-2.5 py-0.5 rounded-full bg-tasty-teal-light text-tasty-teal-dark border border-tasty-teal/25 text-[10px] font-bold">سلف نقدية</span>
      </div>
      <div dir="ltr" class="flex items-baseline justify-end gap-1">
        <span class="text-xs font-bold text-tasty-teal font-sans">€</span>
        <span class="text-2xl sm:text-3xl font-black font-sans tracking-tight text-tasty-teal-dark tabular-nums">
          <?= number_format($totalAdvancesMonth, 2) ?>
        </span>
      </div>
      <p class="text-[11px] text-gray-400 mt-3 pt-2.5 border-t border-gray-100">مخصومة من رواتب الموظفين القادمة</p>
    </div>

  </div>

  <!-- 3. Quick 1-Click Attendance Panel for Today (تحضير كادر العمل لليوم) -->
  <div class="bg-gradient-to-r from-tasty-terracotta/10 via-tasty-teal/5 to-white border border-tasty-terracotta/30 rounded-3xl p-5 shadow-xs space-y-3.5">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-tasty-terracotta text-white flex items-center justify-center shrink-0 shadow-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-sm sm:text-base text-tasty-charcoal">تحضير كادر العمل لليوم (<?= $todayDayName ?>)</h3>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tasty-terracotta-light text-tasty-terracotta-dark border border-tasty-terracotta/30">
              تحضير سريع بضغطة زر
            </span>
          </div>
          <p class="text-xs text-gray-500 mt-0.5">
            اضغط زر التحضير السريع الأخضر أمام اسم الموظف لتسجيل ورديته فوراً وفق ساعاته المعتمدة!
          </p>
        </div>
      </div>

      <?php if ($unloggedFixedCount > 0): ?>
        <form method="POST" action="" class="shrink-0">
          <input type="hidden" name="action" value="quick_log_all_fixed_today">
          <button type="submit" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-tasty-terracotta hover:bg-tasty-terracotta-dark text-white text-xs font-bold transition-all shadow-sm active:scale-95">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            <span>تسجيل حضور كل الثابتين لليوم (<?= $unloggedFixedCount ?> موظف)</span>
          </button>
        </form>
      <?php endif; ?>
    </div>

    <!-- Live Quick Attendance Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-tasty-terracotta/20">
      <?php foreach ($employees as $emp): ?>
        <?php 
          if (!$emp['is_active']) continue;
          $hasShift = isset($todayShiftsMap[$emp['id']]);
          $shift = $hasShift ? $todayShiftsMap[$emp['id']] : null;
          $isFixed = ($emp['schedule_type'] === 'fixed');
        ?>
        <div class="p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 <?= $hasShift ? 'bg-emerald-50/70 border-emerald-200 shadow-2xs' : 'bg-white border-gray-200 hover:border-tasty-teal/50 shadow-2xs' ?>">
          <div class="min-w-0 pr-1">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-xs text-tasty-charcoal truncate"><?= htmlspecialchars($emp['name']) ?></span>
              <span class="w-2 h-2 rounded-full shrink-0 <?= $hasShift ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse' ?>" title="<?= $hasShift ? 'حاضر اليوم' : 'بانتظار التحضير' ?>"></span>
            </div>
            <div class="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
              <span><?= htmlspecialchars($emp['role'] ?: 'موظف') ?></span>
              <span>•</span>
              <span class="font-semibold text-tasty-teal-dark">
                <?= $emp['wage_type'] === 'daily' ? ('€' . $emp['rate'] . ' /يومي') : ('€' . $emp['rate'] . ' /ساعة') ?>
              </span>
            </div>
          </div>

          <div class="shrink-0 flex items-center gap-1.5">
            <?php if ($hasShift): ?>
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                <span><?= $shift['total_hours'] ?>س</span>
                <span class="font-mono text-[10px] text-emerald-950 font-sans" dir="ltr">€<?= number_format($shift['total_earned'], 0) ?></span>
              </span>
            <?php else: ?>
              <form method="POST" action="" class="inline">
                <input type="hidden" name="action" value="quick_log_today">
                <input type="hidden" name="employee_id" value="<?= $emp['id'] ?>">
                <button type="submit" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-all active:scale-95 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  <span>تسجيل حضور (<?= $emp['default_hours'] ?>س)</span>
                </button>
              </form>
            <?php endif; ?>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>

  <!-- 4. Team Directory: Two Clear Sections (دوام ثابت vs دوام مرن / ورديات) -->
  <div class="space-y-6">

    <!-- Section Header & Filter Tabs -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200">
      <div>
        <h2 class="text-lg font-bold text-tasty-charcoal flex items-center gap-2">
          <span>دليل فريق العمل وتفاصيل الموظفين</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-tasty-teal-light text-tasty-teal-dark font-bold">
            <?= count($employees) ?> موظف
          </span>
        </h2>
        <p class="text-xs text-gray-400 mt-0.5">تفاصيل الأجر بالساعة أو اليومي، مواعيد الدوام الثابت والمرن، وكشف حساب مستحقات كل موظف.</p>
      </div>

      <!-- Quick Filter Pills -->
      <div class="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-gray-200 shadow-2xs self-start sm:self-auto text-xs font-bold">
        <button onclick="filterStaff('all')" id="tabBtn-all" class="px-3 py-1.5 rounded-xl bg-tasty-charcoal text-white transition-all">
          كافة الكادر (<?= count($employees) ?>)
        </button>
        <button onclick="filterStaff('fixed')" id="tabBtn-fixed" class="px-3 py-1.5 rounded-xl text-gray-600 hover:text-tasty-charcoal transition-all">
          دوام ثابت (<?= count(array_filter($employees, fn($e) => $e['schedule_type'] === 'fixed')) ?>)
        </button>
        <button onclick="filterStaff('flexible')" id="tabBtn-flexible" class="px-3 py-1.5 rounded-xl text-gray-600 hover:text-tasty-charcoal transition-all">
          دوام مرن / ورديات (<?= count(array_filter($employees, fn($e) => $e['schedule_type'] !== 'fixed')) ?>)
        </button>
      </div>
    </div>

    <!-- Employee Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <?php foreach ($employees as $emp): ?>
        <?php 
          $isFixed = ($emp['schedule_type'] === 'fixed');
          $st = $empStats[$emp['id']] ?? ['hours' => 0, 'earned' => 0, 'advances' => 0, 'shifts_count' => 0];
          $netDue = $st['earned'] - $st['advances'];
        ?>
        <div class="emp-card bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between" data-schedule="<?= $isFixed ? 'fixed' : 'flexible' ?>">
          
          <div>
            <!-- Card Top: Name, Role, Schedule Badge -->
            <div class="flex items-start justify-between gap-2 mb-3">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base shadow-2xs <?= $isFixed ? 'bg-tasty-terracotta-light text-tasty-terracotta-dark' : 'bg-tasty-teal-light text-tasty-teal-dark' ?>">
                  <?= mb_substr($emp['name'], 0, 1, 'UTF-8') ?>
                </div>
                <div>
                  <h3 class="text-base font-bold text-tasty-charcoal"><?= htmlspecialchars($emp['name']) ?></h3>
                  <p class="text-xs text-gray-400 font-semibold"><?= htmlspecialchars($emp['role'] ?: 'موظف') ?></p>
                </div>
              </div>

              <!-- Schedule Badge (ثابت أو مرن) -->
              <div>
                <?php if ($isFixed): ?>
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-tasty-terracotta-light text-tasty-terracotta-dark border border-tasty-terracotta/25 text-[11px] font-bold whitespace-nowrap">
                    <span>دوام ثابت (<?= $emp['default_hours'] ?>س)</span>
                  </span>
                <?php else: ?>
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-tasty-sage-light text-tasty-charcoal border border-tasty-sage/30 text-[11px] font-bold whitespace-nowrap">
                    <span>دوام مرن / ورديات</span>
                  </span>
                <?php endif; ?>
              </div>
            </div>

            <!-- Wage Rate Banner -->
            <div class="p-3 rounded-2xl bg-[#FCFAF7] border border-gray-100 flex items-center justify-between text-xs mb-3">
              <div>
                <span class="text-gray-400 block text-[10px] font-bold">طريقة حساب الأجر</span>
                <span class="font-bold text-tasty-charcoal">
                  <?= $emp['wage_type'] === 'daily' ? 'أجر يومي مقطوع' : 'أجر حسب ساعات العمل' ?>
                </span>
              </div>
              <div class="text-left font-sans font-black text-sm text-tasty-teal-dark" dir="ltr">
                €<?= number_format($emp['rate'], 2) ?>
                <span class="text-[10px] font-bold text-gray-400">
                  <?= $emp['wage_type'] === 'daily' ? '/يوم' : '/ساعة' ?>
                </span>
              </div>
            </div>

            <!-- Contact & Schedule Info -->
            <div class="space-y-1.5 text-xs text-gray-500 mb-3 px-1">
              <div class="flex items-center justify-between">
                <span>رقم الهاتف للتواصل:</span>
                <span class="font-bold text-gray-700 dir-ltr font-mono"><?= htmlspecialchars($emp['phone'] ?: '—') ?></span>
              </div>
              <div class="flex items-center justify-between">
                <span>مواعيد الدوام الافتراضية:</span>
                <span class="font-bold text-gray-700 dir-ltr font-mono"><?= htmlspecialchars($emp['default_start_time'] ?: '10:00') ?> - <?= htmlspecialchars($emp['default_end_time'] ?: '18:00') ?></span>
              </div>
              <?php if (!empty($emp['notes'])): ?>
                <p class="text-[11px] text-gray-400 pt-1 border-t border-gray-100 truncate"><?= htmlspecialchars($emp['notes']) ?></p>
              <?php endif; ?>
            </div>

            <!-- Individual Mini Account Summary -->
            <div class="p-3 rounded-2xl bg-gray-50 border border-gray-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span class="text-[10px] text-gray-400 block font-bold">الساعات</span>
                <span class="font-bold text-tasty-charcoal font-sans"><?= number_format($st['hours'], 1) ?>س</span>
              </div>
              <div>
                <span class="text-[10px] text-gray-400 block font-bold">المستحق</span>
                <span class="font-bold text-tasty-teal-dark font-sans" dir="ltr">€<?= number_format($st['earned'], 0) ?></span>
              </div>
              <div>
                <span class="text-[10px] text-gray-400 block font-bold">صافي المتبقي</span>
                <span class="font-bold font-sans <?= $netDue > 0 ? 'text-tasty-terracotta-dark' : 'text-emerald-700' ?>" dir="ltr">
                  €<?= number_format($netDue, 0) ?>
                </span>
              </div>
            </div>

          </div>

          <!-- Bottom Action Buttons -->
          <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
            <button 
              onclick='openShiftModalFor("<?= $emp['id'] ?>", "<?= addslashes($emp['name']) ?>", <?= $emp['rate'] ?>, "<?= $emp['wage_type'] ?>", <?= $emp['default_hours'] ?>, "<?= $emp['default_start_time'] ?>", "<?= $emp['default_end_time'] ?>", <?= $emp['default_break_minutes'] ?>)'
              class="flex-1 py-2 bg-tasty-teal-light hover:bg-tasty-teal hover:text-white text-tasty-teal-dark rounded-xl font-bold text-xs transition-all text-center shadow-2xs flex items-center justify-center gap-1"
            >
              <span>+ وردية</span>
            </button>
            <button 
              onclick='openAdvanceModalFor("<?= $emp['id'] ?>", "<?= addslashes($emp['name']) ?>")'
              class="flex-1 py-2 bg-tasty-terracotta-light hover:bg-tasty-terracotta hover:text-white text-tasty-terracotta-dark rounded-xl font-bold text-xs transition-all text-center shadow-2xs flex items-center justify-center gap-1"
            >
              <span>سلفة كاش</span>
            </button>
            <button 
              onclick='openEditEmpModal(<?= json_encode($emp) ?>)'
              title="تعديل بيانات الموظف"
              class="p-2 text-gray-400 hover:text-tasty-teal rounded-xl transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
            <form method="POST" action="" onsubmit="return confirm('حذف الموظف <?= addslashes($emp['name']) ?> بالكامل؟ ستظل وردياته السابقة محفوظة للتوثيق.');" class="inline">
              <input type="hidden" name="action" value="delete_employee">
              <input type="hidden" name="id" value="<?= $emp['id'] ?>">
              <button type="submit" title="حذف الموظف" class="p-2 text-gray-400 hover:text-red-600 rounded-xl transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </form>
          </div>

        </div>
      <?php endforeach; ?>
    </div>

  </div>

  <!-- 5. Shifts History Table (سجل الورديات الأخير) -->
  <div class="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
    <div class="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
      <div>
        <h3 class="text-base font-bold text-tasty-charcoal">سجل الورديات الأخير وساعات العمل</h3>
        <p class="text-xs text-gray-400 mt-0.5">آخر (<?= count($shifts) ?>) وردية عمل موثقة في النظام</p>
      </div>
      <button onclick="openShiftModal()" class="px-3.5 py-1.5 rounded-xl bg-tasty-teal-light text-tasty-teal-dark font-bold text-xs hover:bg-tasty-teal hover:text-white transition-all">
        + تسجيل وردية جديدة
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-right text-xs">
        <thead>
          <tr class="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
            <th class="p-4">الموظف</th>
            <th class="p-4">التاريخ</th>
            <th class="p-4">الوقت والدوام</th>
            <th class="p-4">الساعات</th>
            <th class="p-4">الأجر</th>
            <th class="p-4">الإجمالي المستحق</th>
            <th class="p-4">حالة الصرف</th>
            <th class="p-4 text-center">إجراء</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <?php if (empty($shifts)): ?>
            <tr>
              <td colspan="8" class="p-10 text-center text-gray-400 font-bold">
                لا توجد أي ورديات مسجلة بعد. استخدم زر "تسجيل وردية" للبدء.
              </td>
            </tr>
          <?php else: ?>
            <?php foreach ($shifts as $s): ?>
              <tr class="hover:bg-tasty-bg-warm/60 transition-colors">
                <td class="p-4 font-bold text-tasty-charcoal">
                  <?= htmlspecialchars($s['employee_name']) ?>
                  <?php if (!empty($s['notes'])): ?>
                    <p class="text-[10px] text-gray-400 font-normal"><?= htmlspecialchars($s['notes']) ?></p>
                  <?php endif; ?>
                </td>
                <td class="p-4 whitespace-nowrap font-mono text-gray-600"><?= htmlspecialchars($s['date']) ?></td>
                <td class="p-4 whitespace-nowrap dir-ltr text-right text-gray-500 font-mono">
                  <?= htmlspecialchars($s['start_time']) ?> - <?= htmlspecialchars($s['end_time']) ?>
                </td>
                <td class="p-4 font-bold text-tasty-charcoal font-sans"><?= $s['total_hours'] ?> س</td>
                <td class="p-4 dir-ltr text-right font-mono">€<?= number_format($s['hourly_rate'], 2) ?></td>
                <td class="p-4 font-bold text-tasty-teal-dark dir-ltr text-right font-sans">
                  €<?= number_format($s['total_earned'], 2) ?>
                </td>
                <td class="p-4 whitespace-nowrap">
                  <?php if ($s['payment_status'] === 'paid_cash'): ?>
                    <span class="px-2.5 py-0.5 rounded-full bg-tasty-teal-light text-tasty-teal-dark border border-tasty-teal/25 font-bold text-[10px]">مسدد كاش</span>
                  <?php elseif ($s['payment_status'] === 'paid_bank'): ?>
                    <span class="px-2.5 py-0.5 rounded-full bg-tasty-sage-light text-tasty-charcoal border border-tasty-sage/30 font-bold text-[10px]">مسدد بنك</span>
                  <?php else: ?>
                    <span class="px-2.5 py-0.5 rounded-full bg-tasty-terracotta-light text-tasty-terracotta-dark border border-tasty-terracotta/25 font-bold text-[10px]">مستحق معلق</span>
                  <?php endif; ?>
                </td>
                <td class="p-4 text-center">
                  <form method="POST" action="" onsubmit="return confirm('حذف هذه الوردية نهائياً؟');" class="inline">
                    <input type="hidden" name="action" value="delete_shift">
                    <input type="hidden" name="id" value="<?= $s['id'] ?>">
                    <button type="submit" class="p-1.5 text-gray-400 hover:text-red-600 rounded-xl transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </form>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>

  <!-- 6. Cash Advances Table (سجل السلف والدفعات المسحوبة) -->
  <div class="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
    <div class="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
      <div>
        <h3 class="text-base font-bold text-tasty-charcoal">سجل السلف والدفعات النقدية المسحوبة من الكاش</h3>
        <p class="text-xs text-gray-400 mt-0.5">مبالغ تم صرفها للموظفين مسبقاً وتُخصم من رواتبهم</p>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-right text-xs">
        <thead>
          <tr class="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
            <th class="p-4">الموظف</th>
            <th class="p-4">التاريخ</th>
            <th class="p-4">المبلغ المسحوب</th>
            <th class="p-4">طريقة الصرف</th>
            <th class="p-4">الملاحظات</th>
            <th class="p-4 text-center">إجراء</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <?php if (empty($advances)): ?>
            <tr>
              <td colspan="6" class="p-8 text-center text-gray-400 font-bold">
                لا توجد سلف أو دفعات مسحوبة مسجلة.
              </td>
            </tr>
          <?php else: ?>
            <?php foreach ($advances as $a): ?>
              <tr class="hover:bg-tasty-bg-warm/60 transition-colors">
                <td class="p-4 font-bold text-tasty-charcoal"><?= htmlspecialchars($a['employee_name']) ?></td>
                <td class="p-4 whitespace-nowrap font-mono text-gray-600"><?= htmlspecialchars($a['date']) ?></td>
                <td class="p-4 font-bold text-tasty-terracotta-dark dir-ltr text-right font-sans">
                  €<?= number_format($a['amount'], 2) ?>
                </td>
                <td class="p-4 whitespace-nowrap">
                  <span class="px-2.5 py-0.5 rounded-full bg-tasty-teal-light text-tasty-teal-dark text-[10px] font-bold">
                    <?= $a['payment_method'] === 'cash' ? 'كاش من الصندوق' : 'تحويل بنكي' ?>
                  </span>
                </td>
                <td class="p-4 text-gray-500"><?= htmlspecialchars($a['notes'] ?: '—') ?></td>
                <td class="p-4 text-center">
                  <form method="POST" action="" onsubmit="return confirm('حذف سجل هذه السلفة؟');" class="inline">
                    <input type="hidden" name="action" value="delete_advance">
                    <input type="hidden" name="id" value="<?= $a['id'] ?>">
                    <button type="submit" class="p-1.5 text-gray-400 hover:text-red-600 rounded-xl transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </form>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>

</div>

<!-- Modal 1: Add / Edit Employee -->
<div id="empModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 hidden">
  <div class="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-4" onclick="event.stopPropagation()">
    <div class="flex items-center justify-between pb-3 border-b border-gray-100">
      <h3 class="text-base font-bold text-tasty-charcoal" id="empModalTitle">إضافة موظف جديد</h3>
      <button onclick="document.getElementById('empModal').classList.add('hidden')" class="p-1 text-gray-400 hover:text-gray-900">&times;</button>
    </div>

    <form method="POST" action="" class="space-y-3.5">
      <input type="hidden" name="action" value="save_employee">
      <input type="hidden" name="id" id="empFormId" value="">

      <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">اسم الموظف الكامل *</label>
        <input type="text" name="name" id="empFormName" required placeholder="مثال: يوسف الحلبي" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-tasty-teal focus:bg-white focus:outline-none">
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">المسمى الوظيفي</label>
          <input type="text" name="role" id="empFormRole" placeholder="معلم شاورما، شيف، كاشير..." class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-tasty-teal focus:bg-white focus:outline-none">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">رقم الهاتف</label>
          <input type="text" name="phone" id="empFormPhone" placeholder="0612345678" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-tasty-teal focus:bg-white focus:outline-none dir-ltr text-right">
        </div>
      </div>

      <!-- Wage Type & Rate -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">طريقة الحساب والأجر *</label>
          <select name="wage_type" id="empFormWageType" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:border-tasty-teal focus:bg-white focus:outline-none">
            <option value="hourly">أجر بالساعة (Hourly Rate)</option>
            <option value="daily">أجر يومي مقطوع (Daily Wage)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">الأجر باليورو (€) *</label>
          <input type="number" step="0.5" name="rate" id="empFormRate" value="13.5" required class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:border-tasty-teal focus:bg-white focus:outline-none dir-ltr text-right">
        </div>
      </div>

      <!-- Schedule Type & Default Hours -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">نوع الدوام والورديات *</label>
          <select name="schedule_type" id="empFormScheduleType" onchange="toggleFixedHours(this.value)" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:border-tasty-teal focus:bg-white focus:outline-none">
            <option value="fixed">دوام ثابت (ساعات محددة يومياً)</option>
            <option value="flexible">دوام مرن (عند الحاجة والورديات)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">الساعات اليومية المعتمدة</label>
          <input type="number" step="0.5" name="default_hours" id="empFormHours" value="8" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:border-tasty-teal focus:bg-white focus:outline-none dir-ltr text-right">
        </div>
      </div>

      <!-- Default Times -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">وقت الحضور الافتراضي</label>
          <input type="time" name="default_start_time" id="empFormStart" value="10:00" class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:border-tasty-teal focus:bg-white focus:outline-none">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">وقت الانصراف الافتراضي</label>
          <input type="time" name="default_end_time" id="empFormEnd" value="18:00" class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:border-tasty-teal focus:bg-white focus:outline-none">
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">ملاحظات إضافية (اختياري)</label>
        <input type="text" name="notes" id="empFormNotes" placeholder="أيام العطلة، تفاصيل مسؤوليته..." class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:border-tasty-teal focus:bg-white focus:outline-none">
      </div>

      <div class="pt-3 flex gap-2">
        <button type="submit" class="flex-1 py-3 bg-tasty-terracotta hover:bg-tasty-terracotta-dark text-white font-bold rounded-2xl text-xs transition-all shadow-md">
          حفظ الموظف
        </button>
        <button type="button" onclick="document.getElementById('empModal').classList.add('hidden')" class="px-5 py-3 border border-gray-200 text-gray-600 rounded-2xl font-bold text-xs hover:bg-gray-50">
          إلغاء
        </button>
      </div>
    </form>
  </div>
</div>

<!-- Modal 2: Log Shift (Manual Modal) -->
<div id="shiftModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 hidden">
  <div class="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4" onclick="event.stopPropagation()">
    <div class="flex items-center justify-between pb-3 border-b border-gray-100">
      <h3 class="text-base font-bold text-tasty-charcoal">تسجيل وردية عمل</h3>
      <button onclick="document.getElementById('shiftModal').classList.add('hidden')" class="p-1 text-gray-400 hover:text-gray-900">&times;</button>
    </div>

    <form method="POST" action="" class="space-y-3.5">
      <input type="hidden" name="action" value="save_shift">

      <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">الموظف *</label>
        <select name="employee_id" id="shiftEmpSelect" onchange="onShiftEmpSelect(this)" required class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:border-tasty-teal focus:bg-white focus:outline-none">
          <?php foreach ($employees as $e): ?>
            <option value="<?= $e['id'] ?>" data-rate="<?= $e['rate'] ?>" data-wtype="<?= $e['wage_type'] ?>" data-hours="<?= $e['default_hours'] ?>" data-start="<?= $e['default_start_time'] ?>" data-end="<?= $e['default_end_time'] ?>">
              <?= htmlspecialchars($e['name']) ?> (<?= $e['wage_type'] === 'daily' ? '€' . $e['rate'] . '/يوم' : '€' . $e['rate'] . '/س' ?>)
            </option>
          <?php endforeach; ?>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">التاريخ *</label>
          <input type="date" name="shift_date" value="<?= date('Y-m-d') ?>" required class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:border-tasty-teal focus:bg-white focus:outline-none">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">الساعات الصافية *</label>
          <input type="number" step="0.5" min="0.5" name="total_hours" id="shiftInputHours" value="8" required class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:border-tasty-teal focus:bg-white focus:outline-none dir-ltr text-right">
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">بداية الدوام</label>
          <input type="time" name="start_time" id="shiftInputStart" value="10:00" class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:border-tasty-teal focus:bg-white focus:outline-none">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">نهاية الدوام</label>
          <input type="time" name="end_time" id="shiftInputEnd" value="18:00" class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:border-tasty-teal focus:bg-white focus:outline-none">
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">أجر الساعة/اليوم (€)</label>
          <input type="number" step="0.5" name="hourly_rate" id="shiftInputRate" value="13.5" class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:border-tasty-teal focus:bg-white focus:outline-none dir-ltr text-right">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">حالة الدفع</label>
          <select name="payment_status" class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:border-tasty-teal focus:bg-white focus:outline-none">
            <option value="unpaid">مستحق معلق (يُحاسب لاحقاً)</option>
            <option value="paid_cash">تم التسليم كاش فوراً</option>
            <option value="paid_bank">تم التحويل بنكياً</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">ملاحظة</label>
        <input type="text" name="notes" placeholder="عمل إضافي، دوام عطلة..." class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:border-tasty-teal focus:bg-white focus:outline-none">
      </div>

      <div class="pt-3 flex gap-2">
        <button type="submit" class="flex-1 py-3 bg-tasty-teal hover:bg-tasty-teal-dark text-white font-bold rounded-2xl text-xs transition-all shadow-md">
          تسجيل الوردية
        </button>
        <button type="button" onclick="document.getElementById('shiftModal').classList.add('hidden')" class="px-5 py-3 border border-gray-200 text-gray-600 rounded-2xl font-bold text-xs hover:bg-gray-50">
          إلغاء
        </button>
      </div>
    </form>
  </div>
</div>

<!-- Modal 3: Cash Advance -->
<div id="advanceModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 hidden">
  <div class="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl space-y-4" onclick="event.stopPropagation()">
    <div class="flex items-center justify-between pb-3 border-b border-gray-100">
      <h3 class="text-base font-bold text-tasty-charcoal">سلفة نقدية من الصندوق</h3>
      <button onclick="document.getElementById('advanceModal').classList.add('hidden')" class="p-1 text-gray-400 hover:text-gray-900">&times;</button>
    </div>

    <form method="POST" action="" class="space-y-3.5">
      <input type="hidden" name="action" value="save_advance">
      <input type="hidden" name="employee_id" id="advEmpId" value="">

      <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">الموظف</label>
        <input type="text" id="advEmpName" readonly class="w-full px-3.5 py-2 bg-gray-100 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700">
      </div>

      <div>
        <label class="block text-xs font-bold text-tasty-terracotta-dark mb-1">مبلغ السلفة (€) *</label>
        <input type="number" step="1" min="1" name="amount" required placeholder="50" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-base font-bold focus:border-tasty-terracotta focus:bg-white focus:outline-none dir-ltr text-right">
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">ملاحظة</label>
        <input type="text" name="notes" placeholder="سلفة نقدية من درج الكاش..." class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:border-tasty-teal focus:bg-white focus:outline-none">
      </div>

      <div class="pt-3 flex gap-2">
        <button type="submit" class="flex-1 py-3 bg-tasty-terracotta hover:bg-tasty-terracotta-dark text-white font-bold rounded-2xl text-xs transition-all shadow-md">
          صرف السلفة
        </button>
        <button type="button" onclick="document.getElementById('advanceModal').classList.add('hidden')" class="px-5 py-3 border border-gray-200 text-gray-600 rounded-2xl font-bold text-xs hover:bg-gray-50">
          إلغاء
        </button>
      </div>
    </form>
  </div>
</div>

<script>
// Filter Staff by Schedule Type (All, Fixed, Flexible)
function filterStaff(type) {
  document.querySelectorAll('.emp-card').forEach(card => {
    if (type === 'all' || card.getAttribute('data-schedule') === type) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });

  ['all', 'fixed', 'flexible'].forEach(t => {
    const btn = document.getElementById('tabBtn-' + t);
    if (t === type) {
      btn.className = 'px-3 py-1.5 rounded-xl bg-tasty-charcoal text-white transition-all';
    } else {
      btn.className = 'px-3 py-1.5 rounded-xl text-gray-600 hover:text-tasty-charcoal transition-all';
    }
  });
}

function openEmpModal() {
  document.getElementById('empModalTitle').innerText = 'إضافة موظف جديد';
  document.getElementById('empFormId').value = '';
  document.getElementById('empFormName').value = '';
  document.getElementById('empFormPhone').value = '';
  document.getElementById('empFormRole').value = '';
  document.getElementById('empFormWageType').value = 'hourly';
  document.getElementById('empFormRate').value = '13.5';
  document.getElementById('empFormScheduleType').value = 'fixed';
  document.getElementById('empFormHours').value = '8';
  document.getElementById('empFormStart').value = '10:00';
  document.getElementById('empFormEnd').value = '18:00';
  document.getElementById('empFormNotes').value = '';
  document.getElementById('empModal').classList.remove('hidden');
}

function openEditEmpModal(emp) {
  document.getElementById('empModalTitle').innerText = 'تعديل بيانات: ' + emp.name;
  document.getElementById('empFormId').value = emp.id;
  document.getElementById('empFormName').value = emp.name;
  document.getElementById('empFormPhone').value = emp.phone || '';
  document.getElementById('empFormRole').value = emp.role || '';
  document.getElementById('empFormWageType').value = emp.wage_type || 'hourly';
  document.getElementById('empFormRate').value = emp.rate;
  document.getElementById('empFormScheduleType').value = emp.schedule_type || 'flexible';
  document.getElementById('empFormHours').value = emp.default_hours || 8;
  document.getElementById('empFormStart').value = emp.default_start_time || '10:00';
  document.getElementById('empFormEnd').value = emp.default_end_time || '18:00';
  document.getElementById('empFormNotes').value = emp.notes || '';
  document.getElementById('empModal').classList.remove('hidden');
}

function openShiftModal() {
  document.getElementById('shiftModal').classList.remove('hidden');
}

function openShiftModalFor(empId, empName, rate, wageType, defaultHours, start, end, breakMin) {
  const sel = document.getElementById('shiftEmpSelect');
  if (sel) sel.value = empId;
  document.getElementById('shiftInputHours').value = defaultHours || 8;
  document.getElementById('shiftInputRate').value = rate || 12;
  document.getElementById('shiftInputStart').value = start || '10:00';
  document.getElementById('shiftInputEnd').value = end || '18:00';
  document.getElementById('shiftModal').classList.remove('hidden');
}

function onShiftEmpSelect(selectElem) {
  const opt = selectElem.options[selectElem.selectedIndex];
  if (opt) {
    document.getElementById('shiftInputRate').value = opt.getAttribute('data-rate') || '12';
    document.getElementById('shiftInputHours').value = opt.getAttribute('data-hours') || '8';
    document.getElementById('shiftInputStart').value = opt.getAttribute('data-start') || '10:00';
    document.getElementById('shiftInputEnd').value = opt.getAttribute('data-end') || '18:00';
  }
}

function openAdvanceModalFor(empId, empName) {
  document.getElementById('advEmpId').value = empId;
  document.getElementById('advEmpName').value = empName;
  document.getElementById('advanceModal').classList.remove('hidden');
}
</script>

<?php require_once __DIR__ . '/footer.php'; ?>

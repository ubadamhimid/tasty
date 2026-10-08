<?php
$pageTitle = 'الموظفون والورديات — لوحة إدارة TASTY';
require_once __DIR__ . '/header.php';

$db = getDB();
$message = '';
$error = '';

// Handle Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];

    // 1. Save or Update Employee
    if ($action === 'save_employee') {
        $id = trim($_POST['id'] ?? '');
        $name = trim($_POST['name'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $role = trim($_POST['role'] ?? 'عامل صالة ومطبخ');
        $wageType = trim($_POST['wage_type'] ?? 'hourly');
        $rate = floatval($_POST['rate'] ?? 0);
        $scheduleType = trim($_POST['schedule_type'] ?? 'flexible');
        $defaultHours = floatval($_POST['default_hours'] ?? 8);
        $defaultStart = trim($_POST['default_start_time'] ?? '10:00');
        $defaultEnd = trim($_POST['default_end_time'] ?? '18:00');
        $defaultBreak = intval($_POST['default_break_minutes'] ?? 30);
        $notes = trim($_POST['notes'] ?? '');
        $workingDays = json_encode($_POST['working_days'] ?? [1,2,3,4,5,6,0]);

        if (empty($name)) {
            $error = 'يرجى إدخال اسم الموظف.';
        } else {
            if (!empty($id)) {
                $stmt = $db->prepare("UPDATE employees SET name=?, phone=?, role=?, wage_type=?, rate=?, schedule_type=?, default_hours=?, default_start_time=?, default_end_time=?, default_break_minutes=?, working_days_json=?, notes=? WHERE id=?");
                $stmt->execute([$name, $phone, $role, $wageType, $rate, $scheduleType, $defaultHours, $defaultStart, $defaultEnd, $defaultBreak, $workingDays, $notes, $id]);
                $message = 'تم تحديث بيانات الموظف بنجاح!';
            } else {
                $newId = 'emp-' . time() . '-' . substr(md5(uniqid()), 0, 4);
                $stmt = $db->prepare("INSERT INTO employees (id, name, phone, role, wage_type, rate, schedule_type, default_hours, default_start_time, default_end_time, default_break_minutes, working_days_json, is_active, start_date, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)");
                $stmt->execute([$newId, $name, $phone, $role, $wageType, $rate, $scheduleType, $defaultHours, $defaultStart, $defaultEnd, $defaultBreak, $workingDays, date('Y-m-d'), $notes, date('c')]);
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
            $message = 'تم حذف الموظف بنجاح.';
        }
    }

    // 3. Log a Shift
    elseif ($action === 'save_shift') {
        $empId = trim($_POST['employee_id'] ?? '');
        $date = trim($_POST['shift_date'] ?? date('Y-m-d'));
        $start = trim($_POST['start_time'] ?? '10:00');
        $end = trim($_POST['end_time'] ?? '18:00');
        $break = intval($_POST['break_minutes'] ?? 0);
        $rate = floatval($_POST['hourly_rate'] ?? 0);
        $status = trim($_POST['payment_status'] ?? 'unpaid');
        $paid = floatval($_POST['paid_amount'] ?? 0);
        $notes = trim($_POST['notes'] ?? '');

        // Fetch Employee Name
        $emp = $db->prepare("SELECT name, rate FROM employees WHERE id = ?");
        $emp->execute([$empId]);
        $empRow = $emp->fetch();

        if (!$empRow) {
            $error = 'الموظف المحدد غير موجود.';
        } else {
            if ($rate <= 0) $rate = $empRow['rate'];

            // Calculate hours
            $startTs = strtotime("2000-01-01 $start");
            $endTs = strtotime("2000-01-01 $end");
            if ($endTs < $startTs) $endTs += 86400; // Overnight shift
            $diffMinutes = ($endTs - $startTs) / 60;
            $workMinutes = max(0, $diffMinutes - $break);
            $totalHours = round($workMinutes / 60, 2);
            $totalEarned = round($totalHours * $rate, 2);

            if ($status === 'paid_cash' || $status === 'paid_bank') {
                $paid = $totalEarned;
            }

            $shiftId = 'shift-' . time() . '-' . substr(md5(uniqid()), 0, 4);
            $stmt = $db->prepare("INSERT INTO employee_shifts (id, employee_id, employee_name, date, start_time, end_time, break_minutes, total_hours, hourly_rate, total_earned, payment_status, paid_amount, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$shiftId, $empId, $empRow['name'], $date, $start, $end, $break, $totalHours, $rate, $totalEarned, $status, $paid, $notes, date('c')]);
            $message = 'تم تسجيل الوردية لـ ' . $empRow['name'] . ' بنجاح (' . $totalHours . ' ساعة)!';
        }
    }

    // 4. Delete a Shift
    elseif ($action === 'delete_shift') {
        $id = trim($_POST['id'] ?? '');
        if (!empty($id)) {
            $stmt = $db->prepare("DELETE FROM employee_shifts WHERE id = ?");
            $stmt->execute([$id]);
            $message = 'تم حذف الوردية بنجاح.';
        }
    }

    // 5. Save Advance / Payout
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
}

// Fetch Employees, Shifts, Advances
$employees = $db->query("SELECT * FROM employees ORDER BY is_active DESC, name ASC")->fetchAll();
$shifts = $db->query("SELECT * FROM employee_shifts ORDER BY date DESC, created_at DESC LIMIT 100")->fetchAll();
$advances = $db->query("SELECT * FROM employee_advances ORDER BY date DESC LIMIT 100")->fetchAll();

// Period Aggregates
$currentMonth = date('Y-m');
$totalEarnedMonth = 0;
$totalHoursMonth = 0;
$totalAdvancesMonth = 0;
$unpaidWagesTotal = 0;

foreach ($shifts as $s) {
    if (strpos($s['date'], $currentMonth) === 0) {
        $totalEarnedMonth += $s['total_earned'];
        $totalHoursMonth += $s['total_hours'];
    }
    if ($s['payment_status'] === 'unpaid') {
        $unpaidWagesTotal += ($s['total_earned'] - $s['paid_amount']);
    }
}

foreach ($advances as $a) {
    if (strpos($a['date'], $currentMonth) === 0) {
        $totalAdvancesMonth += $a['amount'];
    }
}
?>

<div class="space-y-6">

  <!-- Header Banner -->
  <div class="bg-gradient-to-l from-tasty-teal-dark via-[#354D4B] to-tasty-teal text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-tasty-teal-light text-xs font-bold mb-3 border border-white/15">
        <span>كادر العمل والورديات</span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">إدارة الموظفين والورديات والأجور</h1>
      <p class="text-tasty-teal-light/90 text-sm mt-1 max-w-xl leading-relaxed">
        تسجيل ساعات العمل اليومية، حساب مستحقات الكوادر، والسلف المسحوبة من الكاش.
      </p>
    </div>

    <!-- Quick Buttons -->
    <div class="flex items-center gap-2 shrink-0">
      <button onclick="document.getElementById('newShiftModal').classList.remove('hidden')" class="px-4 py-2.5 rounded-2xl bg-white text-tasty-teal-dark font-bold text-xs hover:bg-tasty-teal-light shadow-md transition-all active:scale-95 flex items-center gap-1.5">
        <svg class="w-4 h-4 text-tasty-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        <span>تسجيل وردية</span>
      </button>
      <button onclick="document.getElementById('newEmpModal').classList.remove('hidden')" class="px-4 py-2.5 rounded-2xl bg-tasty-gold text-white font-bold text-xs hover:brightness-110 shadow-md transition-all active:scale-95 flex items-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
        <span>موظف جديد</span>
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
    <div class="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center justify-between">
      <span><?= htmlspecialchars($error) ?></span>
      <button onclick="this.parentElement.remove();" class="text-red-600">&times;</button>
    </div>
  <?php endif; ?>

  <!-- Summary KPI Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
      <span class="text-xs text-gray-400 font-bold">أجور شهر <?= date('m / Y') ?></span>
      <div class="text-2xl sm:text-3xl font-bold text-tasty-charcoal mt-1">
        €<?= number_format($totalEarnedMonth, 2) ?>
      </div>
      <p class="text-[11px] text-gray-400 mt-2">إجمالي (<?= number_format($totalHoursMonth, 1) ?>) ساعة عمل مسجلة</p>
    </div>

    <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
      <span class="text-xs text-amber-700 font-bold">مستحقات معلقة (غير مسددة)</span>
      <div class="text-2xl sm:text-3xl font-bold text-amber-600 mt-1">
        €<?= number_format($unpaidWagesTotal, 2) ?>
      </div>
      <p class="text-[11px] text-gray-400 mt-2">ورديات مسجلة لم تسلم رواتبها بعد</p>
    </div>

    <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
      <span class="text-xs text-emerald-700 font-bold">السلف المسحوبة هذا الشهر</span>
      <div class="text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">
        €<?= number_format($totalAdvancesMonth, 2) ?>
      </div>
      <p class="text-[11px] text-gray-400 mt-2">مخصومة من رواتب الموظفين القادمة</p>
    </div>
  </div>

  <!-- Employee Cards Grid -->
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-tasty-charcoal">فريق العمل (<?= count($employees) ?> موظف)</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <?php foreach ($employees as $emp): ?>
        <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-base font-bold text-tasty-charcoal"><?= htmlspecialchars($emp['name']) ?></h3>
                <p class="text-xs text-tasty-teal font-semibold mt-0.5"><?= htmlspecialchars($emp['role'] ?: 'موظف') ?></p>
              </div>
              <span class="px-2.5 py-1 rounded-xl bg-tasty-teal-light text-tasty-teal-dark font-bold text-xs dir-ltr">
                €<?= number_format($emp['rate'], 2) ?>/ساعة
              </span>
            </div>

            <div class="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-500">
              <div class="flex items-center justify-between">
                <span>رقم الهاتف:</span>
                <span class="font-bold text-gray-700 dir-ltr"><?= htmlspecialchars($emp['phone'] ?: '—') ?></span>
              </div>
              <div class="flex items-center justify-between">
                <span>نوع الدوام:</span>
                <span class="font-bold <?= $emp['schedule_type'] === 'fixed' ? 'text-blue-600' : 'text-purple-600' ?>">
                  <?= $emp['schedule_type'] === 'fixed' ? 'دوام ثابت (' . $emp['default_hours'] . ' س)' : 'دوام مرن' ?>
                </span>
              </div>
              <?php if (!empty($emp['notes'])): ?>
                <p class="text-[11px] text-gray-400 italic pt-1 truncate"><?= htmlspecialchars($emp['notes']) ?></p>
              <?php endif; ?>
            </div>
          </div>

          <div class="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
            <button 
              onclick='openShiftModalFor("<?= $emp['id'] ?>", "<?= addslashes($emp['name']) ?>", <?= $emp['rate'] ?>, "<?= $emp['default_start_time'] ?>", "<?= $emp['default_end_time'] ?>", <?= $emp['default_break_minutes'] ?>)'
              class="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs transition-colors text-center"
            >
              + وردية
            </button>
            <button 
              onclick='openAdvanceModalFor("<?= $emp['id'] ?>", "<?= addslashes($emp['name']) ?>")'
              class="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl font-bold text-xs transition-colors text-center"
            >
              سلفة كاش
            </button>
            <form method="POST" action="" onsubmit="return confirm('حذف الموظف <?= addslashes($emp['name']) ?>؟');">
              <input type="hidden" name="action" value="delete_employee">
              <input type="hidden" name="id" value="<?= $emp['id'] ?>">
              <button type="submit" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </form>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>

  <!-- Recent Shifts Table -->
  <div class="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
    <div class="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
      <div>
        <h3 class="text-base font-bold text-tasty-charcoal">سجل الورديات الأخير</h3>
        <p class="text-xs text-gray-400">آخر (<?= count($shifts) ?>) وردية مسجلة</p>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-right text-xs">
        <thead>
          <tr class="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
            <th class="p-4">الموظف</th>
            <th class="p-4">التاريخ</th>
            <th class="p-4">الوقت</th>
            <th class="p-4">الساعات</th>
            <th class="p-4">الأجر/س</th>
            <th class="p-4">الإجمالي المستحق</th>
            <th class="p-4">الحالة</th>
            <th class="p-4 text-center">إجراءات</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <?php if (empty($shifts)): ?>
            <tr>
              <td colspan="8" class="p-8 text-center text-gray-400 font-bold">
                لا توجد أي ورديات مسجلة بعد. اضغط زر "تسجيل وردية" للبدء.
              </td>
            </tr>
          <?php else: ?>
            <?php foreach ($shifts as $s): ?>
              <tr class="hover:bg-tasty-bg-warm/60 transition-colors">
                <td class="p-4 font-bold text-tasty-charcoal"><?= htmlspecialchars($s['employee_name']) ?></td>
                <td class="p-4 whitespace-nowrap"><?= htmlspecialchars($s['date']) ?></td>
                <td class="p-4 whitespace-nowrap dir-ltr text-right text-gray-500">
                  <?= htmlspecialchars($s['start_time']) ?> - <?= htmlspecialchars($s['end_time']) ?>
                </td>
                <td class="p-4 font-bold text-tasty-charcoal"><?= $s['total_hours'] ?> س</td>
                <td class="p-4 dir-ltr text-right">€<?= number_format($s['hourly_rate'], 2) ?></td>
                <td class="p-4 font-bold text-tasty-teal-dark dir-ltr text-right">€<?= number_format($s['total_earned'], 2) ?></td>
                <td class="p-4 whitespace-nowrap">
                  <?php if ($s['payment_status'] === 'paid_cash'): ?>
                    <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">مسدد كاش</span>
                  <?php elseif ($s['payment_status'] === 'paid_bank'): ?>
                    <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">مسدد بنك</span>
                  <?php else: ?>
                    <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">مستحق معلق</span>
                  <?php endif; ?>
                </td>
                <td class="p-4 text-center">
                  <form method="POST" action="" onsubmit="return confirm('حذف هذه الوردية؟');" class="inline">
                    <input type="hidden" name="action" value="delete_shift">
                    <input type="hidden" name="id" value="<?= $s['id'] ?>">
                    <button type="submit" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
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

<!-- Modal: New/Edit Employee -->
<div id="newEmpModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 hidden">
  <div class="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-4" onclick="event.stopPropagation()">
    <div class="flex items-center justify-between pb-3 border-b border-gray-100">
      <h3 class="text-base font-bold text-tasty-charcoal">إضافة موظف جديد للكادر</h3>
      <button onclick="document.getElementById('newEmpModal').classList.add('hidden')" class="p-1 text-gray-400 hover:text-gray-900">&times;</button>
    </div>

    <form method="POST" action="" class="space-y-3.5">
      <input type="hidden" name="action" value="save_employee">
      <input type="hidden" name="id" value="">

      <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">اسم الموظف الكامل *</label>
        <input type="text" name="name" required placeholder="مثال: يوسف المصري" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-tasty-teal focus:bg-white focus:outline-none">
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">المسمى الوظيفي</label>
          <input type="text" name="role" placeholder="شيف، كاشير، مساعد مطبخ..." class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-tasty-teal focus:bg-white focus:outline-none">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">رقم الهاتف</label>
          <input type="text" name="phone" placeholder="0687654321" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-tasty-teal focus:bg-white focus:outline-none dir-ltr text-right">
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">أجر الساعة (€) *</label>
          <input type="number" step="0.5" name="rate" value="12.0" required class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:border-tasty-teal focus:bg-white focus:outline-none dir-ltr text-right">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">نوع الدوام</label>
          <select name="schedule_type" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:border-tasty-teal focus:bg-white focus:outline-none">
            <option value="fixed">دوام ثابت (ساعات محددة)</option>
            <option value="flexible" selected>دوام مرن (عند الحاجة)</option>
          </select>
        </div>
      </div>

      <div class="pt-3 flex gap-2">
        <button type="submit" class="flex-1 py-3 bg-tasty-teal hover:bg-tasty-teal-dark text-white font-bold rounded-2xl text-xs transition-all shadow-md">
          حفظ الموظف
        </button>
        <button type="button" onclick="document.getElementById('newEmpModal').classList.add('hidden')" class="px-5 py-3 border border-gray-200 text-gray-600 rounded-2xl font-bold text-xs hover:bg-gray-50">
          إلغاء
        </button>
      </div>
    </form>
  </div>
</div>

<!-- Modal: Log Shift -->
<div id="newShiftModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 hidden">
  <div class="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4" onclick="event.stopPropagation()">
    <div class="flex items-center justify-between pb-3 border-b border-gray-100">
      <h3 class="text-base font-bold text-tasty-charcoal">تسجيل وردية عمل</h3>
      <button onclick="document.getElementById('newShiftModal').classList.add('hidden')" class="p-1 text-gray-400 hover:text-gray-900">&times;</button>
    </div>

    <form method="POST" action="" class="space-y-3.5">
      <input type="hidden" name="action" value="save_shift">

      <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">الموظف *</label>
        <select name="employee_id" id="shiftEmpId" required class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:border-tasty-teal focus:bg-white focus:outline-none">
          <?php foreach ($employees as $e): ?>
            <option value="<?= $e['id'] ?>"><?= htmlspecialchars($e['name']) ?> (€<?= $e['rate'] ?>/س)</option>
          <?php endforeach; ?>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">التاريخ *</label>
          <input type="date" name="shift_date" value="<?= date('Y-m-d') ?>" required class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-tasty-teal focus:bg-white focus:outline-none">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">استراحة (دقائق)</label>
          <input type="number" name="break_minutes" value="30" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-tasty-teal focus:bg-white focus:outline-none dir-ltr text-right">
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">بداية الدوام</label>
          <input type="time" name="start_time" id="shiftStart" value="10:00" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-tasty-teal focus:bg-white focus:outline-none">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">نهاية الدوام</label>
          <input type="time" name="end_time" id="shiftEnd" value="18:30" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-tasty-teal focus:bg-white focus:outline-none">
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">حالة الدفع</label>
        <select name="payment_status" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:border-tasty-teal focus:bg-white focus:outline-none">
          <option value="unpaid">مستحق معلق (يُحاسب لاحقاً)</option>
          <option value="paid_cash">تم التسليم كاش فوراً نهاية اليوم</option>
          <option value="paid_bank">تم التحويل بنكياً</option>
        </select>
      </div>

      <div class="pt-3 flex gap-2">
        <button type="submit" class="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md">
          تسجيل الوردية
        </button>
        <button type="button" onclick="document.getElementById('newShiftModal').classList.add('hidden')" class="px-5 py-3 border border-gray-200 text-gray-600 rounded-2xl font-bold text-xs hover:bg-gray-50">
          إلغاء
        </button>
      </div>
    </form>
  </div>
</div>

<!-- Modal: Cash Advance -->
<div id="advanceModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 hidden">
  <div class="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl space-y-4" onclick="event.stopPropagation()">
    <div class="flex items-center justify-between pb-3 border-b border-gray-100">
      <h3 class="text-base font-bold text-tasty-charcoal">سلفة كاش من الصندوق</h3>
      <button onclick="document.getElementById('advanceModal').classList.add('hidden')" class="p-1 text-gray-400 hover:text-gray-900">&times;</button>
    </div>

    <form method="POST" action="" class="space-y-3.5">
      <input type="hidden" name="action" value="save_advance">
      <input type="hidden" name="employee_id" id="advEmpId" value="">

      <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">الموظف</label>
        <input type="text" id="advEmpName" readonly class="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700">
      </div>

      <div>
        <label class="block text-xs font-bold text-amber-700 mb-1">مبلغ السلفة (€) *</label>
        <input type="number" step="1" min="1" name="amount" required placeholder="50" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-base font-bold focus:border-amber-500 focus:bg-white focus:outline-none dir-ltr text-right">
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">ملاحظة</label>
        <input type="text" name="notes" placeholder="سلفة نقدية من درج الكاش..." class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-tasty-teal focus:bg-white focus:outline-none">
      </div>

      <div class="pt-3 flex gap-2">
        <button type="submit" class="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md">
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
  function openShiftModalFor(id, name, rate, start, end, brk) {
    document.getElementById('shiftEmpId').value = id;
    if (start) document.getElementById('shiftStart').value = start;
    if (end) document.getElementById('shiftEnd').value = end;
    document.getElementById('newShiftModal').classList.remove('hidden');
  }

  function openAdvanceModalFor(id, name) {
    document.getElementById('advEmpId').value = id;
    document.getElementById('advEmpName').value = name;
    document.getElementById('advanceModal').classList.remove('hidden');
  }
</script>

<?php require_once __DIR__ . '/footer.php'; ?>

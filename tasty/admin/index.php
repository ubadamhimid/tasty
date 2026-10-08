<?php
$pageTitle = 'لوحة القيادة التنفيذية — TASTY Hilversum';
require_once __DIR__ . '/header.php';

// Strict Admin Enforcement (Managers can only see Sales, Employees, Orders)
if (!isAdmin()) {
    header('Location: ' . APP_URL . '/admin/sales.php');
    exit;
}

$db = getDB();

// Period Filter
$period = $_GET['period'] ?? 'month'; // 'today', 'week', 'month', 'all'
$todayStr = date('Y-m-d');

// Determine start date based on period
$startDate = null;
if ($period === 'today') {
    $startDate = $todayStr;
} elseif ($period === 'week') {
    $startDate = date('Y-m-d', strtotime('monday this week'));
} elseif ($period === 'month') {
    $startDate = date('Y-m-01');
}

// 1. Fetch Sales for Period
$salesQuery = "SELECT * FROM daily_sales";
$salesParams = [];
if ($startDate !== null) {
    $salesQuery .= " WHERE date >= ?";
    $salesParams[] = $startDate;
}
$salesQuery .= " ORDER BY date DESC";

$stmt = $db->prepare($salesQuery);
$stmt->execute($salesParams);
$periodSales = $stmt->fetchAll();

$periodTotalSales = 0;
$periodCash = 0;
$periodCard = 0;
foreach ($periodSales as $s) {
    $periodTotalSales += $s['total_amount'];
    $periodCash += $s['cash_amount'];
    $periodCard += $s['card_amount'];
}
$cashPct = ($periodTotalSales > 0) ? round(($periodCash / $periodTotalSales) * 100) : 0;
$cardPct = ($periodTotalSales > 0) ? round(($periodCard / $periodTotalSales) * 100) : 0;

// 2. Fetch Shifts & Wages for Period
$shiftsQuery = "SELECT * FROM employee_shifts";
$shiftsParams = [];
if ($startDate !== null) {
    $shiftsQuery .= " WHERE date >= ?";
    $shiftsParams[] = $startDate;
}
$stmt = $db->prepare($shiftsQuery);
$stmt->execute($shiftsParams);
$periodShifts = $stmt->fetchAll();

$periodWages = 0;
$periodHours = 0;
foreach ($periodShifts as $sh) {
    $periodWages += $sh['total_earned'];
    $periodHours += $sh['total_hours'];
}

// 3. Fetch Advances for Period
$advQuery = "SELECT SUM(amount) FROM employee_advances";
$advParams = [];
if ($startDate !== null) {
    $advQuery .= " WHERE date >= ?";
    $advParams[] = $startDate;
}
$stmt = $db->prepare($advQuery);
$stmt->execute($advParams);
$periodAdvances = floatval($stmt->fetchColumn() ?: 0);

// 4. Calculate Operational Surplus (Sales - Wages)
$operationalSurplus = $periodTotalSales - $periodWages;
$wagesRatio = ($periodTotalSales > 0) ? round(($periodWages / $periodTotalSales) * 100) : 0;

// 5. Overall Debts Status
$totalPayableDebts = floatval($db->query("SELECT SUM(remaining_amount) FROM debts WHERE type = 'payable'")->fetchColumn() ?: 0);
$totalReceivableDebts = floatval($db->query("SELECT SUM(remaining_amount) FROM debts WHERE type = 'receivable'")->fetchColumn() ?: 0);
$netDebt = $totalPayableDebts; // صافي التزامات المطعم للموردين

// Check if today sales recorded
$isTodayLogged = (bool)$db->query("SELECT COUNT(*) FROM daily_sales WHERE date = '$todayStr'")->fetchColumn();
?>

<div class="space-y-6">

  <!-- Executive Hero Banner -->
  <div class="bg-gradient-to-l from-tasty-teal-dark via-[#354D4B] to-tasty-teal text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
    <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <div class="flex items-center gap-2 flex-wrap mb-3 text-xs">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-tasty-teal-light font-bold border border-white/15">
            <span>لوحة القيادة التنفيذية للمدير العام</span>
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/25">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>المطعم مفتوح الآن</span>
          </span>
          <span class="text-white/70"><?= date('l، j F Y') ?></span>
        </div>

        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">أهلاً بك في نظام إدارة TASTY</h1>
        <p class="text-tasty-teal-light/90 text-sm mt-1 max-w-2xl leading-relaxed">
          تحليل شامل وفوري للأداء المالي، مراقبة الإيرادات والكاش، أجور الكوادر والورديات، وحركة المشتريات والديون.
        </p>
      </div>

      <!-- Period Filter Buttons -->
      <div class="flex items-center p-1.5 bg-black/25 backdrop-blur-md rounded-2xl border border-white/15 shrink-0 self-start md:self-auto">
        <a href="?period=today" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all <?= $period === 'today' ? 'bg-white text-tasty-teal-dark shadow-sm' : 'text-white/80 hover:text-white' ?>">اليوم</a>
        <a href="?period=week" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all <?= $period === 'week' ? 'bg-white text-tasty-teal-dark shadow-sm' : 'text-white/80 hover:text-white' ?>">هذا الأسبوع</a>
        <a href="?period=month" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all <?= $period === 'month' ? 'bg-white text-tasty-teal-dark shadow-sm' : 'text-white/80 hover:text-white' ?>">هذا الشهر</a>
        <a href="?period=all" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all <?= $period === 'all' ? 'bg-white text-tasty-teal-dark shadow-sm' : 'text-white/80 hover:text-white' ?>">كافة الفترات</a>
      </div>
    </div>
  </div>

  <!-- Operational Alerts (Notice if today sale not entered) -->
  <?php if (!$isTodayLogged): ?>
    <div class="p-4 sm:p-5 rounded-3xl bg-amber-50 border border-amber-200/80 shadow-2xs flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <div>
          <h4 class="text-xs font-bold text-amber-900">تنبيهات العمليات المباشرة</h4>
          <p class="text-xs text-amber-700 mt-0.5">لم يتم إدخال مبيعات اليوم بعد (<?= date('Y-m-d') ?>).</p>
        </div>
      </div>
      <a href="<?= APP_URL ?>/admin/sales.php" class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all shrink-0">
        تسجيل مبيعات اليوم
      </a>
    </div>
  <?php endif; ?>

  <!-- 4 Executive KPI Cards Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

    <!-- Card 1: Revenue -->
    <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between text-xs text-gray-400 font-bold mb-2">
          <span>المبيعات المحققة</span>
          <span class="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          </span>
        </div>
        <div class="text-2xl font-extrabold text-tasty-charcoal dir-ltr text-right">
          €<?= number_format($periodTotalSales, 2) ?>
        </div>
      </div>

      <div class="mt-4 pt-3 border-t border-gray-100">
        <div class="flex items-center justify-between text-[11px] text-gray-500 font-bold">
          <span class="text-emerald-700">كاش: €<?= number_format($periodCash, 2) ?> (<?= $cashPct ?>%)</span>
          <span class="text-blue-700">PIN: €<?= number_format($periodCard, 2) ?> (<?= $cardPct ?>%)</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden flex">
          <div class="bg-emerald-500 h-1.5" style="width: <?= $cashPct ?>%"></div>
          <div class="bg-blue-500 h-1.5" style="width: <?= $cardPct ?>%"></div>
        </div>
      </div>
    </div>

    <!-- Card 2: Labor Cost -->
    <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between text-xs text-gray-400 font-bold mb-2">
          <span>تكلفة الكوادر والورديات</span>
          <span class="p-2 rounded-xl bg-blue-50 text-blue-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          </span>
        </div>
        <div class="text-2xl font-extrabold text-tasty-charcoal dir-ltr text-right">
          €<?= number_format($periodWages, 2) ?>
        </div>
      </div>

      <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
        <span><?= number_format($periodHours, 1) ?> ساعة عمل</span>
        <span class="font-bold text-amber-700">سلف مسحوبة: €<?= number_format($periodAdvances, 2) ?></span>
      </div>
    </div>

    <!-- Card 3: Operational Surplus -->
    <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between text-xs text-gray-400 font-bold mb-2">
          <span>الفائض التشغيلي التقديري</span>
          <span class="p-2 rounded-xl bg-amber-50 text-amber-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </span>
        </div>
        <div class="text-2xl font-extrabold <?= $operationalSurplus >= 0 ? 'text-emerald-700' : 'text-red-600' ?> dir-ltr text-right">
          <?= $operationalSurplus >= 0 ? '+' : '' ?>€<?= number_format($operationalSurplus, 2) ?>
        </div>
      </div>

      <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
        <span class="text-gray-400">نسبة أجور العمل من الدخل:</span>
        <span class="font-bold <?= $wagesRatio <= 35 ? 'text-emerald-700' : 'text-amber-700' ?>"><?= $wagesRatio ?>%</span>
      </div>
    </div>

    <!-- Card 4: Debts Position -->
    <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between text-xs text-gray-400 font-bold mb-2">
          <span>صافي التزامات المطعم</span>
          <span class="p-2 rounded-xl bg-purple-50 text-purple-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
          </span>
        </div>
        <div class="text-2xl font-extrabold text-red-600 dir-ltr text-right">
          €<?= number_format($netDebt, 2) ?>
        </div>
      </div>

      <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
        <span class="text-gray-400">ديون لنا على الزبائن:</span>
        <span class="font-bold text-blue-700">€<?= number_format($totalReceivableDebts, 2) ?></span>
      </div>
    </div>

  </div>

  <!-- Recent Sales Breakdown & Quick Actions -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    
    <!-- Recent Activity -->
    <div class="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-bold text-tasty-charcoal">سجل المبيعات الأخير للفترة</h3>
        <a href="<?= APP_URL ?>/admin/sales.php" class="text-xs text-tasty-teal font-bold hover:underline">عرض الكل ←</a>
      </div>

      <div class="space-y-3">
        <?php if (empty($periodSales)): ?>
          <p class="text-xs text-gray-400 text-center py-8">لا توجد مبيعات مسجة في هذه الفترة المحددة.</p>
        <?php else: ?>
          <?php foreach (array_slice($periodSales, 0, 7) as $sl): ?>
            <div class="p-3.5 rounded-2xl bg-gray-50 flex items-center justify-between text-xs">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-bold text-tasty-teal">
                  €
                </div>
                <div>
                  <span class="font-bold text-tasty-charcoal"><?= $sl['date'] ?></span>
                  <?php if (!empty($sl['notes'])): ?>
                    <p class="text-[11px] text-gray-400 truncate max-w-xs"><?= htmlspecialchars($sl['notes']) ?></p>
                  <?php endif; ?>
                </div>
              </div>
              <div class="text-left dir-ltr">
                <span class="font-bold text-sm text-tasty-charcoal">€<?= number_format($sl['total_amount'], 2) ?></span>
                <p class="text-[10px] text-gray-400">كاش €<?= number_format($sl['cash_amount'], 2) ?> / PIN €<?= number_format($sl['card_amount'], 2) ?></p>
              </div>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
    </div>

    <!-- Quick Navigation Cards -->
    <div class="space-y-4">
      
      <div class="bg-gradient-to-br from-tasty-teal-light to-white p-5 rounded-3xl border border-tasty-teal/20 shadow-xs">
        <h4 class="text-xs font-bold text-tasty-teal-dark mb-1">تسجيل مبيعات جديد</h4>
        <p class="text-xs text-gray-500 mb-3">إدخال جرد الكاش والبطاقة نهاية وردية اليوم.</p>
        <a href="<?= APP_URL ?>/admin/sales.php" class="inline-flex items-center justify-center w-full py-2.5 bg-tasty-teal text-white rounded-xl text-xs font-bold shadow-xs hover:bg-tasty-teal-dark transition-all">
          فتح نموذج المبيعات
        </a>
      </div>

      <div class="bg-gradient-to-br from-amber-50 to-white p-5 rounded-3xl border border-amber-200/60 shadow-xs">
        <h4 class="text-xs font-bold text-amber-900 mb-1">سجل الديون والموردين</h4>
        <p class="text-xs text-gray-500 mb-3">متابعة فواتير اللحوم والخضار ودفعات الموردين.</p>
        <a href="<?= APP_URL ?>/admin/debts.php" class="inline-flex items-center justify-center w-full py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-amber-700 transition-all">
          إدارة سجل الديون
        </a>
      </div>

      <div class="bg-gradient-to-br from-blue-50 to-white p-5 rounded-3xl border border-blue-200/60 shadow-xs">
        <h4 class="text-xs font-bold text-blue-900 mb-1">ورديات الموظفين</h4>
        <p class="text-xs text-gray-500 mb-3">تسجيل ساعات عمل الكاشير والشيف والمساعدين.</p>
        <a href="<?= APP_URL ?>/admin/employees.php" class="inline-flex items-center justify-center w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-700 transition-all">
          تسجيل ساعات الكادر
        </a>
      </div>

    </div>

  </div>

</div>

<?php require_once __DIR__ . '/footer.php'; ?>

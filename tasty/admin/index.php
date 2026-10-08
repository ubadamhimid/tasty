<?php
// Smart Front Controller Router: seamless clean URL routing (e.g., /admin/employees -> employees.php)
$reqPath = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
$subRoute = trim(preg_replace('#^.*?/admin/?#', '', $reqPath), '/');
$cleanRoute = preg_replace('/\.php$/', '', $subRoute);
$cleanRoute = preg_replace('/[^a-zA-Z0-9_-]/', '', $cleanRoute);

if (!empty($cleanRoute) && $cleanRoute !== 'index') {
    $targetFile = __DIR__ . '/' . $cleanRoute . '.php';
    if (file_exists($targetFile)) {
        require $targetFile;
        exit;
    }
}

$pageTitle = 'لوحة القيادة التنفيذية — TASTY Hilversum';
require_once __DIR__ . '/header.php';

// Strict Admin Enforcement (Managers can only see Sales, Employees, Orders)
if (!isAdmin()) {
    header('Location: ' . APP_URL . '/admin/sales');
    exit;
}

$db = getDB();
$todayStr = date('Y-m-d');

// 1. Period Filter
$period = $_GET['period'] ?? 'month'; // 'today', 'week', 'month', 'all'

$startDate = null;
$periodLabel = 'هذا الشهر';
if ($period === 'today') {
    $startDate = $todayStr;
    $periodLabel = 'مبيعات اليوم';
} elseif ($period === 'week') {
    $startDate = date('Y-m-d', strtotime('monday this week'));
    $periodLabel = 'هذا الأسبوع';
} elseif ($period === 'month') {
    $startDate = date('Y-m-01');
    $periodLabel = 'هذا الشهر (' . date('m/Y') . ')';
} else {
    $period = 'all';
    $startDate = null;
    $periodLabel = 'كافة الفترات المسجلة';
}

// 2. Fetch Sales for Selected Period
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
    $periodTotalSales += floatval($s['total_amount']);
    $periodCash += floatval($s['cash_amount']);
    $periodCard += floatval($s['card_amount']);
}
$cashPct = ($periodTotalSales > 0) ? round(($periodCash / $periodTotalSales) * 100) : 0;
$cardPct = ($periodTotalSales > 0) ? round(($periodCard / $periodTotalSales) * 100) : 0;
$salesCount = count($periodSales);

// 3. Fetch Shifts & Wages for Selected Period
$shiftsQuery = "SELECT * FROM employee_shifts";
$shiftsParams = [];
if ($startDate !== null) {
    $shiftsQuery .= " WHERE date >= ?";
    $shiftsParams[] = $startDate;
}
$shiftsQuery .= " ORDER BY date DESC, start_time ASC";
$stmt = $db->prepare($shiftsQuery);
$stmt->execute($shiftsParams);
$periodShifts = $stmt->fetchAll();

$periodWages = 0;
$periodHours = 0;
foreach ($periodShifts as $sh) {
    $periodWages += floatval($sh['total_earned']);
    $periodHours += floatval($sh['total_hours']);
}

// 4. Fetch Advances for Selected Period
$advQuery = "SELECT SUM(amount) FROM employee_advances";
$advParams = [];
if ($startDate !== null) {
    $advQuery .= " WHERE date >= ?";
    $advParams[] = $startDate;
}
$stmt = $db->prepare($advQuery);
$stmt->execute($advParams);
$periodAdvances = floatval($stmt->fetchColumn() ?: 0);

// 5. Operational Surplus (Sales - Wages)
$operationalSurplus = $periodTotalSales - $periodWages;
$isSurplusNegative = ($operationalSurplus < 0);
$wagesRatio = ($periodTotalSales > 0) ? round(($periodWages / $periodTotalSales) * 100) : 0;

// 6. Overall Debts Status
$totalPayableDebts = floatval($db->query("SELECT SUM(remaining_amount) FROM debts WHERE type = 'payable'")->fetchColumn() ?: 0);
$totalReceivableDebts = floatval($db->query("SELECT SUM(remaining_amount) FROM debts WHERE type = 'receivable'")->fetchColumn() ?: 0);

// 7. General Average Daily Sales
$avgDailySales = floatval($db->query("SELECT AVG(total_amount) FROM daily_sales")->fetchColumn() ?: 0);

// 8. 7-Day Performance Bar Chart Data
$chartDays = [];
$highestChartTotal = 0;
$arabicDays = [
    'Sat' => 'السبت', 'Sun' => 'الأحد', 'Mon' => 'الإثنين',
    'Tue' => 'الثلاثاء', 'Wed' => 'الأربعاء', 'Thu' => 'الخميس', 'Fri' => 'الجمعة'
];

for ($i = 6; $i >= 0; $i--) {
    $ts = strtotime("-$i days");
    $dStr = date('Y-m-d', $ts);
    $shortDay = date('D', $ts);
    $dayName = $arabicDays[$shortDay] ?? $shortDay;
    
    $saleStmt = $db->prepare("SELECT total_amount, cash_amount, card_amount FROM daily_sales WHERE date = ?");
    $saleStmt->execute([$dStr]);
    $sRow = $saleStmt->fetch();
    
    $tot = $sRow ? floatval($sRow['total_amount']) : 0;
    $csh = $sRow ? floatval($sRow['cash_amount']) : 0;
    $crd = $sRow ? floatval($sRow['card_amount']) : 0;
    
    if ($tot > $highestChartTotal) {
        $highestChartTotal = $tot;
    }
    
    $chartDays[] = [
        'date' => $dStr,
        'shortDate' => date('m/d', $ts),
        'dayName' => $dayName,
        'total' => $tot,
        'cash' => $csh,
        'card' => $crd,
        'hasSale' => ($sRow !== false && $tot > 0),
        'isToday' => ($dStr === $todayStr)
    ];
}
$maxChartVal = max($highestChartTotal, 500);

// 9. Today's Shifts & Crew
$todayShiftsStmt = $db->prepare("SELECT * FROM employee_shifts WHERE date = ? ORDER BY start_time ASC");
$todayShiftsStmt->execute([$todayStr]);
$todayShifts = $todayShiftsStmt->fetchAll();

// 10. Check if today sales recorded
$isTodaySaleLogged = (bool)$db->query("SELECT COUNT(*) FROM daily_sales WHERE date = '$todayStr'")->fetchColumn();

// 11. Recent Purchase Orders
$recentOrders = [];
try {
    $recentOrders = $db->query("SELECT * FROM purchase_orders ORDER BY date DESC, created_at DESC LIMIT 4")->fetchAll();
} catch (Exception $e) {
    $recentOrders = [];
}

// 12. Check pending purchase orders count
$pendingOrdersCount = 0;
try {
    $pendingOrdersCount = intval($db->query("SELECT COUNT(*) FROM purchase_orders WHERE status = 'pending'")->fetchColumn() ?: 0);
} catch (Exception $e) {}

// 13. Unlogged fixed staff check
$unloggedFixedCount = 0;
try {
    $fixedEmployees = $db->query("SELECT id FROM employees WHERE schedule_type = 'fixed' AND is_active = 1")->fetchAll();
    foreach ($fixedEmployees as $fe) {
        $chk = $db->prepare("SELECT COUNT(*) FROM employee_shifts WHERE employee_id = ? AND date = ?");
        $chk->execute([$fe['id'], $todayStr]);
        if (!$chk->fetchColumn()) {
            $unloggedFixedCount++;
        }
    }
} catch (Exception $e) {}
?>

<div class="space-y-6">

  <!-- 1. Executive Top Hero Banner with Status & Period Switcher -->
  <div class="bg-gradient-to-l from-tasty-charcoal via-tasty-teal-dark to-tasty-teal rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 text-white shadow-xl relative overflow-hidden">
    <div class="absolute -left-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-0 right-1/3 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

    <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-5">
      <div>
        <div class="flex flex-wrap items-center gap-2 mb-1.5 sm:mb-2.5">
          <span class="hidden sm:inline-flex text-[11px] font-bold px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md items-center gap-1.5 shadow-xs whitespace-nowrap">
            <svg class="w-3.5 h-3.5 text-amber-300 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <span>لوحة القيادة التنفيذية</span>
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 inline-flex items-center gap-1.5 whitespace-nowrap">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span>المطعم مفتوح الآن</span>
          </span>
          <span class="text-xs text-tasty-sage-light hidden md:inline">
            <?= date('l، j F Y') ?>
          </span>
        </div>

        <h1 class="font-serif font-black text-lg sm:text-3xl text-white tracking-tight">
          أهلاً بك في نظام إدارة TASTY
        </h1>
        <p class="text-xs sm:text-sm text-tasty-sage-light/90 max-w-2xl mt-1 leading-relaxed hidden sm:block">
          تحليل شامل وفوري للأداء المالي، مراقبة الإيرادات والكاش، أجور الكوادر والورديات، وحركة المشتريات والديون.
        </p>
      </div>

      <!-- Quick Period Selector Tabs -->
      <div class="w-full lg:w-auto bg-black/35 backdrop-blur-md p-1 rounded-xl sm:rounded-2xl border border-white/15 grid grid-cols-4 lg:flex items-center gap-1 shrink-0">
        <a href="?period=today" class="py-1.5 lg:py-2 px-1 lg:px-3.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all text-center whitespace-nowrap <?= $period === 'today' ? 'bg-white text-tasty-charcoal shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10' ?>">
          اليوم
        </a>
        <a href="?period=week" class="py-1.5 lg:py-2 px-1 lg:px-3.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all text-center whitespace-nowrap <?= $period === 'week' ? 'bg-white text-tasty-charcoal shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10' ?>">
          الأسبوع
        </a>
        <a href="?period=month" class="py-1.5 lg:py-2 px-1 lg:px-3.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all text-center whitespace-nowrap <?= $period === 'month' ? 'bg-white text-tasty-charcoal shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10' ?>">
          الشهر
        </a>
        <a href="?period=all" class="py-1.5 lg:py-2 px-1 lg:px-3.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all text-center whitespace-nowrap <?= $period === 'all' ? 'bg-white text-tasty-charcoal shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10' ?>">
          الكل
        </a>
      </div>
    </div>
  </div>

  <!-- 2. Executive Alert & Action Highlights (If any actions are pending) -->
  <?php if (!$isTodaySaleLogged || $unloggedFixedCount > 0 || $pendingOrdersCount > 0): ?>
    <div class="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white border border-amber-200/80 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
      <div class="flex items-start sm:items-center gap-2.5 sm:gap-3">
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <div>
          <div class="flex items-center gap-1.5">
            <h4 class="font-bold text-xs sm:text-sm text-amber-950">تنبيه العمليات</h4>
            <span class="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/50">
              إجراء مطلوب
            </span>
          </div>
          <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-0.5 sm:gap-x-3 text-[11px] sm:text-xs text-amber-900/80 mt-0.5">
            <?php if (!$isTodaySaleLogged): ?>
              <span class="text-rose-700 font-semibold">
                • لم يتم إدخال مبيعات اليوم بعد
              </span>
            <?php endif; ?>
            <?php if ($unloggedFixedCount > 0): ?>
              <span>• (<?= $unloggedFixedCount ?>) موظف بانتظار التحضير</span>
            <?php endif; ?>
            <?php if ($pendingOrdersCount > 0): ?>
              <span>• (<?= $pendingOrdersCount ?>) طلبية قيد التجهيز</span>
            <?php endif; ?>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-amber-200/50">
        <?php if (!$isTodaySaleLogged): ?>
          <a href="<?= APP_URL ?>/admin/sales" class="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            <span>تسجيل المبيعات</span>
          </a>
        <?php endif; ?>
        <?php if ($pendingOrdersCount > 0): ?>
          <a href="<?= APP_URL ?>/admin/orders" class="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border border-amber-300 text-amber-900 bg-white hover:bg-amber-50 font-bold text-xs transition-all flex items-center justify-center gap-1.5">
            <span>الطلبيات</span>
          </a>
        <?php endif; ?>
      </div>
    </div>
  <?php endif; ?>

  <!-- 3. Four Core Dynamic Executive KPI Cards (2 Cols on Mobile, 4 Cols on Desktop) -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
    
    <!-- KPI 1: Dynamic Revenue -->
    <div class="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow relative group">
      <div class="flex items-center justify-between mb-1.5 sm:mb-3">
        <div>
          <span class="text-[10px] sm:text-[11px] font-bold text-gray-400 block">الإيرادات</span>
          <span class="text-[11px] sm:text-xs font-bold text-gray-700 hidden sm:block"><?= $periodLabel ?></span>
        </div>
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
        </div>
      </div>

      <div dir="ltr" class="flex items-baseline gap-0.5 sm:gap-1">
        <span class="text-xs sm:text-lg font-bold text-emerald-500 font-sans">€</span>
        <span class="text-lg sm:text-3xl font-black font-sans tracking-tight text-tasty-charcoal tabular-nums">
          <?= number_format($periodTotalSales, 2) ?>
        </span>
      </div>

      <div class="mt-2 sm:mt-3.5 pt-2 sm:pt-3 border-t border-gray-100">
        <div class="flex flex-col sm:flex-row justify-between sm:items-center text-[10px] sm:text-[11px] font-bold gap-0.5">
          <span class="text-emerald-700">كاش: €<?= number_format($periodCash, 0) ?></span>
          <span class="text-tasty-teal-dark">PIN: €<?= number_format($periodCard, 0) ?></span>
        </div>
        <div class="w-full h-1.5 sm:h-2 rounded-full bg-gray-100 overflow-hidden hidden sm:flex mt-1.5">
          <div style="width: <?= $cashPct ?>%" class="h-full bg-emerald-500 transition-all duration-500"></div>
          <div style="width: <?= $cardPct ?>%" class="h-full bg-tasty-teal transition-all duration-500"></div>
        </div>
      </div>
    </div>

    <!-- KPI 2: Labor Cost & Staff Wages -->
    <div class="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow relative group">
      <div class="flex items-center justify-between mb-1.5 sm:mb-3">
        <div>
          <span class="text-[10px] sm:text-[11px] font-bold text-gray-400 block">أجور الكوادر</span>
          <span class="text-[11px] sm:text-xs font-bold text-gray-700 hidden sm:block">الأجور المستحقة</span>
        </div>
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        </div>
      </div>

      <div dir="ltr" class="flex items-baseline gap-0.5 sm:gap-1">
        <span class="text-xs sm:text-lg font-bold text-blue-500 font-sans">€</span>
        <span class="text-lg sm:text-3xl font-black font-sans tracking-tight text-tasty-charcoal tabular-nums">
          <?= number_format($periodWages, 2) ?>
        </span>
      </div>

      <div class="mt-2 sm:mt-3.5 pt-2 sm:pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-[11px] text-gray-500 gap-0.5">
        <span><?= number_format($periodHours, 1) ?> ساعة</span>
        <span class="font-bold text-amber-700">سلف: €<?= number_format($periodAdvances, 0) ?></span>
      </div>
    </div>

    <!-- KPI 3: Operational Surplus (Sales - Wages) -->
    <div class="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow relative group">
      <div class="flex items-center justify-between mb-1.5 sm:mb-3">
        <div>
          <span class="text-[10px] sm:text-[11px] font-bold text-gray-400 block">الفائض التقديري</span>
          <span class="text-[11px] sm:text-xs font-bold text-gray-700 hidden sm:block">(المبيعات - الأجور)</span>
        </div>
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
      </div>

      <div dir="ltr" class="flex items-baseline gap-0.5 sm:gap-1">
        <span class="text-xs sm:text-lg font-bold <?= $isSurplusNegative ? 'text-rose-500' : 'text-emerald-500' ?> font-sans">
          <?= $isSurplusNegative ? '-€' : '€' ?>
        </span>
        <span class="text-lg sm:text-3xl font-black font-sans tracking-tight tabular-nums <?= $isSurplusNegative ? 'text-rose-600' : 'text-emerald-600' ?>">
          <?= number_format(abs($operationalSurplus), 2) ?>
        </span>
      </div>

      <div class="mt-2 sm:mt-3.5 pt-2 sm:pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] sm:text-[11px] text-gray-500">
        <span class="hidden sm:inline">نسبة الأجور:</span>
        <span class="font-bold px-1.5 py-0.5 rounded-md sm:rounded-full <?= ($wagesRatio > 35) ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800' ?>">
          <?= $wagesRatio ?>% من الدخل
        </span>
      </div>
    </div>

    <!-- KPI 4: Net Debt & Liquidity Position -->
    <div class="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow relative group">
      <div class="flex items-center justify-between mb-1.5 sm:mb-3">
        <div>
          <span class="text-[10px] sm:text-[11px] font-bold text-gray-400 block">ديون الموردين</span>
          <span class="text-[11px] sm:text-xs font-bold text-gray-700 hidden sm:block">صافي الالتزامات</span>
        </div>
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
        </div>
      </div>

      <div dir="ltr" class="flex items-baseline gap-0.5 sm:gap-1">
        <span class="text-xs sm:text-lg font-bold text-gray-400 font-sans">€</span>
        <span class="text-lg sm:text-3xl font-black font-sans tracking-tight tabular-nums <?= $totalPayableDebts > 0 ? 'text-rose-600' : 'text-emerald-600' ?>">
          <?= number_format($totalPayableDebts, 2) ?>
        </span>
      </div>

      <div class="mt-2 sm:mt-3.5 pt-2 sm:pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] sm:text-[11px] text-gray-500">
        <span>لنا:</span>
        <span class="font-bold text-blue-700" dir="ltr">€<?= number_format($totalReceivableDebts, 0) ?></span>
      </div>
    </div>

  </div>

  <!-- 4. Interactive 7-Day Sales Trend Bar Chart & Liquidity Analysis -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    
    <!-- Weekly Trend Bar Chart (2 Cols) -->
    <div class="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-gray-100">
        <div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-tasty-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            <h3 class="font-bold text-base text-tasty-charcoal">مخطط حركة المبيعات (الأيام السبعة الأخيرة)</h3>
          </div>
          <p class="text-xs text-gray-400 mt-0.5">مقارنة حجم مبيعات الأيام لمعرفة ذروة الطلب والإيراد اليومي</p>
        </div>
        
        <div class="flex items-center gap-3 text-xs text-gray-500">
          <span class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-md bg-emerald-500"></span> كاش
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-md bg-tasty-teal"></span> كرت PIN
          </span>
        </div>
      </div>

      <!-- Bar Chart Container -->
      <div class="h-60 w-full flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-2 px-1 sm:px-4">
        <?php foreach ($chartDays as $d): ?>
          <?php 
            $heightPct = ($maxChartVal > 0) ? max(10, round(($d['total'] / $maxChartVal) * 100)) : 10;
            $isHighest = ($d['total'] > 0 && $d['total'] === $highestChartTotal);
            $cashRatio = ($d['total'] > 0) ? round(($d['cash'] / $d['total']) * 100) : 0;
            $cardRatio = ($d['total'] > 0) ? round(($d['card'] / $d['total']) * 100) : 0;
          ?>
          <div class="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative">
            
            <!-- Tooltip on hover -->
            <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-14 z-20 bg-tasty-charcoal text-white text-[11px] py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap pointer-events-none text-center">
              <p class="font-bold font-sans">€<?= number_format($d['total'], 2) ?></p>
              <p class="text-[9px] text-gray-300">كاش: €<?= number_format($d['cash'], 0) ?> | كرت: €<?= number_format($d['card'], 0) ?></p>
            </div>

            <!-- Highest day badge -->
            <?php if ($isHighest): ?>
              <span class="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md mb-1 animate-bounce">
                الأعلى 🏆
              </span>
            <?php endif; ?>

            <!-- Value on top of bar -->
            <span class="text-[10px] font-bold text-gray-400 font-sans mb-1 group-hover:text-tasty-teal tabular-nums">
              <?= $d['total'] > 0 ? ('€' . number_format($d['total'], 0)) : '€0' ?>
            </span>

            <!-- Vertical Bar Stack -->
            <div style="height: <?= $heightPct ?>%" class="w-full max-w-[42px] rounded-2xl overflow-hidden flex flex-col justify-end transition-all duration-300 <?= $d['isToday'] ? 'ring-2 ring-emerald-400/80 shadow-md' : 'opacity-90 group-hover:opacity-100 group-hover:scale-105 group-hover:shadow-md' ?>">
              <?php if ($d['hasSale']): ?>
                <!-- Card PIN portion on top -->
                <div style="height: <?= $cardRatio ?>%" class="w-full bg-tasty-teal transition-all"></div>
                <!-- Cash portion at bottom -->
                <div style="height: <?= $cashRatio ?>%" class="w-full bg-emerald-500 transition-all"></div>
              <?php else: ?>
                <div class="w-full h-full bg-gray-100 border border-dashed border-gray-300 rounded-xl"></div>
              <?php endif; ?>
            </div>

            <!-- Day Label -->
            <div class="mt-2.5 text-center">
              <span class="block text-xs font-bold <?= $d['isToday'] ? 'text-emerald-700' : 'text-gray-700' ?>">
                <?= $d['dayName'] ?>
              </span>
              <span class="block text-[10px] text-gray-400 font-sans">
                <?= $d['shortDate'] ?>
              </span>
            </div>

          </div>
        <?php endforeach; ?>
      </div>

      <div class="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 mt-2">
        <span>متوسط المبيعات اليومي العام: <strong class="text-tasty-teal-dark font-sans">€<?= number_format($avgDailySales, 2) ?></strong> / يوم</span>
        <a href="<?= APP_URL ?>/admin/sales" class="text-tasty-teal hover:underline font-bold flex items-center gap-1">
          <span>عرض سجل المبيعات والتقفيل اليومي ←</span>
        </a>
      </div>
    </div>

    <!-- Cash vs PIN Liquidity Breakdown & Advice (1 Col) -->
    <div class="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
      <div>
        <div class="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
          <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg>
          </div>
          <div>
            <h3 class="font-bold text-base text-tasty-charcoal">تحليل وسائل الدفع والسيولة</h3>
            <p class="text-xs text-gray-400">توزيع الأموال بين الدرج والحساب البنكي</p>
          </div>
        </div>

        <div class="space-y-4">
          
          <!-- Cash Box -->
          <div class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
            <div class="flex items-center justify-between mb-1.5">
              <span class="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                <span>النقد المتوفر (الكاش)</span>
              </span>
              <span class="text-xs font-black font-sans text-emerald-800 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                <?= $cashPct ?>%
              </span>
            </div>
            <div dir="ltr" class="flex items-baseline gap-1">
              <span class="text-xs font-bold text-emerald-600">€</span>
              <span class="text-xl font-black font-sans text-emerald-950 tabular-nums">
                <?= number_format($periodCash, 2) ?>
              </span>
            </div>
            <p class="text-[10px] text-emerald-800/80 mt-1">
              السيولة النقدية المستلمة في المطعم
            </p>
          </div>

          <!-- Card PIN Box -->
          <div class="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80">
            <div class="flex items-center justify-between mb-1.5">
              <span class="font-bold text-xs text-tasty-teal-dark flex items-center gap-1.5">
                <svg class="w-4 h-4 text-tasty-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                <span>الدفع الإلكتروني (كرت PIN)</span>
              </span>
              <span class="text-xs font-black font-sans text-tasty-teal-dark bg-white px-2 py-0.5 rounded-lg border border-teal-200">
                <?= $cardPct ?>%
              </span>
            </div>
            <div dir="ltr" class="flex items-baseline gap-1">
              <span class="text-xs font-bold text-tasty-teal">€</span>
              <span class="text-xl font-black font-sans text-teal-950 tabular-nums">
                <?= number_format($periodCard, 2) ?>
              </span>
            </div>
            <p class="text-[10px] text-tasty-teal/80 mt-1">
              تحويلات مباشرة لحساب بنك المطعم
            </p>
          </div>

        </div>
      </div>

      <div class="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>عدد الأيام المسجلة:</span>
        <strong class="text-tasty-charcoal font-bold"><?= $salesCount ?> يومية</strong>
      </div>
    </div>

  </div>

  <!-- 5. Live Operations Row: Today's Active Crew & Fast Quick Launchers -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    
    <!-- Today's Active Crew (1 Col) -->
    <div class="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            <h3 class="font-bold text-sm text-tasty-charcoal">كادر العمل لليوم</h3>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
            <?= count($todayShifts) ?> مسجل
          </span>
        </div>

        <?php if (empty($todayShifts)): ?>
          <div class="py-6 text-center space-y-2">
            <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <p class="text-xs font-bold text-gray-700">لم يُسجل حضور أي موظف لليوم بعد</p>
            <p class="text-[11px] text-gray-400">يمكنك تسجيل الورديات بضغطة زر واحدة</p>
            <a href="<?= APP_URL ?>/admin/employees" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-700 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span>تحضير الكادر الآن</span>
            </a>
          </div>
        <?php else: ?>
          <div class="space-y-2">
            <?php foreach (array_slice($todayShifts, 0, 4) as $s): ?>
              <div class="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                    <?= mb_substr($s['employee_name'], 0, 1, 'UTF-8') ?>
                  </div>
                  <div>
                    <span class="font-bold text-xs text-gray-900 block"><?= htmlspecialchars($s['employee_name']) ?></span>
                    <span class="text-[10px] text-gray-400 font-mono"><?= $s['start_time'] ?> - <?= $s['end_time'] ?></span>
                  </div>
                </div>
                <div class="text-left font-mono font-bold text-xs text-emerald-700" dir="ltr">
                  €<?= number_format($s['total_earned'], 2) ?>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>

      <div class="pt-3 border-t border-gray-100 mt-2">
        <a href="<?= APP_URL ?>/admin/employees" class="text-xs text-blue-600 hover:underline font-bold flex items-center justify-center gap-1">
          <span>إدارة جدول الكادر والورديات ←</span>
        </a>
      </div>
    </div>

    <!-- Quick Operations Launchers (2 Cols) -->
    <div class="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-tasty-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          <h3 class="font-bold text-base text-tasty-charcoal">وصول سريع لعمليات الإدارة</h3>
        </div>
        <span class="text-xs text-gray-400">إجراءات الإدارة اليومية</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        
        <!-- Action 1: Sales -->
        <a href="<?= APP_URL ?>/admin/sales" class="p-3.5 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200/80 transition-all text-center flex flex-col items-center group">
          <div class="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform mb-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"/></svg>
          </div>
          <p class="text-xs font-bold text-tasty-charcoal">تسجيل مبيعات</p>
          <p class="text-[10px] text-gray-400 mt-0.5">تقفيل اليوميات</p>
        </a>

        <!-- Action 2: Staff -->
        <a href="<?= APP_URL ?>/admin/employees" class="p-3.5 rounded-2xl bg-blue-50/60 hover:bg-blue-100/70 border border-blue-200/80 transition-all text-center flex flex-col items-center group">
          <div class="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform mb-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </div>
          <p class="text-xs font-bold text-tasty-charcoal">ورديات الكادر</p>
          <p class="text-[10px] text-gray-400 mt-0.5">حساب الأجور</p>
        </a>

        <!-- Action 3: Orders -->
        <a href="<?= APP_URL ?>/admin/orders" class="p-3.5 rounded-2xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200/80 transition-all text-center flex flex-col items-center group">
          <div class="w-10 h-10 rounded-xl bg-white text-amber-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform mb-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          </div>
          <p class="text-xs font-bold text-tasty-charcoal">طلبيات الشراء</p>
          <p class="text-[10px] text-gray-400 mt-0.5">المستودع والتجهيز</p>
        </a>

        <!-- Action 4: Debts -->
        <a href="<?= APP_URL ?>/admin/debts" class="p-3.5 rounded-2xl bg-purple-50/60 hover:bg-purple-100/70 border border-purple-200/80 transition-all text-center flex flex-col items-center group">
          <div class="w-10 h-10 rounded-xl bg-white text-purple-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform mb-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
          </div>
          <p class="text-xs font-bold text-tasty-charcoal">سجل الديون</p>
          <p class="text-[10px] text-gray-400 mt-0.5">الموردون والزبائن</p>
        </a>

      </div>

      <div class="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>قاعدة البيانات المركزية تعمل لحظياً عبر جميع الأجهزة.</span>
        <a href="<?= APP_URL ?>/admin/settings" class="text-tasty-teal hover:underline font-bold">إعدادات النظام والنسخ الاحتياطي ←</a>
      </div>
    </div>

  </div>

  <!-- 6. Two Column Grid: Recent Sales Entries & Active Orders -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    
    <!-- Recent Daily Sales Log -->
    <div class="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <div>
          <h3 class="font-bold text-sm sm:text-base text-tasty-charcoal">آخر إدخالات المبيعات</h3>
          <p class="text-xs text-gray-400">تقفيل اليوميات الأخيرة والنسب المئوية</p>
        </div>
        <a href="<?= APP_URL ?>/admin/sales" class="text-xs font-bold text-tasty-teal hover:text-tasty-teal-dark flex items-center gap-1">
          <span>عرض السجل الكامل</span>
          <span>←</span>
        </a>
      </div>

      <div class="space-y-3">
        <?php if (empty($periodSales)): ?>
          <p class="text-xs text-gray-400 text-center py-8">لا توجد مبيعات مسجلة في هذه الفترة المحددة.</p>
        <?php else: ?>
          <?php foreach (array_slice($periodSales, 0, 4) as $sale): ?>
            <?php 
              $saleTot = floatval($sale['total_amount']);
              $saleCash = floatval($sale['cash_amount']);
              $saleCard = floatval($sale['card_amount']);
              $saleCashPct = $saleTot > 0 ? round(($saleCash / $saleTot) * 100) : 0;
              $saleCardPct = $saleTot > 0 ? round(($saleCard / $saleTot) * 100) : 0;
            ?>
            <div class="p-3.5 rounded-2xl bg-[#FCFAF7] border border-gray-100 flex items-center justify-between gap-3 hover:border-gray-200 transition-colors">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-xs sm:text-sm text-tasty-charcoal font-sans"><?= $sale['date'] ?></span>
                  <?php if ($sale['date'] === $todayStr): ?>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      اليوم
                    </span>
                  <?php endif; ?>
                </div>
                <div class="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-[11px] font-semibold whitespace-nowrap">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>كاش</span>
                    <span dir="ltr" class="font-mono font-bold">€<?= number_format($saleCash, 0) ?></span>
                    <span class="text-[10px] text-emerald-600/90 font-mono">(<?= $saleCashPct ?>%)</span>
                  </span>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/60 text-[11px] font-semibold whitespace-nowrap">
                    <span class="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
                    <span>كرت</span>
                    <span dir="ltr" class="font-mono font-bold">€<?= number_format($saleCard, 0) ?></span>
                    <span class="text-[10px] text-teal-600/90 font-mono">(<?= $saleCardPct ?>%)</span>
                  </span>
                </div>
              </div>

              <div class="text-left shrink-0">
                <div class="flex items-baseline gap-0.5 font-sans font-black text-sm sm:text-base text-tasty-charcoal tabular-nums" dir="ltr">
                  <span class="text-xs font-bold text-gray-400">€</span>
                  <span><?= number_format($saleTot, 2) ?></span>
                </div>
              </div>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
    </div>

    <!-- Orders in Pipeline -->
    <div class="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <div>
          <h3 class="font-bold text-sm sm:text-base text-tasty-charcoal">طلبيات بضاعة المطعم</h3>
          <p class="text-xs text-gray-400">متابعة شراء المواد الاستهلاكية والتجهيز</p>
        </div>
        <a href="<?= APP_URL ?>/admin/orders" class="text-xs font-bold text-tasty-teal hover:text-tasty-teal-dark flex items-center gap-1">
          <span>إدارة الطلبيات</span>
          <span>←</span>
        </a>
      </div>

      <div class="space-y-3">
        <?php if (empty($recentOrders)): ?>
          <div class="py-8 text-center space-y-2">
            <p class="text-xs text-gray-400">لا توجد طلبيات شراء مسجلة حالياً.</p>
            <a href="<?= APP_URL ?>/admin/orders" class="inline-flex items-center gap-1 text-xs text-tasty-teal font-bold hover:underline">
              + إنشاء طلبية شراء بضاعة جديدة
            </a>
          </div>
        <?php else: ?>
          <?php foreach ($recentOrders as $order): ?>
            <?php 
              $items = json_decode($order['items_json'] ?? '[]', true) ?: [];
              $totalItems = count($items);
              $purchasedItems = 0;
              foreach ($items as $itm) {
                  if (!empty($itm['isPurchased'])) {
                      $purchasedItems++;
                  }
              }
              $pct = ($totalItems > 0) ? round(($purchasedItems / $totalItems) * 100) : 0;
              $isCompleted = ($order['status'] === 'completed');
            ?>
            <div class="p-3.5 rounded-2xl bg-[#FCFAF7] border border-gray-100 flex items-center justify-between gap-3 hover:border-gray-200 transition-colors">
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-xs sm:text-sm text-tasty-charcoal truncate">
                    <?= htmlspecialchars($order['title']) ?>
                  </span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full font-bold <?= $isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800' ?>">
                    <?= $isCompleted ? 'مكتملة' : 'قيد الشراء' ?>
                  </span>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  <?= $purchasedItems ?> من <?= $totalItems ?> مواد تم شراؤها (<?= $pct ?>%) • <?= $order['date'] ?>
                </p>
              </div>

              <a href="<?= APP_URL ?>/admin/orders" class="shrink-0 px-3 py-1.5 rounded-xl bg-white hover:bg-tasty-teal hover:text-white border border-gray-200 text-xs font-bold text-tasty-teal-dark transition-all">
                فتح القائمة
              </a>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
    </div>

  </div>

</div>

<?php require_once __DIR__ . '/footer.php'; ?>

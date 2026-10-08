<?php
$pageTitle = 'تسجيل مبيعات اليوم — لوحة إدارة TASTY';
require_once __DIR__ . '/header.php';

$db = getDB();
$message = '';
$error = '';

// Handle Form Submission (Add or Update Sale)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'save_sale') {
        $date = trim($_POST['date'] ?? date('Y-m-d'));
        $cash = floatval($_POST['cash_amount'] ?? 0);
        $card = floatval($_POST['card_amount'] ?? 0);
        $notes = trim($_POST['notes'] ?? '');
        $id = trim($_POST['sale_id'] ?? '');

        $total = $cash + $card;
        $cashPct = ($total > 0) ? round(($cash / $total) * 100, 1) : 0;
        $cardPct = ($total > 0) ? round(($card / $total) * 100, 1) : 0;

        if (empty($date)) {
            $error = 'يرجى تحديد التاريخ بشكل صحيح.';
        } elseif ($total <= 0) {
            $error = 'يرجى إدخال مبلغ مبيعات صحيح (كاش أو كرت).';
        } else {
            // Check if record exists for this date
            $existing = $db->prepare("SELECT id FROM daily_sales WHERE date = ?");
            $existing->execute([$date]);
            $existingRecord = $existing->fetch();

            if ($existingRecord) {
                // Update
                $stmt = $db->prepare("UPDATE daily_sales SET cash_amount = ?, card_amount = ?, total_amount = ?, cash_percentage = ?, card_percentage = ?, notes = ?, recorded_at = ? WHERE date = ?");
                $stmt->execute([$cash, $card, $total, $cashPct, $cardPct, $notes, date('c'), $date]);
                $message = 'تم تحديث مبيعات تاريخ ' . $date . ' بنجاح!';
            } else {
                // Insert new
                $newId = !empty($id) ? $id : 'ds-' . time() . '-' . substr(md5(uniqid()), 0, 4);
                $stmt = $db->prepare("INSERT INTO daily_sales (id, date, cash_amount, card_amount, total_amount, cash_percentage, card_percentage, notes, recorded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$newId, $date, $cash, $card, $total, $cashPct, $cardPct, $notes, date('c')]);
                $message = 'تم تسجيل مبيعات اليوم بنجاح!';
            }
        }
    } elseif ($_POST['action'] === 'delete_sale') {
        $id = trim($_POST['sale_id'] ?? '');
        if (!empty($id)) {
            $stmt = $db->prepare("DELETE FROM daily_sales WHERE id = ?");
            $stmt->execute([$id]);
            $message = 'تم حذف قيد المبيعات بنجاح.';
        }
    }
}

// Fetch all sales ordered by date DESC
$sales = $db->query("SELECT * FROM daily_sales ORDER BY date DESC")->fetchAll();

// Calculate Monthly Summary
$currentMonth = date('Y-m');
$monthTotal = 0;
$monthCash = 0;
$monthCard = 0;
foreach ($sales as $s) {
    if (strpos($s['date'], $currentMonth) === 0) {
        $monthTotal += $s['total_amount'];
        $monthCash += $s['cash_amount'];
        $monthCard += $s['card_amount'];
    }
}
$monthCashPct = ($monthTotal > 0) ? round(($monthCash / $monthTotal) * 100, 1) : 0;
$monthCardPct = ($monthTotal > 0) ? round(($monthCard / $monthTotal) * 100, 1) : 0;

// Check if today's sale is already logged
$today = date('Y-m-d');
$todayLogged = false;
$todaySale = null;
foreach ($sales as $s) {
    if ($s['date'] === $today) {
        $todayLogged = true;
        $todaySale = $s;
        break;
    }
}
?>

<div class="space-y-6">

  <!-- Header Banner -->
  <div class="bg-gradient-to-l from-tasty-charcoal via-tasty-teal-dark to-tasty-teal text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
    <div class="absolute -left-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="relative z-10">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-tasty-teal-light text-xs font-bold mb-3 border border-white/20 backdrop-blur-md">
        <span>سجل المبيعات اليومية</span>
        <span>•</span>
        <span><?= date('l، j F Y') ?></span>
      </div>
      <h1 class="font-serif font-black text-2xl sm:text-3xl tracking-tight text-white">إدارة وتوثيق مبيعات الصندوق والكاش</h1>
      <p class="text-tasty-teal-light/90 text-sm mt-1 max-w-xl leading-relaxed">
        تسجيل إيرادات الكاش وماكينات الـ PIN بدقة، وتوزيع النسب المئوية ومراقبة حركة دخل المطعم.
      </p>
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

  <!-- Month Summary KPI Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    
    <!-- Total Month -->
    <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between text-xs text-tasty-charcoal font-bold mb-3">
        <span>مبيعات شهر <?= date('m / Y') ?></span>
        <span class="p-2 rounded-xl bg-tasty-teal-light text-tasty-teal-dark">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
        </span>
      </div>
      <div dir="ltr" class="flex items-baseline justify-end gap-1">
        <span class="text-xs font-bold text-gray-400 font-sans">€</span>
        <span class="text-2xl sm:text-3xl font-black font-sans tracking-tight text-tasty-charcoal tabular-nums">
          <?= number_format($monthTotal, 2) ?>
        </span>
      </div>
      <p class="text-[11px] text-gray-400 mt-3 pt-2.5 border-t border-gray-100">إجمالي الدخل المحقق خلال هذا الشهر</p>
    </div>

    <!-- Cash Split -->
    <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between text-xs text-tasty-charcoal font-bold mb-3">
        <span>مقبوضات الكاش النقدية</span>
        <span class="p-2 rounded-xl bg-emerald-50 text-emerald-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        </span>
      </div>
      <div dir="ltr" class="flex items-baseline justify-end gap-1">
        <span class="text-xs font-bold text-emerald-600 font-sans">€</span>
        <span class="text-2xl sm:text-3xl font-black font-sans tracking-tight text-emerald-800 tabular-nums">
          <?= number_format($monthCash, 2) ?>
        </span>
        <span class="text-xs font-bold text-gray-400 mr-2 font-sans">(<?= $monthCashPct ?>%)</span>
      </div>
      <div class="w-full bg-gray-100 rounded-full h-1.5 mt-3 overflow-hidden">
        <div class="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style="width: <?= $monthCashPct ?>%"></div>
      </div>
    </div>

    <!-- PIN Card Split -->
    <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between text-xs text-tasty-charcoal font-bold mb-3">
        <span>مدفوعات البطاقة والبنك (PIN)</span>
        <span class="p-2 rounded-xl bg-tasty-teal-light text-tasty-teal-dark">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
        </span>
      </div>
      <div dir="ltr" class="flex items-baseline justify-end gap-1">
        <span class="text-xs font-bold text-tasty-teal font-sans">€</span>
        <span class="text-2xl sm:text-3xl font-black font-sans tracking-tight text-tasty-charcoal tabular-nums">
          <?= number_format($monthCard, 2) ?>
        </span>
        <span class="text-xs font-bold text-gray-400 mr-2 font-sans">(<?= $monthCardPct ?>%)</span>
      </div>
      <div class="w-full bg-gray-100 rounded-full h-1.5 mt-3 overflow-hidden">
        <div class="bg-tasty-teal h-1.5 rounded-full transition-all duration-500" style="width: <?= $monthCardPct ?>%"></div>
      </div>
    </div>

  </div>

  <!-- Entry Form Card -->
  <div class="bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-xs">
    <div class="flex items-center justify-between mb-5">
      <div>
        <h2 class="text-lg font-bold text-tasty-charcoal flex items-center gap-2">
          <span>تسجيل مبيعات جديدة / تعديل</span>
          <?php if ($todayLogged): ?>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">تم تسجيل مبيعات اليوم مسبقاً</span>
          <?php else: ?>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">مطلوب تسجيل مبيعات اليوم</span>
          <?php endif; ?>
        </h2>
        <p class="text-xs text-gray-400 mt-0.5">أدخل أرقام الصندوق المحسوبة في نهاية الوردية اليومية.</p>
      </div>
    </div>

    <form method="POST" action="" class="space-y-4">
      <input type="hidden" name="action" value="save_sale">
      <input type="hidden" name="sale_id" id="formSaleId" value="<?= $todaySale['id'] ?? '' ?>">

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <!-- Date -->
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1.5">التاريخ</label>
          <input 
            type="date" 
            name="date" 
            id="formDate"
            value="<?= $todaySale['date'] ?? date('Y-m-d') ?>" 
            required 
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-tasty-teal focus:bg-white transition-all text-right"
          >
        </div>

        <!-- Cash -->
        <div>
          <label class="block text-xs font-bold text-emerald-700 mb-1.5">مبلغ الكاش الصافي (€)</label>
          <div class="relative">
            <input 
              type="number" 
              step="0.01" 
              min="0"
              name="cash_amount" 
              id="formCash"
              value="<?= $todaySale['cash_amount'] ?? '' ?>" 
              placeholder="0.00"
              required 
              oninput="calcTotal()"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-left dir-ltr"
            >
          </div>
        </div>

        <!-- PIN Card -->
        <div>
          <label class="block text-xs font-bold text-blue-700 mb-1.5">مبلغ البطاقة PIN (€)</label>
          <div class="relative">
            <input 
              type="number" 
              step="0.01" 
              min="0"
              name="card_amount" 
              id="formCard"
              value="<?= $todaySale['card_amount'] ?? '' ?>" 
              placeholder="0.00"
              required 
              oninput="calcTotal()"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-left dir-ltr"
            >
          </div>
        </div>

      </div>

      <!-- Total Preview & Notes -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center pt-2">
        <div class="sm:col-span-3">
          <label class="block text-xs font-bold text-gray-600 mb-1.5">ملاحظات اليومية (اختياري)</label>
          <input 
            type="text" 
            name="notes" 
            id="formNotes"
            value="<?= htmlspecialchars($todaySale['notes'] ?? '') ?>" 
            placeholder="مثال: ذروة عطلة نهاية الأسبوع، إقبال ممتاز على الكبسلون والمناقيش..."
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-tasty-teal focus:bg-white transition-all"
          >
        </div>

        <div class="sm:col-span-1 pt-4 sm:pt-0">
          <button 
            type="submit" 
            class="w-full py-3 bg-gradient-to-l from-tasty-teal to-tasty-teal-dark hover:from-[#6ba9a6] hover:to-tasty-teal text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 text-xs flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <span id="submitBtnText"><?= $todayLogged ? 'تحديث قيد اليوم' : 'حفظ المبيعات' ?></span>
          </button>
        </div>
      </div>
    </form>
  </div>

  <!-- Historical Sales Records Table -->
  <div class="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
    <div class="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
      <div>
        <h3 class="text-base font-bold text-tasty-charcoal">سجل الأيام السابقة</h3>
        <p class="text-xs text-gray-400">إجمالي السجلات المدخلة: (<?= count($sales) ?>) يوم</p>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-right text-xs">
        <thead>
          <tr class="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
            <th class="p-4">التاريخ</th>
            <th class="p-4">الكاش</th>
            <th class="p-4">البطاقة (PIN)</th>
            <th class="p-4">الإجمالي</th>
            <th class="p-4">النسبة</th>
            <th class="p-4">ملاحظات</th>
            <th class="p-4 text-center">إجراءات</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <?php if (empty($sales)): ?>
            <tr>
              <td colspan="7" class="p-8 text-center text-gray-400 font-bold">
                لا توجد سجلات مبيعات مسجلة حتى الآن. استخدم النموذج أعلاه لإدخال أول مبيعات.
              </td>
            </tr>
          <?php else: ?>
            <?php foreach ($sales as $sale): ?>
              <tr class="hover:bg-tasty-bg-warm/60 transition-colors">
                <td class="p-4 font-bold text-tasty-charcoal whitespace-nowrap">
                  <?= htmlspecialchars($sale['date']) ?>
                  <?php if ($sale['date'] === date('Y-m-d')): ?>
                    <span class="mr-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">اليوم</span>
                  <?php endif; ?>
                </td>
                <td class="p-4 text-emerald-700 font-bold whitespace-nowrap dir-ltr text-right">
                  €<?= number_format($sale['cash_amount'], 2) ?>
                </td>
                <td class="p-4 text-blue-700 font-bold whitespace-nowrap dir-ltr text-right">
                  €<?= number_format($sale['card_amount'], 2) ?>
                </td>
                <td class="p-4 font-bold text-tasty-charcoal text-sm whitespace-nowrap dir-ltr text-right">
                  €<?= number_format($sale['total_amount'], 2) ?>
                </td>
                <td class="p-4 whitespace-nowrap">
                  <span class="inline-flex items-center gap-1 text-[11px]">
                    <span class="text-emerald-700 font-bold"><?= $sale['cash_percentage'] ?>% كاش</span>
                    <span class="text-gray-300">/</span>
                    <span class="text-blue-700 font-bold"><?= $sale['card_percentage'] ?>% PIN</span>
                  </span>
                </td>
                <td class="p-4 text-gray-500 max-w-xs truncate">
                  <?= htmlspecialchars($sale['notes'] ?: '—') ?>
                </td>
                <td class="p-4 text-center whitespace-nowrap">
                  <div class="inline-flex items-center gap-1.5">
                    <button 
                      onclick='editSale(<?= json_encode($sale, JSON_UNESCAPED_UNICODE) ?>)'
                      class="p-1.5 text-gray-500 hover:text-tasty-teal hover:bg-tasty-teal-light rounded-xl transition-all" 
                      title="تعديل هذا اليوم"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                    </button>
                    <form method="POST" action="" onsubmit="return confirm('هل أنت متأكد من حذف مبيعات تاريخ <?= $sale['date'] ?>؟');" class="inline">
                      <input type="hidden" name="action" value="delete_sale">
                      <input type="hidden" name="sale_id" value="<?= $sale['id'] ?>">
                      <button type="submit" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="حذف">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>

</div>

<script>
  function editSale(sale) {
    document.getElementById('formSaleId').value = sale.id;
    document.getElementById('formDate').value = sale.date;
    document.getElementById('formCash').value = sale.cash_amount;
    document.getElementById('formCard').value = sale.card_amount;
    document.getElementById('formNotes').value = sale.notes || '';
    document.getElementById('submitBtnText').innerText = 'تحديث مبيعات ' + sale.date;
    window.scrollTo({ top: 200, behavior: 'smooth' });
  }

  function calcTotal() {
    const cash = parseFloat(document.getElementById('formCash').value) || 0;
    const card = parseFloat(document.getElementById('formCard').value) || 0;
    const total = cash + card;
    if (total > 0) {
      document.getElementById('submitBtnText').innerText = 'حفظ (€' + total.toFixed(2) + ')';
    }
  }
</script>

<?php require_once __DIR__ . '/footer.php'; ?>

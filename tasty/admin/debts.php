<?php
$pageTitle = 'سجل الديون والمدفوعات — لوحة إدارة TASTY';
require_once __DIR__ . '/header.php';

// Strict Admin Enforcement
requireAdmin();

$db = getDB();
$message = '';
$error = '';

// Handle Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];

    // 1. Add / Update Debt Record
    if ($action === 'save_debt') {
        $id = trim($_POST['id'] ?? '');
        $partyName = trim($_POST['party_name'] ?? '');
        $type = trim($_POST['type'] ?? 'payable'); // payable (علينا) | receivable (لنا)
        $category = trim($_POST['category'] ?? 'supplier');
        $phone = trim($_POST['phone'] ?? '');
        $totalAmount = floatval($_POST['total_amount'] ?? 0);
        $dueDate = trim($_POST['due_date'] ?? '');
        $description = trim($_POST['description'] ?? '');

        if (empty($partyName) || $totalAmount <= 0) {
            $error = 'يرجى إدخال اسم الجهة أو المورد وتحديد مبلغ إجمالي صحيح.';
        } else {
            if (!empty($id)) {
                // Update
                $stmt = $db->prepare("UPDATE debts SET party_name=?, type=?, category=?, phone=?, total_amount=?, remaining_amount=(total_amount - paid_amount), due_date=?, description=? WHERE id=?");
                $stmt->execute([$partyName, $type, $category, $phone, $totalAmount, $dueDate, $description, $id]);
                $message = 'تم تحديث قيد الدين بنجاح!';
            } else {
                // Create
                $newId = 'debt-' . time() . '-' . substr(md5(uniqid()), 0, 4);
                $stmt = $db->prepare("INSERT INTO debts (id, party_name, type, category, phone, total_amount, paid_amount, remaining_amount, status, created_date, due_date, notes, description, payments_json) VALUES (?, ?, ?, ?, ?, ?, 0.00, ?, 'unpaid', ?, ?, '', ?, '[]')");
                $stmt->execute([$newId, $partyName, $type, $category, $phone, $totalAmount, $totalAmount, date('Y-m-d'), $dueDate, $description]);
                $message = 'تم تسجيل قيد الدين بنجاح!';
            }
        }
    }

    // 2. Register Partial Payment
    elseif ($action === 'add_payment') {
        $debtId = trim($_POST['debt_id'] ?? '');
        $payAmount = floatval($_POST['payment_amount'] ?? 0);
        $payDate = trim($_POST['payment_date'] ?? date('Y-m-d'));
        $payMethod = trim($_POST['payment_method'] ?? 'cash');
        $payNotes = trim($_POST['payment_notes'] ?? '');

        $debtStmt = $db->prepare("SELECT total_amount, paid_amount, payments_json FROM debts WHERE id = ?");
        $debtStmt->execute([$debtId]);
        $debt = $debtStmt->fetch();

        if (!$debt || $payAmount <= 0) {
            $error = 'يرجى إدخال مبلغ دفعة صحيح.';
        } else {
            $newPaid = $debt['paid_amount'] + $payAmount;
            $newRemaining = max(0, $debt['total_amount'] - $newPaid);
            $newStatus = ($newRemaining <= 0) ? 'fully_paid' : 'partially_paid';

            $payments = json_decode($debt['payments_json'], true) ?: [];
            $payments[] = [
                'id' => 'pay-' . time(),
                'amount' => $payAmount,
                'date' => $payDate,
                'method' => $payMethod,
                'notes' => $payNotes,
                'recordedAt' => date('c'),
            ];

            $up = $db->prepare("UPDATE debts SET paid_amount = ?, remaining_amount = ?, status = ?, payments_json = ? WHERE id = ?");
            $up->execute([$newPaid, $newRemaining, $newStatus, json_encode($payments, JSON_UNESCAPED_UNICODE), $debtId]);
            $message = 'تم تسجيل الدفعة بقيمة €' . number_format($payAmount, 2) . ' بنجاح!';
        }
    }

    // 3. Delete Debt Record
    elseif ($action === 'delete_debt') {
        $id = trim($_POST['id'] ?? '');
        if (!empty($id)) {
            $stmt = $db->prepare("DELETE FROM debts WHERE id = ?");
            $stmt->execute([$id]);
            $message = 'تم حذف قيد الدين بنجاح.';
        }
    }
}

// Fetch all debts
$debts = $db->query("SELECT * FROM debts ORDER BY created_date DESC, status ASC")->fetchAll();

// Calculate totals
$totalPayable = 0;   // علينا للموردين
$paidPayable = 0;
$totalReceivable = 0; // لنا على الزبائن
$paidReceivable = 0;

foreach ($debts as $d) {
    if ($d['type'] === 'payable') {
        $totalPayable += $d['remaining_amount'];
        $paidPayable += $d['paid_amount'];
    } else {
        $totalReceivable += $d['remaining_amount'];
        $paidReceivable += $d['paid_amount'];
    }
}
$netBalance = $totalReceivable - $totalPayable;
?>

<div class="space-y-6">

  <!-- Header Banner -->
  <div class="bg-gradient-to-l from-tasty-charcoal via-tasty-teal-dark to-tasty-teal text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div class="absolute -left-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="relative z-10">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-tasty-teal-light text-xs font-bold mb-3 border border-white/20 backdrop-blur-md">
        <span>الذمم والالتزامات المالية</span>
        <span>•</span>
        <span class="text-tasty-terracotta-light font-bold">خاص بالإدارة العليا (Admin)</span>
      </div>
      <h1 class="font-serif font-black text-2xl sm:text-3xl tracking-tight text-white">سجل الديون والمدفوعات (موردين وزبائن)</h1>
      <p class="text-tasty-teal-light/90 text-sm mt-1 max-w-xl leading-relaxed">
        متابعة الديون المستحقة علينا للموردين، والديون المستحقة لنا على الزبائن وتسجيل الدفعات الجزئية.
      </p>
    </div>

    <!-- Quick Button -->
    <div class="shrink-0 relative z-10">
      <button onclick="document.getElementById('newDebtModal').classList.remove('hidden')" class="px-5 py-3 rounded-2xl bg-tasty-terracotta text-white font-bold text-xs hover:bg-tasty-terracotta-dark shadow-md transition-all active:scale-95 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        <span>إضافة قيد دين جديد</span>
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

  <!-- Financial Debt Summary Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    
    <!-- Payable to Suppliers (علينا) -->
    <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between text-xs font-bold text-tasty-charcoal mb-3">
        <span>ديون علينا للموردين (Payable)</span>
        <span class="px-2.5 py-0.5 rounded-full bg-tasty-terracotta-light text-tasty-terracotta-dark border border-tasty-terracotta/25 text-[10px] font-bold">مطلوب سداده</span>
      </div>
      <div dir="ltr" class="flex items-baseline justify-end gap-1">
        <span class="text-xs font-bold text-tasty-terracotta-dark font-sans">€</span>
        <span class="text-2xl sm:text-3xl font-black font-sans tracking-tight text-tasty-charcoal tabular-nums">
          <?= number_format($totalPayable, 2) ?>
        </span>
      </div>
      <div class="text-[11px] text-gray-400 mt-3 pt-2.5 border-t border-gray-100 flex justify-between">
        <span>تم سداده:</span>
        <span class="font-bold text-tasty-teal-dark font-sans" dir="ltr">€<?= number_format($paidPayable, 2) ?></span>
      </div>
    </div>

    <!-- Receivable from Customers (لنا) -->
    <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between text-xs font-bold text-tasty-charcoal mb-3">
        <span>ديون لنا على الزبائن (Receivable)</span>
        <span class="px-2.5 py-0.5 rounded-full bg-tasty-teal-light text-tasty-teal-dark border border-tasty-teal/25 text-[10px] font-bold">مطلوب تحصيله</span>
      </div>
      <div dir="ltr" class="flex items-baseline justify-end gap-1">
        <span class="text-xs font-bold text-tasty-teal font-sans">€</span>
        <span class="text-2xl sm:text-3xl font-black font-sans tracking-tight text-tasty-charcoal tabular-nums">
          <?= number_format($totalReceivable, 2) ?>
        </span>
      </div>
      <div class="text-[11px] text-gray-400 mt-3 pt-2.5 border-t border-gray-100 flex justify-between">
        <span>تم تحصيله:</span>
        <span class="font-bold text-tasty-teal-dark font-sans" dir="ltr">€<?= number_format($paidReceivable, 2) ?></span>
      </div>
    </div>

    <!-- Net Balance (الصافي) -->
    <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between text-xs font-bold text-tasty-charcoal mb-3">
        <span>صافي الميزان (لنا - علينا)</span>
        <span class="px-2.5 py-0.5 rounded-full bg-tasty-sage-light text-tasty-charcoal border border-tasty-sage/30 text-[10px] font-bold">الرصيد الصافي</span>
      </div>
      <div dir="ltr" class="flex items-baseline justify-end gap-1">
        <span class="text-xs font-bold font-sans <?= $netBalance < 0 ? 'text-tasty-terracotta-dark' : 'text-tasty-teal' ?>">
          <?= $netBalance < 0 ? '-€' : ($netBalance > 0 ? '+€' : '€') ?>
        </span>
        <span class="text-2xl sm:text-3xl font-black font-sans tracking-tight tabular-nums <?= $netBalance < 0 ? 'text-tasty-terracotta-dark' : 'text-tasty-teal-dark' ?>">
          <?= number_format(abs($netBalance), 2) ?>
        </span>
      </div>
      <p class="text-[11px] text-gray-400 mt-3 pt-2.5 border-t border-gray-100">
        <?= $netBalance >= 0 ? 'الديون المطلوب تحصيلها تغطي التزامات الموردين' : 'التزامات الموردين تفوق مستحقات الزبائن' ?>
      </p>
    </div>

  </div>

  <!-- Debts Table -->
  <div class="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
    <div class="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
      <h3 class="text-base font-bold text-tasty-charcoal">سجل القيود المسجلة (<?= count($debts) ?>)</h3>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-right text-xs">
        <thead>
          <tr class="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
            <th class="p-4">الجهة / المورد / الزبون</th>
            <th class="p-4">النوع</th>
            <th class="p-4">الهاتف</th>
            <th class="p-4">المبلغ الإجمالي</th>
            <th class="p-4">المسدد</th>
            <th class="p-4">المتبقي</th>
            <th class="p-4">الحالة</th>
            <th class="p-4 text-center">إجراءات</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <?php if (empty($debts)): ?>
            <tr>
              <td colspan="8" class="p-10 text-center text-gray-400 font-bold">
                لا توجد قيود ديون أو ذمم مسجلة حالياً.
              </td>
            </tr>
          <?php else: ?>
            <?php foreach ($debts as $d): ?>
              <tr class="hover:bg-tasty-bg-warm/60 transition-colors">
                <td class="p-4 font-bold text-tasty-charcoal">
                  <?= htmlspecialchars($d['party_name']) ?>
                  <?php if (!empty($d['description'])): ?>
                    <p class="text-[11px] text-gray-400 font-normal"><?= htmlspecialchars($d['description']) ?></p>
                  <?php endif; ?>
                </td>
                <td class="p-4 whitespace-nowrap">
                  <?php if ($d['type'] === 'payable'): ?>
                    <span class="px-2.5 py-0.5 rounded-full bg-tasty-terracotta-light text-tasty-terracotta-dark border border-tasty-terracotta/25 text-[10px] font-bold">دين علينا</span>
                  <?php else: ?>
                    <span class="px-2.5 py-0.5 rounded-full bg-tasty-teal-light text-tasty-teal-dark border border-tasty-teal/25 text-[10px] font-bold">دين لنا</span>
                  <?php endif; ?>
                </td>
                <td class="p-4 whitespace-nowrap dir-ltr text-right text-gray-500"><?= htmlspecialchars($d['phone'] ?: '—') ?></td>
                <td class="p-4 font-bold text-gray-700 dir-ltr text-right whitespace-nowrap">€<?= number_format($d['total_amount'], 2) ?></td>
                <td class="p-4 text-tasty-teal-dark font-bold dir-ltr text-right whitespace-nowrap">€<?= number_format($d['paid_amount'], 2) ?></td>
                <td class="p-4 text-tasty-terracotta-dark font-bold text-sm dir-ltr text-right whitespace-nowrap">€<?= number_format($d['remaining_amount'], 2) ?></td>
                <td class="p-4 whitespace-nowrap">
                  <?php if ($d['status'] === 'fully_paid'): ?>
                    <span class="px-2.5 py-0.5 rounded-full bg-tasty-teal-light text-tasty-teal-dark font-bold text-[10px]">مسدد بالكامل</span>
                  <?php elseif ($d['status'] === 'partially_paid'): ?>
                    <span class="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold text-[10px]">مسدد جزئياً</span>
                  <?php else: ?>
                    <span class="px-2.5 py-0.5 rounded-full bg-tasty-terracotta-light text-tasty-terracotta-dark font-bold text-[10px]">غير مسدد</span>
                  <?php endif; ?>
                </td>
                <td class="p-4 text-center whitespace-nowrap">
                  <div class="inline-flex items-center gap-1.5">
                    <?php if ($d['remaining_amount'] > 0): ?>
                      <button 
                        onclick='openPaymentModal("<?= $d['id'] ?>", "<?= addslashes($d['party_name']) ?>", <?= $d['remaining_amount'] ?>)'
                        class="px-2.5 py-1 bg-tasty-teal hover:bg-tasty-teal-dark text-white rounded-xl font-bold text-[11px] transition-colors shadow-2xs"
                      >
                        تسجيل دفعة
                      </button>
                    <?php endif; ?>
                    <form method="POST" action="" onsubmit="return confirm('حذف قيد الدين بالكامل؟');" class="inline">
                      <input type="hidden" name="action" value="delete_debt">
                      <input type="hidden" name="id" value="<?= $d['id'] ?>">
                      <button type="submit" class="p-1.5 text-gray-400 hover:text-red-600 rounded-xl">
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

<!-- Modal: New Debt -->
<div id="newDebtModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 hidden">
  <div class="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-4" onclick="event.stopPropagation()">
    <div class="flex items-center justify-between pb-3 border-b border-gray-100">
      <h3 class="text-base font-bold text-tasty-charcoal">إضافة قيد دين أو ذمة مالية</h3>
      <button onclick="document.getElementById('newDebtModal').classList.add('hidden')" class="p-1 text-gray-400 hover:text-gray-900">&times;</button>
    </div>

    <form method="POST" action="" class="space-y-3.5">
      <input type="hidden" name="action" value="save_debt">

      <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">اسم المورد أو العميل *</label>
        <input type="text" name="party_name" required placeholder="مثال: ملحمة الأندلس، مطحنة البركة..." class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-tasty-teal focus:bg-white focus:outline-none">
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">نوع الدين *</label>
          <select name="type" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:border-tasty-teal focus:bg-white focus:outline-none">
            <option value="payable">دين علينا للمورد (مطلوب سداده)</option>
            <option value="receivable">دين لنا على زبون (مطلوب تحصيله)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">المبلغ الإجمالي (€) *</label>
          <input type="number" step="0.5" min="1" name="total_amount" required placeholder="500" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:border-tasty-teal focus:bg-white focus:outline-none dir-ltr text-right">
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">رقم الهاتف للتواصل</label>
          <input type="text" name="phone" placeholder="0612345678" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-tasty-teal focus:bg-white focus:outline-none dir-ltr text-right">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">تاريخ الاستحقاق</label>
          <input type="date" name="due_date" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-tasty-teal focus:bg-white focus:outline-none">
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">بيان وتفاصيل الفاتورة / الدين</label>
        <input type="text" name="description" placeholder="فاتورة لحوم شاورما رقم #942..." class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-tasty-teal focus:bg-white focus:outline-none">
      </div>

      <div class="pt-3 flex gap-2">
        <button type="submit" class="flex-1 py-3 bg-tasty-teal hover:bg-tasty-teal-dark text-white font-bold rounded-2xl text-xs transition-all shadow-md">
          تسجيل القيد
        </button>
        <button type="button" onclick="document.getElementById('newDebtModal').classList.add('hidden')" class="px-5 py-3 border border-gray-200 text-gray-600 rounded-2xl font-bold text-xs hover:bg-gray-50">
          إلغاء
        </button>
      </div>
    </form>
  </div>
</div>

<!-- Modal: Register Payment -->
<div id="paymentModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 hidden">
  <div class="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl space-y-4" onclick="event.stopPropagation()">
    <div class="flex items-center justify-between pb-3 border-b border-gray-100">
      <h3 class="text-base font-bold text-tasty-charcoal">تسجيل دفعة / سداد</h3>
      <button onclick="document.getElementById('paymentModal').classList.add('hidden')" class="p-1 text-gray-400 hover:text-gray-900">&times;</button>
    </div>

    <form method="POST" action="" class="space-y-3.5">
      <input type="hidden" name="action" value="add_payment">
      <input type="hidden" name="debt_id" id="payDebtId" value="">

      <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">الجهة</label>
        <input type="text" id="payPartyName" readonly class="w-full px-3.5 py-2 bg-gray-100 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700">
      </div>

      <div>
        <label class="block text-xs font-bold text-emerald-700 mb-1">مبلغ الدفعة المسدد (€) *</label>
        <input type="number" step="0.5" min="1" name="payment_amount" id="payAmountInput" required placeholder="0.00" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-base font-bold focus:border-emerald-500 focus:bg-white focus:outline-none dir-ltr text-right">
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">تاريخ الدفعة</label>
          <input type="date" name="payment_date" value="<?= date('Y-m-d') ?>" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:border-tasty-teal focus:bg-white focus:outline-none">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">طريقة السداد</label>
          <select name="payment_method" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:border-tasty-teal focus:bg-white focus:outline-none">
            <option value="cash">كاش نقدياً</option>
            <option value="bank">تحويل بنكي</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">ملاحظة السداد</label>
        <input type="text" name="payment_notes" placeholder="دفعة أولى على حساب الفاتورة..." class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:border-tasty-teal focus:bg-white focus:outline-none">
      </div>

      <div class="pt-3 flex gap-2">
        <button type="submit" class="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md">
          تأكيد تسجيل الدفعة
        </button>
        <button type="button" onclick="document.getElementById('paymentModal').classList.add('hidden')" class="px-5 py-3 border border-gray-200 text-gray-600 rounded-2xl font-bold text-xs hover:bg-gray-50">
          إلغاء
        </button>
      </div>
    </form>
  </div>
</div>

<script>
  function openPaymentModal(id, name, remaining) {
    document.getElementById('payDebtId').value = id;
    document.getElementById('payPartyName').value = name;
    document.getElementById('payAmountInput').value = remaining;
    document.getElementById('payAmountInput').max = remaining;
    document.getElementById('paymentModal').classList.remove('hidden');
  }
</script>

<?php require_once __DIR__ . '/footer.php'; ?>

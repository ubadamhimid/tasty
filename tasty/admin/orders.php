<?php
$pageTitle = 'طلبيات الشراء والمخزون — لوحة إدارة TASTY';
require_once __DIR__ . '/header.php';

$db = getDB();
$message = '';
$error = '';

// Handle Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];

    // 1. Create Purchase Order
    if ($action === 'create_order') {
        $title = trim($_POST['title'] ?? 'طلبية مستودع عامة');
        $date = trim($_POST['date'] ?? date('Y-m-d'));
        $notes = trim($_POST['notes'] ?? '');
        $itemsData = $_POST['items'] ?? [];

        $orderItems = [];
        foreach ($itemsData as $itemId => $qty) {
            $qty = floatval($qty);
            if ($qty > 0) {
                // Fetch item details
                $itemStmt = $db->prepare("SELECT name, unit, category FROM master_items WHERE id = ?");
                $itemStmt->execute([$itemId]);
                $itemRow = $itemStmt->fetch();
                if ($itemRow) {
                    $orderItems[] = [
                        'id' => $itemId,
                        'name' => $itemRow['name'],
                        'unit' => $itemRow['unit'],
                        'category' => $itemRow['category'],
                        'quantity' => $qty,
                        'isPurchased' => false,
                    ];
                }
            }
        }

        if (empty($orderItems)) {
            $error = 'يرجى اختيار مادة واحدة على الأقل وتحديد الكمية المطلوبة.';
        } else {
            $orderId = 'po-' . time() . '-' . substr(md5(uniqid()), 0, 4);
            $orderNumber = '#ORD-' . date('Y') . '-' . rand(100, 999);
            $stmt = $db->prepare("INSERT INTO purchase_orders (id, order_number, title, date, status, items_json, notes, created_at) VALUES (?, ?, ?, ?, 'pending', ?, ?, ?)");
            $stmt->execute([$orderId, $orderNumber, $title, $date, json_encode($orderItems, JSON_UNESCAPED_UNICODE), $notes, date('c')]);
            $message = 'تم إنشاء طلبية الشراء بنجاح (' . $orderNumber . ')!';
        }
    }

    // 2. Toggle Item Purchased or Complete Order
    elseif ($action === 'toggle_order_item') {
        $orderId = trim($_POST['order_id'] ?? '');
        $itemIdx = intval($_POST['item_index'] ?? -1);

        $stmt = $db->prepare("SELECT items_json, status FROM purchase_orders WHERE id = ?");
        $stmt->execute([$orderId]);
        $row = $stmt->fetch();

        if ($row && $itemIdx >= 0) {
            $items = json_decode($row['items_json'], true) ?: [];
            if (isset($items[$itemIdx])) {
                $items[$itemIdx]['isPurchased'] = empty($items[$itemIdx]['isPurchased']);
                
                // If all purchased, mark completed
                $allBought = true;
                foreach ($items as $it) {
                    if (empty($it['isPurchased'])) {
                        $allBought = false;
                        break;
                    }
                }
                $newStatus = $allBought ? 'completed' : 'pending';

                $up = $db->prepare("UPDATE purchase_orders SET items_json = ?, status = ?, completed_at = ? WHERE id = ?");
                $up->execute([json_encode($items, JSON_UNESCAPED_UNICODE), $newStatus, $allBought ? date('c') : null, $orderId]);
                $message = 'تم تحديث حالة المادة في الطلبية.';
            }
        }
    }

    // 3. Delete Order
    elseif ($action === 'delete_order') {
        $id = trim($_POST['order_id'] ?? '');
        if (!empty($id)) {
            $stmt = $db->prepare("DELETE FROM purchase_orders WHERE id = ?");
            $stmt->execute([$id]);
            $message = 'تم حذف الطلبية بنجاح.';
        }
    }

    // 4. Add Master Item
    elseif ($action === 'add_master_item') {
        $name = trim($_POST['name'] ?? '');
        $cat = trim($_POST['category'] ?? 'dry_goods');
        $unit = trim($_POST['unit'] ?? 'box');
        $qty = floatval($_POST['default_qty'] ?? 1);
        $notes = trim($_POST['notes'] ?? '');

        if (!empty($name)) {
            $newId = 'mi-' . time() . '-' . substr(md5(uniqid()), 0, 4);
            $stmt = $db->prepare("INSERT INTO master_items (id, name, category, unit, default_qty, notes, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?)");
            $stmt->execute([$newId, $name, $cat, $unit, $qty, $notes, date('Y-m-d')]);
            $message = 'تمت إضافة مادة جديدة إلى كتالوج المستودع!';
        }
    }
}

// Fetch Orders and Catalog Items
$orders = $db->query("SELECT * FROM purchase_orders ORDER BY date DESC, created_at DESC")->fetchAll();
$masterItems = $db->query("SELECT * FROM master_items WHERE is_active = 1 ORDER BY category ASC, name ASC")->fetchAll();
?>

<div class="space-y-6">

  <!-- Header Banner -->
  <div class="bg-gradient-to-l from-tasty-teal-dark via-[#354D4B] to-tasty-teal text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-tasty-teal-light text-xs font-bold mb-3 border border-white/15">
        <span>المشتريات والمخزون</span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">طلبيات الشراء وتجهيز المستودع</h1>
      <p class="text-tasty-teal-light/90 text-sm mt-1 max-w-xl leading-relaxed">
        تنسيق قوائم التسوق والمشتريات من ملحمة اللحوم والمخابز وموردي الخضار والزيوت.
      </p>
    </div>

    <!-- Quick Action Buttons -->
    <div class="flex items-center gap-2 shrink-0">
      <button onclick="document.getElementById('newOrderModal').classList.remove('hidden')" class="px-4 py-2.5 rounded-2xl bg-white text-tasty-teal-dark font-bold text-xs hover:bg-tasty-teal-light shadow-md transition-all active:scale-95 flex items-center gap-1.5">
        <svg class="w-4 h-4 text-tasty-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        <span>إنشاء طلبية شراء</span>
      </button>
      <button onclick="document.getElementById('addItemModal').classList.remove('hidden')" class="px-4 py-2.5 rounded-2xl bg-tasty-teal text-white font-bold text-xs hover:brightness-110 shadow-md transition-all active:scale-95 flex items-center gap-1.5 border border-white/20">
        <span>+ مادة للمستودع</span>
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

  <!-- Orders List -->
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold text-tasty-charcoal">سجل طلبيات الشراء (<?= count($orders) ?>)</h2>
    </div>

    <?php if (empty($orders)): ?>
      <div class="bg-white rounded-3xl p-12 border border-gray-100 shadow-xs text-center">
        <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        <h3 class="text-base font-bold text-gray-700">لا توجد طلبيات شراء حتى الآن</h3>
        <p class="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
          اضغط زر "إنشاء طلبية شراء" لتحديد المواد والكميات المطلوبة للمطبخ والمستودع.
        </p>
      </div>
    <?php else: ?>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <?php foreach ($orders as $order): ?>
          <?php 
            $items = json_decode($order['items_json'], true) ?: []; 
            $isComplete = ($order['status'] === 'completed');
            $boughtCount = 0;
            foreach ($items as $it) {
              if (!empty($it['isPurchased'])) $boughtCount++;
            }
            $pct = count($items) > 0 ? round(($boughtCount / count($items)) * 100) : 0;
          ?>
          <div class="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-xs text-tasty-teal dir-ltr"><?= htmlspecialchars($order['order_number']) ?></span>
                    <span class="text-xs text-gray-400">• <?= htmlspecialchars($order['date']) ?></span>
                  </div>
                  <h3 class="text-base font-bold text-tasty-charcoal mt-1"><?= htmlspecialchars($order['title']) ?></h3>
                </div>

                <div class="flex items-center gap-1.5">
                  <?php if ($isComplete): ?>
                    <span class="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-[10px] font-bold">مكتملة</span>
                  <?php else: ?>
                    <span class="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 text-[10px] font-bold">قيد الشراء (<?= $pct ?>%)</span>
                  <?php endif; ?>
                  
                  <form method="POST" action="" onsubmit="return confirm('حذف هذه الطلبية؟');" class="inline">
                    <input type="hidden" name="action" value="delete_order">
                    <input type="hidden" name="order_id" value="<?= $order['id'] ?>">
                    <button type="submit" class="p-1 text-gray-400 hover:text-red-600 rounded-lg">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </form>
                </div>
              </div>

              <!-- Items Checklist -->
              <div class="mt-4 pt-3 border-t border-gray-100 space-y-2">
                <?php foreach ($items as $idx => $it): ?>
                  <?php $purchased = !empty($it['isPurchased']); ?>
                  <form method="POST" action="" class="flex items-center justify-between text-xs p-2 rounded-xl <?= $purchased ? 'bg-emerald-50/50 text-gray-400 line-through' : 'bg-gray-50 text-tasty-charcoal' ?>">
                    <input type="hidden" name="action" value="toggle_order_item">
                    <input type="hidden" name="order_id" value="<?= $order['id'] ?>">
                    <input type="hidden" name="item_index" value="<?= $idx ?>">
                    
                    <button type="submit" class="flex items-center gap-2 flex-1 text-right focus:outline-none">
                      <span class="w-4 h-4 rounded-md border flex items-center justify-center <?= $purchased ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 bg-white' ?>">
                        <?php if ($purchased): ?>
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                        <?php endif; ?>
                      </span>
                      <span class="font-bold"><?= htmlspecialchars($it['name']) ?></span>
                    </button>

                    <span class="font-bold px-2 py-0.5 rounded-lg bg-white border border-gray-200 text-[11px] dir-ltr shrink-0">
                      <?= $it['quantity'] ?> <?= htmlspecialchars($it['unit']) ?>
                    </span>
                  </form>
                <?php endforeach; ?>
              </div>
            </div>

            <?php if (!empty($order['notes'])): ?>
              <div class="mt-3 pt-2 text-[11px] text-gray-400 italic">
                ملاحظات: <?= htmlspecialchars($order['notes']) ?>
              </div>
            <?php endif; ?>
          </div>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </div>

</div>

<!-- Modal: Create Order -->
<div id="newOrderModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 hidden">
  <div class="bg-white rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col" onclick="event.stopPropagation()">
    <div class="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
      <h3 class="text-base font-bold text-tasty-charcoal">إنشاء طلبية شراء جديدة للمستودع</h3>
      <button onclick="document.getElementById('newOrderModal').classList.add('hidden')" class="p-1 text-gray-400 hover:text-gray-900">&times;</button>
    </div>

    <form method="POST" action="" class="space-y-4 overflow-y-auto flex-1 p-1">
      <input type="hidden" name="action" value="create_order">

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">عنوان الطلبية *</label>
          <input type="text" name="title" value="طلبية مشتريات عطلة نهاية الأسبوع" required class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-tasty-teal focus:bg-white focus:outline-none">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">التاريخ *</label>
          <input type="date" name="date" value="<?= date('Y-m-d') ?>" required class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-tasty-teal focus:bg-white focus:outline-none">
        </div>
      </div>

      <!-- Items Selector -->
      <div>
        <label class="block text-xs font-bold text-gray-600 mb-2">حدد المواد والكميات المطلوبة:</label>
        <div class="border border-gray-200 rounded-2xl p-3 max-h-64 overflow-y-auto divide-y divide-gray-100 bg-gray-50/50">
          <?php foreach ($masterItems as $mItem): ?>
            <div class="py-2 flex items-center justify-between gap-3 text-xs">
              <div class="flex-1">
                <span class="font-bold text-tasty-charcoal"><?= htmlspecialchars($mItem['name']) ?></span>
                <span class="text-gray-400 text-[11px] mr-2">(<?= htmlspecialchars($mItem['unit']) ?>)</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-[11px] text-gray-500">الكمية:</span>
                <input 
                  type="number" 
                  step="0.5" 
                  min="0"
                  name="items[<?= $mItem['id'] ?>]" 
                  placeholder="0"
                  class="w-20 px-2 py-1 bg-white border border-gray-200 rounded-xl text-center font-bold focus:border-tasty-teal focus:outline-none"
                >
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">ملاحظات الطلبية</label>
        <input type="text" name="notes" placeholder="تسليم صباح الغد قبل الساعة 11:00..." class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-tasty-teal focus:bg-white focus:outline-none">
      </div>

      <div class="pt-3 flex gap-2 shrink-0 border-t border-gray-100">
        <button type="submit" class="flex-1 py-3 bg-tasty-teal hover:bg-tasty-teal-dark text-white font-bold rounded-2xl text-xs transition-all shadow-md">
          حفظ وإنشاء الطلبية
        </button>
        <button type="button" onclick="document.getElementById('newOrderModal').classList.add('hidden')" class="px-5 py-3 border border-gray-200 text-gray-600 rounded-2xl font-bold text-xs hover:bg-gray-50">
          إلغاء
        </button>
      </div>
    </form>
  </div>
</div>

<!-- Modal: Add Item to Catalog -->
<div id="addItemModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 hidden">
  <div class="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4" onclick="event.stopPropagation()">
    <div class="flex items-center justify-between pb-3 border-b border-gray-100">
      <h3 class="text-base font-bold text-tasty-charcoal">إضافة مادة جديدة لكتالوج المستودع</h3>
      <button onclick="document.getElementById('addItemModal').classList.add('hidden')" class="p-1 text-gray-400 hover:text-gray-900">&times;</button>
    </div>

    <form method="POST" action="" class="space-y-3.5">
      <input type="hidden" name="action" value="add_master_item">

      <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">اسم المادة / الصنف *</label>
        <input type="text" name="name" required placeholder="مثال: مخلل لفت وردي مقرمش" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-tasty-teal focus:bg-white focus:outline-none">
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">التصنيف</label>
          <select name="category" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:border-tasty-teal focus:bg-white focus:outline-none">
            <option value="meat">لحوم ودواجن</option>
            <option value="vegetables">خضروات وفواكه</option>
            <option value="bread">خبز وعجين</option>
            <option value="dairy_sauces">أجبان وألبان وصلصات</option>
            <option value="dry_goods" selected>مواد جافة وبقوليات</option>
            <option value="packaging">تغليف وعلب</option>
            <option value="drinks">مشروبات</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">الوحدة</label>
          <select name="unit" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:border-tasty-teal focus:bg-white focus:outline-none">
            <option value="kg">كيلوغرام (kg)</option>
            <option value="box" selected>صندوق / كرتون (box)</option>
            <option value="bag">كيس / شوال (bag)</option>
            <option value="piece">قطعة / حبة (piece)</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">ملاحظات وتفاصيل التوريد</label>
        <input type="text" name="notes" placeholder="ماركة محددة، مورد، حجم العبوة..." class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-tasty-teal focus:bg-white focus:outline-none">
      </div>

      <div class="pt-3 flex gap-2">
        <button type="submit" class="flex-1 py-3 bg-tasty-teal hover:bg-tasty-teal-dark text-white font-bold rounded-2xl text-xs transition-all shadow-md">
          حفظ المادة في الكتالوج
        </button>
        <button type="button" onclick="document.getElementById('addItemModal').classList.add('hidden')" class="px-5 py-3 border border-gray-200 text-gray-600 rounded-2xl font-bold text-xs hover:bg-gray-50">
          إلغاء
        </button>
      </div>
    </form>
  </div>
</div>

<?php require_once __DIR__ . '/footer.php'; ?>

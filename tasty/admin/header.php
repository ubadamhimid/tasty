<?php
require_once __DIR__ . '/auth.php';
requireAuth();

$currentUser = getCurrentUser();
$isAdmin = isAdmin();
$currentPage = basename($_SERVER['PHP_SELF']);

// Define navigation items with permissions
$navItems = [
    [
        'url' => APP_URL . '/admin/index.php',
        'file' => 'index.php',
        'label' => 'الإحصائيات العامة',
        'adminOnly' => true,
        'icon' => '<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>'
    ],
    [
        'url' => APP_URL . '/admin/sales.php',
        'file' => 'sales.php',
        'label' => 'تسجيل مبيعات اليوم',
        'adminOnly' => false,
        'icon' => '<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"/></svg>'
    ],
    [
        'url' => APP_URL . '/admin/employees.php',
        'file' => 'employees.php',
        'label' => 'الموظفون والورديات',
        'adminOnly' => false,
        'icon' => '<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>'
    ],
    [
        'url' => APP_URL . '/admin/orders.php',
        'file' => 'orders.php',
        'label' => 'طلبيات الشراء',
        'adminOnly' => false,
        'icon' => '<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>'
    ],
    [
        'url' => APP_URL . '/admin/debts.php',
        'file' => 'debts.php',
        'label' => 'سجل الديون والدفعات',
        'adminOnly' => true, // STRICTLY Admin only!
        'icon' => '<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>'
    ],
    [
        'url' => APP_URL . '/admin/settings.php',
        'file' => 'settings.php',
        'label' => 'الإعدادات والبيانات',
        'adminOnly' => true, // STRICTLY Admin only!
        'icon' => '<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'
    ],
];

// Determine active database driver for header badge
$db = getDB();
$dbDriver = strtoupper($db->getAttribute(PDO::ATTR_DRIVER_NAME));
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $pageTitle ?? 'لوحة إدارة TASTY Hilversum' ?></title>
  <link rel="icon" type="image/png" href="<?= APP_URL ?>/public/images/icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            tasty: {
              teal: '#5E9895',
              'teal-dark': '#2B3A39',
              'teal-light': '#EBF3F2',
              gold: '#D48B38',
              charcoal: '#2B3A39',
              'bg-warm': '#FBF9F5',
            }
          },
          fontFamily: {
            cairo: ['Cairo', 'sans-serif'],
            tajawal: ['Tajawal', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    /* Clean custom scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #f1f1f1; }
    ::-webkit-scrollbar-thumb { background: #5E9895; border-radius: 999px; }
  </style>
</head>
<body class="min-h-screen bg-[#FBF9F5] text-tasty-charcoal flex flex-col font-cairo selection:bg-tasty-teal selection:text-white">

  <!-- Top Sticky Header (Clean & Minimal) -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      
      <!-- Brand & Logo -->
      <div class="flex items-center gap-3">
        <button id="mobileMenuBtn" class="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors" aria-label="القائمة">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>

        <a href="<?= $isAdmin ? (APP_URL . '/admin/index.php') : (APP_URL . '/admin/sales.php') ?>" class="flex items-center gap-3 group">
          <img src="/images/logo.webp" alt="TASTY" class="h-10 w-auto object-contain group-hover:scale-105 transition-transform" onerror="this.src='/images/logo.png'">
          <span class="text-xs font-black px-2.5 py-1 rounded-xl bg-tasty-teal/10 text-tasty-teal border border-tasty-teal/20">
            لوحة الإدارة
          </span>
        </a>
      </div>

      <!-- User Role, Web Link & Logout -->
      <div class="flex items-center gap-2.5">
        
        <!-- View Website Link -->
        <a href="/" target="_blank" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 hover:text-tasty-teal hover:bg-gray-50 transition border border-gray-200">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          <span>الموقع</span>
        </a>

        <!-- User Role Pill -->
        <?php if ($isAdmin): ?>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>المدير العام</span>
          </span>
        <?php else: ?>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>مدير الوردية</span>
          </span>
        <?php endif; ?>

        <!-- Logout Button -->
        <a 
          href="<?= APP_URL ?>/admin/logout.php" 
          onclick="return confirm('هل تود تسجيل الخروج؟');" 
          class="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition border border-red-100"
          title="تسجيل الخروج"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          <span class="hidden sm:inline">خروج</span>
        </a>

      </div>
    </div>
  </header>

  <!-- Layout Container: Sidebar + Main Content -->
  <div class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
    
    <!-- Desktop Sidebar -->
    <aside class="hidden lg:block w-64 shrink-0">
      <div class="sticky top-24 bg-white rounded-3xl p-4 shadow-sm border border-gray-100/80 space-y-1">
        
        <div class="px-3 py-2 mb-2">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">إدارة العمليات اليومية</p>
        </div>

        <?php foreach ($navItems as $item): ?>
          <?php if ($item['adminOnly'] && !$isAdmin) continue; ?>
          <?php $isActive = ($currentPage === $item['file']); ?>
          <a 
            href="<?= $item['url'] ?>" 
            class="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-bold transition-all <?= $isActive ? 'bg-gradient-to-l from-tasty-teal to-tasty-teal-dark text-white shadow-md shadow-tasty-teal/20 translate-x-1' : 'text-gray-600 hover:text-tasty-charcoal hover:bg-tasty-bg-warm' ?>"
          >
            <span class="<?= $isActive ? 'text-white' : 'text-tasty-teal' ?>">
              <?= $item['icon'] ?>
            </span>
            <span><?= $item['label'] ?></span>
          </a>
        <?php endforeach; ?>

        <!-- Quick Summary Box -->
        <div class="mt-8 pt-4 border-t border-gray-100 px-3">
          <div class="p-3.5 rounded-2xl bg-gradient-to-br from-tasty-teal-light to-white border border-tasty-teal/20 text-xs">
            <div class="flex items-center gap-1.5 text-tasty-teal-dark font-bold mb-1">
              <span>Tasty Hilversum</span>
            </div>
            <p class="text-gray-500 text-[11px] leading-relaxed">
              نظام محلي متكامل مربوط بقاعدة بيانات مركزية تعمل لحظياً عبر جميع الأجهزة.
            </p>
          </div>
        </div>

      </div>
    </aside>

    <!-- Mobile Drawer Modal -->
    <div id="mobileDrawer" class="fixed inset-0 z-50 lg:hidden bg-black/50 backdrop-blur-xs hidden">
      <div class="w-72 bg-white h-full p-5 shadow-2xl flex flex-col justify-between" onclick="event.stopPropagation()">
        <div>
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div class="flex items-center gap-2">
              <img src="/images/logo.webp" alt="TASTY" class="h-8 w-auto object-contain" onerror="this.src='/images/logo.png'">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tasty-teal-light text-tasty-teal-dark">لوحة الإدارة</span>
            </div>
            <button id="closeDrawerBtn" class="p-2 text-gray-400 hover:text-black">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div class="space-y-1.5">
            <?php foreach ($navItems as $item): ?>
              <?php if ($item['adminOnly'] && !$isAdmin) continue; ?>
              <?php $isActive = ($currentPage === $item['file']); ?>
              <a 
                href="<?= $item['url'] ?>" 
                class="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-bold transition-all <?= $isActive ? 'bg-gradient-to-l from-tasty-teal to-tasty-teal-dark text-white shadow-md' : 'text-gray-600 hover:bg-tasty-bg-warm' ?>"
              >
                <?= $item['icon'] ?>
                <span><?= $item['label'] ?></span>
              </a>
            <?php endforeach; ?>
          </div>
        </div>

        <div class="pt-4 border-t border-gray-100">
          <a href="<?= APP_URL ?>/admin/logout.php" onclick="return confirm('هل تود تسجيل الخروج؟');" class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold">
            <span>تسجيل الخروج</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="flex-1 min-w-0 pb-20 lg:pb-6">
      
      <!-- Flash Alert Message if any -->
      <?php if (isset($_SESSION['flash_success'])): ?>
        <div class="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <span><?= htmlspecialchars($_SESSION['flash_success']) ?></span>
          <button onclick="this.parentElement.remove();" class="text-emerald-600 hover:text-emerald-900">&times;</button>
        </div>
        <?php unset($_SESSION['flash_success']); ?>
      <?php endif; ?>

      <?php if (isset($_SESSION['flash_error'])): ?>
        <div class="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center justify-between">
          <span><?= htmlspecialchars($_SESSION['flash_error']) ?></span>
          <button onclick="this.parentElement.remove();" class="text-red-600 hover:text-red-900">&times;</button>
        </div>
        <?php unset($_SESSION['flash_error']); ?>
      <?php endif; ?>

<?php
require_once __DIR__ . '/auth.php';

if (isLoggedIn()) {
    header('Location: ' . APP_URL . (isAdmin() ? '/admin' : '/admin/sales'));
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (empty($username) || empty($password)) {
        $error = 'يرجى إدخال اسم المستخدم وكلمة المرور.';
    } else {
        $res = loginUser($username, $password);
        if ($res['success']) {
            header('Location: ' . APP_URL . ($res['role'] === 'admin' ? '/admin' : '/admin/sales'));
            exit;
        } else {
            $error = $res['error'];
        }
    }
}
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تسجيل الدخول — لوحة إدارة TASTY Hilversum</title>
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
</head>
<body class="min-h-screen bg-gradient-to-br from-[#1C2726] via-[#243332] to-[#121B1A] flex items-center justify-center p-4 font-cairo text-gray-100 selection:bg-tasty-teal selection:text-white relative overflow-hidden">

  <!-- Background Ambient Glow -->
  <div class="absolute -top-32 -left-32 w-96 h-96 bg-tasty-teal/20 rounded-full blur-3xl pointer-events-none"></div>
  <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-tasty-gold/15 rounded-full blur-3xl pointer-events-none"></div>

  <div class="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-2xl relative z-10">
    
    <!-- Logo & Restaurant Title -->
    <div class="text-center mb-8">
      <div class="inline-flex p-3 rounded-2xl bg-white/10 border border-white/20 mb-3 shadow-inner">
        <img src="/images/logo.webp" alt="TASTY" class="h-12 w-auto object-contain" onerror="this.src='/images/logo.png'">
      </div>
      <h1 class="text-2xl font-bold tracking-tight text-white">لوحة إدارة المطعم</h1>
      <p class="text-xs text-tasty-teal-light/80 mt-1">TASTY Hilversum • Groest 50</p>
    </div>

    <!-- Error Alert -->
    <?php if (!empty($error)): ?>
      <div class="mb-6 p-3.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-bold flex items-center gap-2">
        <svg class="w-4 h-4 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span><?= htmlspecialchars($error) ?></span>
      </div>
    <?php endif; ?>

    <!-- Login Form -->
    <form method="POST" action="" class="space-y-4">
      <div>
        <label class="block text-xs font-bold text-gray-300 mb-1.5">اسم المستخدم</label>
        <div class="relative">
          <input 
            type="text" 
            name="username" 
            required 
            placeholder="admin أو manager" 
            class="w-full px-4 py-3 bg-black/25 border border-white/15 rounded-2xl text-white placeholder-gray-400 text-sm focus:outline-none focus:border-tasty-teal focus:ring-2 focus:ring-tasty-teal/20 transition-all text-left dir-ltr"
            autocomplete="username"
          >
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-300 mb-1.5">كلمة المرور</label>
        <div class="relative">
          <input 
            type="password" 
            name="password" 
            required 
            placeholder="••••••••" 
            class="w-full px-4 py-3 bg-black/25 border border-white/15 rounded-2xl text-white placeholder-gray-400 text-sm focus:outline-none focus:border-tasty-teal focus:ring-2 focus:ring-tasty-teal/20 transition-all text-left dir-ltr"
            autocomplete="current-password"
          >
        </div>
      </div>

      <button 
        type="submit" 
        class="w-full py-3.5 bg-gradient-to-l from-tasty-teal to-[#437573] hover:from-[#6ba9a6] hover:to-tasty-teal text-white font-bold rounded-2xl shadow-lg shadow-tasty-teal/25 hover:shadow-xl transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-2"
      >
        <span>تسجيل الدخول</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
      </button>
    </form>

    <!-- Role Quick Access Hint -->
    <div class="mt-8 pt-6 border-t border-white/10 text-[11px] text-gray-400 flex flex-col gap-2">
      <div class="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
        <span class="font-bold text-amber-300">المدير العام (Admin):</span>
        <code class="text-gray-300 dir-ltr">admin / tasty2025</code>
      </div>
      <div class="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
        <span class="font-bold text-tasty-teal-light">مدير الوردية (Manager):</span>
        <code class="text-gray-300 dir-ltr">manager / tasty123</code>
      </div>
    </div>

    <!-- Back to Website -->
    <div class="mt-6 text-center">
      <a href="<?= APP_URL ?>/" class="text-xs text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
        <span>العودة لموقع المطعم الرئيسي</span>
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
      </a>
    </div>

  </div>

</body>
</html>

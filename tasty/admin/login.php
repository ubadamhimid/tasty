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
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            tasty: {
              teal: '#5E9895',
              'teal-dark': '#3D6C6A',
              'teal-light': '#EBF3F2',
              terracotta: '#E29578',
              'terracotta-dark': '#C87455',
              charcoal: '#1A2524',
              'charcoal-dark': '#101817',
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
<body class="min-h-screen bg-[#111918] bg-radial from-[#1A2625] via-[#111918] to-[#0A0F0E] flex items-center justify-center p-4 font-cairo text-gray-100 selection:bg-tasty-teal selection:text-white relative overflow-hidden">

  <!-- Ambient Glow Effects -->
  <div class="absolute -top-32 -left-32 w-96 h-96 bg-tasty-teal/25 rounded-full blur-[120px] pointer-events-none"></div>
  <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-tasty-terracotta/20 rounded-full blur-[120px] pointer-events-none"></div>
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-tasty-teal/5 rounded-full blur-[140px] pointer-events-none"></div>

  <!-- Main Card -->
  <div class="w-full max-w-md bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl relative z-10">
    
    <!-- Logo & Title -->
    <div class="text-center mb-7">
      <div class="inline-flex p-3 rounded-2xl bg-white/[0.06] border border-white/15 mb-3.5 shadow-lg shadow-black/20">
        <img src="/images/logo.webp" alt="TASTY" class="h-12 w-auto object-contain" onerror="this.src='/images/logo.png'">
      </div>
      <h1 class="text-xl sm:text-2xl font-black tracking-tight text-white">لوحة الإدارة والمبيعات</h1>
      <p class="text-xs text-tasty-teal-light/75 mt-1 font-medium">TASTY Hilversum • الدخول للمخولين فقط</p>
    </div>

    <!-- Error Alert -->
    <?php if (!empty($error)): ?>
      <div class="mb-5 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-bold flex items-center gap-2.5 animate-shake">
        <svg class="w-4 h-4 shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span><?= htmlspecialchars($error) ?></span>
      </div>
    <?php endif; ?>

    <!-- Login Form -->
    <form method="POST" action="" class="space-y-4">
      
      <!-- Username Field -->
      <div>
        <label class="block text-xs font-bold text-gray-300 mb-1.5">اسم المستخدم</label>
        <div class="relative">
          <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
          <input 
            type="text" 
            name="username" 
            required 
            placeholder="اسم المستخدم" 
            class="w-full pr-10 pl-4 py-3 bg-black/30 border border-white/10 rounded-2xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-tasty-teal focus:ring-2 focus:ring-tasty-teal/20 transition-all text-right font-medium"
            autocomplete="username"
            autofocus
          >
        </div>
      </div>

      <!-- Password Field with Toggle -->
      <div>
        <label class="block text-xs font-bold text-gray-300 mb-1.5">كلمة المرور</label>
        <div class="relative">
          <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <input 
            type="password" 
            name="password" 
            id="passwordInput"
            required 
            placeholder="••••••••" 
            class="w-full pr-10 pl-11 py-3 bg-black/30 border border-white/10 rounded-2xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-tasty-teal focus:ring-2 focus:ring-tasty-teal/20 transition-all text-left dir-ltr font-sans"
            autocomplete="current-password"
          >
          <button 
            type="button" 
            onclick="togglePassword()" 
            class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 hover:text-white transition-colors"
            title="إظهار / إخفاء كلمة المرور"
          >
            <svg id="eyeIcon" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          </button>
        </div>
      </div>

      <!-- Submit Button -->
      <button 
        type="submit" 
        class="w-full py-3.5 bg-gradient-to-l from-tasty-teal via-tasty-teal-dark to-tasty-teal hover:opacity-95 text-white font-bold rounded-2xl shadow-lg shadow-tasty-teal/20 transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-2 text-sm"
      >
        <span>تسجيل الدخول</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
      </button>
    </form>

    <!-- Footer Links & Security Indicator -->
    <div class="mt-7 pt-5 border-t border-white/10 flex flex-col items-center gap-3 text-center">
      <a href="<?= APP_URL ?>/" class="text-xs text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1.5 font-medium">
        <span>العودة لموقع المطعم الرئيسي</span>
        <svg class="w-3.5 h-3.5 text-tasty-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
      </a>
      <span class="text-[10px] text-gray-500 font-mono">
        نظام محمي ومشفر • TASTY © <?= date('Y') ?>
      </span>
    </div>

  </div>

  <script>
    function togglePassword() {
      const input = document.getElementById('passwordInput');
      const icon = document.getElementById('eyeIcon');
      if (input.type === 'password') {
        input.type = 'text';
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/>';
      } else {
        input.type = 'password';
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>';
      }
    }
  </script>

</body>
</html>

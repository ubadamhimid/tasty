    </main>
  </div>

  <!-- Mobile Sticky Bottom Navigation Bar -->
  <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-0.5 py-1 flex items-center justify-around shadow-lg pb-[max(0.25rem,env(safe-area-inset-bottom))]">
    <?php foreach ($navItems as $item): ?>
      <?php if ($item['adminOnly'] && !$isAdmin) continue; ?>
      <?php $isActive = ($currentPage === $item['file']); ?>
      <a 
        href="<?= $item['url'] ?>" 
        class="flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all flex-1 min-w-0 <?= $isActive ? 'text-tasty-teal font-black' : 'text-gray-400 hover:text-gray-600' ?>"
      >
        <span class="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
          <?= $item['icon'] ?>
        </span>
        <span class="text-[9px] sm:text-[10px] mt-0.5 font-bold truncate block w-full text-center leading-none">
          <?= htmlspecialchars($item['shortLabel'] ?? $item['label']) ?>
        </span>
      </a>
    <?php endforeach; ?>
  </nav>

  <!-- Drawer Script -->
  <script>
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');

    if (mobileMenuBtn && mobileDrawer) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileDrawer.classList.remove('hidden');
      });
      mobileDrawer.addEventListener('click', () => {
        mobileDrawer.classList.add('hidden');
      });
      if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', () => {
          mobileDrawer.classList.add('hidden');
        });
      }
    }
  </script>

</body>
</html>

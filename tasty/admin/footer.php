    </main>
  </div>

  <!-- Mobile Sticky Bottom Navigation Bar -->
  <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-1 py-1.5 flex items-center justify-around shadow-lg">
    <?php foreach ($navItems as $item): ?>
      <?php if ($item['adminOnly'] && !$isAdmin) continue; ?>
      <?php $isActive = ($currentPage === $item['file']); ?>
      <a 
        href="<?= $item['url'] ?>" 
        class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all <?= $isActive ? 'text-tasty-teal font-bold scale-105' : 'text-gray-400 hover:text-gray-600' ?>"
      >
        <span class="w-5 h-5 flex items-center justify-center">
          <?= $item['icon'] ?>
        </span>
        <span class="text-[10px] mt-0.5 whitespace-nowrap"><?= $item['label'] ?></span>
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

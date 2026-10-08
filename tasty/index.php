<?php
/**
 * TASTY Hilversum - Authentic Levantine Street Kitchen
 * Pure PHP High-Performance Customer Landing Page & Digital Menu
 */
require_once __DIR__ . '/config.php';

// Restaurant Constants
$restaurantName = "TASTY";
$tagline = "Authentic Levantine Street Kitchen";
$city = "Hilversum";
$phoneDisplay = "035 204 2001";
$phoneRaw = "tel:0352042001";
$whatsappDisplay = "+31 6 84632782";
$whatsappNumber = "31684632782";

// Menu Data Array
$menuItems = [
    // --- LEVANTINE DIPS ---
    [
        'id' => 'dip-tasty-combo',
        'name' => 'Tasty Combination Platter',
        'dutchName' => 'Hummus en handgemaakte Falafel',
        'category' => 'dips',
        'price' => 8.00,
        'description' => 'Zijdezachte huisgemaakte hummus geserveerd met knapperige handgemaakte falafel en vers Libanees brood.',
        'badge' => 'Populair',
        'isVegetarian' => true,
        'image' => '/images/falafel-hummus-bowl.webp',
        'ingredients' => ['Huisgemaakte Hummus', 'Falafel', 'Extra Virgin Olijfolie', 'Vers Brood']
    ],
    [
        'id' => 'dip-classic-hummus',
        'name' => 'Classic Hummus',
        'dutchName' => 'Klassieke Hummus Dip',
        'category' => 'dips',
        'price' => 5.00,
        'description' => 'Traditionele romige hummus van kikkererwten en fijne tahini, afgewerkt met olijfolie en vers brood.',
        'badge' => 'Klassieker',
        'isVegetarian' => true,
        'image' => '/images/hummus-dip.webp',
        'ingredients' => ['Kikkererwten', 'Sesam Tahini', 'Olijfolie', 'Vers Brood']
    ],
    [
        'id' => 'dip-mutabal',
        'name' => 'Mutabal',
        'dutchName' => 'Gegrilde Auberginedip',
        'category' => 'dips',
        'price' => 5.00,
        'description' => 'Op houtskool geroosterde auberginedip vermengd met zachte tahini, knoflook en olijfolie.',
        'badge' => 'Gerookt',
        'isVegetarian' => true,
        'image' => '/images/hummus-dip.webp',
        'ingredients' => ['Gegrilde Aubergine', 'Tahini', 'Knoflook', 'Olijfolie']
    ],

    // --- TASTY BOWLS ---
    [
        'id' => 'bowl-crispy-chicken-rice',
        'name' => 'Tasty Crispy Chicken Rice',
        'dutchName' => 'Crispy Chicken Rice Bowl',
        'category' => 'bowls',
        'price' => 12.00,
        'description' => 'Knapperige gekruide kipreepjes geserveerd over geurige basmatirijst met Libanese augurken en huisgemaakte saus.',
        'badge' => 'Bestseller',
        'image' => '/images/crispy-chicken-bowl.webp',
        'ingredients' => ['Crispy Chicken', 'Gele Kruidenrijst', 'Pickles', 'Signature Saus']
    ],
    [
        'id' => 'bowl-chicken-frites',
        'name' => 'Tasty Chicken Frites Bowl',
        'dutchName' => 'Crispy Chicken Frites Bowl',
        'category' => 'bowls',
        'price' => 12.00,
        'description' => 'Malse crispy kipstukjes op een bed van goudbruine steak frites met verse augurken en knoflooksaus.',
        'badge' => 'Favoriet',
        'image' => '/images/crispy-chicken-bowl.webp',
        'ingredients' => ['Crispy Chicken', 'Gouden Frites', 'Pickles', 'Knoflooksaus']
    ],
    [
        'id' => 'bowl-shish-taouk',
        'name' => 'Tasty Shish Taouk Bowl',
        'dutchName' => 'Shish Taouk Rice Bowl',
        'category' => 'bowls',
        'price' => 12.00,
        'description' => 'Op houtskool gegrilde kipspiesjes over gekruide rijst, geserveerd met Syrische knoflooksaus en tafelzuur.',
        'badge' => 'Chef Special',
        'image' => '/images/chicken-skewers-bowl.webp',
        'ingredients' => ['Gegrilde Shish Taouk', 'Gele Rijst', 'Huisgemaakte Toum', 'Augurken']
    ],

    // --- MANAQISH ---
    [
        'id' => 'manaqish-kaas',
        'name' => 'Manaqish Kaas',
        'dutchName' => 'Kaas Flatbread',
        'category' => 'manaqish',
        'price' => 3.00,
        'description' => 'In de steenoven vers gebakken platbrood rijkelijk belegd met gesmolten Levantijnse kaas.',
        'badge' => 'Steenoven',
        'isVegetarian' => true,
        'image' => '/images/manaqish.webp',
        'ingredients' => ['Gesmolten Kaas', 'Olijfolie', 'Vers Deeg']
    ],
    [
        'id' => 'manaqish-mohamara',
        'name' => 'Manaqish Mohamara',
        'dutchName' => 'Mohamara Flatbread',
        'category' => 'manaqish',
        'price' => 2.50,
        'description' => 'Vers deeg belegd met pittige paprikapasta, walnoten en olijfolie volgens traditioneel Aleppijns recept.',
        'badge' => 'Spicy',
        'isVegetarian' => true,
        'image' => '/images/manaqish.webp',
        'ingredients' => ['Rode Paprikaspread', 'Walnoten', 'Olijfolie']
    ],
    [
        'id' => 'manaqish-mohamara-kaas',
        'name' => 'Manaqish Mohamara met Kaas',
        'dutchName' => 'Mohamara met Kaas',
        'category' => 'manaqish',
        'price' => 3.00,
        'description' => 'De perfecte combinatie van onze pittige mohamara spread met een royale laag gesmolten kaas.',
        'badge' => 'Populair',
        'isVegetarian' => true,
        'image' => '/images/manaqish.webp',
        'ingredients' => ['Mohamara', 'Gesmolten Kaas', 'Olijfolie']
    ],
    [
        'id' => 'manaqish-vlees',
        'name' => 'Manaqish Vlees',
        'dutchName' => 'Lahm Bi Ajeen',
        'category' => 'manaqish',
        'price' => 3.50,
        'description' => 'Klassiek Midden-Oosters platbrood belegd met fijn gekruid gehakt, tomaat, ui en specerijen.',
        'badge' => 'Klassieker',
        'image' => '/images/manaqish.webp',
        'ingredients' => ['Fijn Rundergehakt', 'Tomaat', 'Ui', 'Kruidenmix']
    ],
    [
        'id' => 'manaqish-thijm',
        'name' => 'Manaqish Zaatar',
        'dutchName' => 'Za’atar Flatbread',
        'category' => 'manaqish',
        'price' => 2.50,
        'description' => 'Authentiek steenoven platbrood bestreken met wilde tijm, geroosterd sesamzaad en extra virgin olijfolie.',
        'badge' => 'Aanrader',
        'isVegetarian' => true,
        'image' => '/images/manaqish.webp',
        'ingredients' => ['Levantijnse Za’atar', 'Sesam', 'Olijfolie']
    ],

    // --- DURUM WRAPS ---
    [
        'id' => 'durum-kip-shoarma',
        'name' => 'Kip Shoarma Durum',
        'dutchName' => 'Kip Shoarma Durum Wrap',
        'category' => 'durum',
        'price' => 8.00,
        'description' => '24 uur gemarineerde malse kipshoarma gewikkeld in geroosterde durum met toum knoflooksaus en augurken.',
        'badge' => 'Bestseller',
        'image' => '/images/shawarma-wrap.webp',
        'ingredients' => ['Kip Shoarma', 'Huisgemaakte Toum', 'Salade naar Keuze', 'Augurken']
    ],
    [
        'id' => 'durum-lams-shoarma',
        'name' => 'Lams Shoarma Durum',
        'dutchName' => 'Lams Shoarma Durum Wrap',
        'category' => 'durum',
        'price' => 11.00,
        'description' => 'Langzaam gegaard en intens gekruid lamsvlees in versgeroosterde durum met tahinisaus en verse kruiden.',
        'badge' => 'Chef Special',
        'image' => '/images/shawarma-wrap.webp',
        'ingredients' => ['Lams Shoarma', 'Tahini Saus', 'Salade naar Keuze', 'Sumak Ui']
    ],
    [
        'id' => 'durum-falafel',
        'name' => 'Falafel Durum',
        'dutchName' => 'Falafel Durum Wrap',
        'category' => 'durum',
        'price' => 6.00,
        'description' => '100% vegetarisch & vegan! Verse krokante falafelballetjes met tahini, salade en ingelegde roze raapjes.',
        'badge' => 'Vegan',
        'isVegetarian' => true,
        'image' => '/images/falafel-wrap.webp',
        'ingredients' => ['Krokante Falafel', 'Tahini', 'Roze Augurken', 'Salade']
    ],
    [
        'id' => 'durum-crispy',
        'name' => 'Crispy Durum',
        'dutchName' => 'Crispy Chicken Durum Wrap',
        'category' => 'durum',
        'price' => 8.00,
        'description' => 'Extra knapperige gepaneerde kip met cheddar kaas, frisse ijsbergsla en onze Tasty speciaalsaus.',
        'badge' => 'Populair',
        'image' => '/images/shawarma-wrap.webp',
        'ingredients' => ['Crispy Kip', 'Cheddar', 'Tasty Saus', 'Verse Sla']
    ],

    // --- SCHOTELS (KAPSALON / PLATTERS) ---
    [
        'id' => 'schotel-arabish-kip-shoarma',
        'name' => 'Arabisch Kip Shoarma Schotel',
        'dutchName' => 'Arabische Kip Shoarma Schotel',
        'category' => 'kapsalon',
        'price' => 14.00,
        'description' => 'Grote Arabische schotel met in stukken gesneden kipwrap, gouden frites, knoflooksaus, granaatappelsiroop en augurken.',
        'badge' => 'Top Schotel',
        'image' => '/images/shawarma-platter.webp',
        'ingredients' => ['Kip Shoarma Roll', 'Gouden Frites', 'Knoflook Toum', 'Pickles']
    ],
    [
        'id' => 'schotel-arabish-lams-shoarma',
        'name' => 'Arabisch Lams Shoarma Schotel',
        'dutchName' => 'Arabische Lams Shoarma Schotel',
        'category' => 'kapsalon',
        'price' => 15.00,
        'description' => 'Rijkelijk belegde schotel met gekruid lamsvlees, frites, tahini dip, gegrilde groenten en Libanees brood.',
        'badge' => 'Luxe',
        'image' => '/images/shawarma-platter.webp',
        'ingredients' => ['Lams Shoarma Roll', 'Frites', 'Tahini Dip', 'Geroosterde Tomaat']
    ],

    // --- KIP ---
    [
        'id' => 'kip-hele-rijst-patat',
        'name' => 'Hele Kip Schotel',
        'dutchName' => 'Hele Geroosterde Kip met Rijst of Patat',
        'category' => 'kip',
        'price' => 20.00,
        'description' => 'Volledig goudbruin gebraden kip geserveerd met een royale portie rijst of frites, Syrische knoflook en tafelzuur.',
        'badge' => 'Familie Feest',
        'image' => '/images/crispy-chicken-bowl.webp',
        'ingredients' => ['Hele Kip', 'Syrische Knoflooksaus', 'Augurken', 'Rijst of Frites']
    ],
    [
        'id' => 'kip-half-rijst-patat',
        'name' => 'Halve Kip Schotel',
        'dutchName' => 'Halve Geroosterde Kip met Rijst of Patat',
        'category' => 'kip',
        'price' => 12.00,
        'description' => 'Malse halve gebraden kip met rijst of frites, romige toum en ingelegde augurken.',
        'badge' => 'Favoriet',
        'image' => '/images/crispy-chicken-bowl.webp',
        'ingredients' => ['Halve Kip', 'Knoflooksaus', 'Augurken', 'Rijst of Frites']
    ]
];

$categories = [
    ['id' => 'all', 'label' => 'Alles (All Dishes)'],
    ['id' => 'durum', 'label' => 'Durum Wraps'],
    ['id' => 'bowls', 'label' => 'Tasty Bowls'],
    ['id' => 'kapsalon', 'label' => 'Schotels & Platers'],
    ['id' => 'manaqish', 'label' => 'Manaqish Steenoven'],
    ['id' => 'kip', 'label' => 'Geroosterde Kip'],
    ['id' => 'dips', 'label' => 'Hummus & Dips']
];

foreach ($menuItems as &$mItem) {
    $mItem['image'] = APP_URL . '/public' . $mItem['image'];
}
unset($mItem);
?>
<!DOCTYPE html>
<html lang="nl" dir="ltr" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TASTY Hilversum | Authentic Levantine Street Kitchen & Delivery</title>
  <meta name="description" content="Proef authentieke Levantijnse gerechten in Hilversum: knapperige durum wraps, 24-uurs gemarineerde kip shoarma, steenoven manaqish, en verse bowls. Bestel gemakkelijk via WhatsApp!">
  <link rel="icon" type="image/png" href="<?= APP_URL ?>/public/images/icon.png">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=Cairo:wght@600;700;800&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS -->
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
              'bg-warm': '#FFFDF9',
              terracotta: '#C86D51',
            }
          },
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            serif: ['"Playfair Display"', 'serif'],
            cairo: ['Cairo', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #FAF7F2; }
    ::-webkit-scrollbar-thumb { background: #5E9895; border-radius: 999px; }
    
    /* Animation Keyframes */
    @keyframes marquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee {
      display: flex;
      width: 200%;
      animation: marquee 25s linear infinite;
    }
    .animate-marquee:hover {
      animation-play-state: paused;
    }
  </style>
</head>
<body class="bg-[#FFFDF9] text-tasty-charcoal font-sans selection:bg-tasty-teal selection:text-white">

  <!-- ================= TOP NOTIFICATION BAR ================= -->
  <div class="bg-tasty-teal-dark text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-3">
    <span class="inline-flex items-center gap-1.5 bg-[#25D366] text-white px-2 py-0.5 rounded-full text-[11px] font-bold">
      <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
      Nu Open
    </span>
    <span>🛵 <strong>Bezorging & Afhalen in Hilversum</strong> — Bestel snel direct via WhatsApp!</span>
    <a href="#delivery" class="underline text-emerald-300 hover:text-white transition hidden sm:inline">Openingstijden & Locatie</a>
  </div>

  <!-- ================= NAVBAR ================= -->
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      
      <!-- Brand Logo -->
      <a href="<?= APP_URL ?>/" class="flex items-center gap-3 group">
        <img src="<?= APP_URL ?>/public/images/logo.webp" alt="TASTY Hilversum Logo" class="h-12 w-auto object-contain group-hover:scale-105 transition">
        <div>
          <span class="text-2xl font-extrabold tracking-tight font-serif text-tasty-charcoal block leading-none">TASTY</span>
          <span class="text-[10px] uppercase tracking-widest text-tasty-teal font-bold block mt-0.5">Levantine Kitchen</span>
        </div>
      </a>

      <!-- Desktop Nav Items -->
      <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-tasty-charcoal/80">
        <a href="#menu" class="hover:text-tasty-teal transition">Menu Kaart</a>
        <a href="#customizer" class="hover:text-tasty-teal transition flex items-center gap-1.5">
          <span>Stel je Bowl samen</span>
          <span class="px-1.5 py-0.5 text-[10px] bg-tasty-teal/10 text-tasty-teal rounded-md font-bold">Interactief</span>
        </a>
        <a href="#about" class="hover:text-tasty-teal transition">Over Ons</a>
        <a href="#delivery" class="hover:text-tasty-teal transition">Bezorging & Contact</a>
      </nav>

      <!-- Action Buttons & Cart Trigger -->
      <div class="flex items-center gap-3">
        <!-- Cart Drawer Button -->
        <button onclick="openCartDrawer()" class="relative p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-tasty-charcoal border border-gray-200 transition flex items-center gap-2">
          <svg class="w-5 h-5 text-tasty-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          <span class="text-xs font-bold hidden sm:inline">Winkelmand</span>
          <span id="cartCountBadge" class="w-5 h-5 rounded-full bg-tasty-teal text-white text-[11px] font-black flex items-center justify-center">0</span>
        </button>

        <!-- WhatsApp Quick Button -->
        <a href="https://wa.me/<?= $whatsappNumber ?>?text=Hallo%20TASTY!%20Ik%20wil%20graag%20een%20bestelling%20plaatsen." target="_blank" class="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-md shadow-emerald-500/20 transition transform active:scale-95">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.2.662.591 1.221.774 1.394.861.174.086.275.072.376-.044.102-.115.434-.506.549-.679.116-.173.232-.144.39-.087s1.011.477 1.184.564.289.13.332.202c.044.073.044.42-.1 1.225z"/></svg>
          Bestel WhatsApp
        </a>

        <!-- Admin Portal Icon Link -->
        <a href="<?= APP_URL ?>/admin/login.php" title="لوحة إدارة المطعم" class="p-2.5 rounded-xl bg-gray-50 hover:bg-tasty-teal hover:text-white text-gray-500 border border-gray-200 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
        </a>
      </div>

    </div>
  </header>

  <!-- ================= HERO SECTION ================= -->
  <section class="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#FFFDF9]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <!-- Left Content -->
        <div class="lg:col-span-7 space-y-6 text-left">
          
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tasty-teal/10 border border-tasty-teal/20 text-tasty-teal font-bold text-xs uppercase tracking-widest">
            <span class="w-2 h-2 rounded-full bg-tasty-teal"></span>
            Artisanal Levantine Street Kitchen • Hilversum
          </div>

          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-tasty-charcoal leading-[1.1]">
            Authentic <span class="italic font-serif font-normal text-tasty-terracotta">Tasty</span> Craft.<br>
            Honest Levantine Flavors.
          </h1>

          <p class="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
            Hilversum’s signature Mediterranean destination. Van 24-uur gemarineerde malse kipshoarma wraps en steenoven Manaqish tot fluweelzachte dips en verse custom bowls.
          </p>

          <div class="flex flex-wrap items-center gap-4 pt-2">
            <a href="#menu" class="px-7 py-3.5 rounded-2xl bg-tasty-teal hover:bg-tasty-teal-dark text-white font-bold text-sm shadow-xl shadow-tasty-teal/25 transition transform active:scale-95 flex items-center gap-2">
              <span>Bekijk het Menu</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </a>
            
            <a href="#customizer" class="px-7 py-3.5 rounded-2xl bg-white hover:bg-gray-50 text-tasty-charcoal border border-gray-200 font-bold text-sm shadow-sm transition transform active:scale-95 flex items-center gap-2">
              <svg class="w-5 h-5 text-tasty-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
              <span>Stel je Bowl samen</span>
            </a>

            <a href="tel:<?= $phoneDisplay ?>" class="px-5 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-tasty-charcoal font-bold text-sm transition flex items-center gap-2">
              <svg class="w-4 h-4 text-tasty-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              <span><?= $phoneDisplay ?></span>
            </a>
          </div>

          <!-- Feature Badges -->
          <div class="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200/60 max-w-lg">
            <div>
              <div class="font-extrabold text-tasty-charcoal text-base">100% Halal</div>
              <div class="text-xs text-gray-500">Vers & Gecertificeerd</div>
            </div>
            <div>
              <div class="font-extrabold text-tasty-charcoal text-base">Steenoven</div>
              <div class="text-xs text-gray-500">Dagelijks Vers Deeg</div>
            </div>
            <div>
              <div class="font-extrabold text-tasty-charcoal text-base">Snelle Bezorging</div>
              <div class="text-xs text-gray-500">Heet aan Huis</div>
            </div>
          </div>

        </div>

        <!-- Right Visual Showcase -->
        <div class="lg:col-span-5 relative flex justify-center">
          <div class="relative w-full max-w-md">
            <div class="absolute -inset-4 bg-gradient-to-tr from-tasty-teal/20 to-tasty-gold/20 rounded-3xl blur-2xl -z-10"></div>
            
            <div class="bg-white rounded-3xl p-4 shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-[1.02] transition duration-300">
              <img id="heroImage" src="<?= APP_URL ?>/public/images/shawarma-wrap.webp" alt="Kip Shoarma Durum Wrap" class="w-full h-80 object-cover rounded-2xl mb-4">
              
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-[10px] uppercase font-bold tracking-wider text-tasty-teal bg-tasty-teal/10 px-2.5 py-0.5 rounded-full">Bestseller</span>
                  <h3 id="heroTitle" class="text-lg font-bold text-tasty-charcoal mt-1">Kip Shoarma Durum Wrap</h3>
                  <p id="heroSubtitle" class="text-xs text-gray-500">24-uur gemarineerd • Huisgemaakte Toum</p>
                </div>
                <div class="text-right">
                  <span id="heroPrice" class="text-xl font-black text-tasty-teal">€8.00</span>
                  <button onclick="addToCart('durum-kip-shoarma', 'Kip Shoarma Durum Wrap', 8.00, '<?= APP_URL ?>/public/images/shawarma-wrap.webp')" class="mt-1 block px-3 py-1.5 bg-tasty-teal text-white rounded-xl text-xs font-bold hover:bg-tasty-teal-dark transition">
                    + Bestel
                  </button>
                </div>
              </div>

              <!-- Mini Dish Switcher -->
              <div class="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100">
                <button onclick="switchHeroDish('wrap')" class="p-1 rounded-xl border border-tasty-teal/40 bg-tasty-teal/5 text-center text-[10px] font-bold text-tasty-charcoal hover:bg-tasty-teal/10 transition">
                  🌯 Durum Wrap
                </button>
                <button onclick="switchHeroDish('bowl')" class="p-1 rounded-xl border border-gray-200 text-center text-[10px] font-bold text-tasty-charcoal hover:bg-gray-50 transition">
                  🥗 Shish Bowl
                </button>
                <button onclick="switchHeroDish('manaqish')" class="p-1 rounded-xl border border-gray-200 text-center text-[10px] font-bold text-tasty-charcoal hover:bg-gray-50 transition">
                  🫓 Manaqish
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- ================= MARQUEE ================= -->
  <div class="bg-tasty-charcoal py-4 overflow-hidden border-y border-tasty-teal/20 text-white font-medium text-xs tracking-widest uppercase">
    <div class="animate-marquee whitespace-nowrap flex gap-8">
      <span>✨ Authentic Levantine Street Kitchen</span>
      <span>•</span>
      <span>🔥 Stone-Baked Manaqish</span>
      <span>•</span>
      <span>🌯 24h Marinated Kip Shoarma</span>
      <span>•</span>
      <span>🥗 Signature Custom Bowls</span>
      <span>•</span>
      <span>🧆 Handgemaakte Falafel & Hummus</span>
      <span>•</span>
      <span>🛵 Nu Bezorging in Hilversum</span>
      <span>•</span>
      <span>✨ 100% Halal Fresh Ingredients</span>
      <span>•</span>
      <span>✨ Authentic Levantine Street Kitchen</span>
      <span>•</span>
      <span>🔥 Stone-Baked Manaqish</span>
      <span>•</span>
      <span>🌯 24h Marinated Kip Shoarma</span>
      <span>•</span>
      <span>🥗 Signature Custom Bowls</span>
    </div>
  </div>

  <!-- ================= MENU EXPLORER ================= -->
  <section id="menu" class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-12 space-y-3">
      <span class="text-xs uppercase font-extrabold tracking-widest text-tasty-teal bg-tasty-teal/10 px-3.5 py-1.5 rounded-full inline-block">
        Onze Menu Kaart
      </span>
      <h2 class="text-3xl sm:text-4xl font-serif font-bold text-tasty-charcoal">
        Ontdek de Eerlijke Smaken van de Levant
      </h2>
      <p class="text-gray-500 text-sm">
        Elk gerecht wordt vers op bestelling bereid met traditionele kruiden, verse ingrediënten en pure passie.
      </p>
    </div>

    <!-- Category Filter Tabs -->
    <div class="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
      <?php foreach ($categories as $index => $cat): ?>
        <button 
          onclick="filterMenu('<?= $cat['id'] ?>')" 
          id="btn-cat-<?= $cat['id'] ?>"
          class="cat-filter-btn px-5 py-2.5 rounded-full text-xs font-bold transition whitespace-nowrap <?= $index === 0 ? 'bg-tasty-teal text-white shadow-md shadow-tasty-teal/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200' ?>"
        >
          <?= $cat['label'] ?>
        </button>
      <?php endforeach; ?>
    </div>

    <!-- Menu Items Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="menuGrid">
      <?php foreach ($menuItems as $item): ?>
        <div 
          class="menu-item-card bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          data-category="<?= $item['category'] ?>"
        >
          <div>
            <!-- Image & Badge Container -->
            <div class="relative overflow-hidden rounded-2xl mb-4 bg-gray-50 h-52">
              <img 
                src="<?= $item['image'] ?>" 
                alt="<?= htmlspecialchars($item['name']) ?>" 
                class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                loading="lazy"
              >
              <?php if (!empty($item['badge'])): ?>
                <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-tasty-charcoal text-[11px] font-extrabold px-3 py-1 rounded-full shadow-xs">
                  <?= $item['badge'] ?>
                </span>
              <?php endif; ?>
              <?php if (!empty($item['isVegetarian'])): ?>
                <span class="absolute top-3 left-3 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Veggie
                </span>
              <?php endif; ?>
            </div>

            <!-- Content -->
            <div class="space-y-1.5">
              <div class="flex items-start justify-between gap-2">
                <h3 class="font-bold text-lg text-tasty-charcoal leading-snug group-hover:text-tasty-teal transition">
                  <?= htmlspecialchars($item['dutchName']) ?>
                </h3>
                <span class="text-lg font-black text-tasty-teal shrink-0">
                  €<?= number_format($item['price'], 2) ?>
                </span>
              </div>
              
              <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                <?= htmlspecialchars($item['description']) ?>
              </p>

              <!-- Ingredients Tags -->
              <div class="flex flex-wrap gap-1.5 pt-2">
                <?php foreach (array_slice($item['ingredients'], 0, 3) as $ing): ?>
                  <span class="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-md border border-gray-100">
                    <?= htmlspecialchars($ing) ?>
                  </span>
                <?php endforeach; ?>
              </div>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="pt-5 mt-4 border-t border-gray-100 flex items-center justify-between gap-2">
            <!-- 1-Click WhatsApp Order -->
            <a 
              href="https://wa.me/<?= $whatsappNumber ?>?text=<?= urlencode("Hallo TASTY! 👋\nIk wil graag bestellen:\n🍽️ " . $item['dutchName'] . " (€" . number_format($item['price'], 2) . ")\n\n🛵 Bezorging / Afhalen graag!\n📍 Adres:") ?>" 
              target="_blank" 
              class="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.2.662.591 1.221.774 1.394.861.174.086.275.072.376-.044.102-.115.434-.506.549-.679.116-.173.232-.144.39-.087s1.011.477 1.184.564.289.13.332.202c.044.073.044.42-.1 1.225z"/></svg>
              <span>Direct Bestellen</span>
            </a>

            <!-- Add to Cart Button -->
            <button 
              onclick="addToCart('<?= $item['id'] ?>', '<?= addslashes($item['dutchName']) ?>', <?= $item['price'] ?>, '<?= $item['image'] ?>')" 
              class="px-3.5 py-2 rounded-xl text-xs font-bold bg-tasty-teal hover:bg-tasty-teal-dark text-white transition flex items-center gap-1.5"
            >
              <span>+ In Mandje</span>
            </button>
          </div>

        </div>
      <?php endforeach; ?>
    </div>
  </section>

  <!-- ================= INTERACTIVE BOWL BUILDER ================= -->
  <section id="customizer" class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div class="bg-gradient-to-br from-[#FAF7F2] to-white rounded-3xl p-6 sm:p-12 border border-tasty-terracotta/20 shadow-xl relative overflow-hidden">
      
      <div class="max-w-2xl space-y-3 mb-10">
        <span class="inline-flex items-center gap-1.5 text-tasty-terracotta text-xs font-extrabold uppercase tracking-widest bg-tasty-terracotta/10 px-3.5 py-1.5 rounded-full">
          ✨ Interactive Craft Studio
        </span>
        <h2 class="text-3xl sm:text-4xl font-serif font-bold text-tasty-charcoal">
          Stel je Eigen Levantine Bowl Samen
        </h2>
        <p class="text-gray-600 text-sm leading-relaxed">
          Kies je favoriete basis, vers gegrilde proteïne, ambachtelijke toppings en huisgemaakte sauzen.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Options Form (7 Cols) -->
        <div class="lg:col-span-7 space-y-8">
          
          <!-- Step 1: Base -->
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-tasty-charcoal mb-3 flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-tasty-teal text-white flex items-center justify-center text-[10px]">1</span>
              Kies je Basis
            </h3>
            <div class="grid grid-cols-2 gap-3" id="bowlBases">
              <label class="cursor-pointer p-3.5 rounded-2xl border border-tasty-teal bg-white shadow-xs flex items-center justify-between transition">
                <input type="radio" name="bowl_base" value="Gele Kruidenrijst" data-price="0" checked onchange="updateBowlSummary()" class="hidden">
                <span class="text-xs font-bold text-tasty-charcoal">🍚 Gele Kruidenrijst</span>
                <span class="text-xs text-gray-400">+€0</span>
              </label>
              <label class="cursor-pointer p-3.5 rounded-2xl border border-gray-200 bg-white/70 flex items-center justify-between transition">
                <input type="radio" name="bowl_base" value="Gouden Frites" data-price="0.50" onchange="updateBowlSummary()" class="hidden">
                <span class="text-xs font-bold text-tasty-charcoal">🍟 Gouden Frites</span>
                <span class="text-xs text-tasty-teal font-bold">+€0.50</span>
              </label>
              <label class="cursor-pointer p-3.5 rounded-2xl border border-gray-200 bg-white/70 flex items-center justify-between transition">
                <input type="radio" name="bowl_base" value="Verse Salade Bed" data-price="0" onchange="updateBowlSummary()" class="hidden">
                <span class="text-xs font-bold text-tasty-charcoal">🥗 Verse Salade Bed</span>
                <span class="text-xs text-gray-400">+€0</span>
              </label>
              <label class="cursor-pointer p-3.5 rounded-2xl border border-gray-200 bg-white/70 flex items-center justify-between transition">
                <input type="radio" name="bowl_base" value="Half Rijst / Half Frites" data-price="0.75" onchange="updateBowlSummary()" class="hidden">
                <span class="text-xs font-bold text-tasty-charcoal">🍱 Half Rijst & Half Frites</span>
                <span class="text-xs text-tasty-teal font-bold">+€0.75</span>
              </label>
            </div>
          </div>

          <!-- Step 2: Protein -->
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-tasty-charcoal mb-3 flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-tasty-teal text-white flex items-center justify-center text-[10px]">2</span>
              Kies je Proteïne
            </h3>
            <div class="grid grid-cols-2 gap-3" id="bowlProteins">
              <label class="cursor-pointer p-3.5 rounded-2xl border border-tasty-teal bg-white shadow-xs flex items-center justify-between transition">
                <input type="radio" name="bowl_protein" value="Kip Shoarma" data-price="12.50" checked onchange="updateBowlSummary()" class="hidden">
                <div>
                  <div class="text-xs font-bold text-tasty-charcoal">🍗 Kip Shoarma</div>
                  <div class="text-[10px] text-gray-500">24h gemarineerd</div>
                </div>
                <span class="text-xs font-black text-tasty-teal">€12.50</span>
              </label>
              <label class="cursor-pointer p-3.5 rounded-2xl border border-gray-200 bg-white/70 flex items-center justify-between transition">
                <input type="radio" name="bowl_protein" value="Lams Shoarma" data-price="13.50" onchange="updateBowlSummary()" class="hidden">
                <div>
                  <div class="text-xs font-bold text-tasty-charcoal">🥩 Lams Shoarma</div>
                  <div class="text-[10px] text-gray-500">Langzaam gegaard</div>
                </div>
                <span class="text-xs font-black text-tasty-teal">€13.50</span>
              </label>
              <label class="cursor-pointer p-3.5 rounded-2xl border border-gray-200 bg-white/70 flex items-center justify-between transition">
                <input type="radio" name="bowl_protein" value="Crispy Kip" data-price="13.90" onchange="updateBowlSummary()" class="hidden">
                <div>
                  <div class="text-xs font-bold text-tasty-charcoal">🍗 Crispy Kipreepjes</div>
                  <div class="text-[10px] text-gray-500">Gepaneerd & krokant</div>
                </div>
                <span class="text-xs font-black text-tasty-teal">€13.90</span>
              </label>
              <label class="cursor-pointer p-3.5 rounded-2xl border border-gray-200 bg-white/70 flex items-center justify-between transition">
                <input type="radio" name="bowl_protein" value="Falafel & Halloumi" data-price="11.90" onchange="updateBowlSummary()" class="hidden">
                <div>
                  <div class="text-xs font-bold text-tasty-charcoal">🧀 Halloumi & Falafel</div>
                  <div class="text-[10px] text-emerald-600 font-bold">100% Vegetarisch</div>
                </div>
                <span class="text-xs font-black text-tasty-teal">€11.90</span>
              </label>
            </div>
          </div>

          <!-- Step 3: Toppings -->
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-tasty-charcoal mb-3 flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-tasty-teal text-white flex items-center justify-center text-[10px]">3</span>
              Kies Toppings (Gratis)
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <?php 
              $sampleToppings = ['Roze Raapjes', 'Sumak Uien', 'Komkommer & Tomaat', 'Granaatappelpitjes', 'Geroosterde Aubergine', 'Sesamzaadjes'];
              foreach ($sampleToppings as $idx => $top): ?>
                <label class="cursor-pointer p-2.5 rounded-xl border border-gray-200 bg-white/80 text-xs font-semibold flex items-center gap-2 hover:bg-white transition">
                  <input type="checkbox" name="bowl_toppings[]" value="<?= $top ?>" <?= $idx < 2 ? 'checked' : '' ?> onchange="updateBowlSummary()" class="rounded text-tasty-teal focus:ring-tasty-teal">
                  <span><?= $top ?></span>
                </label>
              <?php endforeach; ?>
            </div>
          </div>

          <!-- Step 4: Sauzen -->
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-tasty-charcoal mb-3 flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-tasty-teal text-white flex items-center justify-center text-[10px]">4</span>
              Huisgemaakte Sauzen
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <?php 
              $sampleSauces = ['Knoflook Toum', 'Mohamara Spread', 'Romige Tahini', 'Pittige Shatta'];
              foreach ($sampleSauces as $idx => $sauce): ?>
                <label class="cursor-pointer p-2.5 rounded-xl border border-gray-200 bg-white/80 text-xs font-semibold flex items-center gap-2 hover:bg-white transition">
                  <input type="checkbox" name="bowl_sauces[]" value="<?= $sauce ?>" <?= $idx === 0 ? 'checked' : '' ?> onchange="updateBowlSummary()" class="rounded text-tasty-teal focus:ring-tasty-teal">
                  <span><?= $sauce ?></span>
                </label>
              <?php endforeach; ?>
            </div>
          </div>

        </div>

        <!-- Summary Preview Box (5 Cols) -->
        <div class="lg:col-span-5 sticky top-24">
          <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 space-y-6">
            <div class="flex items-center justify-between pb-4 border-b border-gray-100">
              <h4 class="font-bold text-lg text-tasty-charcoal">Jouw Custom Bowl</h4>
              <span id="bowlLivePrice" class="text-2xl font-black text-tasty-teal">€12.50</span>
            </div>

            <div class="space-y-3 text-xs text-gray-600">
              <div class="flex items-center justify-between py-1 border-b border-gray-50">
                <span class="text-gray-400">Basis:</span>
                <span id="summaryBase" class="font-bold text-tasty-charcoal">Gele Kruidenrijst</span>
              </div>
              <div class="flex items-center justify-between py-1 border-b border-gray-50">
                <span class="text-gray-400">Proteïne:</span>
                <span id="summaryProtein" class="font-bold text-tasty-charcoal">Kip Shoarma</span>
              </div>
              <div class="py-1 border-b border-gray-50">
                <span class="text-gray-400 block mb-1">Toppings:</span>
                <span id="summaryToppings" class="font-medium text-tasty-charcoal block">Roze Raapjes, Sumak Uien</span>
              </div>
              <div class="py-1">
                <span class="text-gray-400 block mb-1">Sauzen:</span>
                <span id="summarySauces" class="font-medium text-tasty-charcoal block">Knoflook Toum</span>
              </div>
            </div>

            <div class="space-y-2 pt-2">
              <!-- Send Custom Bowl to WhatsApp -->
              <a 
                id="btnBowlWhatsApp" 
                href="#" 
                target="_blank" 
                class="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-lg transition flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.2.662.591 1.221.774 1.394.861.174.086.275.072.376-.044.102-.115.434-.506.549-.679.116-.173.232-.144.39-.087s1.011.477 1.184.564.289.13.332.202c.044.073.044.42-.1 1.225z"/></svg>
                <span>Bestel Bowl via WhatsApp</span>
              </a>

              <!-- Add to Cart -->
              <button 
                onclick="addCustomBowlToCart()" 
                class="w-full py-3 px-4 rounded-xl font-bold text-xs bg-tasty-teal hover:bg-tasty-teal-dark text-white transition flex items-center justify-center gap-2"
              >
                <span>+ Voeg Bowl Toe aan Mandje</span>
              </button>
            </div>
            
          </div>
        </div>

      </div>

    </div>
  </section>

  <!-- ================= ABOUT & STORY ================= -->
  <section id="about" class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-100">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-6 space-y-5">
        <span class="text-xs uppercase font-extrabold tracking-widest text-tasty-teal bg-tasty-teal/10 px-3.5 py-1.5 rounded-full inline-block">
          Over TASTY Hilversum
        </span>
        <h2 class="text-3xl sm:text-4xl font-serif font-bold text-tasty-charcoal leading-tight">
          Ambachtelijke Traditie Ontmoet Moderne Kwaliteit
        </h2>
        <p class="text-gray-600 text-sm leading-relaxed">
          Bij TASTY brengen we het beste van de Levantijnse straatkeuken naar Hilversum. Geen fabrieksvlees of kant-en-klare sauzen: ons vlees wordt dagelijks gemarineerd in geheime kruidenmengsels en onze knoflooksaus (Toum) wordt volgens oud familierecept met pure ingrediënten opgeklopt.
        </p>
        <p class="text-gray-600 text-sm leading-relaxed">
          Ons platbrood en onze Manaqish komen rechtstreeks uit de gloeiend hete oven, krokant aan de rand en heerlijk zacht van binnen.
        </p>
        <div class="flex items-center gap-4 pt-2">
          <div class="flex -space-x-2 overflow-hidden">
            <span class="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-tasty-teal/20 text-tasty-teal flex items-center justify-center font-bold text-xs">⭐ 5.0</span>
          </div>
          <div class="text-xs">
            <div class="font-bold text-tasty-charcoal">Top Beoordeeld in Hilversum</div>
            <div class="text-gray-400">Meer dan 500+ tevreden gasten</div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-6 grid grid-cols-2 gap-4">
        <img src="<?= APP_URL ?>/public/images/shawarma-platter.webp" alt="Arabische Schotel" class="w-full h-64 object-cover rounded-2xl shadow-md">
        <img src="<?= APP_URL ?>/public/images/falafel-hummus-bowl.webp" alt="Falafel Hummus" class="w-full h-64 object-cover rounded-2xl shadow-md mt-6">
      </div>
    </div>
  </section>

  <!-- ================= DELIVERY & CONTACT SECTION ================= -->
  <section id="delivery" class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div class="bg-gradient-to-r from-tasty-teal via-[#4A7F7C] to-tasty-teal rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <div class="lg:col-span-7 space-y-5">
          <span class="inline-flex items-center gap-2 bg-white/15 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide text-white">
            🛵 Dine-In • Takeaway • Bezorging
          </span>
          <h2 class="text-3xl sm:text-5xl font-serif font-bold leading-tight">
            Bestel via WhatsApp, Bel ons, of Kom Gezellig Langs
          </h2>
          <p class="text-white/85 text-sm sm:text-base leading-relaxed">
            Geen ingewikkelde accounts nodig! Stuur ons direct je bestelling via WhatsApp of bel ons keukenteam voor razendsnelle bereiding.
          </p>

          <div class="flex flex-wrap items-center gap-3 pt-2">
            <a href="https://wa.me/<?= $whatsappNumber ?>?text=Hallo%20TASTY!%20Ik%20wil%20graag%20een%20bestelling%20plaatsen." target="_blank" class="px-7 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-2xl text-sm shadow-lg transition flex items-center gap-2">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.2.662.591 1.221.774 1.394.861.174.086.275.072.376-.044.102-.115.434-.506.549-.679.116-.173.232-.144.39-.087s1.011.477 1.184.564.289.13.332.202c.044.073.044.42-.1 1.225z"/></svg>
              <span>Bestel via WhatsApp</span>
            </a>

            <a href="tel:<?= $phoneDisplay ?>" class="px-6 py-3.5 bg-white text-tasty-teal hover:bg-gray-100 font-bold rounded-2xl text-sm shadow-md transition flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              <span><?= $phoneDisplay ?></span>
            </a>
          </div>

          <div class="pt-4 text-xs text-white/80 space-y-1">
            <div>📍 <strong>Locatie:</strong> Hilversum Centrum, Nederland</div>
            <div>⏰ <strong>Openingstijden:</strong> Maandag t/m Zondag: 11:30 - 22:00</div>
          </div>
        </div>

        <div class="lg:col-span-5 flex justify-center">
          <div class="bg-white text-tasty-charcoal p-6 rounded-3xl shadow-2xl text-center space-y-3 max-w-xs w-full">
            <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-center">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://tasty-hilversum.nl&color=2B3A39&bgcolor=FFFDF9" 
                alt="Scan Digitaal Menu QR Code" 
                class="w-36 h-36 object-contain"
              >
            </div>
            <div>
              <h4 class="font-bold text-base text-tasty-charcoal">Scan Digitaal Menu</h4>
              <p class="text-xs text-gray-500">Bekijk de kaart direct op je smartphone</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- ================= FOOTER ================= -->
  <footer class="bg-tasty-charcoal text-white pt-16 pb-12 border-t border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-gray-800">
        
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <img src="<?= APP_URL ?>/public/images/logo.webp" alt="TASTY Logo" class="h-10 w-auto">
            <span class="text-xl font-bold font-serif">TASTY</span>
          </div>
          <p class="text-xs text-gray-400 leading-relaxed">
            Authentic Levantine Street Kitchen in Hilversum. 100% Halal gecertificeerd, dagelijks verse bereiding.
          </p>
        </div>

        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-tasty-teal mb-3">Snelkoppelingen</h4>
          <ul class="space-y-2 text-xs text-gray-400">
            <li><a href="#menu" class="hover:text-white transition">Menu Kaart</a></li>
            <li><a href="#customizer" class="hover:text-white transition">Stel je Bowl samen</a></li>
            <li><a href="#about" class="hover:text-white transition">Over Ons</a></li>
            <li><a href="#delivery" class="hover:text-white transition">Bezorging Hilversum</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-tasty-teal mb-3">Contact & Bestellen</h4>
          <ul class="space-y-2 text-xs text-gray-400">
            <li>Telefoon: <a href="tel:<?= $phoneDisplay ?>" class="text-white hover:underline"><?= $phoneDisplay ?></a></li>
            <li>WhatsApp: <a href="https://wa.me/<?= $whatsappNumber ?>" target="_blank" class="text-emerald-400 hover:underline"><?= $whatsappDisplay ?></a></li>
            <li>Stad: Hilversum, Nederland</li>
          </ul>
        </div>

        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-tasty-teal mb-3">Beheer & Personeel</h4>
          <p class="text-xs text-gray-400 mb-3">Toegang tot het interne kassa- en verkoopsysteem:</p>
          <a href="<?= APP_URL ?>/admin/login.php" class="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-tasty-teal text-white rounded-xl text-xs font-bold transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
            <span>لوحة إدارة المطعم</span>
          </a>
        </div>

      </div>

      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <div>
          © <?= date('Y') ?> TASTY Hilversum. Alle rechten voorbehouden.
        </div>
        <div class="flex items-center gap-4">
          <span class="text-gray-400">Gemaakt met pure passie voor de Levantijnse keuken</span>
        </div>
      </div>
    </div>
  </footer>

  <!-- ================= FLOATING WHATSAPP BUTTON ================= -->
  <div class="fixed bottom-6 right-6 z-50">
    <a 
      href="https://wa.me/<?= $whatsappNumber ?>?text=Hallo%20TASTY!%20Ik%20wil%20graag%20een%20bestelling%20plaatsen." 
      target="_blank" 
      class="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-3.5 rounded-full shadow-2xl transition transform hover:scale-105 active:scale-95 group"
      title="Direct bestellen via WhatsApp"
    >
      <span class="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
      <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.2.662.591 1.221.774 1.394.861.174.086.275.072.376-.044.102-.115.434-.506.549-.679.116-.173.232-.144.39-.087s1.011.477 1.184.564.289.13.332.202c.044.073.044.42-.1 1.225z"/></svg>
      <span class="font-bold text-sm hidden sm:inline">WhatsApp Bestellen</span>
    </a>
  </div>

  <!-- ================= CART SLIDE-OVER DRAWER ================= -->
  <div id="cartDrawerBackdrop" onclick="closeCartDrawer()" class="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 opacity-0 pointer-events-none transition-opacity duration-300"></div>
  <aside id="cartDrawer" class="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl transform translate-x-full transition-transform duration-300 flex flex-col justify-between">
    
    <!-- Drawer Header -->
    <div class="p-5 border-b border-gray-100 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-tasty-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        <h3 class="font-bold text-base text-tasty-charcoal">Jouw Winkelmandje</h3>
      </div>
      <button onclick="closeCartDrawer()" class="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>

    <!-- Items List -->
    <div id="cartItemsList" class="p-5 flex-1 overflow-y-auto space-y-4">
      <!-- Populated dynamically via JS -->
      <div class="text-center py-12 text-gray-400 text-sm">
        Je winkelmandje is nog leeg.
      </div>
    </div>

    <!-- Drawer Footer -->
    <div class="p-5 border-t border-gray-100 space-y-4 bg-gray-50/50">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-500 font-medium">Totaalbedrag:</span>
        <span id="cartTotalPrice" class="text-xl font-black text-tasty-charcoal">€0.00</span>
      </div>

      <button 
        onclick="checkoutWhatsApp()" 
        id="btnCartCheckout" 
        disabled 
        class="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.2.662.591 1.221.774 1.394.861.174.086.275.072.376-.044.102-.115.434-.506.549-.679.116-.173.232-.144.39-.087s1.011.477 1.184.564.289.13.332.202c.044.073.044.42-.1 1.225z"/></svg>
        <span>Bestelling Versturen via WhatsApp</span>
      </button>

      <p class="text-[11px] text-center text-gray-400">
        Je bestelling wordt direct doorgestuurd naar de kassa van TASTY Hilversum.
      </p>
    </div>

  </aside>

  <!-- ================= JAVASCRIPT LOGIC ================= -->
  <script>
    const RESTAURANT_WHATSAPP_NUMBER = '<?= $whatsappNumber ?>';

    // 1. Hero Dish Switcher
    const heroDishes = {
      wrap: {
        title: 'Kip Shoarma Durum Wrap',
        subtitle: '24-uur gemarineerd • Huisgemaakte Toum',
        price: '€8.00',
        image: '<?= APP_URL ?>/public/images/shawarma-wrap.webp'
      },
      bowl: {
        title: 'Tasty Shish Taouk Rice Bowl',
        subtitle: 'Op houtskool gegrilde spiesjes • Gele Rijst',
        price: '€12.00',
        image: '<?= APP_URL ?>/public/images/chicken-skewers-bowl.webp'
      },
      manaqish: {
        title: 'Manaqish Kaas Steenoven',
        subtitle: 'Vers gebakken deeg • Gesmolten Kaas • Olijfolie',
        price: '€3.00',
        image: '<?= APP_URL ?>/public/images/manaqish.webp'
      }
    };

    function switchHeroDish(key) {
      const d = heroDishes[key];
      if (!d) return;
      document.getElementById('heroImage').src = d.image;
      document.getElementById('heroTitle').textContent = d.title;
      document.getElementById('heroSubtitle').textContent = d.subtitle;
      document.getElementById('heroPrice').textContent = d.price;
    }

    // 2. Menu Category Filter
    function filterMenu(categoryId) {
      // Toggle category button styles
      document.querySelectorAll('.cat-filter-btn').forEach(btn => {
        btn.classList.remove('bg-tasty-teal', 'text-white', 'shadow-md', 'shadow-tasty-teal/20');
        btn.classList.add('bg-gray-100', 'text-gray-700');
      });
      const activeBtn = document.getElementById('btn-cat-' + categoryId);
      if (activeBtn) {
        activeBtn.classList.remove('bg-gray-100', 'text-gray-700');
        activeBtn.classList.add('bg-tasty-teal', 'text-white', 'shadow-md', 'shadow-tasty-teal/20');
      }

      // Filter cards
      document.querySelectorAll('.menu-item-card').forEach(card => {
        if (categoryId === 'all' || card.getAttribute('data-category') === categoryId) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    // 3. Interactive Bowl Builder Logic
    function getSelectedBowlOptions() {
      const baseRadio = document.querySelector('input[name="bowl_base"]:checked');
      const proteinRadio = document.querySelector('input[name="bowl_protein"]:checked');
      
      const baseName = baseRadio ? baseRadio.value : 'Gele Kruidenrijst';
      const basePrice = baseRadio ? parseFloat(baseRadio.getAttribute('data-price')) : 0;

      const proteinName = proteinRadio ? proteinRadio.value : 'Kip Shoarma';
      const proteinPrice = proteinRadio ? parseFloat(proteinRadio.getAttribute('data-price')) : 12.50;

      const toppings = [];
      document.querySelectorAll('input[name="bowl_toppings[]"]:checked').forEach(cb => {
        toppings.push(cb.value);
      });

      const sauces = [];
      document.querySelectorAll('input[name="bowl_sauces[]"]:checked').forEach(cb => {
        sauces.push(cb.value);
      });

      const totalPrice = proteinPrice + basePrice;

      return {
        base: baseName,
        protein: proteinName,
        toppings: toppings,
        sauces: sauces,
        totalPrice: totalPrice
      };
    }

    function updateBowlSummary() {
      const opt = getSelectedBowlOptions();
      document.getElementById('summaryBase').textContent = opt.base;
      document.getElementById('summaryProtein').textContent = opt.protein;
      document.getElementById('summaryToppings').textContent = opt.toppings.length > 0 ? opt.toppings.join(', ') : 'Geen';
      document.getElementById('summarySauces').textContent = opt.sauces.length > 0 ? opt.sauces.join(', ') : 'Geen';
      document.getElementById('bowlLivePrice').textContent = '€' + opt.totalPrice.toFixed(2);

      // Update WhatsApp 1-Click Link
      const msg = `Hallo TASTY! 👋\nIk wil graag een Custom Levantine Bowl bestellen:\n\n🥗 Samenstelling:\n• Basis: ${opt.base}\n• Proteïne: ${opt.protein}\n• Toppings: ${opt.toppings.join(', ') || 'Geen'}\n• Sauzen: ${opt.sauces.join(', ') || 'Geen'}\n\n💰 Totaalprijs: €${opt.totalPrice.toFixed(2)}\n🛵 Bezorging / Afhalen graag!\n📍 Adres: `;
      document.getElementById('btnBowlWhatsApp').href = `https://wa.me/${RESTAURANT_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    }
    updateBowlSummary();

    function addCustomBowlToCart() {
      const opt = getSelectedBowlOptions();
      const bowlTitle = `Custom Bowl (${opt.protein} + ${opt.base})`;
      addToCart('custom-bowl-' + Date.now(), bowlTitle, opt.totalPrice, '<?= APP_URL ?>/public/images/crispy-chicken-bowl.webp');
      openCartDrawer();
    }

    // 4. Cart State Management
    let cart = [];

    function addToCart(id, name, price, image) {
      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ id, name, price, image, quantity: 1 });
      }
      renderCart();
    }

    function updateQuantity(id, change) {
      const item = cart.find(item => item.id === id);
      if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
          cart = cart.filter(i => i.id !== id);
        }
      }
      renderCart();
    }

    function renderCart() {
      const countBadge = document.getElementById('cartCountBadge');
      const itemsList = document.getElementById('cartItemsList');
      const totalPriceEl = document.getElementById('cartTotalPrice');
      const checkoutBtn = document.getElementById('btnCartCheckout');

      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      countBadge.textContent = totalItems;

      if (cart.length === 0) {
        itemsList.innerHTML = `<div class="text-center py-12 text-gray-400 text-sm">Je winkelmandje is nog leeg.</div>`;
        totalPriceEl.textContent = '€0.00';
        checkoutBtn.disabled = true;
        return;
      }

      checkoutBtn.disabled = false;
      let totalSum = 0;
      let html = '';

      cart.forEach(item => {
        const itemSum = item.price * item.quantity;
        totalSum += itemSum;

        html += `
          <div class="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <img src="${item.image}" alt="${item.name}" class="w-12 h-12 rounded-xl object-cover">
            <div class="flex-1 min-w-0">
              <h5 class="text-xs font-bold text-tasty-charcoal truncate">${item.name}</h5>
              <div class="text-xs font-black text-tasty-teal">€${item.price.toFixed(2)}</div>
            </div>
            <div class="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-gray-200">
              <button onclick="updateQuantity('${item.id}', -1)" class="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-600 hover:text-rose-600">-</button>
              <span class="text-xs font-bold w-4 text-center">${item.quantity}</span>
              <button onclick="updateQuantity('${item.id}', 1)" class="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-600 hover:text-emerald-600">+</button>
            </div>
          </div>
        `;
      });

      itemsList.innerHTML = html;
      totalPriceEl.textContent = '€' + totalSum.toFixed(2);
    }

    function openCartDrawer() {
      document.getElementById('cartDrawerBackdrop').classList.remove('opacity-0', 'pointer-events-none');
      document.getElementById('cartDrawer').classList.remove('translate-x-full');
    }

    function closeCartDrawer() {
      document.getElementById('cartDrawerBackdrop').classList.add('opacity-0', 'pointer-events-none');
      document.getElementById('cartDrawer').classList.add('translate-x-full');
    }

    function checkoutWhatsApp() {
      if (cart.length === 0) return;

      let msg = "Hallo TASTY Hilversum! 👋\nIk wil graag de volgende bestelling plaatsen:\n\n";
      let total = 0;

      cart.forEach((item, idx) => {
        const itemSubtotal = item.price * item.quantity;
        total += itemSubtotal;
        msg += `${idx + 1}. ${item.quantity}x ${item.name} — €${itemSubtotal.toFixed(2)}\n`;
      });

      msg += `\n💰 Totaalbedrag: €${total.toFixed(2)}\n`;
      msg += `🛵 Bezorging / Afhalen graag!\n`;
      msg += `📍 Mijn adres / Opmerkingen:\n`;

      const url = `https://wa.me/${RESTAURANT_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    }
  </script>

</body>
</html>

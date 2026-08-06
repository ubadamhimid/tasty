# Nuwa Content Engine - Frontend

مشروع Vue 3 مع RTL support لمصنع محتوى وجدولة نشر على وسائل التواصل الاجتماعي.

## 🚀 المميزات

- ✅ **Vue 3 + TypeScript** - أحدث تقنيات Vue مع دعم كامل لـ TypeScript
- ✅ **Vite** - بناء سريع وHMR فائق السرعة
- ✅ **TailwindCSS** - تصميم حديث وقابل للتخصيص
- ✅ **RTL Support** - دعم كامل للغة العربية مع direction RTL
- ✅ **Vue Router** - نظام routing متقدم مع Authentication Guards
- ✅ **Pinia** - إدارة state حديثة وسهلة
- ✅ **Dark Theme** - تصميم داكن احترافي
- ✅ **خطوط عربية** - Cairo & Tajawal من Google Fonts
- ✅ **Component Library** - مكتبة components قابلة لإعادة الاستخدام

## 📁 هيكل المشروع

```
apps/web/
├── src/
│   ├── components/        # المكونات
│   │   ├── base/         # مكونات أساسية
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseInput.vue
│   │   │   ├── BaseSelect.vue
│   │   │   ├── BaseCard.vue
│   │   │   ├── BaseModal.vue
│   │   │   └── BaseToast.vue
│   │   └── layout/       # مكونات Layout
│   │       ├── Sidebar.vue
│   │       └── Topbar.vue
│   │
│   ├── views/            # الصفحات
│   │   ├── LoginView.vue
│   │   ├── DashboardView.vue
│   │   ├── BrandsView.vue
│   │   ├── GeneratorView.vue
│   │   ├── PlannerView.vue
│   │   ├── LibraryView.vue
│   │   ├── IntegrationsView.vue
│   │   └── SettingsView.vue
│   │
│   ├── layouts/          # Layouts
│   │   ├── DashboardLayout.vue
│   │   └── AuthLayout.vue
│   │
│   ├── stores/           # Pinia Stores
│   │   ├── auth.ts
│   │   ├── brand.ts
│   │   └── content.ts
│   │
│   ├── router/           # Vue Router
│   │   └── index.ts
│   │
│   ├── composables/      # Composables
│   │   └── useToast.ts
│   │
│   ├── services/         # API Services (جاهزة للربط)
│   │
│   ├── utils/            # أدوات مساعدة
│   │   └── api.ts
│   │
│   ├── types/            # TypeScript Types
│   │   └── index.ts
│   │
│   ├── App.vue
│   ├── main.ts
│   └── style.css
│
├── .env                  # متغيرات البيئة
├── tailwind.config.js    # إعدادات Tailwind
├── vite.config.ts        # إعدادات Vite
├── tsconfig.json         # إعدادات TypeScript
└── package.json
```

## 🛠️ التثبيت والتشغيل

### المتطلبات الأساسية

- Node.js >= 18
- npm أو yarn

### خطوات التثبيت

```bash
# الانتقال إلى مجلد المشروع
cd apps/web

# تثبيت المكتبات
npm install

# تشغيل السيرفر التطويري
npm run dev

# فتح المتصفح على
# http://localhost:5173
```

### أوامر البناء

```bash
# بناء الإنتاج
npm run build

# معاينة البناء
npm run preview

# فحص الأكواد
npm run lint
```

## 🎨 الصفحات المتوفرة

| الصفحة            | المسار          | الوصف                            |
| ----------------- | --------------- | -------------------------------- |
| تسجيل الدخول      | `/login`        | صفحة تسجيل الدخول (mock)         |
| لوحة التحكم       | `/`             | Dashboard مع KPIs والنشاط الأخير |
| العلامات التجارية | `/brands`       | إدارة العلامات التجارية          |
| المولّد           | `/generator`    | توليد أفكار ونصوص وprompts       |
| المخطط            | `/planner`      | جدولة المنشورات                  |
| المكتبة           | `/library`      | جميع المحتويات                   |
| التكاملات         | `/integrations` | ربط حسابات Social Media          |
| الإعدادات         | `/settings`     | إعدادات الحساب                   |

## 🔐 المصادقة (Mock)

حالياً المشروع يستخدم بيانات mock للمصادقة:

- يمكنك استخدام **أي بريد إلكتروني** و**أي كلمة مرور** لتسجيل الدخول
- البيانات تُحفظ في localStorage
- جاهز للربط مع Backend API

## 📊 State Management (Pinia)

### authStore

- إدارة المستخدم وتسجيل الدخول/الخروج
- حفظ الجلسة في localStorage

### brandStore

- إدارة العلامات التجارية
- اختيار العلامة النشطة
- CRUD operations

### contentStore

- إدارة المحتوى (drafts, scheduled, posted)
- تصفية حسب الحالة والمنصة
- جدولة المنشورات

## 🎯 Base Components

### BaseButton

```vue
<BaseButton variant="primary" size="md" :loading="false">
  النص
</BaseButton>
```

### BaseInput

```vue
<BaseInput
  v-model="value"
  type="text"
  label="التسمية"
  placeholder="..."
  :error="errorMessage"
/>
```

### BaseSelect

```vue
<BaseSelect v-model="selected" :options="options" label="التسمية" />
```

### BaseCard

```vue
<BaseCard title="العنوان" hoverable>
  المحتوى
</BaseCard>
```

### BaseModal

```vue
<BaseModal v-model="showModal" title="العنوان" size="lg">
  المحتوى
  <template #footer>
    <!-- أزرار -->
  </template>
</BaseModal>
```

### Toast Notifications

```typescript
import { useToast } from "@/composables/useToast";

const toast = useToast();
toast.success("تم بنجاح!");
toast.error("حدث خطأ");
toast.warning("تحذير");
toast.info("معلومة");
```

## 🔌 API Integration

الملفات جاهزة للربط مع Backend:

```typescript
// src/utils/api.ts
// Axios instance مع interceptors للـ token

// src/services/*.service.ts
// Endpoints placeholders جاهزة
```

### مثال على استخدام API:

```typescript
import api from "@/utils/api";

// GET request
const response = await api.get("/brands");

// POST request
const result = await api.post("/generate/ideas", data);
```

## 🌍 متغيرات البيئة (.env)

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Nuwa Content Engine
```

## 🎨 Tailwind Configuration

### الألوان المخصصة

- `primary` - البنفسجي الأزرق
- `secondary` - الوردي
- `accent` - الفيروزي
- `dark` - درجات الرمادي الداكن

### RTL Support

- جميع الـ spacing يستخدم logical properties
- Direction: rtl تلقائياً
- Utilities مخصصة للـ RTL

## 📝 ملاحظات مهمة

1. **Mock Data**: جميع البيانات حالياً mock - جاهزة للربط بـ API
2. **Authentication**: تسجيل الدخول mock (أي email/password يعمل)
3. **Dark Mode Only**: حالياً فقط Dark theme (يمكن إضافة Light لاحقاً)
4. **RTL**: كل النصوص بالعربي والـ layout RTL
5. **Type Safety**: TypeScript في كل مكان

## 🚧 TODO / تحسينات مستقبلية

- [ ] ربط Backend API الحقيقي
- [ ] إضافة Light Mode
- [ ] تحسين responsive للموبايل
- [ ] إضافة testing (Vitest)
- [ ] إضافة E2E testing
- [ ] تحسين SEO
- [ ] إضافة PWA support
- [ ] إضافة Calendar view للمخطط
- [ ] Drag & drop للمنشورات المجدولة

## 📄 License

MIT

## 👨‍💻 المطور

تم بناؤه بـ ❤️ للغة العربية

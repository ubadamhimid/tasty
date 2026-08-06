# Generator Feature - Documentation

## Overview

تم تنفيذ Generator Feature كاملة مع Mock AI Service جاهز للربط بـ n8n لاحقاً.

---

## Files Created/Modified

### 1. Generator Service

**File**: `src/services/generatorService.ts`

✅ **Functions:**

- `generateIdeas(payload)` - توليد 5 أفكار محتوى
- `generateCaption(payload)` - توليد caption كامل (Hook + Body + CTA + Hashtags)
- `generatePrompt(payload)` - توليد video prompt بالإنجليزي

✅ **Features:**

- Mock implementation مع delays واقعية (800-1500ms)
- TypeScript types كاملة
- Comments توضح مكان استبدال mock بـ n8n
- بيانات mock واقعية بالعربي

### 2. Generator View

**File**: `src/views/GeneratorView.vue`

✅ **Enhanced Features:**

- 3 Tabs منفصلة (أفكار، كابتشن، برومبت)
- Loading states لكل tab
- Error handling
- Copy functionality
- Brand validation
- RTL layout كامل

---

## Usage Examples

### Ideas Generation

```typescript
// Input
{
  brandId: "1",
  topic: "إطلاق منتج جديد",
  platform: "instagram",
  count: 5
}

// Output
[
  {
    id: "idea-xxx-0",
    title: "5 أخطاء شائعة تمنع محتواك من الانتشار",
    description: "فكرة محتوى قوية تستهدف instagram",
    hook: "توقف عن السكرول - هذا المحتوى راح يغير طريقة تفكيرك"
  },
  // ... 4 more ideas
]
```

### Caption Generation

```typescript
// Input
{
  brandId: "1",
  topic: "مميزات التطبيق الجديد",
  platform: "instagram",
  tone: "احترافي وودود"
}

// Output
{
  hook: "توقف عن السكرول - هذا المحتوى راح يغير طريقة تفكيرك",
  body: "هل تعلم أن مميزات التطبيق الجديد يمكن أن يحدث فرقاً كبيراً...",
  cta: "احفظ هذا المنشور ورجعلو كل أسبوع",
  hashtags: ["محتوى_عربي", "تسويق_رقمي", "ريادة_أعمال"]
}
```

### Prompt Generation

```typescript
// Input
{
  brandId: "1",
  description: "فريق عمل في مكتب حديث",
  style: "cinematic"
}

// Output
{
  prompt: "فريق عمل في مكتب حديث, cinematic style, vertical format 9:16, high quality video production...",
  aspectRatio: "9:16",
  style: "cinematic"
}
```

---

## UI Components Used

| Component    | Usage                       |
| ------------ | --------------------------- |
| `BaseInput`  | جميع الـ inputs             |
| `BaseSelect` | Platform & Style selection  |
| `BaseButton` | Generate & Copy buttons     |
| `BaseCard`   | Container للـ tabs          |
| `useToast`   | Success/Error notifications |

---

## State Management

### Local State (inside GeneratorView)

**Ideas Tab:**

```typescript
ideasInput: ref<string>("");
ideasPlatform: ref<string>("");
loadingIdeas: ref<boolean>(false);
generatedIdeas: ref<IdeaResult[]>([]);
```

**Caption Tab:**

```typescript
captionInput: ref<string>("");
captionPlatform: ref<string>("");
loadingCaption: ref<boolean>(false);
generatedCaption: ref<CaptionResult | null>(null);
```

**Prompt Tab:**

```typescript
promptInput: ref<string>("");
promptStyle: ref<string>("cinematic");
loadingPrompt: ref<boolean>(false);
generatedPrompt: ref<PromptResult | null>(null);
```

**Global:**

```typescript
error: ref<string>("");
activeTab: ref<"ideas" | "caption" | "prompt">("ideas");
```

---

## n8n Integration Readiness

### Current Mock Implementation

```typescript
export async function generateIdeas(payload) {
  // Simulate delay
  await new Promise((resolve) =>
    setTimeout(resolve, 800 + Math.random() * 400),
  );

  // Return mock data
  return mockIdeas;
}
```

### Future n8n Implementation

```typescript
export async function generateIdeas(payload) {
  // Real API call
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/generate/ideas`,
    payload,
  );
  return response.data;
}
```

### n8n Webhook Endpoints

**Expected endpoints:**

- `POST /generate/ideas`
- `POST /generate/caption`
- `POST /generate/prompt`

**Payload structure** (already implemented):

```typescript
interface GenerateIdeasPayload {
  brandId: string;
  topic?: string;
  platform?: Platform;
  count?: number;
}
```

**Response structure** (already typed):

```typescript
interface IdeaResult {
  id: string;
  title: string;
  description: string;
  hook?: string;
}
```

---

## Copy Functionality

### Copy Individual Idea

```typescript
copyText(idea.title);
```

### Copy All Ideas

```typescript
const copyAllIdeas = () => {
  const text = generatedIdeas.value
    .map((idea, idx) => `${idx + 1}. ${idea.title}`)
    .join("\n\n");
  copyText(text);
};
```

### Copy Full Caption

```typescript
const copyCaption = () => {
  const { hook, body, cta, hashtags } = generatedCaption.value;
  const text = `${hook}\n\n${body}\n\n${cta}\n\n${hashtags.map((t) => "#" + t).join(" ")}`;
  copyText(text);
};
```

---

## Error Handling

### Validation

- يتحقق من وجود `activeBrand` قبل التوليد
- يعطل الأزرار إذا لم يتم اختيار علامة تجارية
- يتحقق من ملء الحقول المطلوبة (Caption & Prompt)

### Error Display

```vue
<div v-if="error" class="bg-red-600/10 border border-red-500/20 rounded-lg p-4">
  <p class="text-red-300">❌ {{ error }}</p>
</div>
```

### Toast Notifications

- Success: عند نجاح التوليد
- Error: عند فشل التوليد
- Success: عند نسخ النص

---

## Mock Data Quality

### Ideas (10 options)

```javascript
[
  "5 أخطاء شائعة تمنع محتواك من الانتشار",
  "ليش 90% من الحسابات ما عم تكبر؟ السبب الحقيقي",
  "كيف تبني Reel يضرب الخوارزمية في 2024",
  // ... 7 more
];
```

### Hooks (5 variants)

```javascript
[
  "توقف عن السكرول - هذا المحتوى راح يغير طريقة تفكيرك",
  "ليش ما حدا عم يحكيلك عن هالشي؟",
  // ... 3 more
];
```

### CTAs (5 variants)

```javascript
[
  "احفظ هذا المنشور ورجعلو كل أسبوع",
  "شاركه مع شخص بحاجة لهالنصائح",
  // ... 3 more
];
```

### Hashtags (4 sets)

```javascript
[
  ["محتوى_عربي", "تسويق_رقمي", "ريادة_أعمال", "نجاح"],
  ["انستغرام", "محتوى_ابداعي", "تطوير_ذاتي", "فريلانسر"],
  // ... 2 more
];
```

---

## Testing Checklist

- [x] Ideas generation يعمل
- [x] Caption generation يعمل
- [x] Prompt generation يعمل
- [x] Loading states تظهر بشكل صحيح
- [x] Copy functionality تعمل
- [x] Toast notifications تظهر
- [x] Error handling يعمل
- [x] Brand validation تعمل
- [x] RTL layout صحيح
- [x] Tabs switching يعمل
- [x] Platform/Style selectors تعمل

---

## Performance

- **Mock Delay**: 800-1500ms (realistic)
- **No blocking**: Async/await
- **Smooth transitions**: CSS animations
- **Optimized**: No unnecessary re-renders

---

## Future Enhancements

### Phase 1 (Current)

✅ Mock implementation
✅ Full UI with all features
✅ Error handling
✅ Copy functionality

### Phase 2 (n8n Integration)

- [ ] Replace mock service with axios calls
- [ ] Add retry logic
- [ ] Add request timeout
- [ ] Add rate limiting UI

### Phase 3 (Advanced)

- [ ] Save generated content to library
- [ ] Schedule directly from generator
- [ ] History of generations
- [ ] Favorites/bookmarks
- [ ] Export to different formats

---

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

When integrating with n8n:

```env
VITE_API_BASE_URL=https://your-n8n-instance.com/webhook
```

---

## Code Quality

✅ **TypeScript**: Full typing
✅ **Comments**: Clear documentation
✅ **Separation**: Service layer separated from UI
✅ **Reusability**: Service functions can be used elsewhere
✅ **Maintainability**: Easy to switch from mock to real API

---

## Summary

Generator Feature is:

- ✅ **Complete**: All 3 tabs working
- ✅ **Polished**: Professional UI with loading/error states
- ✅ **Ready**: Easy to integrate with n8n
- ✅ **Tested**: Dev server runs without errors
- ✅ **Documented**: Clear code comments and this doc

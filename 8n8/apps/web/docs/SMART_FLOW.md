# Smart Flow - Generator Feature

## Overview

تم تطبيق Smart Flow في Generator لربط الخطوات ببعضها تلقائياً من الفكرة → النص → Prompt → المكتبة.

---

## Flow Diagram

```
[أفكار] → انقر على فكرة
    ↓
[تحديد الفكرة] → حفظ في store
    ↓
[انتقال تلقائي] → Caption tab
    ↓
[توليد تلقائي] → generateCaption(idea, tone, platform)
    ↓
[عرض النص] → Hook + Body + Hashtags
    ↓
[زر "توليد برومبت"] → انقر
    ↓
[انتقال تلقائي] → Prompt tab
    ↓
[توليد Prompt] → generatePrompt(idea + caption)
    ↓
[عرض Prompt] → English prompt + style
    ↓
[زر "حفظ في المكتبة"] → انقر
    ↓
[إنشاء Draft] → contentStore.saveDraftFromGenerator()
    ↓
[حفظ] → title + body + hashtags + status=draft
    ↓
[Toast نجاح] → "تم الحفظ"
    ↓
[إعادة تعيين + رجوع] → Ideas tab
```

---

## Implementation Details

### 1. Content Store Updates

**File**: `src/stores/content.ts`

#### New State

```typescript
selectedIdea: ref<string | null>(null);
generatedCaption: ref<string | null>(null);
generatedHashtags: ref<string[]>([]);
generatedPrompt: ref<string | null>(null);
```

#### New Actions

```typescript
setSelectedIdea(idea: string)
setGeneratedCaption(caption: string, hashtags: string[])
setGeneratedPrompt(prompt: string)
resetGeneratorFlow()
saveDraftFromGenerator() // Creates draft from flow data
```

---

### 2. Generator View Updates

**File**: `src/views/GeneratorView.vue`

#### Smart Flow Features

**في Ideas Tab:**

- ✅ Click على فكرة يحفظها في `contentStore.selectedIdea`
- ✅ Border highlight للفكرة المحددة (primary-500)
- ✅ Checkmark + رسالة "انتقل لتاب كابتشن"
- ✅ Auto-switch إلى Caption tab
- ✅ Auto-generate caption

**في Caption Tab:**

- ✅ عرض الفكرة المحددة في card مميز
- ✅ عرض Caption + Hashtags المولّد
- ✅ زر "توليد برومبت فيديو" جديد
- ✅ Loading state أثناء التوليد
- ✅ Auto-switch إلى Prompt tab

**في Prompt Tab:**

- ✅ عرض الفكرة + Caption في cards
- ✅ عرض Prompt المولّد
- ✅ زر "حفظ في المكتبة" (success variant)
- ✅ Loading state للحفظ
- ✅ Toast نجاح + Reset + رجوع لـ Ideas

---

### 3. Visual Indicators

#### Flow Progress Bar

```vue
<div v-if="contentStore.selectedIdea" class="bg-primary-600/10">
  <p>جاري العمل على: {{ contentStore.selectedIdea }}</p>
  <button @click="resetFlow">إعادة تعيين</button>
</div>
```

#### Selected Idea Card

```vue
<div class="p-4 bg-primary-600/10 border border-primary-500/20">
  <p class="text-xs text-primary-300">الفكرة المحددة</p>
  <p class="text-white font-medium">{{ contentStore.selectedIdea }}</p>
</div>
```

#### Idea Click Handler

```typescript
const handleSelectIdea = async (idea: string) => {
  contentStore.setSelectedIdea(idea);
  activeTab.value = "caption";

  // Auto-generate caption
  const result = await generateCaption({
    brandId: brandStore.activeBrand.id,
    topic: idea,
    tone: brandStore.activeBrand.tone,
  });

  contentStore.setGeneratedCaption(result.body, result.hashtags);
  toast.success("تم توليد النص بنجاح");
};
```

---

## User Journey

### Scenario: إنشاء محتوى كامل من فكرة

1. **المستخدم يذهب لتاب "أفكار"**
   - يدخل موضوع (اختياري)
   - يضغط "توليد أفكار"
   - يظهر 5 أفكار

2. **المستخدم ينقر على فكرة**
   - الفكرة تتحدد (border primary)
   - ظهور رسالة "محدد - انتقل لتاب كابتشن"
   - **تلقائياً**: الانتقال لتاب Caption
   - **تلقائياً**: توليد النص
   - Loading spinner
   - عرض النص + Hashtags

3. **المستخدم في Caption tab**
   - يرى النص المولّد
   - ينقر "توليد برومبت فيديو"
   - **تلقائياً**: الانتقال لتاب Prompt
   - **تلقائياً**: توليد Prompt
   - عرض Prompt بالإنجليزي

4. **المستخدم في Prompt tab**
   - يرى الفكرة + النص + Prompt
   - ينقر "حفظ في المكتبة"
   - Loading على الزر
   - **Draft يُحفظ في contentStore**
   - Toast: "تم حفظ المحتوى بنجاح"
   - Reset تلقائي
   - رجوع لتاب Ideas

5. **المستخدم يذهب للمكتبة**
   - يجد Draft جديد
   - Title = الفكرة
   - Body = النص + Hashtags
   - Status = Draft

---

## Copy Functionality

### Copy في Ideas

```typescript
// Copy واحدة
copyText(idea.title);

// Copy الكل
const text = generatedIdeas.value
  .map((idea, idx) => `${idx + 1}. ${idea.title}`)
  .join("\n\n");
copyText(text);
```

### Copy في Caption

```typescript
const text = `${contentStore.generatedCaption}\n\n${contentStore.generatedHashtags.map((t) => "#" + t).join(" ")}`;
copyText(text);
```

### Copy في Prompt

```typescript
copyText(contentStore.generatedPrompt);
```

---

## Loading States

| Tab     | Loading Variable | Trigger                                       |
| ------- | ---------------- | --------------------------------------------- |
| Ideas   | `loadingIdeas`   | Generate ideas button                         |
| Caption | `loadingCaption` | Auto-generate from idea OR manual generate    |
| Prompt  | `loadingPrompt`  | Auto-generate from caption OR manual generate |
| Save    | `savingDraft`    | Save to library button                        |

---

## Error Handling

### Validation

```typescript
// Check brand
if (!brandStore.activeBrand) {
  // Disable buttons + show warning
}

// Check flow data
if (!contentStore.selectedIdea || !contentStore.generatedCaption) {
  throw new Error("Missing required data");
}
```

### Error Display

```vue
<div v-if="error" class="bg-red-600/10">
  <p class="text-red-300">❌ {{ error }}</p>
</div>
```

### Toast Notifications

- ✅ Success: "تم توليد الأفكار/النص/Prompt"
- ✅ Success: "تم حفظ المحتوى في المكتبة"
- ✅ Error: "فشل التوليد/الحفظ"
- ℹ️ Info: "تم إعادة تعيين العملية"

---

## Manual vs Auto Mode

### Manual Mode (بدون flow)

- المستخدم يمكنه استخدام أي tab بشكل مستقل
- Caption tab: يدخل موضوع يدوياً
- Prompt tab: يدخل وصف يدوياً

### Auto Mode (مع flow)

- عند تحديد فكرة، يبدأ الـ flow
- Caption يتولد تلقائياً
- Prompt يتولد من الفكرة + Caption
- Save يحفظ كل البيانات

---

## State Persistence

### Flow State في Store

```typescript
// Current flow data
selectedIdea: string | null
generatedCaption: string | null
generatedHashtags: string[]
generatedPrompt: string | null
```

### Reset

```typescript
resetGeneratorFlow() {
  selectedIdea.value = null
  generatedCaption.value = null
  generatedHashtags.value = []
  generatedPrompt.value = null
}
```

Called when:

- User clicks "إعادة تعيين"
- After saving to library
- Manually via button

---

## Draft Creation

### Data Structure

```typescript
{
  title: selectedIdea,                    // الفكرة
  body: caption + '\n\n' + hashtags,      // النص + الهاشتاغات
  platform: 'instagram',                   // افتراضي
  status: 'draft',
  brand_id: activeBrand.id,
  created_at: new Date(),
  updated_at: new Date(),
}
```

### Save Flow

```typescript
const saveDraftFromGenerator = async () => {
  // Validation
  if (!selectedIdea || !generatedCaption) {
    throw new Error("Missing required data");
  }

  // Create draft
  const draft = await addContent(draftData);

  // Reset
  resetGeneratorFlow();

  return draft;
};
```

---

## UI/UX Enhancements

### Visual Feedback

- ✅ Border highlight على الفكرة المحددة
- ✅ Checkmark icon عند التحديد
- ✅ Progress indicator في أعلى الصفحة
- ✅ Color-coded cards (primary, green, accent)
- ✅ Loading spinners
- ✅ Smooth transitions

### Buttons

- ✅ "توليد أفكار" - Primary
- ✅ "توليد برومبت فيديو" - Primary
- ✅ "حفظ في المكتبة" - Success (green)
- ✅ "إعادة تعيين" - Ghost
- ✅ "نسخ" - Ghost

### Disabled States

- Buttons disabled عند:
  - No active brand
  - Missing required fields
  - Loading

---

## Testing Checklist

- [x] Click idea → auto-generates caption
- [x] Caption → click button → auto-generates prompt
- [x] Prompt → click save → creates draft
- [x] Draft appears in library
- [x] Reset button works
- [x] Copy buttons work
- [x] Loading states show correctly
- [x] Error handling works
- [x] Toast notifications appear
- [x] Manual mode still works
- [x] RTL layout correct
- [x] All buttons styled properly

---

## Performance

- **Delays realistic**: 800-1500ms
- **No blocking**: All async
- **State updates smooth**: Reactive
- **Transitions**: CSS animations

---

## Future Enhancements

### Phase 1 (Current)

✅ Smart Flow implemented
✅ Auto-generation
✅ Save to library
✅ Visual feedback

### Phase 2

- [ ] Edit caption before generating prompt
- [ ] Select platform before generating caption
- [ ] Preview before saving
- [ ] Schedule from generator

### Phase 3

- [ ] A/B testing multiple captions
- [ ] Save prompt with draft
- [ ] Generate image along with prompt
- [ ] Multi-platform support

---

## Summary

Smart Flow is:

- ✅ **Complete**: Idea → Caption → Prompt → Library
- ✅ **Automatic**: Minimal clicks required
- ✅ **Flexible**: Manual mode still available
- ✅ **Visual**: Clear progress indicators
- ✅ **User-friendly**: Smooth transitions
- ✅ **RTL**: Full Arabic support

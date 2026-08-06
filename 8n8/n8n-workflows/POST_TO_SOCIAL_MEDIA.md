# n8n Workflow - Post to Social Media

## Overview

Workflow لنشر محتوى على Facebook و Instagram تلقائياً عبر Webhook.

---

## Workflow Structure

```
Webhook Trigger
    ↓
Platform Switch (facebook/instagram/other)
    ↓
├─ Facebook Branch
│   ↓
│   Facebook - Create Post
│   ↓
│   Facebook Response
│
├─ Instagram Branch
│   ↓
│   Instagram - Create Media Container
│   ↓
│   Instagram - Publish Media
│   ↓
│   Instagram Response
│
└─ Error Branch
    ↓
    Error - Invalid Platform
```

---

## Nodes Breakdown

### 1. Webhook Trigger

**Type**: `n8n-nodes-base.webhook`

**Configuration**:

- Method: `POST`
- Path: `/post-content`
- Response Mode: `Response Node`

**Expected Payload**:

```json
{
  "draftId": "123",
  "platform": "facebook",
  "caption": "نص المنشور\n\n#hashtag1 #hashtag2",
  "mediaUrl": "https://example.com/image.jpg",
  "scheduledAt": "2024-01-25T10:00:00Z",
  "facebookPageId": "your-page-id",
  "instagramBusinessAccountId": "your-ig-business-id"
}
```

---

### 2. Platform Switch

**Type**: `n8n-nodes-base.switch`

**Rules**:

- Output 0: `platform == "facebook"`
- Output 1: `platform == "instagram"`
- Output 2: Default (error)

**Expression**: `={{ $json.platform }}`

---

### 3. Facebook Branch

#### Facebook - Create Post

**Type**: `n8n-nodes-base.facebookGraphApi`

**Configuration**:

- Resource: `post`
- Operation: `create`
- Page ID: `={{ $json.facebookPageId }}`
- Message: `={{ $json.caption }}`
- Link: `={{ $json.mediaUrl }}`

**Credentials Required**:

- Facebook Graph API
  - Access Token (Page Token)
  - App ID
  - App Secret

**Permissions Needed**:

- `pages_manage_posts`
- `pages_read_engagement`

---

### 4. Instagram Branch

#### Step 1: Create Media Container

**Type**: `n8n-nodes-base.instagram`

**Configuration**:

- Resource: `media`
- Operation: `create`
- Instagram Business Account ID: `={{ $json.instagramBusinessAccountId }}`
- Image URL: `={{ $json.mediaUrl }}`
- Caption: `={{ $json.caption }}`

**Output**: Returns `creation_id`

#### Step 2: Publish Media

**Type**: `n8n-nodes-base.instagram`

**Configuration**:

- Resource: `media`
- Operation: `publish`
- Instagram Business Account ID: `={{ $json.instagramBusinessAccountId }}`
- Creation ID: `={{ $json.id }}`

**Credentials Required**:

- Instagram Business API
  - Access Token
  - Connected to Facebook Page

**Permissions Needed**:

- `instagram_basic`
- `instagram_content_publish`
- `pages_read_engagement`

---

### 5. Response Nodes

#### Facebook Response

**Success Response**:

```json
{
  "status": "posted",
  "platform": "facebook",
  "platformPostId": "123456789_987654321",
  "draftId": "123",
  "postedAt": "2024-01-25T10:00:00.000Z"
}
```

#### Instagram Response

**Success Response**:

```json
{
  "status": "posted",
  "platform": "instagram",
  "platformPostId": "17841234567890123",
  "draftId": "123",
  "postedAt": "2024-01-25T10:00:00.000Z"
}
```

#### Error Response

**Invalid Platform Response**:

```json
{
  "status": "error",
  "message": "Invalid platform. Use 'facebook' or 'instagram'"
}
```

---

## Setup Instructions

### Prerequisites

1. **n8n Instance** running
2. **Facebook Developer Account**
3. **Facebook Page** created
4. **Instagram Business Account** linked to Facebook Page

---

### Step 1: Import Workflow

1. في n8n، اذهب إلى **Workflows**
2. Click **Import from File**
3. اختر `post-to-social-media.json`
4. Workflow سيظهر في قائمتك

---

### Step 2: Configure Facebook Credentials

1. اذهب إلى [Facebook Developers](https://developers.facebook.com/)
2. أنشئ **App** جديد (Type: Business)
3. أضف **Facebook Login** product
4. في **Settings** → **Basic**:
   - احفظ **App ID**
   - احفظ **App Secret**
5. اذهب إلى **Graph API Explorer**:
   - اختر App
   - اختر Page
   - أضف Permissions:
     - `pages_manage_posts`
     - `pages_read_engagement`
   - Generate Access Token
   - استخدم [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/) لتحويله إلى Long-Lived Token

6. في n8n:
   - **Credentials** → **Create New**
   - Type: **Facebook Graph API**
   - Access Token: [paste long-lived token]
   - Save

---

### Step 3: Configure Instagram Credentials

**Requirements**:

- Instagram account must be **Business Account**
- Must be connected to a **Facebook Page**

**Steps**:

1. حوّل Instagram account إلى Business:
   - Settings → Account → Switch to Professional Account → Business
2. ربط بـ Facebook Page:
   - Settings → Business → Page
3. احصل على Instagram Business Account ID:

   ```
   GET https://graph.facebook.com/v18.0/me/accounts?access_token={TOKEN}
   ```

   ثم:

   ```
   GET https://graph.facebook.com/v18.0/{PAGE_ID}?fields=instagram_business_account&access_token={TOKEN}
   ```

4. في n8n:
   - **Credentials** → **Create New**
   - Type: **Instagram Graph API**
   - Access Token: [same as Facebook token]
   - Save

---

### Step 4: Get Page & Account IDs

#### Facebook Page ID

**Method 1**: من Settings

- اذهب إلى Facebook Page → About → Page ID

**Method 2**: من API

```bash
curl "https://graph.facebook.com/v18.0/me/accounts?access_token={TOKEN}"
```

Response:

```json
{
  "data": [
    {
      "id": "123456789",
      "name": "Your Page Name"
    }
  ]
}
```

#### Instagram Business Account ID

```bash
curl "https://graph.facebook.com/v18.0/{PAGE_ID}?fields=instagram_business_account&access_token={TOKEN}"
```

Response:

```json
{
  "instagram_business_account": {
    "id": "17841234567890123"
  }
}
```

---

## Testing

### Test Facebook Post

**Request**:

```bash
curl -X POST http://localhost:5678/webhook/post-content \
  -H "Content-Type: application/json" \
  -d '{
    "draftId": "test-001",
    "platform": "facebook",
    "caption": "هذا منشور تجريبي من n8n 🚀\n\n#automation #n8n",
    "mediaUrl": "https://picsum.photos/800/600",
    "facebookPageId": "YOUR_PAGE_ID"
  }'
```

**Expected Response**:

```json
{
  "status": "posted",
  "platform": "facebook",
  "platformPostId": "123456789_987654321",
  "draftId": "test-001",
  "postedAt": "2024-01-25T10:30:00.000Z"
}
```

---

### Test Instagram Post

**Request**:

```bash
curl -X POST http://localhost:5678/webhook/post-content \
  -H "Content-Type: application/json" \
  -d '{
    "draftId": "test-002",
    "platform": "instagram",
    "caption": "منشور تجريبي على Instagram ✨\n\n#automation #n8n",
    "mediaUrl": "https://picsum.photos/1080/1080",
    "instagramBusinessAccountId": "YOUR_IG_BUSINESS_ID"
  }'
```

**Expected Response**:

```json
{
  "status": "posted",
  "platform": "instagram",
  "platformPostId": "17841234567890123",
  "draftId": "test-002",
  "postedAt": "2024-01-25T10:35:00.000Z"
}
```

---

## Integration with Nuwa Frontend

### Update .env

```env
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/post-content
```

### Create Service

**File**: `src/services/socialMediaService.ts`

```typescript
import api from "@/utils/api";

interface PostPayload {
  draftId: string;
  platform: "facebook" | "instagram";
  caption: string;
  mediaUrl: string;
  facebookPageId?: string;
  instagramBusinessAccountId?: string;
}

export async function postToSocialMedia(payload: PostPayload) {
  const n8nUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  const response = await fetch(n8nUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to post to social media");
  }

  return await response.json();
}
```

### Usage in Component

```vue
<script setup>
import { postToSocialMedia } from "@/services/socialMediaService";

const handlePublish = async () => {
  try {
    const result = await postToSocialMedia({
      draftId: content.id,
      platform: "instagram",
      caption: content.body,
      mediaUrl: content.imageUrl,
      instagramBusinessAccountId: "17841234567890123",
    });

    console.log("Posted:", result.platformPostId);
    toast.success("تم النشر بنجاح!");
  } catch (error) {
    toast.error("فشل النشر");
  }
};
</script>
```

---

## Important Notes

### Facebook

✅ **Supported**:

- Text posts
- Photo posts
- Link posts
- Video posts (up to 4GB)

❌ **Not Supported**:

- Stories
- Reels (use Instagram)

### Instagram

✅ **Supported**:

- Single photo posts (square 1:1 or vertical 4:5)
- Carousel posts (multiple images)
- Reels (video)

❌ **Not Supported**:

- Stories (use Stories API)
- IGTV (deprecated)

**Image Requirements**:

- Min resolution: 320px
- Max resolution: 8000px
- Aspect ratio: 0.8:1 to 1.91:1
- Format: JPG, PNG

---

## Error Handling

### Common Errors

#### Facebook

| Error Code | Meaning              | Solution                            |
| ---------- | -------------------- | ----------------------------------- |
| `190`      | Invalid Access Token | Regenerate token                    |
| `200`      | Permission denied    | Add `pages_manage_posts` permission |
| `100`      | Invalid parameter    | Check pageId & caption              |

#### Instagram

| Error Code | Meaning              | Solution                          |
| ---------- | -------------------- | --------------------------------- |
| `190`      | Invalid Access Token | Regenerate token                  |
| `100`      | Invalid media URL    | Check image URL is public & valid |
| `9004`     | Upload in progress   | Wait and retry                    |
| `352`      | Duplicate caption    | Change caption text               |

---

## Monitoring & Logs

### Enable Logging in n8n

1. في Workflow settings
2. Enable **Save Execution Data**
3. Set **Error Workflow** (optional)

### View Executions

1. Workflows → Your Workflow
2. Click **Executions**
3. View success/failed runs
4. Click execution to see full data flow

---

## Scheduling (Optional)

### Add Cron Trigger

إذا تريد نشر محتوى مجدول تلقائياً:

1. أضف **Cron** node قبل Webhook
2. Configure:
   - Mode: Every X minutes
   - Interval: 5 minutes
3. أضف **Database** node لجلب scheduled content
4. Loop على كل item
5. Post إذا وصل موعد النشر

---

## Security

### Best Practices

✅ **DO**:

- استخدم long-lived tokens
- احفظ tokens في Environment Variables
- استخدم HTTPS للـ webhooks
- Validate input في Webhook

❌ **DON'T**:

- لا تحفظ tokens في Git
- لا تستخدم Personal Access Tokens
- لا تعطي permissions زائدة
- لا تنشر tokens publically

---

## Troubleshooting

### Workflow not triggering

1. Check webhook URL في n8n
2. Activate workflow (toggle في n8n)
3. Check firewall/network

### Facebook post fails

1. Verify token is valid
2. Check page permissions
3. Verify pageId is correct
4. Check caption length (<63,206 chars)

### Instagram post fails

1. Verify account is Business
2. Check image URL is public
3. Verify image meets requirements
4. Check caption length (<2,200 chars)

---

## Next Steps

### Enhancements

1. **Add scheduling**:
   - Cron node + database check
2. **Add error notifications**:
   - Slack/Email on failure
3. **Add analytics**:
   - Track engagement metrics
4. **Add retry logic**:
   - Retry failed posts
5. **Add media validation**:
   - Check image before posting

---

## Resources

- [Facebook Graph API Docs](https://developers.facebook.com/docs/graph-api/)
- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api/)
- [n8n Documentation](https://docs.n8n.io/)
- [n8n Facebook Node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.facebook/)
- [n8n Instagram Node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.instagram/)

---

## Summary

Workflow جاهز للاستخدام:

✅ Webhook trigger  
✅ Platform switch  
✅ Facebook posting  
✅ Instagram posting (2-step)  
✅ Error handling  
✅ Response formatting

**Webhook URL**: `http://localhost:5678/webhook/post-content`

Ready to integrate with Nuwa! 🚀

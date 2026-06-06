# ⚖️ ميزان — المساعد القانوني العراقي

## خطوات الرفع على Vercel

### 1. رفع المشروع على GitHub
1. اذهب إلى [github.com](https://github.com) وسجل دخول
2. اضغط **New Repository** واسمه `mizan-legal`
3. ارفع كل ملفات المشروع

### 2. ربط Vercel بـ GitHub
1. اذهب إلى [vercel.com](https://vercel.com) وسجل دخول
2. اضغط **Add New Project**
3. اختر الـ Repository `mizan-legal`
4. اضغط **Deploy**

### 3. إضافة API Key
1. في Vercel، اذهب إلى **Settings → Environment Variables**
2. أضف:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** مفتاحك من [console.anthropic.com](https://console.anthropic.com)
3. اضغط **Save** ثم **Redeploy**

### الحصول على Anthropic API Key
1. اذهب إلى [console.anthropic.com](https://console.anthropic.com)
2. سجل حساب جديد
3. اذهب إلى **API Keys** واضغط **Create Key**
4. انسخ المفتاح وضعه في Vercel

# Meta WhatsApp API Setup Guide

## ✅ Status: Implementation is Ready

Your project has a **complete Meta WhatsApp integration** at:

- **Webhook Handler:** `/src/app/api/webhooks/meta/route.ts`
- **API Functions:** `/src/lib/meta.ts`
- **AI Service:** `/src/lib/services/ai.service.ts`
- **Conversation Service:** `/src/lib/services/conversation.service.ts`

## 🚀 Quick Setup (30 minutes)

### Step 1: Get Meta Credentials (10 min)

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a Business Account or sign in
3. Create a WhatsApp Business App (or use existing)
4. Navigate to **WhatsApp > Getting Started**
5. Collect these credentials:
   - **Phone Number ID** - Under Settings > Displays on Dashboard
   - **Business Account ID** - Under Settings > Account Resources
   - **Access Token** - Under Settings > API Keys (or create a System User token)
   - **Verify Token** - Create your own (any string, e.g., `my_voice_is_my_password_verify_me`)

### Step 2: Create `.env.local` File

Create a file in the project root (next to `package.json`):

```bash
# Meta WhatsApp API
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_VERIFY_TOKEN=your_verify_token_here
META_GRAPH_VERSION=v22.0

# OpenAI (for AI responses)
OPENAI_API_KEY=your_openai_api_key_here

# Pusher (for real-time updates)
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
PUSHER_APP_ID=your_app_id
PUSHER_SECRET=your_secret

# Database
MONGODB_URI=your_mongodb_connection_string

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Step 3: Configure Meta Webhook (5 min)

1. In Meta for Developers Dashboard:
   - Go to **WhatsApp > Settings > Configuration** (or **App Roles > Webhooks**)
2. Click **Edit Callback URL** and set:
   - **Callback URL:** `https://your-domain.com/api/webhooks/meta`
   - **Verify Token:** (use the same token from `.env.local`)

3. Under **Subscribe to Webhook Fields**, select:
   - ✅ `messages`
   - ✅ `message_status`
   - ✅ `message_template_status_update`

4. **Save Changes**

### Step 4: Test Your Setup (5 min)

```bash
# 1. Start your dev server
npm run dev

# 2. Send a test message from your WhatsApp Business Account
# to yourself or the test number

# 3. Check these to verify it's working:
# - Dashboard shows new conversation
# - MongoDB Conversation collection has new entry
# - Browser console shows Pusher events
```

## 📋 What Each Component Does

| Component                               | Purpose                           | Status   |
| --------------------------------------- | --------------------------------- | -------- |
| **Meta Webhook** (`/api/webhooks/meta`) | Receives messages from WhatsApp   | ✅ Ready |
| **Message Sending** (`lib/meta.ts`)     | Sends text & interactive messages | ✅ Ready |
| **AI Service**                          | Generates smart responses         | ✅ Ready |
| **Conversation Service**                | Stores conversations in DB        | ✅ Ready |
| **Knowledge Base**                      | Context for AI responses          | ✅ Ready |
| **Pusher Integration**                  | Real-time dashboard updates       | ✅ Ready |

## 🔄 How It Works

```
1. User sends WhatsApp message
   ↓
2. Meta sends webhook to /api/webhooks/meta
   ↓
3. Service extracts message & finds/creates conversation
   ↓
4. AI generates response using knowledge base
   ↓
5. Response sent back via sendMetaText() or sendMetaCourseList()
   ↓
6. Pusher updates dashboard in real-time
```

## 🎯 Key Features Already Implemented

- ✅ **Auto Name Detection** - AI extracts user's name from messages
- ✅ **Course Selection** - Interactive list with course buttons
- ✅ **Knowledge Base Integration** - AI references custom knowledge
- ✅ **Button Actions** - Handle "Show List", "Show Website" interactions
- ✅ **Real-time Updates** - Dashboard shows conversations live
- ✅ **Conversation History** - MongoDB stores all messages
- ✅ **New Day Detection** - Resets greetings each day

## 💰 Cost Comparison

| Provider           | Monthly Cost         | Pros                                    |
| ------------------ | -------------------- | --------------------------------------- |
| **Meta (Current)** | $0.05/msg            | Native WhatsApp, best support, reliable |
|                    | Free first 1000 msgs |                                         |
| Twilio             | $0.0075/msg          | But reseller = less reliable            |

**You save ~86% using Meta directly**

## 🐛 Troubleshooting

### "Webhook not calling my endpoint"

- Ensure domain is HTTPS (WhatsApp requires it)
- Check Verify Token matches in Meta dashboard
- Test webhook manually: `curl -X POST https://your-domain/api/webhooks/meta`

### "Messages not sending"

- Verify `WHATSAPP_ACCESS_TOKEN` is correct
- Check `WHATSAPP_PHONE_NUMBER_ID` is the right format
- Ensure phone number is in **E.164 format** (+234XXXXXXXXXX)

### "No response from AI"

- Verify `OPENAI_API_KEY` is valid
- Check MongoDB connection
- Review OpenAI API status

## 📞 IMPORTANT: Phone Number Requirements

The phone number must be:

1. **E.164 Format:** `+country_code_phone_number`
   - Nigeria example: `+234901234567`
   - Keep leading zero out after country code
2. **Verified with Meta** - Phone must be registered in WhatsApp Business Account
3. **Active WhatsApp Account** - User must have WhatsApp installed

## 🚦 Next Steps

1. ✅ Add credentials to `.env.local`
2. ✅ Configure webhook in Meta dashboard
3. ✅ Test with a message
4. ✅ Monitor MongoDB for conversations
5. ✅ Check dashboard real-time updates

## 📚 Resources

- [Meta WhatsApp API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)
- [API Reference](https://developers.facebook.com/docs/whatsapp/cloud-api/reference)
- [Webhook Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)
- [Message Types](https://developers.facebook.com/docs/whatsapp/cloud-api/messages)

---

**You're ready to go! Start with Step 1 above.** 🎉

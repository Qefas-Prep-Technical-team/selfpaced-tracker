# Meta WhatsApp Setup Checklist

## 🔐 Phase 1: Get Credentials (10 minutes)

- [ ] Go to https://developers.facebook.com
- [ ] Sign in with your Meta business account (or create one)
- [ ] Create WhatsApp Business App (or select existing)
- [ ] Navigate to **WhatsApp > Getting Started**
- [ ] Copy and save these 3 values:
  - [ ] **Phone Number ID** - Format: `123456789...`
  - [ ] **Access Token** - Format: `EAAB...` (very long)
  - [ ] Create **Verify Token** - Make up any string (e.g., `qefas_verify_token_2025`)
- [ ] Verify your test phone number in WhatsApp Business Account settings

## 📝 Phase 2: Configure Environment (5 minutes)

- [ ] Open VS Code at project root
- [ ] Create new file: `.env.local`
- [ ] Copy values from `.env.example` and fill in:
  ```
  WHATSAPP_PHONE_NUMBER_ID=<your_phone_number_id>
  WHATSAPP_ACCESS_TOKEN=<your_access_token>
  WHATSAPP_VERIFY_TOKEN=<your_verify_token>
  OPENAI_API_KEY=<your_openai_key>
  MONGODB_URI=<your_mongodb_uri>
  ```
- [ ] Save `.env.local` (⚠️ Never commit this file)
- [ ] Verify `.env.local` is in `.gitignore`

## 🔗 Phase 3: Configure Webhook in Meta Dashboard (5 minutes)

- [ ] Deploy your app to get HTTPS URL (required by WhatsApp)
  - Recommended: Vercel, Heroku, or Railway
  - Your final URL: `https://your-domain.com`
- [ ] Go to Meta Developers Dashboard
- [ ] Navigate to **App Settings > Webhooks** (or WhatsApp > Configuration)
- [ ] Click **Edit Callback URL**
- [ ] Set callback URL:
  ```
  https://your-domain.com/api/webhooks/meta
  ```
- [ ] Set Verify Token:
  ```
  (use same token from .env.local WHATSAPP_VERIFY_TOKEN)
  ```
- [ ] Click **Verify and Save**
- [ ] Under **Webhook Fields**, subscribe to:
  - [ ] ✅ `messages`
  - [ ] ✅ `message_status`
  - [ ] ✅ `message_template_status_update`
- [ ] Save

## 🧪 Phase 4: Test the Integration (5 minutes)

- [ ] Start local dev server:
  ```bash
  npm run dev
  ```
- [ ] Using test WhatsApp number, send a message to your Business Account
- [ ] Check if message appears in MongoDB:
  ```bash
  # Connect to MongoDB and check:
  db.conversations.findOne({})
  ```
- [ ] Verify in dashboard:
  - Check Pusher real-time updates
  - See conversation appear in Inbox
  - See AI response sent back automatically

## 🚀 Phase 5: Go Live

- [ ] Test all features:
  - [ ] Send text message → receive AI response
  - [ ] Say "show me courses" → receive course list
  - [ ] Click course button → receive course link
  - [ ] Dashboard updates in real-time
- [ ] Monitor for 24 hours:
  - [ ] Check error logs
  - [ ] Verify message delivery
  - [ ] Test with multiple phone numbers
- [ ] Enable production mode in Meta dashboard
  - [ ] Upgrade from Sandbox to Production
  - [ ] Test with real numbers

## 📋 Credentials Checklist

```
WHATSAPP_PHONE_NUMBER_ID: ___ (numbers only, ~15 digits)
WHATSAPP_ACCESS_TOKEN:    ___ (starts with EAA, very long)
WHATSAPP_VERIFY_TOKEN:    ___ (your custom string)
OPENAI_API_KEY:           ___ (starts with sk_)
MONGODB_URI:              ___ (mongodb+srv://...)
NEXT_PUBLIC_APP_URL:      ___ (https://your-domain.com)
```

## 💡 Helpful Commands

```bash
# View logs in real-time
npm run dev

# Test webhook manually
curl -X POST https://your-domain.com/api/webhooks/meta \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Check if .env.local is loaded (should show values)
node -e "console.log(process.env.WHATSAPP_PHONE_NUMBER_ID)"

# View MongoDB conversations
# Open MongoDB Atlas > Collections > selfpaced.conversations
```

## ⚠️ Common Mistakes to Avoid

1. ❌ Forgetting leading zero on Nigerian numbers
   - ✅ Correct: `+234901234567` (NO leading zero)
   - ❌ Wrong: `+2340901234567` (has leading zero)

2. ❌ Using HTTP instead of HTTPS
   - Meta requires HTTPS for all webhooks

3. ❌ Verify Token doesn't match
   - Must be identical in `.env.local` AND Meta dashboard

4. ❌ Phone number not verified in WhatsApp Business
   - Must add and verify number before messaging

5. ❌ Committing `.env.local` to GitHub
   - Keep it in `.gitignore`

## 🆘 Troubleshooting

### "Webhook verification failed"

- Double-check Verify Token matches
- Ensure domain is HTTPS
- Check callback URL format: `https://domain.com/api/webhooks/meta`

### "No messages received"

- Verify phone number is E.164 format (+234...)
- Check phone is registered in WhatsApp Business Account
- Check Meta dashboard shows webhook as "Active"

### "Access Token error"

- Token may have expired, generate new one
- Ensure it's a System User token (long-lived)

### "No AI response"

- Check OpenAI API key is valid
- Check MongoDB is connected
- View server logs for errors

## 📞 Support

- Meta Support: https://www.facebook.com/help
- OpenAI Support: support@openai.com
- Your Database Provider support

---

**Status: Implementation is 100% ready. Just need credentials and configuration.**

Schedule: 25-30 minutes total setup time ⏱️

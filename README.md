# LipaStay.co.ke 🇰🇪
> **Kenya's First 0% Commission Direct Booking Platform**  
> Connecting guests with verified hosts directly via WhatsApp (`wa.me`) and Safaricom M-Pesa Buy Goods Tills.

---

## 🚀 Overview

Global OTAs (Booking.com & Airbnb) charge Kenyan property hosts between 15% to 30% in commissions, hold payouts for weeks, and lock communication. 

**LipaStay is a discovery + trust layer:**
- **0% Commission:** Hosts keep 100% of their earnings. LipaStay monetizes via host subscriptions (KES 1,500/mo) rather than per-booking cuts.
- **Direct Settlement:** Funds travel straight from guest to the host's Safaricom Buy Goods Till via M-Pesa STK Push. LipaStay holds **KES 0 in escrow**.
- **Real WhatsApp:** Guests chat hosts directly on WhatsApp with pre-filled check-in dates, establishing true long-term guest relationships.

---

## 🛠️ How to Run Locally

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Development
```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev
```

App will run at `http://localhost:3000`.

### Production Build
```bash
npm run build
```

---

## 📲 How to Connect Real Safaricom Daraja API (M-Pesa STK Push)

To transition from the current mock simulation to live Safaricom M-Pesa STK Push:

1. **Create a Safaricom Developer Account:**
   - Register at [developer.safaricom.co.ke](https://developer.safaricom.co.ke/).
   - Create an app to obtain your `Consumer Key` and `Consumer Secret`.

2. **Acquire Live / Sandbox Credentials:**
   - **Business Short Code (Till / Paybill):** e.g. `174379` (Sandbox) or your Host's Buy Goods Till.
   - **Passkey:** Generated from Safaricom Daraja portal.
   - **Callback URL:** Your secure HTTPS endpoint (e.g., `https://lipastay.co.ke/api/mpesa/callback`).

3. **Backend Integration Endpoint (Express/Firebase Function):**
   ```ts
   // Example Daraja STK Push Initiation Payload
   const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
   const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

   const response = await fetch('https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
     method: 'POST',
     headers: {
       Authorization: `Bearer ${accessToken}`,
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       BusinessShortCode: shortCode,
       Password: password,
       Timestamp: timestamp,
       TransactionType: 'CustomerBuyGoodsOnline', // or CustomerPayBillOnline
       Amount: amountKES,
       PartyA: guestPhoneNumber, // Format: 2547XXXXXXXX
       PartyB: hostTillNumber,
       PhoneNumber: guestPhoneNumber,
       CallBackURL: 'https://lipastay.co.ke/api/mpesa/callback',
       AccountReference: 'LipaStay Direct',
       TransactionDesc: `Deposit for Property ${propertyId}`,
     }),
   });
   ```

4. **Instant Verification Callback:**
   - When the guest enters their PIN on their Safaricom handset, Daraja posts to `CallBackURL`.
   - Update `status: 'verified'` in your database and dispatch instant SMS or WhatsApp confirmation.

---

## 💬 How to Connect WhatsApp Cloud API (Meta WhatsApp Business)

While LipaStay's core flow uses direct zero-cost `wa.me/${phone}?text=...` deep linking, you can also send automated STK receipts and host alerts using Meta's WhatsApp Cloud API:

1. **Meta for Developers Setup:**
   - Go to [developers.facebook.com](https://developers.facebook.com/) and register a WhatsApp Business App.
   - Obtain `WHATSAPP_TOKEN` and `PHONE_NUMBER_ID`.

2. **Sending Automated Reservation Alerts to Host:**
   ```ts
   await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
     method: 'POST',
     headers: {
       Authorization: `Bearer ${WHATSAPP_TOKEN}`,
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       messaging_product: 'whatsapp',
       to: hostWhatsAppNumber, // 2547XXXXXXXX
       type: 'template',
       template: {
         name: 'new_booking_deposit_received',
         language: { code: 'en' },
         components: [
           {
             type: 'body',
             parameters: [
               { type: 'text', text: guestName },
               { type: 'text', text: propertyTitle },
               { type: 'text', text: `KES ${amountKES}` },
               { type: 'text', text: transactionCode },
             ],
           },
         ],
       },
     }),
   });
   ```

---

## 🔥 How to Deploy to Firebase Hosting

LipaStay is configured with `firebase.json` for single-page application routing.

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize or Link Project:**
   ```bash
   firebase use lipastay-co-ke
   # or run 'firebase init hosting' and choose existing project
   ```

4. **Build the Production Assets:**
   ```bash
   npm run build
   ```

5. **Deploy Live:**
   ```bash
   firebase deploy --only hosting
   ```

Your site will be live instantly at `https://lipastay-co-ke.web.app` or your custom domain `https://lipastay.co.ke`.

---

## 🛡️ Kenyan Trust Model

- **Zero Escrow:** Guests never pay LipaStay; payments settle immediately in the host's Till.
- **Till Fraud Checks:** All host Tills undergo a 2-hour Safaricom identification match before listings go live.
- **Built in Nairobi for Kenyan Hosts:** 100% mobile-first, lightweight PWA architecture optimized for Safaricom 4G/5G.

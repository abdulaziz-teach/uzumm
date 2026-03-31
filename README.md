# Uzumm Frontend

Bu loyiha `register/login/seller/big-admin` ma'lumotlarini ikki xil usulda ishlata oladi:

- `localStorage` rejimi: faqat o'sha brauzer ichida ishlaydi.
- `shared API` rejimi: barcha qurilmalardagi userlar bitta admin panelda ko'rinadi.

## Muhim

Faqat GitHub'ga joylashning o'zi yetmaydi. Agar barcha foydalanuvchilar `Big Admin` panelda ko'rinishi kerak bo'lsa, shared backend ham kerak bo'ladi.

Agar `.env` ichida `VITE_SHARED_API_BASE_URL` bo'lmasa yoki backend ishlamasa, app avtomatik ravishda `localStorage` rejimiga qaytadi.

## Tayyor Variant

Repo ichida bepul ishlatish uchun Cloudflare Worker namuna backendi qo'shilgan:

- `cloudflare/worker.js`
- `cloudflare/wrangler.example.toml`

Bu worker `users`, `sellerCards`, `sellerRequests` ma'lumotlarini bitta joyda saqlaydi va frontend bilan ishlaydi.

## Frontend Sozlash

`.env` fayl yarating va `.env.example` dagi qiymatlarni to'ldiring:

```env
VITE_SHARED_API_BASE_URL=https://your-worker.your-subdomain.workers.dev
VITE_SHARED_STATE_COLLECTION=app_state
VITE_SHARED_API_TOKEN=change-this-secret-token
```

## Cloudflare Worker Sozlash

1. Cloudflare hisob oching.
2. `Workers & Pages` ichida yangi Worker yarating.
3. KV namespace yarating.
4. `cloudflare/worker.js` kodini Worker'ga joylang.
5. `cloudflare/wrangler.example.toml` dagi `YOUR_KV_NAMESPACE_ID` ni o'zingizniki bilan almashtiring.
6. `SHARED_API_TOKEN` ga maxfiy token bering.
7. Worker deploy qiling.
8. Deploy bo'lgan worker URL'ni frontend `.env` fayliga yozing.

## API Tuzilishi

Frontend quyidagi endpointlar bilan ishlaydi:

- `GET /app_state`
- `POST /app_state`
- `GET /app_state/main`
- `PUT /app_state/main`

Authorization token ishlatilsa, frontend `Authorization: Bearer <token>` header yuboradi.

## Ishga Tushirish

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

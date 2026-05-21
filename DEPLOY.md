# Deploy live (Vercel + Render)

Your Vercel site is **only the frontend**. Socket.io must run on **Render**.

## Step 1 — Backend on Render (5 min)

1. Go to https://dashboard.render.com
2. **New +** → **Blueprint** → connect `vivek20Eng/socket-mouse-pointer`
3. Wait until status is **Live**
4. Copy the URL, e.g. `https://socket-mouse-pointer.onrender.com`
5. Open that URL in the browser — you should see **Connected** (use this URL if you skip Vercel)

## Step 2 — Link Vercel to Render

1. https://vercel.com → your project → **Settings** → **Environment Variables**
2. Add:

   | Name | Value |
   |------|--------|
   | `SOCKET_SERVER_URL` | `https://socket-mouse-pointer.onrender.com` (your Render URL, no trailing `/`) |

3. Enable for **Production** (and Preview if you want)
4. **Save**
5. **Deployments** → latest → **⋯** → **Redeploy**

## Step 3 — Check

Open https://socket-mouse-pointer.vercel.app/env.js — it must show:

```js
window.SOCKET_SERVER_URL = "https://your-app.onrender.com";
```

If it still says `null`, the env var was not set before build, or you need to redeploy.

## Local only

```bash
npm run dev
```

Open http://localhost:3000 — no env vars needed.

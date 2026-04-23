# AEP Golf Day 2026 — Registration Form

Static frontend + Vercel serverless backend. Submissions write a row to Google Sheets.

---

## File structure

```
aep-golf-registration/
├── public/
│   └── index.html        # Registration form
├── api/
│   └── register.js       # Serverless function → Google Sheets
├── vercel.json
├── package.json
└── .gitignore
```

---

## Setup (one-time, ~15 min)

### Step 1 — Google Sheet

1. Create a new Google Sheet
2. Rename the first tab to exactly: `Registrations`
3. Add these headers in row 1:

   | A | B | C | D | E | F | G | H | I | J | K | L | M |
   |---|---|---|---|---|---|---|---|---|---|---|---|---|
   | Ref | Submitted | Team Name | Company | Captain Name | Captain Email | Captain Phone | Players | Ex GST | Inc GST | Payment Method | Dietary / Notes | Player Details |

4. Copy the Sheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`

---

### Step 2 — Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable the **Google Sheets API**
4. Go to **IAM & Admin → Service Accounts → Create Service Account**
5. Give it any name (e.g. `aep-golf-sheets`)
6. On the service account page: **Keys → Add Key → JSON** — download the file
7. In your Google Sheet, click **Share** and add the service account's `client_email` with **Editor** access

---

### Step 3 — Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. Add these **Environment Variables** in the Vercel dashboard:

   | Variable | Value |
   |---|---|
   | `GOOGLE_SHEET_ID` | Sheet ID from Step 1 |
   | `GOOGLE_SERVICE_ACCOUNT_JSON` | Entire contents of the JSON key file (paste as-is) |

4. Deploy — Vercel installs `googleapis` automatically.

---

## How it works

```
User submits form
    ↓
POST /api/register
    ↓
Validates required fields
    ↓
Appends row to Google Sheet
    ↓
Returns { ref } → success screen shown
```

---

## Customisation

- **Bank / payment details:** Edit in `public/index.html` (search `BSB`)
- **Event details:** Edit hero section in `public/index.html`
- **Sheet column order:** Edit the `row` array in `api/register.js`

---

## Troubleshooting

| Issue | Check |
|---|---|
| Sheet not updating | Confirm service account has Editor access; tab named `Registrations` exactly |
| 500 error on submit | Vercel dashboard → Project → Functions tab → check logs |
| JSON parse error | Paste the entire service account JSON as one value in Vercel env vars |

# CDAC ITISS – Complete Examination Preparation Platform

Official examination preparation web platform for the **CDAC Post Graduate Diploma in IT Infrastructure, Systems & Security (ITISS)**.

Built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS** featuring NVIDIA-inspired dark & green (`#76B900`) aesthetic.

---

## 🚀 Features

- **Official 5-Section ITISS Course Structure**:
  - **SECTION A**: Course Focus (FCN, Operating Systems, Advanced Programming Concepts)
  - **SECTION B**: Infrastructure Security with DevOps and Cyber Forensics (DevOps, Cyber Forensics, PKI)
  - **SECTION C**: Network Defense and Cyber Security with Compliance Audit (NDC, Compliance Audit, Security Concepts)
  - **SECTION D**: Employability Skills (Aptitude, Effective Communication)
  - **SECTION E**: Project Capstone
- **FCN Initial Module Active (120 Hours)**:
  - **309 Verified Multiple-Choice Questions** extracted directly from official examination papers (`FCN01.pdf` through `FCN05.pdf`).
  - Zero synthetic or hallucinated questions.
  - Complete provenance tracking: source PDF, page number, and original question ID.
  - Curricular classification across all **13 official topics** (Routing, TCP/IP, NAT, Switching, Subnetting, Protocols, Wireless, DNS/DHCP, IPv4/IPv6, WAN, OSI Model, Security, VLAN).
- **Practice Engine (3 Modes)**:
  - **Mode A (All Questions)**: Browse all 309 questions sequentially with instant technical explanations.
  - **Mode B (Random Practice)**: Selectable question quantity (10, 20, 30, 50, 100).
  - **Mode C (Topic-wise Practice)**: Focused mastery by domain.
- **Realistic 40-Question Mock Examinations**:
  - Exactly 40 questions per test.
  - 40-minute countdown timer.
  - 40-question navigation grid panel (Answered, Unanswered, Marked for Review, Current).
  - Answers hidden during active test.
  - Post-submission diagnostics: Score / 40, Accuracy %, Pass/Fail status, detailed review with filters.
- **Revision & Tracking**:
  - Dedicated **Incorrect Questions** queue with instant retry mode.
  - **Bookmarks** bank with persistent local storage.
  - Real-time **Performance Dashboard** with topic mastery progress bars and historical mock logs.
- **Future Module Activation Architecture**:
  - Independent plug-and-play module configuration in `src/config/modules.ts` and `src/data/moduleRegistry.ts`.
  - Upcoming modules can be activated simply by adding their question JSON and setting status to `AVAILABLE` without code modifications or rebuilding.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React
- **Build Tool**: Vite 6
- **Storage**: LocalStorage Persistence
- **Deployment**: Configured for Vercel SPA (`vercel.json`)

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 📊 FCN Extraction Audit

| Source File | Pages | Extracted | Imported | Verification Method |
| :--- | :---: | :---: | :---: | :--- |
| **FCN01.pdf** | 28 | 159 | 159 | Exact red-font color matching (RGB `0xff0000`) |
| **FCN02.pdf** | 6 | 31 | 31 | Typography font-weight inspection (`Times-Bold` flags) |
| **FCN03.pdf** | 9 | 40 | 40 | PDF Highlight & FreeText Annotation quadpoint mapping |
| **FCN04.pdf** | 9 | 40 | 40 | PDF Highlight Annotation quadpoint mapping |
| **FCN05.pdf** | 5 | 39 | 39 | PDF Highlight Annotation coordinate mapping |
| **TOTAL** | **57** | **309** | **309** | **100% Data Integrity** |

## 📊 Module 2 — OS Administration Extraction Audit

| Source File | Type | Imported | Notes |
| :--- | :--- | :---: | :--- |
| **LINUX02.pdf** | PDF | 129 | OS theory bank (process, memory, scheduling, deadlock, file systems); 180 raw questions de-duplicated to 129 |
| **06-linux.pdf** | PDF | 50 | Linux administration / network services bank |
| **02-windows.pdf** | PDF | 22 | Windows Server, Active Directory, DNS/DHCP questions (fill-in items converted to 4-option MCQs) |
| **COSA01.docx** | DOCX | 48 | Linux and Windows administration (vi, cron, /proc, Apache, quotas, GPO, Samba, mail/print services) |
| **TOTAL** | | **249** | 10 topic domains, every question carries an explanation |

Answer-key corrections applied while verifying the banks:

- `06-linux.pdf`: sendmail config `D → A`, init PID `A → B`, swap size `B → C`, `startx` `B → A`, daemon logging `A → B`.
- `02-windows.pdf`: DNS registration command `a → b` (`ipconfig /registerdns`).
- `LINUX02.pdf`: dynamic loading answers corrected to *Dynamic loading* (3 duplicates), optimal page replacement corrected, protection/security statement corrected.
- `LINUX01.docx` contains questions without any options or answer key, so it could not be imported as MCQs.

---

## 📄 License

Educational preparation platform for CDAC ITISS students.


## Authentication gate (Clerk)

The entire application is gated. Nothing but the sign-in screen is rendered until Clerk
reports an authenticated session — protected views never mount for anonymous visitors.

| State | What renders |
| :-- | :-- |
| Clerk initialising | Boot screen (`Verifying secure access…`) |
| Clerk unreachable for 15s | Sign-in screen with a connection notice (content stays locked) |
| Signed out | Branded Clerk sign-in screen (email + password, Google, sign-up) — no dashboard, practice, mock or data access |
| Signed in, ≤ 2 devices | The full preparation platform + `UserButton` in the header |
| Signed in, 3rd device | “Device limit reached” screen: sign out one of the two listed sessions |

Implementation:

- `src/components/auth/AuthGate.tsx` — the gate itself, including the boot, connection and
  sign-in screens.
- `src/components/auth/AuthGate.tsx` renders Clerk's **prebuilt** `<SignIn />` / `<SignUp />`
  inside the branded shell, because this instance enables Clerk Protect mid-flow challenges,
  bot sign-up protection and new-device (client trust) verification. The prebuilt components
  resolve those steps automatically; a hand-rolled form cannot complete a `protect_check`
  challenge and would leave sign-ups stuck at `missing_requirements` (code verified, no user
  created). Branding comes from the `ClerkProvider` `appearance` config in `main.tsx`.
- `src/main.tsx` — wraps `App` in `ClerkProvider` → `AuthGate` → `SessionLimitGate`, and refuses
  to boot the app when `VITE_CLERK_PUBLISHABLE_KEY` is missing (fail-closed, actionable screen).
- `src/components/auth/AuthView.tsx` — the signed-in student account page (profile, stats,
  sign-out). Sign-in is no longer handled here.

### Session limit (2 devices)

Passwords are shared, so each account may hold **2 concurrent Clerk sessions**. The check runs
on sign-in, when the tab regains focus and every 2 minutes:

- `src/components/auth/SessionLimitGate.tsx` asks `/api/session-guard` about the current session.
- `api/session-guard.js` lists the user's active Clerk sessions (newest first). If the current
  session is beyond the limit it answers `allowed: false` together with the two newest sessions;
  the student then signs one of them out from the blocking screen.
- Sessions beyond the limit are revoked automatically, never the caller's own session.
- If the API is unreachable the guard fails **open** (the limit is a business rule, not auth) so
  students are never locked out by an outage.

Limit is configurable with `MAX_ACTIVE_SESSIONS` (default `2`).

### Admin console

`#/admin` (sidebar → **Admin · Users**) lists Clerk accounts and allows searching, banning,
promoting/demoting administrators, revoking sessions and deleting users — all through the Clerk
Backend API, with the request authenticated by the caller's Clerk session token.

Access is granted when either is true:

1. `publicMetadata.role === 'admin'` on the Clerk user, or
2. the account's e-mail is listed in `ADMIN_EMAILS` (default `pujariprajyot00@gmail.com`).

| Endpoint | Purpose |
| :-- | :-- |
| `POST /api/session-guard` | Session limit check; `{ action: 'revoke', sessionId }` signs another device out |
| `GET /api/admin/users?query=&limit=&offset=` | List/search users with active sessions |
| `POST /api/admin/users` | Create a user `{ email, password, firstName?, lastName?, role? }` |
| `PATCH /api/admin/users` | `{ userId, banned?, role? }` |
| `DELETE /api/admin/users?userId=` | Delete a user |
| `GET /api/admin/sessions?userId=` | Active sessions for one user |
| `POST /api/admin/sessions` | `{ userId, sessionId }` or `{ userId, revokeAll: true }` |

All `/api/*` routes require `Authorization: Bearer <clerk session token>` and return `401`
without it; admin routes additionally return `403` for non-admin accounts. Administrators cannot
ban or delete their own account.

### Environment

```bash
# .env.local (never commit real keys)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...      # server only: /api/* session + admin calls
MAX_ACTIVE_SESSIONS=2             # optional, defaults to 2
ADMIN_EMAILS=pujariprajyot00@gmail.com  # optional, comma separated
```

`CLERK_SECRET_KEY` is read by the serverless functions only and must never be prefixed with
`VITE_` (that would ship it to the browser).

For Vercel, add `VITE_CLERK_PUBLISHABLE_KEY` to **Project → Settings → Environment
Variables** for Production/Preview/Development, then redeploy — Vite inlines the key at build
time, so an existing deployment will not pick it up without a rebuild.

### Verifying the gate

```bash
npm run dev        # open http://localhost:5173 -> sign-in gate appears before any content
npm run build      # tsc + vite production build
```

Manual checks:

1. In a private window the dashboard is not visible and cannot be reached by URL hash.
2. Signing in unlocks the platform immediately, without a page reload.
3. Signing out re-locks the platform (gate returns).
4. Blocking the Clerk frontend API in devtools (`*.clerk.accounts.dev` locally,
   `clerk.cdacitissacademy.tech` in production) shows the fail-closed error screen, not the app.


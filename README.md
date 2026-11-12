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

---

## 📄 License

Educational preparation platform for CDAC ITISS students.


## Authentication gate (Clerk)

The entire application is gated. Nothing but the sign-in screen is rendered until Clerk
reports an authenticated session — protected views never mount for anonymous visitors.

| State | What renders |
| :-- | :-- |
| Clerk initialising | Boot screen (`Verifying secure access…`) |
| Clerk unreachable for 15s | Fail-closed error screen with retry (content stays locked) |
| Signed out | Blocking Clerk `<SignIn />` gate — no dashboard, practice, mock or data access |
| Signed in | The full preparation platform + `UserButton` in the header |

Implementation:

- `src/components/auth/AuthGate.tsx` — the gate itself (`AuthGate`), including the boot,
  failure and sign-in screens.
- `src/main.tsx` — wraps `App` in `ClerkProvider` → `AuthGate`, and refuses to boot the app
  when `VITE_CLERK_PUBLISHABLE_KEY` is missing (fail-closed, with an actionable error screen).
- `src/components/auth/AuthView.tsx` — the signed-in student account page (profile, stats,
  sign-out). Sign-in is no longer handled here.

### Environment

```bash
# .env.local (never commit real keys)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

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


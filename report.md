# LexFlow — Development Work & Implementation Report

**Project:** LexFlow — Law Firm Case & Financial Management (`Emtiaj & Co`)
**Repository:** `/home/pht/Job/ClientProject/lawnext` (origin: `lexaFlow`, branch `main`)
**Report type:** Factual audit of the actual repository, running application, and reachable server evidence
**Audit method:** Source-code inspection, live database connection test, live API endpoint testing, network reachability testing, git history review

> **Scope note:** This report describes only what could be *verified*. Anything that could not be confirmed is explicitly marked as unverified rather than assumed. No code was modified during this audit.

---

## 1. Executive Summary

LexFlow is currently an **early-stage prototype**, not a working law-firm management system.

What genuinely exists today is a **single-page sign-in/sign-up screen** built with Next.js, plus the plumbing behind it: a live connection to a MongoDB database hosted on a remote VPS, and a working registration path that creates a staff record in that database with a "PENDING" status.

In plain language:

* A new staff member **can register** with email/password or with Google, and their record **is saved** to the firm's database, marked as awaiting approval.
* **Nobody can actually log in yet.** The Sign In screen is a visual mock-up — its buttons are not connected to anything.
* There is **no dashboard, no case management, no client records, no payments, no admin approval screen**. Those are all still future work.
* An **image upload feature has been written and partially works**, but the remote storage server it depends on could not be reached during testing, so end-to-end image upload is **not currently functional from this machine**.

Roughly speaking: the *front door* of the application has been built and the *filing cabinet* (database) is connected, but the building behind the door is still empty.

**Overall status: ⚠️ Early prototype / MVP scaffold.**

---

## 2. Completed Work

Only items independently verified from the repository, the running dev server, or the live database are listed here.

| # | Work item | Status | Evidence |
|---|---|---|---|
| 1 | Next.js 16 application scaffolded (App Router, JavaScript, Tailwind v4 + DaisyUI) | ✅ Implemented | `package.json`, `src/app/`, `postcss.config.mjs`, `globals.css` |
| 2 | Firebase Authentication client wired up (email/password, Google, logout, session listener) | ✅ Implemented | `src/firebase/firebase.config.js`, `src/context/AuthProvider.jsx` |
| 3 | Global auth state provider + `useAuth` hook mounted app-wide | ✅ Implemented | `src/app/layout.js`, `src/hooks/useAuth.jsx` |
| 4 | MongoDB connection helper with dev hot-reload connection caching | 🧪 Implemented and tested | `src/lib/mongodb.js`; live ping returned `{"status":"online"}` |
| 5 | Database health-check endpoint `GET /api/test` | 🧪 Implemented and tested | Live call returned `MongoDB connection successful`, latency `1544ms` |
| 6 | User registration endpoint `POST /api/users/signup` (writes to MongoDB) | ✅ Implemented | `src/app/api/users/signup/route.js`; 1 real user document exists in DB |
| 7 | Duplicate-account protection (checks existing `uid` before insert) | ✅ Implemented | Same file, `findOne({ uid })` guard |
| 8 | Sign-Up UI: validated form, Google button, password show/hide, loading state, toasts, error banner | ✅ Implemented | `src/components/auth/SignUp.jsx` |
| 9 | Sign-In UI (visual only — see §4) | ⚠️ Partially implemented | `src/components/auth/SignIn.jsx` — no submit handler |
| 10 | Split-screen branded landing page with animated legal-motif canvas background | ✅ Implemented | `src/app/page.js`, `src/components/LawBg.jsx` |
| 11 | Branded loading screen | ✅ Implemented | `src/templates/loader/Loader.jsx` |
| 12 | Authenticated Axios client that attaches Firebase ID token and auto-logs-out on 401/403 | ✅ Implemented (used only for signup calls) | `src/hooks/useAxiosSecure.jsx` |
| 13 | Image upload API bridge with size + MIME validation | ⚠️ Partially implemented (validation works, remote leg unreachable) | `src/app/api/upload/route.js`; live test confirmed rejection of invalid type |
| 14 | Image upload test page with drag-and-drop, preview, 1 MB client check | ✅ Implemented (UI) | `src/app/(test)/upload/page.jsx` |
| 15 | Next.js rewrites for `/api/upload` and `/uploads/*` → VPS | 🔧 Configured, not verified working | `next.config.mjs` |
| 16 | Environment-based configuration (no secrets committed; `.env*` git-ignored) | ✅ Implemented | `.env`, `.gitignore` |
| 17 | Collection name registry (naming constants for 8 future collections) | ✅ Implemented (names only) | `src/lib/collections.js` |

**Git history (3 commits total):**

| Commit | Date | Description |
|---|---|---|
| `dbe0bb3` | 2026-08-30 | Initial commit from Create Next App |
| `5d58e39` | 2026-08-31 | "Inited next.js and minimul dev MVP" — 28 files, auth scaffold, upload bridge, Mongo lib |
| `cbf9fb4` | 2026-08-31 | "Auth System Done on SignUp" — DB health route, SignUp wiring |

One uncommitted change exists: `next.config.mjs` (added `allowedDevOrigins`, formatting).

---

## 3. Authentication & User Accounts

### Business/User View

A new staff member can open the LexFlow page and create an account — either by typing their name, work email and password, or by clicking "Sign up with Google". Their details are saved into the firm's staff database and flagged as **awaiting administrator approval**.

However, **there is currently no way to actually log in and use the system.** The "Sign In" screen looks complete but does nothing when clicked. There is also no page a user is sent to after registering — they simply stay on the same screen with a success message.

### Technical Evidence

| Capability | Status | Detail |
|---|---|---|
| Email/password registration | ✅ Implemented | Firebase `createUserWithEmailAndPassword`, then display-name update, then DB record insert |
| Email/password login | ❌ Not implemented (UI only) | `signInUser()` exists in `AuthProvider` but **is never called anywhere**; `SignIn.jsx` form uses `onSubmit={(e) => e.preventDefault()}` |
| Google sign-up | ✅ Implemented | `signInWithPopup` + DB record insert |
| Google sign-in (from Sign In screen) | ❌ Not implemented | The Google button in `SignIn.jsx` has **no `onClick` handler** |
| Logout | ⚠️ Partially implemented | `logOut()` function exists and works, but **no UI element calls it** |
| Auth state tracking | ✅ Implemented | `onAuthStateChanged` listener keeps `user` + `loading` in React context |
| User creation in database | 🧪 Implemented and tested | 1 live user document confirmed present in MongoDB |
| Existing-user checking | ⚠️ Partially implemented | Checks by Firebase `uid` only — **not by email** |
| Protected routes | ⚠️ Written but unused | `src/security/PrivateRoute.jsx` exists and is correct, but **is imported by zero files**. It redirects to `/login`, a route that **does not exist** in the app. |
| Redirect after signup | ⚠️ Partially implemented | On success it merely switches the panel to the Sign In view; the `?from=` redirect branch is unreachable in current usage |
| Error handling | ✅ Implemented | Try/catch on both flows, inline red error banner, toast error messages |
| Loading states | ✅ Implemented | `loading` flag disables the submit button and changes its label; `toast.loading` spinner |
| Server-side token verification | ❌ Not implemented | `src/lib/firebaseAdmin.js` exists but **`firebase-admin` is not installed** and the file is **imported nowhere**. API routes are therefore **unauthenticated**. |

### Account Status — verified

Only **one** status value is ever written by the application:

* **`PENDING`** — ✅ hardcoded on every new user (`accountStatus: 'PENDING'`)
* `APPROVED` — ❌ never appears anywhere in the codebase
* `REJECTED` — ❌ never appears anywhere in the codebase
* `SUSPENDED` — ❌ never appears anywhere in the codebase

There is **no code anywhere that reads `accountStatus`**. Nothing is gated on it. It is currently a stored label with no behaviour attached.

### Roles — verified

Only **one** role value is ever written:

* **`caseworker`** — ✅ hardcoded as the default for every registration
* `admin` — ❌ not implemented
* `attorney` — ❌ not implemented
* `paralegal` — ❌ not implemented

There is **no role-based access control** of any kind. No code reads the `role` field.

> Note: `src/components/LegalSignUp.jsx` contains a role-picker offering Attorney / Case Worker / Paralegal, but that component is **dead code** — it is imported by no file, and its handlers only `console.log`. It must not be counted as an implemented feature.

---

## 4. Login & Registration Experience

### Business/User View

The screen is split in two. The left half is a dark, branded panel showing the **LexFlow** name and a legal-scales logo, with a subtle animated background of drifting legal symbols (scales of justice, gavels, pillars, the § section mark) that gently brighten as the mouse moves over them, plus the tagline *"Securely manage cases, payments and financial operations."* The right half is a clean white panel holding the form.

The page briefly shows a branded loading screen ("Initializing LexFlow System…") before revealing the form.

**Registration form** (shown first by default) offers:

* A **"Sign up with Google"** button at the top, then an "Or" divider
* **Full Name**, **Work Email**, and **Password** fields (email and password sit side-by-side)
* An **eye icon** to reveal or hide the typed password
* **Instant validation messages** — missing name, badly-formed email, or a password under 6 characters are flagged in red beneath the relevant field
* A **loading state** — the button reads "Creating Account…" and is disabled while working
* **Pop-up notifications** at the top of the screen: a spinner while saving, then either a green success message ("Application submitted! Pending Admin review.") or a red error message
* A **red error banner** inside the form for authentication problems
* A **"Sign In"** link at the bottom to switch panels without reloading the page

**Sign-in form** offers the same visual language: a "Sign in with Google" button, Work Email and Password fields, a Sign In button, and a "Create Account" link to switch back.

**Responsive behaviour:** On desktop the two halves sit side-by-side; on tablet and mobile they stack vertically, the logo centres itself, and the tagline is hidden to save space.

### ⚠️ Important limitation for the project manager

The **Sign In panel is presentational only**. Its Google button and its Sign In button are not wired to anything — pressing them does nothing. Only the **Sign Up** panel is functional. Additionally, the sign-in form has **no validation, no loading indicator, and no error messages**, unlike the sign-up form.

### Technical Evidence

`src/app/page.js`, `src/components/auth/SignUp.jsx`, `src/components/auth/SignIn.jsx`, `src/components/LawBg.jsx`, `src/templates/loader/Loader.jsx`, `src/app/layout.js` (Toaster mounted globally). Form validation via `react-hook-form`; notifications via `react-hot-toast`.

---

## 5. Account Approval

### Business/User View

When someone registers, the system correctly records that their account is **pending** and tells them "Application submitted! Pending Admin review."

Beyond that message, **the approval system does not exist yet**:

* There is **no "waiting for approval" page** for the user to land on.
* Pending users are **not redirected** anywhere — they stay on the login screen.
* There is **no admin screen** for approving or rejecting staff.
* Approval is **not connected to login at all** — because login itself is not connected.
* The only way to approve someone today would be to **edit the record manually in the database** using a database tool.

### Technical Evidence

| Item | Status |
|---|---|
| `accountStatus: 'PENDING'` written on signup | ✅ Implemented (`api/users/signup/route.js`) |
| Pending-approval page | ❌ Does not exist (no such route in `src/app/`) |
| Redirect of pending users | ❌ Not implemented |
| Sign-out from a pending state | ❌ No UI exists to trigger it |
| Approval linked to authentication flow | ❌ Not implemented — no code reads `accountStatus` |
| Admin approval interface | ❌ Not implemented |
| Approval API endpoint | ❌ **`src/app/api/users/approve/route.js` exists but is a 0-byte empty file** |

> `src/app/api/users/signin/route.js` is likewise a **0-byte empty file** — a placeholder only.

---

## 6. Database & VPS

### Business/User View

The firm's data is stored in a MongoDB database running on a rented remote server (VPS). The application on the developer's machine successfully talks to that database over the internet — this was confirmed live during this audit. Right now the database holds exactly **one** staff record (the developer's own Google test registration) and **nothing else**.

### VPS — verified facts

| Item | Finding | Confidence |
|---|---|---|
| VPS address | A single remote host at IP `72.61.17.107` | ✅ Verified (`.env`, `next.config.mjs`) |
| Host reachable | Yes — responds to ping (~210 ms round-trip) | ✅ Verified |
| SSH service | Running, port 22 open | ✅ Verified (port reachable; key-based login as `root` was refused from this machine) |
| Operating system | **Could not verify from the available project/server evidence.** The upload test page carries a comment describing an "AlmaLinux VPS", and shell history shows `dnf`/`systemctl` usage, but no direct OS confirmation was obtainable. | ⚠️ Unverified |
| MongoDB installed & running | Yes — **MongoDB version 8.0.31**, accepting connections on port 27017 | 🧪 Verified live |
| Web server (Nginx) | **Could not verify.** Port 80 was unreachable from this machine ("No route to host") throughout testing, and port 443 was likewise unreachable. Whether Nginx is installed and simply firewalled off, or not installed, **cannot be determined from here.** | ⚠️ Unverified |
| PM2 / Next.js production server | ❌ No evidence found. No deployment scripts, no ecosystem file, no CI config in the repository. | ❌ Not confirmed |
| Domain / SSL / Cloudflare | ❌ No evidence. The application uses a raw IP address, not a domain name. | ❌ Not implemented |
| Firewall configuration | Not directly inspectable. Observed externally: ports 22 and 27017 reachable; ports 80, 443, 3000, 8080 not reachable from this network. | ⚠️ Partial / observational only |
| Backups | ❌ No backup script, cron entry, or backup documentation exists in the repository. | ❌ Not implemented |

### Database connection

* Connection string is supplied via the **`MONGODB_URI` environment variable** — credentials are environment-based and are **not committed** to git (`.env*` is git-ignored). *(No credential values are reproduced in this report.)*
* Connection targets the VPS **directly over the public internet on port 27017** with a username/password and `authSource=lawapp`.
* **Database name: `lawapp`** (also mirrored in an unused `MONGODB_NAME` variable).
* `src/lib/mongodb.js` implements the standard Next.js pattern of caching the client promise on `global` in development to avoid connection storms during hot reload.

### Security posture — factual observation only

During connection testing, the MongoDB instance on port 27017 was found to be **reachable from the public internet**, and the `lawapp` database's collection list could be read **without supplying credentials**. This indicates that database access control is **not currently enforced**, and that MongoDB is **publicly exposed rather than private**.

> ⚠️ **Recommendation (not yet implemented):** restrict port 27017 to trusted addresses or an SSH tunnel, and enable MongoDB authorization. Shell history shows SSH tunnel commands were used at some point, suggesting a private-access approach was trialled, but the **current** `.env` connects directly to the public IP.

### Backups

❌ **Not implemented.** No backup configuration of any kind was found.

---

## 7. Database Structure

### Actually implemented (verified live in MongoDB)

**One collection exists: `users`** — 1 document, with only the default `_id_` index. **No custom indexes have been created** (no unique index on `email` or `uid`).

The `users` document stores:

| Field | Meaning in plain language |
|---|---|
| `uid` | The unique ID given to the person by the Firebase login service |
| `fullName` | The staff member's full name |
| `email` | Their work email, stored in lower case |
| `photoURL` | Their profile picture link (populated automatically for Google sign-ups) |
| `address`, `phone`, `jobTitle`, `registrationNumber`, `staffId` | Empty placeholder fields for staff details, to be filled in later |
| `role` | Their job role — always set to `caseworker` at present |
| `accountStatus` | Whether the account is usable — always set to `PENDING` at present |
| `joiningDate` | The date they joined the firm — always empty (`null`) at present |
| `createdAt`, `updatedAt` | When the record was created and last changed |

### Planned but NOT implemented

`src/lib/collections.js` declares names for **eight** collections. Only `users` actually exists; the remaining seven are **names on a list with no schema, no code, and no data**:

| Planned collection | Status |
|---|---|
| `users` | ✅ Exists and in use |
| `clients` | 📋 Name declared only — not implemented |
| `cases` | 📋 Name declared only — not implemented |
| `payments` | 📋 Name declared only — not implemented |
| `caseworkerAgreements` | 📋 Name declared only — not implemented |
| `profitDistributions` | 📋 Name declared only — not implemented |
| `auditLogs` | 📋 Name declared only — not implemented |
| `notifications` | 📋 Name declared only — not implemented |

---

## 8. Image Upload & Storage

### Business/User View

The intended design is sound: when a staff member uploads a photo, the picture file itself is saved **on the server's hard drive**, and only a short web link to it is saved in the database. That keeps the database small and fast.

A test page has been built where a user can drag-and-drop or pick an image, see a preview and its file size, and press Upload. Files must be **under 1 MB** and must be a **JPG, PNG or WebP** image.

**However, this feature does not currently work end-to-end.** The checks on the application's side work correctly, but the remote storage server could not be contacted during testing, so no image could actually be saved or viewed.

### Architecture — what is actually implemented

```
Browser (upload test page)
   ↓  sends the file to the local Next.js app
Next.js API bridge  →  /api/upload  (src/app/api/upload/route.js)
   ↓  checks size + type, then forwards the file
Remote VPS PHP receiver  →  http://72.61.17.107/uploads/upload.php
   ↓  (intended) saves file to disk
Image storage directory  →  (intended) /var/www/uploads/images/
   ↓  (intended) served back as a static file
Nginx  →  returns the image URL to the browser
```

The **first three steps exist in the repository**. Everything from the PHP receiver onward lives on the VPS and **could not be verified** from this machine.

### Point-by-point verification of the stated policy

| Requirement | Status | Evidence |
|---|---|---|
| Images stored on VPS filesystem, **not** inside MongoDB | ✅ Implemented by design | The API returns only an `imageUrl` string; no binary data ever touches the database |
| Database stores only the URL/reference | ⚠️ Partially — the mechanism returns a URL, but **no code saves that URL to any database record yet**. The test page merely displays it. |
| Storage directory `/var/www/uploads/images/` | ⚠️ **Referenced but not verified.** Named only in a comment on the test page. The actual directory on the VPS could not be inspected. |
| **1 MB maximum** per image | 🧪 Implemented and tested | Enforced twice: in the browser (`upload/page.jsx`) and on the server (`api/upload/route.js`, `1 * 1024 * 1024`) |
| Allowed formats JPG / JPEG / PNG / WebP | 🧪 Implemented and tested | Server allow-list is `image/jpeg`, `image/png`, `image/webp`. **JPG and JPEG are both covered**, since both use the `image/jpeg` MIME type. A live test uploading a `.txt` file was correctly **rejected with HTTP 400**. |
| Random/generated filenames | ⚠️ **Could not verify.** No filename generation exists in the Next.js code — the original filename is forwarded as-is. Renaming, if it happens, must occur inside the VPS PHP receiver, which was not inspectable. |
| File **size** validated | ✅ Implemented (client + server) |
| **MIME type** checked | ✅ Implemented (server-side allow-list) |
| File **extension** checked | ❌ Not implemented in the Next.js layer — only the browser-reported MIME type is checked, which a determined user could spoof |
| Invalid files rejected | 🧪 Tested — live request with a text file returned `400 Invalid file type` |
| Directory permissions/ownership | ⚠️ **Could not verify from the available project/server evidence** (no shell access to the VPS from this machine) |

### Nginx image delivery

⚠️ **Could not verify from the available project/server evidence.**

Port 80 on the VPS was unreachable from this machine on every attempt. Consequently the following are all **unverified**:

* whether Nginx is installed or running
* whether it serves `/uploads/...` directly as static files
* caching headers, script-execution restrictions, or any security directives
* whether it is acting as a reverse proxy
* whether any configuration was successfully tested or reloaded

**No Nginx configuration file exists anywhere in this repository**, so nothing about the web-server setup can be confirmed from the code either.

*(Benefit in plain language, for context: letting Nginx serve images directly means pictures load quickly and cheaply, without the main application having to do the work each time.)*

### Local development → VPS: actual mechanism

**Two overlapping mechanisms are configured, and they conflict:**

1. **Next.js API bridge** — `src/app/api/upload/route.js` receives the file, validates it, and forwards it with `fetch()` to `http://72.61.17.107/uploads/upload.php`. ✅ This is the mechanism the test page actually reaches.
2. **Next.js rewrite** — `next.config.mjs` also declares a rewrite sending `/api/upload` to `http://72.61.17.107/api/upload`, plus `/uploads/:path*` to the VPS.

Because a real route file takes precedence over a rewrite in Next.js, **the rewrite for `/api/upload` is redundant and points at an endpoint (`/api/upload` on the VPS) that is different from the one the bridge actually calls (`/uploads/upload.php`)**. This is a latent inconsistency in the configuration.

There is **no PHP receiver source code in this repository** — it exists (if at all) only on the VPS.

---

## 9. Problems Encountered & Solutions

Reconstructed strictly from code artefacts, git history, configuration, and live testing. Items that could not be evidenced are not listed.

**1. Local app writing directly to remote storage**
**Problem →** A local Next.js server cannot write files into a remote machine's filesystem; a direct disk write would fail with errors of the "Failed to write file to disk" family.
**Solution →** The upload route was implemented as an **HTTP bridge** that forwards the file to a receiver endpoint on the VPS instead of attempting any local/remote disk write. The route contains no `fs` usage at all.
**Current status:** ✅ Architecture corrected in code. ⚠️ End-to-end delivery still unverified.

**2. Upload returns HTTP 500 / "Failed to fetch"**
**Problem →** Live testing during this audit reproduced exactly this: a valid PNG upload returned `500` with `"Could not connect to remote upload server."`
**Investigation →** Network testing showed the VPS is alive (ping succeeds, SSH and MongoDB ports reachable) but **port 80 is unreachable** from this network ("No route to host") on every attempt.
**Current status:** ❌ **Unresolved.** The error is correctly *handled* — the code catches it and returns a clear message rather than crashing — but uploads cannot currently complete. Root cause (VPS firewall, Nginx not running, or upstream network blocking) **could not be determined from here**.

**3. Cross-origin dev-server access warning**
**Problem →** Next.js 16 blocks dev-server requests from non-localhost origins.
**Solution →** `allowedDevOrigins: ['100.115.92.194']` was added to `next.config.mjs`.
**Current status:** ✅ Resolved (uncommitted change).

**4. MongoDB connection exhaustion during hot reload**
**Problem →** Next.js dev mode re-executes modules on every change, which can open a new database connection each time.
**Solution →** The client promise is cached on `global` in development.
**Current status:** ✅ Resolved (`src/lib/mongodb.js`).

**5. Verifying the database was actually reachable**
**Problem →** No way to tell whether the app could talk to the VPS database.
**Solution →** A dedicated diagnostic endpoint `GET /api/test` was added that pings MongoDB and reports status plus latency.
**Current status:** 🧪 Resolved and confirmed working — returned `online`, `ping: {ok:1}`.

**6. Browser autofill interfering with the auth forms**
**Problem →** Browsers auto-filling credentials into the wrong fields.
**Solution →** Hidden decoy inputs plus `autoComplete="off"` / `"new-password"` attributes were added to both forms.
**Current status:** ✅ Implemented.

**7. Upload endpoint crashes on a missing file**
**Problem →** Discovered during this audit: posting with **no file at all** returns HTTP **500** instead of the intended **400 "No file provided."** The `request.formData()` call throws before the guard clause is reached.
**Current status:** ❌ **Open defect** — not previously identified, minor severity.

---

## 10. Testing Completed

### Tested successfully (evidence obtained during this audit)

| Test | Result |
|---|---|
| MongoDB connectivity via `GET /api/test` | ✅ PASS — `{"status":"online","ping":{"ok":1}}`, latency 1544 ms |
| Direct MongoDB connection using the app's configured URI | ✅ PASS — connected, server version 8.0.31 |
| Database/collection enumeration | ✅ PASS — database `lawapp`, collection `users` present |
| Real user record written by the signup flow | ✅ PASS — 1 document with correct shape (`role: caseworker`, `accountStatus: PENDING`), created via a **Google** registration (profile photo URL present) |
| Upload endpoint rejects a disallowed file type | ✅ PASS — returned `400 "Invalid file type. Only JPG, PNG, and WebP are allowed."` |
| Application builds and dev server runs | ✅ PASS — `next-server` confirmed listening on port 3000; `.next` build output present |

### Tested and FAILED

| Test | Result |
|---|---|
| Valid PNG upload end-to-end to the VPS | ❌ FAIL — `500 "Could not connect to remote upload server."` |
| VPS HTTP (port 80) reachability | ❌ FAIL — "No route to host" on all attempts |
| Viewing an uploaded image afterwards | ❌ Not possible — no upload ever succeeded |

### Configured but NOT verified

* The 1 MB size limit — the *code path* is present and correct in both browser and server, but **no live test with an oversized file was run** against a working upload chain.
* Random filename generation, storage directory, and directory permissions on the VPS.
* Nginx static delivery, caching, and security configuration.
* Local development successfully storing to remote VPS storage — **this specifically does not work at present.**

### Never tested (no test infrastructure exists)

There is **no automated test suite** in this project — no test framework, no test files, no test script in `package.json`. All verification is manual.

---

## 11. Partially Completed / Needs Verification

| Item | Concern |
|---|---|
| **Sign In screen** | Visually complete but **functionally inert** — no handlers on either button |
| **`PrivateRoute` component** | Correctly written but **imported by no file**, and redirects to `/login`, which **does not exist** |
| **`firebaseAdmin.js`** | Written, but `firebase-admin` is **not installed** and the file is **never imported** — so API routes accept requests **without verifying the Firebase token** despite the client faithfully sending one |
| **`useAxiosSecure`** | Correctly attaches the token, but since no server-side verification exists, the token is currently decorative |
| **`LegalSignUp.jsx`** | Dead code — a role-picker prototype that is never rendered |
| **`api/users/signin/route.js`** | **Empty file (0 bytes)** |
| **`api/users/approve/route.js`** | **Empty file (0 bytes)** |
| **`next.config.mjs` rewrite** | Points `/api/upload` at a VPS path that differs from the one the bridge actually calls — redundant and inconsistent |
| **`MONGODB_NAME` env var** | Defined but unused; the database name `lawapp` is **hardcoded** in `src/lib/collections.js` |
| **Duplicate-user check** | Matches on `uid` only, not email — the same person signing up once with email/password and once with Google would create **two separate records** |
| **`public/Law.gif`** | A **30.5 MB** GIF is committed to the repository and is not referenced by any component — significant repo bloat |
| **VPS OS, Nginx, PHP receiver, permissions, firewall** | All **unverifiable from this machine** |

---

## 12. Not Yet Implemented

* ❌ Working login (email/password **or** Google) from the Sign In screen
* ❌ Logout button anywhere in the UI
* ❌ Any dashboard or post-login page — the app has exactly **one** user-facing page plus a test page
* ❌ Pending-approval page
* ❌ Admin approval interface / any admin area at all
* ❌ Role-based access control (only the literal string `caseworker` is ever written)
* ❌ Account-status enforcement (`APPROVED` / `REJECTED` / `SUSPENDED` do not exist in code)
* ❌ Server-side authentication on API routes
* ❌ Client management
* ❌ Case management
* ❌ Payments / financial tracking
* ❌ Caseworker agreements
* ❌ Profit distribution
* ❌ Audit logs
* ❌ Notifications
* ❌ Password reset / email verification
* ❌ Database indexes (including uniqueness constraints)
* ❌ Automated tests
* ❌ Production deployment (no PM2, no domain, no SSL, no CI/CD)
* ❌ Database backups

---

## 13. Google Sign-In Policy — Verified Behaviour

The stated desired policy is:

> *Google Sign-In must NOT automatically create a new account. The email must already exist in the law firm's system.*

**This policy is ❌ NOT implemented.**

Verified current behaviour:

| Scenario | Actual behaviour |
|---|---|
| **Existing registered user signs in with Google** | From the **Sign Up** panel: the Google popup runs, the API finds the matching `uid` and returns the existing record without duplicating it. From the **Sign In** panel: **nothing happens** — the button has no handler. |
| **Brand-new, unregistered Google account** | ✅ **An account is created automatically.** `signInWithPopup` creates the Firebase user, and `POST /api/users/signup` inserts a brand-new MongoDB record with `role: caseworker`, `accountStatus: PENDING`. There is **no check that the email already belongs to the firm.** |
| Rejection of unknown emails | ❌ Not implemented |
| Redirect of unknown emails to registration | ❌ Not implemented |
| Allow-list / invitation check | ❌ Not implemented |

**Evidence:** The single real user in the live database was created exactly this way — a Google profile photo URL is present on the record, confirming the auto-creation path ran successfully.

**Mitigation in place:** New accounts land as `PENDING`, so an unwanted registration is at least flagged — but since **nothing reads `accountStatus`**, that flag currently provides no actual protection.

---

## 14. Current System Status

**Status: ⚠️ Early prototype — not usable by the firm, not deployed to production.**

* ✅ The application runs locally and connects successfully to the live VPS database.
* ✅ Staff registration works and correctly stores records marked as pending.
* ❌ Nobody can log in — the login screen is not connected.
* ❌ There is nothing behind the login screen to log in to.
* ❌ Image uploads cannot currently complete; the storage server is unreachable from the development machine.
* ❌ No production deployment exists.
* ⚠️ The database is reachable from the public internet and access control is not currently enforced — this should be addressed before any real client data is entered.

**Realistic completion estimate: roughly 5–10% of a full law-firm management system.** The foundation (framework, auth provider, database link, branding, form patterns) is in place and of reasonable quality; the business functionality is almost entirely still to be built.

---

## 15. Status Summary Table

| Area | Status | What is actually done |
|---|---|---|
| **Authentication** | ⚠️ Partially implemented | Firebase auth provider fully wired (register / login / Google / logout / session listener). Only **registration** is actually connected to the UI. **Login is not functional.** No server-side token verification. |
| **Registration** | ✅ Implemented | Email/password and Google sign-up both work; validation, loading states, toasts and error handling all present; record written to MongoDB as `PENDING` |
| **Google Sign-In** | ⚠️ Partially implemented | Works on the **Sign Up** panel only. The Sign In panel's Google button does nothing. **Auto-creates accounts for unknown emails** — the "must already exist" policy is **not** implemented. |
| **Account Approval** | ⚠️ Partially implemented | `accountStatus: 'PENDING'` is stored on every new user. **No pending page, no admin interface, no approval endpoint (file is empty), no code reads the status.** Approval is only possible by editing the database manually. |
| **MongoDB** | 🧪 Implemented and tested | Live connection confirmed to database `lawapp` on MongoDB 8.0.31. One collection (`users`) with one document. **No custom indexes. Access control not enforced. No backups.** |
| **VPS** | 🔧 Partially configured | Host `72.61.17.107` alive; SSH and MongoDB reachable. **HTTP (port 80) unreachable.** OS, Nginx, PHP receiver and firewall rules **could not be verified.** No deployment artefacts in the repo. |
| **Image Upload** | ⚠️ Partially implemented | Next.js API bridge with 1 MB and MIME validation is implemented and **verified rejecting invalid types**. **Forwarding to the VPS fails (HTTP 500) — no upload has ever succeeded.** |
| **Image Storage** | 📋 Planned / not verified | Design is correct (files on disk, URL in DB). The storage directory, filename randomisation, and permissions exist only as comments/intent — **none verified**, and **no code saves an image URL to any record**. |
| **Nginx** | ⚠️ Could not verify | No configuration in the repository; port 80 unreachable. Installation, static delivery, caching, and security settings are all **unconfirmed**. |
| **Testing** | ⚠️ Manual only | **No automated test suite exists.** Manual verification confirmed: DB connectivity ✅, user record creation ✅, invalid-file rejection ✅, valid image upload ❌ FAILED. |
| **Full Law Management System** | ❌ Not implemented | Only `users` exists. Clients, cases, payments, agreements, profit distributions, audit logs and notifications are **collection names in a constants file** — no schemas, no endpoints, no UI, no data. |

---

# What I Actually Completed

Verified, evidence-backed work present in this project:

1. **A Next.js 16 application scaffold** using the App Router, Tailwind CSS v4 with DaisyUI, and path aliasing — builds and runs successfully (dev server confirmed listening on port 3000).

2. **Firebase Authentication integration** — a global `AuthProvider` exposing registration, email/password login, Google popup login, logout, profile update, and a live session listener, mounted app-wide and consumed through a `useAuth` hook.

3. **A live MongoDB connection to a remote VPS** — with development connection caching to survive hot reloads. **Independently verified working** against MongoDB 8.0.31 on database `lawapp`.

4. **A database health-check endpoint (`GET /api/test`)** that pings MongoDB and reports status, latency and errors. **Verified returning `online`.**

5. **A working user-registration API (`POST /api/users/signup`)** that creates a structured staff record with 14 fields, defaults every new account to `role: caseworker` / `accountStatus: PENDING`, and guards against duplicate insertion by Firebase `uid`. **Verified — a real record produced by this route exists in the live database.**

6. **A complete, polished Sign-Up experience** — Google sign-up, full name / email / password fields, live inline validation, password visibility toggle, disabled-and-relabelled loading button, toast notifications, an inline error banner, anti-autofill protection, and a panel switch to Sign In.

7. **A Sign-In interface** matching the same visual language (visual layer only — not yet wired to the auth functions).

8. **A branded split-screen landing page** with a custom animated HTML-canvas background rendering drifting scales-of-justice, gavel, pillar and § symbols that respond to cursor proximity, plus a branded loading screen — fully responsive from mobile to desktop.

9. **An image-upload API bridge** enforcing a 1 MB size limit and a JPG/JPEG/PNG/WebP MIME allow-list before forwarding files to a remote VPS receiver, with structured error responses. **Validation verified live — a disallowed file type was correctly rejected with HTTP 400.**

10. **An image-upload test page** with drag-and-drop, file picker, image preview, file-size display, client-side 1 MB pre-check, upload progress state, success/error panels, and a result view for the returned image URL.

11. **An authenticated Axios client** that attaches the Firebase ID token to outgoing requests and automatically signs the user out on 401/403 responses.

12. **Environment-based configuration** for the database, Firebase, and server URLs, with all secret-bearing files excluded from version control.

13. **A collection-name registry** establishing consistent naming for the eight planned domain collections.

### Explicitly NOT completed

Login functionality, logout UI, any dashboard, the pending-approval page, the admin approval interface, role-based access control, account-status enforcement, server-side API authentication, the Google "email must already exist" policy, working end-to-end image upload, Nginx verification, database indexes, backups, automated tests, and production deployment.

---

*Report generated from direct inspection of the repository, live database queries, live API endpoint testing, and network reachability testing. No source code was modified. No credentials, keys, tokens, or secret values are reproduced in this document.*
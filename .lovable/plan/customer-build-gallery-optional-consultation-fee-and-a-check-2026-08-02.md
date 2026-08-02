# Customer build gallery, optional consultation fee, and a checkout page

## 1. New page: Customer Builds gallery (`/gallery`)
A public page showing photos of real builds you've delivered, with title, short caption, and specs.

- Visitors: browse only.
- You: sign in with an admin login, then an "Add build" panel appears on the same page — upload a photo, add title/caption/specs, and delete entries.
- Photos are stored in cloud storage; entries in a `customer_builds` table. Public can read; only your admin account can add, edit, or delete.
- Admin access uses email/password sign-in plus an admin-role check (roles live in their own table, never on the profile) — so no one else can post.
- Linked from the navbar and footer.

## 2. Remove Mini-ITX everywhere
Drop "Mini-ITX — smallest possible" (and the custom tier's "Move to Mini-ITX") from every tier's size options, leaving Full ATX and Micro-ATX. Tier copy that mentions ITX is reworded, and the "Stealth Cube" gallery entry becomes a Micro-ATX compact build.

## 3. Consultation fee becomes optional
The consultation is aimed at people who don't know computers, so it becomes a choice rather than a gate:

- On the final step, two options:
  - **Free request** — send your build request, we reply with a part list and quote.
  - **Guided consultation ($15)** — a walkthrough call/writeup for people who want help deciding; credited toward the build, only refundable if you buy.
- Default is the free path. Copy explains who each is for.
- The choice is saved with the submission, and the success page reflects which path was chosen.

## 4. New checkout page (`/checkout`)
A full order-summary page reached at the end of the consultation wizard:

- Shows the chosen tier, every selected part (size, case/colour, CPU, GPU, RAM, storage, cooling) or repair symptoms, contact details, budget, timeline, and notes.
- Line items: build estimate range from the tier, plus the $15 consultation fee only if selected — with the "credited toward your PC" note.
- "Edit" links jump back to the relevant wizard step.
- A "Place request" button submits and goes to the success page. No payment is processed yet — the page states you'll be contacted to arrange payment, and it's built so real payments can be switched on later.

## Technical notes
- Migration: `customer_builds` table (image_path, title, caption, specs, sort order) + `user_roles`/`app_role` + `has_role()` security-definer function, with GRANTs and RLS (public read, admin-only write); public storage bucket `build-photos` with admin-only write policies.
- New routes: `src/routes/gallery.tsx`, `src/routes/checkout.tsx`, `src/routes/auth.tsx` (admin sign-in).
- `src/data.ts`: strip Mini-ITX options; update the Stealth Cube entry.
- `src/routes/consultation.tsx`: fee becomes a `consultationType` choice ("free" | "guided"); step 3 hands off to `/checkout` carrying the wizard state instead of submitting directly.
- `consultations` table gains a nullable `consultation_type` column; existing insert validation policy updated accordingly.

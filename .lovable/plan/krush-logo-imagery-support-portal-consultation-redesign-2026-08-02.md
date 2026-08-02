# KRUSH: logo, imagery, support portal, consultation redesign

## 1. New logo
Use the uploaded KRUSH PC's shield artwork as the real brand mark:
- Upload it as a CDN asset and replace the hand-drawn SVG in `Logo.tsx` with the image (mark only in the navbar, mark + wordmark where space allows).
- Generate a square favicon from the same mark and wire it into the root route.

## 2. Fresh build photography (no reuse)
Every card on the home gallery and the tier cards currently repeats three stock photos. Replace them with six unique generated build renders (Cryo-Stream Pro, Stealth Cube, Apex Frame, Frost Workstation, Neon Pulse, Silent Deck) plus four unique tier images, all in the cyan/orange neon studio style. No image used twice anywhere on the site.

## 3. Custom & Upgrades tier gets a Repairs option
In the Custom tier, add a service-type selector with three modes: Upgrade, Full custom build, and **Repair / diagnostics** (won't boot, overheating, crashes/BSOD, noisy fans, liquid-cooling leak, data recovery, cleaning & re-paste). Picking Repair swaps the part-upgrade dropdowns for a symptom checklist plus a "what's wrong" field, and the copy explains diagnostics-first, quoted-per-job pricing.

## 4. Support & troubleshooting portal
New `/support` page (linked in the nav and footer) where existing customers can:
- Submit a ticket: name, email, order/build reference, category (hardware fault, software/driver, performance, warranty, general), priority, description.
- Browse a troubleshooting knowledge base of common fixes (PC won't POST, no display, thermal throttling, BSOD, Wi-Fi/driver issues, RGB software) as expandable cards.
- See a confirmation with expected response time after submitting.

Tickets are stored in the backend with row-level security so submissions are write-only from the public site and readable only by you.

## 5. Consultation page rebuild
Keep the exact colour language (ink background, cyan/orange/amber/ice accents, glass panels) but rebuild the structure as a **stepped wizard** instead of one long form:

```text
Step 1  Choose your path      tier cards w/ imagery, service type for Custom
Step 2  Configure             per-part upgrade pickers (or repair symptoms)
Step 3  About you & budget    contact, budget, timeline, use case
Step 4  Review & pay          summary of every choice + $15 fee note -> Stripe
```
- Sticky progress rail on the left with the 4 steps, sticky build-summary card on the right showing running selections.
- Per-step validation, back/next, no page reload.
- Fee explainer stays: $15, credited toward the build, only refundable if you buy.

## Technical notes
- Images generated into `src/assets`, referenced from `src/data.ts`; logo + support portal images via Lovable assets/CDN.
- `src/data.ts`: add `serviceTypes`/repair symptom data to the `custom` tier; keep the `Tier` shape otherwise.
- New `src/routes/support.tsx` and a `support_tickets` table (migration with GRANTs, RLS: anon insert only, no public select).
- `src/routes/consultation.tsx` rewritten into a wizard with small step components; submission payload unchanged apart from the new repair/service fields.

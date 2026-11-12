# i-Snex v4 — IPEX food ordering

This is an improved mobile-first ordering prototype. It is still a prototype until Supabase is configured and the order manager flow is built.

## What changed in this build
- Name first, then restaurant selection.
- Each restaurant now has its own visual treatment.
- De Specht is populated from the official 2026 takeaway menu PDF linked on its website.
- Bie Immink is populated from the menu and prices supplied in the conversation. The menu page is linked directly.
- Kebab van Erhan's confirmed offering is restored. Chicken/veal selection uses an inline two-choice switch, not a browser popup. Prices that are not published remain marked `Prijs op locatie`.
- Products can have required choices, optional extras, item-specific notes and a quantity selector.
- The checkout still supports a general order message.
- Weight-based Bie Immink products show their unit price and the basket total is marked as an estimate. Actual weight can change the final amount.
- Official restaurant imagery is used where accessible: De Specht's own website photo and a recent Bie Immink shop photo from 1Twente. Kebab van Erhan's social posts could not be fetched reliably, so no fake “official” Kebab image has been substituted. The restaurant's supplied Instagram and Facebook links are used instead.

## Menu sources
- De Specht: official 2026 takeaway PDF: https://cafetariadespecht.nl/wp-content/uploads/2026/10/A3_Afhaalmenu_2026_compressed.pdf
- Bie Immink: https://bieimmink.nl/menu/ — item names and prices entered from the menu text supplied by IPEX. The disclaimer from the source is shown in the app.
- Kebab van Erhan: https://www.instagram.com/kebab_van_erhan/ and https://www.facebook.com/p/Kebab-van-Erhan-100049790695923/?locale=nl_NL. Product list supplied by IPEX; prices not publicly listed.

## Run as a preview
Upload the contents of this folder to the root of the static website. Use `display.html` as the Yodeck QR screen. Open `index.html` to test ordering. Without Supabase configured, orders are saved only in the current browser's local storage; they are not shared between employees.

## Connect Supabase (free tier)
1. Create a Supabase project.
2. In Authentication → Providers, enable **Anonymous Sign-Ins**.
3. Run `supabase/schema.sql` in SQL Editor.
4. Put the Supabase Project URL and anon/public key in `config.js`.
5. Deploy again. Never put the `service_role` key in browser code.

## Still not production-ready
- Supabase must be configured; the current menu data is seeded in `menus.js` and not yet centrally editable.
- Manager/admin dashboard, central menu editor, order cut-off, locking, edit/cancel flow and consolidated restaurant tickets are not yet implemented.
- Private order history and robust account/device recovery need further testing.
- Weight-based products are estimated using the listed per-kilo or per-100g rate; actual checkout weight may differ.
- De Specht's 2026 PDF lists sauce varieties but does not list sauce prices, so those are intentionally shown as `Prijs op locatie` rather than reusing older prices.
- Kebab van Erhan's social-media images remain unavailable for reliable extraction. If you can upload screenshots of those posts, I can incorporate the actual food photography and any further menu detail.

## Files
- `index.html`, `styles.css`, `app.js`: ordering experience
- `display.html`: Yodeck start screen and restaurant QR codes
- `menus.js`: menu data
- `config.js`: Supabase public configuration
- `supabase/schema.sql`: database and row-level security schema


## Manager dashboard and A4 supplier PDFs (v5 addition)

Open `manager.html` on the deployed site to access the manager dashboard. The dashboard requires a Supabase email/password account with a `manager` or `admin` row in `public.user_roles`.

### Set up a manager account
1. In Supabase, enable Email/Password sign-in and create a user under Authentication → Users.
2. Run the updated `supabase/schema.sql` in the SQL Editor (safe to re-run; it adds the policy allowing a user to read their own role).
3. Copy the new user's UUID from Authentication → Users and run:

```sql
insert into public.user_roles (user_id, role)
values ('PASTE-USER-UUID-HERE', 'manager');
```

Use `admin` instead of `manager` if the account should eventually manage menu data too. Do not put the Supabase service-role key in the website.

### What works in this version
- Manager email/password login and role check.
- Reads shared orders from Supabase (up to the latest 1,000).
- Filters by order date and restaurant.
- Updates order status, including a locked status.
- Creates a downloadable A4 PDF for each restaurant, with employee names, ordered items, options, item notes, general order notes and known line totals. Long tickets automatically continue onto additional A4 pages.

PDF creation uses the browser and the jsPDF libraries loaded from a CDN. The manager downloads one PDF per supplier and can email it or print it.

### Current boundaries
- The manager dashboard requires Supabase; local-only test orders on another device are not shared.
- The date filter is based on the order's creation date. A dedicated weekly order-round / cutoff workflow is a later step.
- Menu editing and central menu storage are not implemented yet; menu data is still in `menus.js`.
- A PDF is generated from the orders currently saved in Supabase. It does not send anything to a supplier automatically.

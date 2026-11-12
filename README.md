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

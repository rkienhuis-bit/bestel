# i-Snex v3 — IPEX food ordering

A new, unified ordering flow. This is a working front-end foundation, not yet a production-connected ordering system.

## What's new
- Name is entered first, before choosing a restaurant. It is remembered on that device and can be changed.
- One responsive ordering experience for all three restaurants: restaurant selection → menu → basket → review → confirmation.
- More playful visual design, mobile-friendly basket, search and category filters.
- De Specht menu seeded from its official 2025 PDF. The PDF itself is linked in the app. **Prices must be confirmed with De Specht before live ordering**, because the published menu is from 2025.
- Bie Immink and Kebab van Erhan are linked to their own websites. Their actual product lists are not invented: the app shows a clear “menu being prepared” state until verified menu data is added.
- Supabase schema included for central menus, orders, employee-private order history and manager/admin roles.

## Preview without a database
Upload the files to a static host. Use `display.html` as the Yodeck screen; employees scan a restaurant QR and are taken to `index.html` with their restaurant preselected. Open `index.html` directly for normal browsing. The app uses local browser storage for preview orders. These orders are only on that device and are NOT shared or suitable for real company ordering.

## Connect Supabase (free tier)
1. Create a Supabase project.
2. In Authentication → Providers, enable **Anonymous Sign-Ins**.
3. Open SQL Editor and run `supabase/schema.sql`.
4. Copy the Project URL and anon/public key into `config.js`.
5. Deploy again. Never use the `service_role` key in `config.js`.

When configured, the app creates an anonymous Supabase session and saves orders to the database. The RLS policies ensure employees can only see their own orders. Admin/manager screens and the central menu editor are the next implementation step; the database permissions are prepared but the UI is not yet included.

## Important before real use
- The current ordering page does not yet load menu items from Supabase; the De Specht menu is seeded in `menus.js` for the prototype. Bie Immink and Kebab menus need verified item/price data.
- The app currently inserts orders, but editing/cancelling orders and order cut-off/locking are not yet implemented in the UI.
- Admin/manager roles must be assigned securely after users exist; do not expose service-role credentials in the browser.
- Supabase free projects can pause after inactivity. Export/backup orders periodically.
- Add a proper privacy notice and confirm the internal data-retention approach before company-wide use.

## Project files
- `index.html`, `styles.css`, `app.js`: unified app
- `display.html`: separate Yodeck screen with restaurant QR codes; each QR opens the app with that restaurant preselected, while still asking for the employee name first
- `menus.js`: menu seed data
- `config.js`: Supabase public configuration (empty by default)
- `supabase/schema.sql`: database and row-level security schema

## Menu source notes
- De Specht official 2025 menu: https://cafetariadespecht.nl/wp-content/uploads/2025/03/Menukaart-Restaurant-2025.pdf
- Bie Immink: https://bieimmink.nl/
- Kebab van Erhan: https://kebabvanerhan.nl/


## Update: Kebab van Erhan
The Kebab menu is restored with the offerings confirmed by the user: freshly sliced chicken/veal döner, kebab sandwich, dönerbox, wrap/dürüm, lahmacun, garlic sauce and gift vouchers from €10. Product prices are intentionally left unspecified because the supplier does not publish them. Chicken/veal choice is available for döner products. Orders can include an optional general note. Unknown-price items are marked 'Prijs op locatie'; the order total remains pending rather than showing a fabricated amount. Kebab links point to the supplied Instagram and Facebook profiles, not a guessed website.

If you already ran the previous Supabase schema, apply the schema change manually: make `orders.total` nullable and add `orders.note text`. The updated schema.sql includes both changes for fresh installs.

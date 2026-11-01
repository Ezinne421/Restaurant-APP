# Veejay Foods — full business demo

A responsive, dependency-free sales demo based on the supplied Veejay Foods product design. It connects three experiences on one device: Customer ordering, Kitchen operations, and Owner administration. The app uses the original Veejay Foods logo, sample Abuja pickup points, Nigerian menu photography, and an Uber Eats-inspired storefront.

## Run

Requires Node.js 18 or later. No dependency installation needed.

```sh
npm start
```

The server listens on port 3000 (override with `PORT`). Open it in a browser using your development environment’s supported port access.

## Website

Every push to `main` deploys the contents of `public/` to GitHub Pages. The production demo URL is:

`https://ezinne421.github.io/Restaurant-APP/`

The site includes a web-app manifest and service worker. Supported browsers can install it from the **Install web app** prompt, and previously loaded assets remain available offline. Demo state is stored separately in each browser, so role changes share data within that browser rather than across different devices.

### Vercel

The repository includes `vercel.json` and publishes the static app from `public/`. Import the GitHub repository into Vercel without changing its build or output settings.

## Android APK

The installable demo is available at `artifacts/Veejay-Foods-Demo.apk`. Copy it to an Android phone, open it, and allow installation from the browser or file manager when Android asks. The APK uses the package ID `com.veejayfoods.app`, supports Android 6.0 and later, and bundles all demo data and media for offline use. Version 2 uses the same signing identity and installs as an upgrade over version 1.

To rebuild it after changing files under `public/`, run:

```sh
npm run android:apk
```

The local Android toolchain must be available under `/workspace/.toolchains`, or set `ANDROID_SDK_ROOT` and `JAVA_HOME`. This is demo-signed for direct testing. A Play Store release requires a private production signing key controlled by Veejay Foods.

## Recommended presentation journey

1. Start as Customer and sign in using the displayed demo OTP `123456`.
2. Add meals, choose a pickup slot, test a failed payment, then complete a successful payment.
3. Switch to Kitchen staff and move the same order from Placed to Preparing and Ready.
4. Switch to Customer and show the live Ready state and secure-looking collection code.
5. Return to Kitchen, enter the code, and confirm collection.
6. Open Owner / admin to show updated sales, order history, popular items, stock and price controls.
7. Submit a customer complaint and resolve its simulated refund from the Owner view.
8. Use **Guided demo** at any time, and reset the presentation from Owner settings or Customer account.

The three roles share persistent device-local state. Orders, status changes, customer reports, menu prices and availability update across roles immediately.

This remains a sales demo, not a production ordering system. OTP, payment outcomes, notifications, QR codes, refunds, exports, camera uploads and analytics are simulations. No money, SMS or customer data leaves the device. Sample pickup times do not represent live capacity. Food photographs are representative samples, not approved Veejay product photography; see `public/assets/food/SOURCES.md` for provenance.

## Small everyday conveniences

- **Order again:** review current prices and available items before adding them to the existing basket. Choose a fresh pickup time and review checkout; this does not create or pay for an order.
- **Favourites:** save meals and use the Favourites menu filter. Saved per signed-in phone number on this device.
- **Pickup directions:** Utako uses 51 Anthony Enahoro Street, Utako, Abuja. Owner settings can save confirmed street addresses for other outlets. Unknown addresses have no directions link.
- **Meal labels:** Owner → Menu & stock → Meal labels can set kitchen-confirmed spice level, vegetarian status and allergens. Nothing is inferred from sample photos or meal names. Unknown allergen information is clearly identified in meal details.
- **Kitchen filters:** filter active orders by status and pickup day/time, with results sorted by pickup time.
- **Owner reports:** Today, Yesterday and Last 7 days use payment timestamps in Africa/Lagos time. Last 7 days includes today. Collection totals refer to selected orders; open complaints and active-order counts are explicitly labelled as covering all dates.

Addresses, labels, favourites and orders remain device-local demo data. Owner edits do not sync across devices. Existing saved orders and menu overrides are preserved when updating. Demo reset restores sample data and clears saved preferences.

### Verify conveniences

With Node.js available:

```sh
npm test
npm run test:unit
npm start
```

In another terminal, optionally install Playwright for browser testing (`npm install --no-save playwright`) and run `npm run test:conveniences`. The test uses an installed Google Chrome in an isolated, headless session. Set `BASE_URL` to test a deployment or `PLAYWRIGHT_MODULE` to use a separately installed Playwright package.

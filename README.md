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

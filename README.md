# Veejay Foods — interactive demo

A responsive, dependency-free browser prototype based on the supplied Veejay Foods product design PDF. Uses the original Veejay Foods logo extracted from the client proposal, green brand accents, sample Abuja pickup points, and an Uber Eats inspired storefront layout. Includes live menu search.

## Run

Requires Node.js 18 or later. No dependency installation needed.

```sh
npm start
```

The server listens on port 3000 (override with `PORT`). Open it in a browser using your development environment’s supported port access.

## Android APK

The installable demo is available at `artifacts/Veejay-Foods-Demo.apk`. Copy it to an Android phone, open it, and allow installation from the browser or file manager when Android asks. The APK uses the package ID `com.veejayfoods.app`, supports Android 6.0 and later, and bundles the menu, photos, basket, checkout simulation, and order tracking for offline use.

To rebuild it after changing files under `public/`, run:

```sh
npm run android:apk
```

The local Android toolchain must be available under `/workspace/.toolchains`, or set `ANDROID_SDK_ROOT` and `JAVA_HOME`. This is demo-signed for direct testing. A Play Store release requires a private production signing key controlled by Veejay Foods.

## Try the demo

1. Add meals and adjust quantities in the basket.
2. Choose Wuse II, Garki or Jabi, a day, a pickup time, and a simulated payment method.
3. Place the demo order and view its status under My orders.
4. Open Kitchen demo at the same pickup point. Move the order through Preparing, Ready and Collected.
5. View the collection code under My orders when the order is Ready.

Basket and orders persist in this browser’s local storage. Clear the `veejay-demo` local storage key to reset.

This is a frontend demo, not the production system described in the PDF. There is no authentication, API, real payment processing, SMS, notifications, QR scanning, capacity reservation or refunds. Sample pickup times are illustrative and do not represent live availability. Food photographs are bundled locally as sample imagery, not photos of Veejay’s actual meals or packaging. See public/assets/food/SOURCES.md for provenance. Optional Google Fonts fall back to system fonts offline.

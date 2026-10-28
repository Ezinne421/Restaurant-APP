from playwright.sync_api import sync_playwright

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path="/usr/bin/chromium", headless=True, args=["--no-sandbox"])
    context = browser.new_context(service_workers="allow")
    page = context.new_page()
    response = page.goto("http://127.0.0.1:3000", wait_until="networkidle")
    assert response.ok
    assert page.locator('link[rel="manifest"]').get_attribute("href") == "manifest.webmanifest"
    manifest = context.request.get("http://127.0.0.1:3000/manifest.webmanifest")
    assert manifest.ok
    assert "application/manifest+json" in manifest.headers["content-type"]
    data = manifest.json()
    assert data["name"] == "Veejay Foods Business Demo"
    assert data["display"] == "standalone"
    page.wait_for_function("navigator.serviceWorker && navigator.serviceWorker.controller", timeout=15000)
    cache_names = page.evaluate("caches.keys()")
    assert "veejay-foods-demo-v7" in cache_names
    context.set_offline(True)
    page.reload(wait_until="domcontentloaded")
    assert page.get_by_role("heading", name="One order. Three connected views.").is_visible()
    assert page.locator('img[src="assets/veejay-logo.png"]').first.evaluate("img => img.complete && img.naturalWidth > 0")
    print("PASS: web manifest, service worker, app shell cache, offline reload and cached logo")
    browser.close()

from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:3000"

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path="/usr/bin/chromium", headless=True, args=["--no-sandbox"])
    page = browser.new_page(viewport={"width": 390, "height": 844})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(BASE)
    page.evaluate("localStorage.clear()")
    page.reload()

    for role in ("customer", "kitchen", "owner"):
        if page.locator('[data-open-role]').count():
            page.locator('[data-open-role]').click()
            page.locator(f'[data-role="{role}"]').click()
        else:
            page.locator(f'[data-start-role="{role}"]').first.click()
        if page.locator(".auth-dialog").count():
            page.locator("[data-close]").click()
        assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), role
        assert page.evaluate("[...document.images].every(img => img.complete && img.naturalWidth > 0)"), role
        assert page.evaluate("new Set([...document.querySelectorAll('[id]')].map(el => el.id)).size === document.querySelectorAll('[id]').length"), role

    page.locator('[data-owner-view="complaints"]').click()
    page.get_by_role("button", name="Open complaint").first.click()
    assert page.get_by_text("Customer report", exact=True).is_visible()
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
    page.locator("[data-close]").click()
    assert not errors, errors
    print("PASS: phone-width roles, images, overflow, unique IDs, complaint modal and runtime errors")
    browser.close()

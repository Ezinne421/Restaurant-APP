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
        if role == "customer":
            visible_logos = page.locator('img[src="assets/veejay-logo.png"]').evaluate_all("images => images.filter(img => img.getClientRects().length).length")
            assert visible_logos == 1
            assert page.get_by_text("Mon–Sat 8 AM–8 PM", exact=False).is_visible()
            assert page.get_by_text("No real payments or customer messages", exact=True).count() == 0
            assert page.evaluate("orderingStatus(new Date('2026-10-28T10:00:00Z')).open")
            assert not page.evaluate("orderingStatus(new Date('2026-11-01T20:00:00Z')).open")
            assert "Opens" in page.evaluate("orderingStatus(new Date('2026-11-01T20:00:00Z')).label")
            assert page.locator(".context-card").count() == 2
            page.get_by_role("button", name="Drinks", exact=True).click()
            assert page.locator(".product-card").count() == 6
            for drink in ("Fresh Chapman", "Tigernut Milk", "Pineapple–Ginger Juice", "Assorted Minerals", "Chilled Malt Drink"):
                assert page.get_by_role("heading", name=drink, exact=True).is_visible()
            page.get_by_role("button", name="All", exact=True).click()
            page.locator('[data-item="deal"]').click()
            assert page.locator(".item-dialog-photos img").count() == 4
            assert page.locator('img[src="assets/food/meal-deal.jpg"]').count() == 0
            assert page.locator(".item-dialog-photos").evaluate("grid => [...grid.children].every(img => img.getBoundingClientRect().right <= grid.getBoundingClientRect().right + 1 && img.getBoundingClientRect().bottom <= grid.getBoundingClientRect().bottom + 1)")
            page.locator("[data-close]").click()
        assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), role
        assert page.evaluate("[...document.images].every(img => img.complete && img.naturalWidth > 0)"), role
        assert page.locator('img[src="assets/food/meal-deal.jpg"]').count() == 0
        assert page.evaluate("new Set([...document.querySelectorAll('[id]')].map(el => el.id)).size === document.querySelectorAll('[id]').length"), role

    page.locator('[data-owner-view="complaints"]').click()
    page.get_by_role("button", name="Open complaint").first.click()
    assert page.get_by_text("Customer report", exact=True).is_visible()
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
    page.locator("[data-close]").click()
    assert not errors, errors
    print("PASS: phone-width roles, images, overflow, unique IDs, complaint modal and runtime errors")
    browser.close()

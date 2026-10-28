from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:3000"

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path="/usr/bin/chromium", headless=True, args=["--no-sandbox"])
    page = browser.new_page(viewport={"width": 1200, "height": 900})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(BASE)
    page.evaluate("localStorage.clear()")
    page.reload()

    # Owner can open the guide and move directly into the scanner without modal errors.
    page.locator('[data-start-role="owner"]').first.click()
    page.get_by_role("button", name="View demo report").click()
    assert page.get_by_role("heading", name="Today’s demo summary").is_visible()
    page.get_by_role("button", name="Done").click()
    page.locator('[data-owner-view="orders"]').first.click()
    page.locator("[data-order-detail]").first.click()
    assert page.get_by_text("KITCHEN TICKET", exact=True).is_visible()
    page.get_by_role("button", name="Back to board").click()
    page.locator('[data-owner-view="settings"]').click()
    page.locator('[data-setting-select="slotMinutes"]').select_option("60")
    page.get_by_role("button", name="Guided demo").click()
    assert page.get_by_role("heading", name="Tell one connected story").is_visible()
    page.get_by_role("button", name="Open scanner").click()
    assert page.get_by_role("heading", name="Scan or enter collection code").is_visible()
    page.locator("[data-close]").click()

    # Menu price edits persist after reload.
    page.locator('[data-owner-view="menu"]').click()
    jollof = page.locator(".menu-admin > div", has_text="Smoky Jollof Rice")
    before = jollof.locator(".price-control strong").inner_text()
    jollof.locator('[data-price-delta="100"]').click()
    after = page.locator(".menu-admin > div", has_text="Smoky Jollof Rice").locator(".price-control strong").inner_text()
    assert before != after
    page.reload()
    page.locator('[data-owner-view="menu"]').click()
    assert page.locator(".menu-admin > div", has_text="Smoky Jollof Rice").locator(".price-control strong").inner_text() == after

    # Customer authentication rejects the wrong code and accepts the documented code.
    page.locator("[data-open-role]").click()
    page.locator('[data-role="customer"]').click()
    page.get_by_role("button", name="Send demo code").click()
    page.locator("#otp").fill("111111")
    page.get_by_role("button", name="Verify & continue").click()
    assert page.get_by_text("Use demo code 123456", exact=True).is_visible()
    page.locator("#otp").fill("123456")
    page.get_by_role("button", name="Verify & continue").click()

    # Payment cancellation preserves the basket.
    page.locator('[data-add="puff"]').click()
    page.get_by_role("button", name="Choose pickup time").click()
    assert page.locator("[data-checkout-slot]").count() == 3
    page.get_by_role("button", name="Test cancellation").click()
    assert page.locator(".basket-head").get_by_text("1 items", exact=True).is_visible()

    # Existing receipt and notifications are usable.
    page.locator('[data-view="orders"]').click()
    page.locator('[data-receipt]').first.click()
    assert page.get_by_text("PAYMENT RECEIPT", exact=True).is_visible()
    page.get_by_role("button", name="Done").click()
    page.locator("[data-notifications]").click()
    assert page.get_by_role("heading", name="Order updates").is_visible()
    page.locator("[data-close]").click()

    # Presentation reset restores the seeded menu price.
    page.locator('[data-view="profile"]').click()
    page.locator("#app").get_by_role("button", name="Reset demo").click()
    page.locator("#modal").get_by_role("button", name="Reset demo").click()
    assert page.get_by_role("heading", name="Welcome to Veejay Foods").is_visible()
    assert not errors, errors
    print("PASS: guide, nested scanner, persistent price edits, OTP validation, cancelled payment, receipt, notifications and presentation reset")
    browser.close()

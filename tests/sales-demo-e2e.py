from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:3000"
ARTIFACTS = Path(__file__).resolve().parents[1] / "artifacts"
ARTIFACTS.mkdir(exist_ok=True)

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path="/usr/bin/chromium", headless=True, args=["--no-sandbox"])
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(BASE, wait_until="networkidle")
    page.evaluate("localStorage.clear()")
    page.reload(wait_until="networkidle")

    # Customer onboarding and demo OTP.
    page.get_by_role("button", name="Start the guided customer journey").click()
    page.get_by_role("button", name="Send demo code").click()
    page.get_by_role("button", name="Verify & continue").click()
    page.get_by_text("Hello", exact=False).count()
    assert page.get_by_role("heading", name="Explore the menu").is_visible()

    # Item details, basket, payment failure and successful checkout.
    page.locator('[data-item="jollof"]').click()
    page.get_by_role("button", name="Add to basket").click()
    page.locator('[data-add="chicken"]').click()
    assert "₦4,500" in page.locator("#basket").inner_text()
    page.get_by_role("button", name="Choose pickup time").click()
    page.locator('[data-checkout-payment="Bank transfer"]').click()
    page.locator("#checkout-note").fill("Mild chicken, please")
    page.get_by_role("button", name="Test declined payment").click()
    assert page.get_by_text("Payment declined", exact=False).is_visible()
    page.get_by_role("button", name="Simulate successful payment").click()
    assert page.get_by_text("Payment received", exact=True).is_visible()
    newest = page.locator(".customer-order").first
    code = newest.locator(".order-top > div > span").inner_text().replace("ORDER #", "")

    # Shared Kitchen state: start and mark ready.
    page.locator("[data-open-role]").click()
    page.locator('[data-role="kitchen"]').click()
    ticket = page.locator(".kitchen-order", has_text=code)
    ticket.get_by_role("button", name="Start order").click()
    ticket = page.locator(".kitchen-order", has_text=code)
    ticket.get_by_role("button", name="Mark ready").click()

    # Customer immediately sees Ready and a collection code.
    page.locator("[data-open-role]").click()
    page.locator('[data-role="customer"]').click()
    page.locator('[data-view="orders"]').click()
    newest = page.locator(".customer-order", has_text=code)
    assert newest.get_by_text("Ready", exact=True).count() >= 1
    assert newest.locator("canvas[data-code]").count() == 1

    # Counter code confirms collection.
    page.locator("[data-open-role]").click()
    page.locator('[data-role="kitchen"]').click()
    page.get_by_role("button", name="Scan / enter code").click()
    page.locator("#scan-code").fill(code)
    page.get_by_role("button", name="Confirm collection").click()
    assert page.get_by_text("handed over successfully", exact=False).is_visible()

    # Customer complaint appears in Owner view.
    page.locator("[data-open-role]").click()
    page.locator('[data-role="customer"]').click()
    page.locator('[data-view="orders"]').click()
    newest = page.locator(".customer-order", has_text=code)
    newest.get_by_role("button", name="Report a problem").click()
    page.locator("#complaint-details").fill("The demo order was missing the zobo.")
    page.get_by_role("button", name="Submit report").click()
    page.locator("[data-open-role]").click()
    page.locator('[data-role="owner"]').click()
    assert page.get_by_text("Today’s sales", exact=True).is_visible()
    page.locator('[data-owner-view="complaints"]').first.click()
    assert page.get_by_text("The demo order was missing the zobo.", exact=True).is_visible()
    newest_case = page.locator(".complaint-list article").first
    newest_case.get_by_role("button", name="Open complaint").click()
    assert page.get_by_text("Customer report", exact=True).is_visible()
    assert page.get_by_text("The demo order was missing the zobo.", exact=True).last.is_visible()
    page.get_by_role("button", name="Approve demo refund").click()
    assert page.get_by_text("Demo refund approved and case closed", exact=True).is_visible()

    # Owner stock changes immediately affect Customer menu.
    page.locator('[data-owner-view="menu"]').click()
    page.locator('[data-stock="jollof"]').evaluate("element => element.click()")
    page.locator("[data-open-role]").click()
    page.locator('[data-role="customer"]').click()
    page.locator('[data-view="menu"]').first.click()
    jollof_card = page.locator(".product-card", has_text="Smoky Jollof Rice")
    assert jollof_card.get_by_text("SOLD OUT", exact=True).is_visible()
    jollof_card.locator(".product-photo").click()
    assert page.get_by_role("button", name="Currently sold out").is_disabled()
    page.locator("[data-close]").click()

    # Customer history is private to the signed-in phone number.
    page.locator('[data-view="orders"]').click()
    assert page.get_by_text("ORDER #VF3712", exact=True).count() == 0
    assert page.get_by_text("ORDER #VF1093", exact=True).count() == 0

    # Desktop and mobile rendering.
    page.screenshot(path=str(ARTIFACTS / "sales-demo-customer.png"), full_page=True)
    page.set_viewport_size({"width": 390, "height": 844})
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
    page.screenshot(path=str(ARTIFACTS / "sales-demo-mobile.png"), full_page=True)
    assert not errors, errors
    print("PASS: onboarding, OTP, basket, payment outcomes, shared kitchen status, ready code, collection, complaint, owner analytics, stock control and mobile layout")
    browser.close()

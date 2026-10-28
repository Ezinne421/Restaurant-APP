from pathlib import Path
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path="/usr/bin/chromium", headless=True, args=["--no-sandbox"])
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    page.goto("http://127.0.0.1:3000")
    page.evaluate("localStorage.clear()")
    page.reload()
    page.locator('[data-start-role="kitchen"]').click()
    page.screenshot(path=str(root / "artifacts" / "sales-demo-kitchen.png"), full_page=True)
    page.locator("[data-open-role]").click()
    page.locator('[data-role="owner"]').click()
    page.screenshot(path=str(root / "artifacts" / "sales-demo-owner.png"), full_page=True)
    browser.close()

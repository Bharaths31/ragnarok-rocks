from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:5173/login")

    # PAUSE
    page.pause()

    # Wait for the login form to be visible
    page.wait_for_selector('form')

    # Login
    page.get_by_placeholder("Email").fill("test@example.com")
    page.get_by_placeholder("Password").fill("password123")
    page.get_by_role("button", name="Login").click()

    page.wait_for_.url("http://localhost:5173/dashboard")

    # Search for a book
    page.get_by_placeholder("Search for books...").fill("The Lord of the Rings")
    page.get_by_role("button", name="Search").click()

    # Wait for the book to appear (adjust selector as needed)
    page.wait_for_selector("text=The Lord of the Rings")

    page.screenshot(path="jules-scratch/verification/dashboard.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)

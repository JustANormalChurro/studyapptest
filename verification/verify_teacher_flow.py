from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Login as Teacher
        print("Navigating to login...")
        page.goto("http://localhost:5173/login")
        page.wait_for_selector(".login-container")

        print("Logging in...")
        page.fill("input[type=email]", "admin1@testisd.edu")
        page.fill("input[type=password]", "generic12")
        page.fill("input[type=text]", "E3L0a5")
        page.click("button[type=submit]")

        # Wait for portal
        print("Waiting for portal...")
        page.wait_for_selector(".portal-container")
        page.screenshot(path="verification/portal_teacher.png")
        print("Screenshot saved: portal_teacher.png")

        # 2. Flash App
        print("Opening Flash App...")
        page.click("text=Flash")
        page.wait_for_selector("text=Create Assignment")
        page.screenshot(path="verification/flash_teacher.png")
        print("Screenshot saved: flash_teacher.png")

        # Go back
        page.click("button:has-text('X')")

        # 3. Ringdoor App
        print("Opening Ringdoor App...")
        page.click("text=Ringdoor")
        page.wait_for_selector("text=Create New Test")
        page.screenshot(path="verification/ringdoor_teacher.png")
        print("Screenshot saved: ringdoor_teacher.png")

        # Go back
        page.click("button:has-text('X')")

        # 4. Aura App
        print("Opening Aura App...")
        page.click("text=AuraAttendance")
        page.wait_for_selector("text=Record Attendance")
        page.screenshot(path="verification/aura_teacher.png")
        print("Screenshot saved: aura_teacher.png")

        # Go back
        page.click("button:has-text('X')")

        # 5. Admin DB
        print("Opening Admin DB App...")
        page.click("text=Admin DB")
        page.wait_for_selector("text=ADMIN DATABASE VIEWER")
        page.click("button:has-text('Users')")
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/admin_db.png")
        print("Screenshot saved: admin_db.png")

        # Logout
        print("Logging out...")
        page.click("button:has-text('X')") # Close app
        page.click("button:has-text('Log Out')")

        browser.close()

if __name__ == "__main__":
    verify_frontend()

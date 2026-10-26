"""Verify all fixes: mobile nav, socials, pages still healthy."""
import json
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3458"
out = {}

with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", headless=True)

    # ---- Desktop check ----
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(BASE + "/", wait_until="load", timeout=60000)
    pg.wait_for_timeout(1500)
    out["desktop"] = {
        "burger_hidden": pg.evaluate("getComputedStyle(document.querySelector('.burger')).display") == "none",
        "nav_visible": pg.evaluate("getComputedStyle(document.querySelector('nav')).display") != "none",
        "h1": pg.inner_text("h1"),
        "page_errors": errs,
    }

    # socials on home contact section
    pg.goto(BASE + "/contact", wait_until="load", timeout=60000)
    pg.wait_for_timeout(1000)
    socials = pg.eval_on_selector_all(
        ".social a", "(as) => as.map(a => ({label: a.getAttribute('aria-label'), href: a.getAttribute('href')}))"
    )
    out["socials"] = socials

    # ---- All routes still healthy (do before closing pg) ----
    routes = {}
    for path in ["/", "/work", "/about", "/skills", "/contact", "/privacy",
                 "/projects/aero-view", "/projects/ushodhya-lassi-corner",
                 "/projects/cinematic-travel-edit", "/projects/short-form-content"]:
        r = pg.request.get(BASE + path)
        routes[path] = r.status
    out["routes"] = routes
    pg.close()

    # ---- Mobile check ----
    m = b.new_page(viewport={"width": 390, "height": 844})
    m.goto(BASE + "/", wait_until="load", timeout=60000)
    m.wait_for_timeout(1200)
    out["mobile"] = {
        "burger_visible": m.evaluate("getComputedStyle(document.querySelector('.burger')).display") != "none",
        "nav_closed_initially": not m.evaluate("document.querySelector('nav').classList.contains('open')"),
    }
    m.click(".burger")
    m.wait_for_timeout(400)
    out["mobile"]["nav_opens"] = m.evaluate("document.querySelector('nav').classList.contains('open')")
    out["mobile"]["nav_visible_when_open"] = m.evaluate("getComputedStyle(document.querySelector('nav')).display") != "none"
    out["mobile"]["links_count"] = m.eval_on_selector_all("nav a", "as => as.length")
    # tap Work, menu should close and navigate
    m.click("nav a[href='/work']")
    m.wait_for_load_state("load")
    m.wait_for_timeout(800)
    out["mobile"]["navigated_to"] = m.url
    out["mobile"]["menu_closed_after_nav"] = not m.evaluate("document.querySelector('nav').classList.contains('open')")
    out["mobile"]["work_h1"] = m.inner_text("h1")
    # horizontal scroll check on home
    m.goto(BASE + "/", wait_until="load")
    m.wait_for_timeout(800)
    out["mobile"]["hscroll_px"] = m.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
    m.screenshot(path="verify-mobile.png", full_page=False)
    m.close()

    b.close()

print(json.dumps(out, indent=2))

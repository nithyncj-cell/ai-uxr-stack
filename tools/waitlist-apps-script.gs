/**
 * AI UXR Stack sign-ups: receives the website's "Buy" form and free-download emails, one row each.
 *
 * Setup (once):
 * 1. Open the Google Sheet "AI UXR Stack waitlist responses".
 * 2. Extensions -> Apps Script. Delete what is there and paste this whole file. Save.
 * 2b. In the function menu next to Run, pick "authorize", click Run, and allow access.
 *     (Never pick doPost or myFunction: doPost only runs when the website sends data.)
 * 3. Deploy -> New deployment -> type "Web app".
 *    Execute as: Me. Who has access: Anyone. Deploy, allow access, copy the Web app URL.
 * 4. Send that URL to be added to the website.
 *
 * Columns: Time, Email, Interested in, Slowest part of research,
 *          Changes or additions wanted, Manual task to hand off, Region, Consent, Discount code
 *
 * Robot check: in Apps Script, Project Settings -> Script properties -> add TURNSTILE_SECRET
 * with your Cloudflare Turnstile secret key. Keep the secret out of this file (the repo is public).
 *
 * After changing this code: Deploy -> Manage deployments -> pencil -> Version: New version -> Deploy.
 * The web app URL stays the same.
 */

const MAX_LEN = 2000;
const SHEET_ID = "1epCYP87y_o43FZUWwOC3Gn83QvmFcmbwUjdN_Gya6Aw";   // works whether this script is attached to the sheet or not

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (d.website) return reply({ ok: true });            // hidden field: filled only by bots
    const email = String(d.email || "").trim().slice(0, 254);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply({ ok: false, error: "email" });
    // Waitlist sign-ups need consent; free downloads only record whether the person opted in to emails.
    if (d.consent !== true && d.free !== true) return reply({ ok: false, error: "consent" });
    if (!isHuman(d.cf)) return reply({ ok: false, error: "robot" });

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Time", "Email", "Interested in", "Slowest part of research",
        "Changes or additions wanted", "Manual task to hand off", "Region", "Consent", "Discount code"]);
    }
    if (!sheet.getRange(1, 9).getValue()) sheet.getRange(1, 9).setValue("Discount code");
    sheet.appendRow([new Date(), clean(email), clean(d.item), clean(d.pain),
      clean(d.changes), clean(d.automate), clean(d.region), d.consent === true ? "yes" : "no", clean(String(d.code || "").slice(0, 40))]);
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: "bad request" });
  } finally {
    lock.releaseLock();
  }
}

// Checks the Cloudflare Turnstile token. Skipped until TURNSTILE_SECRET is set.
function isHuman(token) {
  const secret = PropertiesService.getScriptProperties().getProperty("TURNSTILE_SECRET");
  if (!secret) return true;
  if (!token) return false;
  const res = UrlFetchApp.fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "post", payload: { secret: secret, response: String(token) }, muteHttpExceptions: true });
  try { return JSON.parse(res.getContentText()).success === true; } catch (e) { return false; }
}

// Stops a typed answer from running as a spreadsheet formula, and caps its length.
function clean(v) {
  const s = String(v == null ? "" : v).slice(0, MAX_LEN);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Run once from the editor to grant permissions and add the header row. Safe to run again.
function authorize() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  const header = ["Time", "Email", "Interested in", "Slowest part of research",
    "Changes or additions wanted", "Manual task to hand off", "Region", "Consent", "Discount code"];
  sheet.getRange(1, 1, 1, header.length).setValues([header]);
  UrlFetchApp.fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "post", payload: {}, muteHttpExceptions: true });
  Logger.log("Ready: sheet '" + sheet.getName() + "' has its header row, and outside requests are allowed.");
}

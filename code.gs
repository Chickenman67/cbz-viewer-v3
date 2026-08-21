/**
 * CBZ Viewer V3 - Google Apps Script Web App
 * -------------------------------------------------------------
 * Install/run:
 *   1. In Google Drive create a folder and upload your .cbz files.
 *   2. Open Apps Script (script.google.com) on the SAME Google account.
 *   3. Paste this file in as Code.gs and the viewer as index.html
 *      (served via __htmlServiceHtmlTemplate / the doGet below).
 *   4. Deploy -> New deployment -> type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone (or your org) - so the page can call the API.
 *   5. Open the Web app URL.
 *
 * The page (index.html) talks to this script through google.script.run.
 * It can (a) list .cbz files in a Drive folder and (b) fetch one as Base64
 * so the local viewer can unzip + render it in the browser.
 */

/** Folder ID that holds your .cbz files. Blank = search the whole Drive. */
const CBZ_FOLDER_ID = '';

/** How many bytes of a chosen .cbz to stream back (base64). 0 = whole file. */
const MAX_BYTES = 0; // Apps Script has a ~50MB payload limit; large files may fail.

/**
 * Web app entry point. Serves the viewer HTML.
 * Deploy as a Web app so doGet() is hit at the published URL.
 */
function doGet() {
  const tpl = HtmlService.createTemplateFromFile('index');
  tpl.FOLDER_HINT = CBZ_FOLDER_ID || '(entire Drive)';
  return tpl
    .evaluate()
    .setTitle('CBZ Viewer V3')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

/** Return [{id, name, size}] for every .cbz/.zip in the configured folder. */
function listCbz() {
  const files = [];
  try {
    const it = CBZ_FOLDER_ID
      ? DriveApp.getFolderById(CBZ_FOLDER_ID).getFiles()
      : DriveApp.getFiles();
    while (it.hasNext()) {
      const f = it.next();
      const n = f.getName().toLowerCase();
      if (n.endsWith('.cbz') || n.endsWith('.zip')) {
        files.push({ id: f.getId(), name: f.getName(), size: f.getSize() });
      }
    }
  } catch (e) {
    return { error: String(e) };
  }
  return { files: files };
}

/**
 * Fetch a .cbz by Drive file id and return it as a base64 data buffer.
 * The viewer unzips it client-side (fflate) and renders the pages.
 */
function getCbzBase64(id) {
  try {
    const f = DriveApp.getFileById(id);
    const blob = f.getBlob();
    const bytes = MAX_BYTES > 0 ? blob.getBytes().slice(0, MAX_BYTES) : blob.getBytes();
    return { name: f.getName(), base64: Utilities.base64Encode(bytes) };
  } catch (e) {
    return { error: String(e) };
  }
}

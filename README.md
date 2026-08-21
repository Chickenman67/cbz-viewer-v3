# CBZ Viewer V3

A single-file, dependency-light comic (`.cbz`) reader. Open a `.cbz` on your
computer, drag & drop one onto the window, or — when hosted as a Google Apps
Script Web App — open one straight from Google Drive.

Built with [fflate](https://github.com/101arrowz/fflate) (pinned `0.8.3`, loaded
from jsDelivr) for in-browser unzipping. No build step, no backend required
(unless you want the Drive feature).

## Files

| File         | Purpose                                                                 |
|--------------|-------------------------------------------------------------------------|
| `index.html` | The entire viewer (HTML + CSS + JS). Open it directly in a browser.     |
| `code.gs`    | Google Apps Script backend that serves the viewer and reads Drive files.|

## Features

- **Two view modes**
  - **Scroll** — fit-width, vertically scrolling, lazily loaded pages.
  - **2-Page** — cover page shown alone, then paired spreads.
- **Reading direction** — LTR or **RTL** (manga style). RTL is the default;
  arrow / `a` / `d` keys invert accordingly.
- **Gaps On/Off** — toggle the gutter between pages in either mode (gapless is
  handy for double-page splash art).
- **Mouse wheel** scrolls (scroll mode) or turns the page (2-page mode).
- **Keyboard** — `↓`/`PageDown`/`Space` and `↑`/`PageUp` scroll; `←`/`→`/`a`/`d`
  navigate spreads; `Home`/`End` jump; `F` toggles fullscreen.
- **Zoom** — buttons, `Ctrl`+`+`/`-`, `Ctrl`+`0` reset, or `Ctrl`+wheel; persisted.
- **Fullscreen** — covers the whole viewport; the toolbar/controls auto-hide and
  reappear when you move the cursor to the top.
- **ComicInfo.xml** — if the archive contains one, page order follows its
  `<Pages>` element; otherwise a natural filename sort is used.
- **Persistence** — mode, reading direction, and zoom are saved to
  `localStorage`.

## Local use (no server, no login)

Just open `index.html` in any modern browser (double-click it, or use
`file://`). Then:

- Click **Open CBZ** or drag a `.cbz` onto the window.
- Everything runs locally in your browser — the file is never uploaded anywhere.

## Google Drive use (host as a Web App)

The **☁ Drive** button is enabled only when the page is running inside a Google
Apps Script Web App (it is intentionally hidden otherwise).

### Deploy

1. In Google Drive, create a folder and upload your `.cbz` files to it.
2. Go to [script.google.com](https://script.google.com) with the **same Google
   account** that owns the files.
3. Create a new project and paste in:
   - `code.gs` (this repo)
   - `index.html` (this repo) — paste it as a new **HTML file** named exactly
     `index`.
4. (Optional) set `CBZ_FOLDER_ID` in `code.gs` to your folder's ID to limit the
   file list. Leave it blank to search your whole Drive.
5. **Deploy → New deployment → type "Web app"**
   - **Execute as:** *Me*
   - **Who has access:** *Anyone* (so the page can call the API; it only reads
     files in your own Drive)
6. Open the Web App URL. Click **☁ Drive**, pick a `.cbz`, and it streams into
   the same viewer.

### How it works

- `listCbz()` returns the `.cbz`/`.zip` files found in Drive.
- `getCbzBase64(id)` returns the chosen file as Base64; the browser unzips and
  renders it with fflate.
- There is a **45 MB response cap** (Apps Script limit). Files larger than that
  are rejected with a clear message instead of hanging.

## Notes / limits

- Apps Script cannot return responses larger than ~50 MB, so very large `.cbz`
  files via Drive may fail. Local/`file://` usage has no such limit.
- An internet connection is required for the fflate CDN script; the page shows a
  toast if it fails to load.
- `code.gs` and `index.html` are kept in sync in this repo; if you edit one,
  re-deploy the Web App to pick up changes.

## Privacy

Local mode is fully offline — files are read in-browser and never leave your
machine. Drive mode reads files only from *your* Google Drive via your own
Apps Script deployment.

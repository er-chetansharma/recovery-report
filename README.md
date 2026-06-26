# Recovery Insights — Assessment Results Experience

A premium, mobile-first results page that bridges the Free Discovery Assessment
to the ₹199 Recovery Blueprint Session. Built with plain HTML5, CSS3, and
vanilla JavaScript — no frameworks, no build step, no dependencies.

## Folder Structure

```
Recovery-Insights/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── icons/
│   ├── illustrations/
│   └── images/
└── README.md
```

## How to Preview Locally

Just open `index.html` directly in a browser — everything works with no
server required. If you prefer a local server (recommended for testing the
`?name=` query parameter, see below):

```bash
cd Recovery-Insights
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Design System

| Token | Value |
|---|---|
| Deep Forest (brand) | `#1B3A2E` |
| Forest Deep (dark surfaces) | `#102822` |
| Warm White (background) | `#FBF9F4` |
| Soft Beige (tinted sections) | `#EDE6D6` |
| Muted Gold (accent) | `#B8924A` |
| Gold Bright (hover/highlight) | `#CDA866` |
| Soft Gray (muted text) | `#6B7268` |
| Display font | Fraunces (serif, headings) |
| Body font | Inter (sans-serif, body) |

All values live as CSS custom properties at the top of `style.css` under
`:root` — change a token once, and it updates everywhere.

## Mobile-First Methodology

Every base rule in `style.css` targets the mobile viewport with **no media
query**. Tablet and desktop are progressive enhancements layered on top using
`min-width` queries only:

- `@media (min-width: 600px)` — tablet refinements (2-column grids, wider container)
- `@media (min-width: 1024px)` — desktop refinements (3-column grids, side-by-side layouts, larger type scale)
- `@media (min-width: 1280px)` — large desktop container width

Nothing is ever overridden downward from a desktop-first base — the cascade
only ever adds.

## Future-Ready Data Injection

`script.js` contains a `RecoveryInsightsData` object at the top of the file.
This is the single hook for personalization:

```js
var RecoveryInsightsData = {
  firstName: null,
  insights: null,
  pattern: null,
  balance: { protection: 78, recovery: 22 }
};
```

**Right now:** the page already reads a `?name=` query parameter from the
URL automatically and uses it to personalize the greeting in Section 1
(falls back to "there" if absent). Try it locally:

```
index.html?name=Aisha
```

**Later, without redesigning the page:** populate `RecoveryInsightsData`
from a backend call or an AI-generated report, then call
`applyDynamicData()` again. The insight cards, pattern explanation, and
balance percentages are all marked with `data-*` attributes so they can be
swapped programmatically.

## Calendly Integration Point

The booking button (`#bookingButton` and any `.js-book-trigger`) is wired to
`openBooking()` inside `script.js`. No URL is hardcoded. To connect Calendly:

```js
function openBooking() {
  if (window.Calendly) {
    window.Calendly.initPopupWidget({ url: 'YOUR_CALENDLY_URL' });
    return;
  }
  // fallback behavior currently scrolls to the pricing card
}
```

Add the Calendly widget script to `index.html` before `</body>`:

```html
<script src="https://assets.calendly.com/assets/external/widget.js"></script>
```

## Future Razorpay Integration Point

If a payment step is added before booking, hook it inside `openBooking()`
ahead of the Calendly call — collect payment, then open the scheduler on
success.

## Future AI Integration Point

The `insights` and `pattern` fields in `RecoveryInsightsData` are reserved
for AI-generated report content. When that's ready, fetch the report,
populate those fields, and extend `applyDynamicData()` to render them into
the existing card and pattern-section markup — no layout changes needed.

## Deployment

### GitHub Pages

1. Push this folder to a GitHub repository (e.g. `recovery-insights`).
2. In the repo, go to **Settings → Pages**.
3. Under **Source**, select the branch (usually `main`) and root folder `/`.
4. Save. Your page will be live at `https://<username>.github.io/recovery-insights/`.

### Google Sites Embedding

1. Deploy via GitHub Pages first (above) to get a public URL.
2. In Google Sites, add an **Embed** block.
3. Paste the GitHub Pages URL, or use an `<iframe>` pointing to it if Google
   Sites requires embed code:
   ```html
   <iframe src="https://<username>.github.io/recovery-insights/" width="100%" height="100%" frameborder="0"></iframe>
   ```

### Tally → Results Page Handoff

Set the Tally "On Submit" redirect to point to this page's URL, optionally
appending the respondent's first name as a query parameter:

```
https://yourdomain.com/recovery-insights/?name={{FirstName}}
```

## Accessibility

- Semantic landmarks (`main`, `section`, `footer`) with `aria-labelledby` on every section
- Keyboard-navigable accordion with correct `aria-expanded` / `aria-controls` pairing
- Visible focus states on all interactive elements
- `prefers-reduced-motion` respected throughout — loader, reveals, counters, pulses, and ripples all disable or shorten accordingly
- Color contrast checked against WCAG AA for body text on all background tints

## Performance Notes

- Zero external JS dependencies
- Single Google Fonts request (Fraunces + Inter, swap-enabled)
- All animation done with CSS transitions/keyframes or lightweight
  `requestAnimationFrame` loops — no animation libraries
- Intersection Observer used for scroll reveals instead of scroll event
  listeners (avoids layout thrashing)

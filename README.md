# arshdwani.github.io/portfolio

My portfolio: **https://arshdwani.github.io/portfolio/**

Software engineer, backend and AI evaluation. Every project on the page shows what I built and what happened when I
tested it, with the numbers and a small chart of the result.

- **Live check:** when the page loads it pings every project it links to and prints the results like a test run.
  GitHub Pages sites report their status code; other hosts only tell the browser they answered. Press `R` to run it
  again.
- **One set of facts:** `data.js` holds every project, number and job. `index.html` and `resume.html` both render from
  it, so the page and the résumé can't disagree.
- **Contact:** the form opens your own email app with the message filled in. Nothing is sent from the page.
- Plain HTML, CSS and JavaScript. No build step, no tracking, no dependencies. Fonts are self-hosted (OFL): Instrument
  Serif, Inter, JetBrains Mono.

## Files

| File | What it is |
|---|---|
| `index.html`, `style.css`, `app.js` | The page, its styles, and the renderer, charts, live check and contact form |
| `data.js` | Every fact on the page and résumé |
| `resume.html` | The résumé layout; printed to `Arshd-Rashid-Wani-Resume.pdf` |
| `og.png`, `favicon.svg` | Share image and icon |

## Update the résumé PDF

After editing `data.js`:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer \
  --virtual-time-budget=3000 --print-to-pdf="$PWD/Arshd-Rashid-Wani-Resume.pdf" "file://$PWD/resume.html"
```

# mayotechx.com

MayoTechX — global link building & digital PR agency site (GitHub Pages, static HTML).

| What | Where |
|---|---|
| WhatsApp, emails, social links | `assets/js/data.js` → `SITE` (and footer/topbar in the HTML) |
| Publisher sites in Marketplace & Smart Finder | `assets/js/data.js` → `INVENTORY` |
| Recent orders ticker (REAL orders only, empty = hidden) | `assets/js/data.js` → `ORDERS` |
| Colours, fonts, layout | `assets/css/site.css` |
| Logo / favicon | `assets/img/logo-mark.svg` |

Forms open WhatsApp with the details filled in — no server needed.

## v3 (Oct 2026)
- New "Aurora Sapphire" colour system (sapphire blue + aqua mint) and new logo colours.
- Languages: English (root), Arabic RTL (`/ar/`), German (`/de/` incl. Impressum + Datenschutz). hreflang tags + sitemap alternates.
- Footer: brand-colour LinkedIn, Facebook, X, Instagram, Telegram; Fiverr + Upwork badges; PayPal, Payoneer, Wise, Visa, Mastercard tiles.
- Assistant (`assets/js/assistant.js`): 40+ topics in EN/AR/DE, follow-up suggestions, guided estimate that sends a brief to WhatsApp, chat transcript to WhatsApp. Set `SITE.chatbaseId` in `data.js` for a full AI chatbot.

## v11 (Nov 2026) — agency refresh
- Homepage re-sequenced: concrete headline, two buyer journeys (Get a Proposal / Explore Publishers), six service areas, labelled illustrative deliverable, process and ownership.
- Six service areas (nav, footer, hub and homepage derive from one list). New pages: `ai-search-visibility.html` (AEO & GEO), `article-writing.html`, `performance-marketing.html`.
- Service CTAs carry the service into `proposal.html?type=…&from=…`; marketplace shortlists carry `pubs=…`. "Request price" is now "Check availability"; listings are not presented as confirmed placements.
- Illustrative examples are always labelled. English pages only; other languages unchanged. Rollback point: commit f66fc7a (v10).

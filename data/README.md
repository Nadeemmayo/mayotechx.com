# Marketplace data (PUBLIC)

These two files feed the live website. **Everything in this folder is public** — anyone can download it.

- `publishers.csv` → Publisher Marketplace, Smart Site Finder, home preview
- `directories.csv` → Business Directory marketplace

## Never put these here
Publisher contact, private email, internal cost, margin, negotiation notes, agreements, supplier status.
Keep them in your private Google Sheet only.

## Columns (publishers.csv)
| column | meaning |
|---|---|
| id | unique ID, e.g. P0038 (never reuse) |
| domain | example.com |
| niche / secondary_niches | main niche; extra niches separated by `;` |
| country, language | e.g. United States, English |
| da, pa, dr | numbers only; leave empty if not checked — never guess |
| traffic | monthly organic estimate as a whole number (e.g. 120000) |
| traffic_country, metric_source | e.g. "DR: Ahrefs · DA: Moz" |
| metric_checked, last_verified | YYYY-MM-DD |
| guest_post, niche_edit, digital_pr | `yes` if available, empty if unknown |
| price, currency | client price (public). Empty = "Request price" |
| turnaround, link_attribute, sponsored_policy, requirements, notes | public text |
| status | `active` to show, anything else hides the row |

## How to update
1. GitHub → this repo → `data/publishers.csv` → pencil (Edit) → change → Commit. Live in about 1 minute.
2. Or keep a Google Sheet with **only the public columns**, File → Share → Publish to web → CSV,
   and paste the link into `assets/js/data.js` → `publishersCsvUrl`.

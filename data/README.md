# Marketplace data (PUBLIC)

These two files feed the live website. **Everything in this folder is public** — anyone can download it.

- `publishers.csv` → Publisher Marketplace, Smart Site Finder, home preview
- `directories.csv` → Directories page, “Business Directories” tab
- `citations.csv` → Directories page, “Local Citations” tab (same columns as directories.csv)

## Never put these here
Publisher contact, private email, internal cost, margin, negotiation notes, agreements, supplier status.
Keep them in your private Google Sheet only.

## Columns (publishers.csv)
| column | meaning |
|---|---|
| id | unique ID, e.g. P0038 (never reuse) |
| domain | example.com |
| name | publication name shown in the table |
| placement_format | e.g. Publisher offer, Do-follow offer, Press release / syndication |
| indexed, dofollow, sponsored, llm_aeo | Yes / No (sponsored can be Discrete) |
| niche / secondary_niches | main niche; extra niches separated by `;` |
| country, language | e.g. United States, English |
| da, pa, dr | numbers only; leave empty if not checked — never guess |
| traffic | monthly organic estimate as a whole number (e.g. 120000) |
| traffic_country, metric_source | e.g. "DR: Ahrefs · DA: Moz" |
| metric_checked, last_verified | YYYY-MM-DD |
| guest_post, niche_edit, digital_pr | `yes` if available, empty if unknown |
| price, currency | leave EMPTY — the site shows “Request price” with WhatsApp + email buttons |
| turnaround, link_attribute, sponsored_policy, requirements, notes | public text |
| status | `active` to show, anything else hides the row |

## How to update
1. GitHub → this repo → `data/publishers.csv` → pencil (Edit) → change → Commit. Live in about 1 minute.
2. Or keep a Google Sheet with **only the public columns**, File → Share → Publish to web → CSV,
   and paste the link into `assets/js/data.js` → `publishersCsvUrl`.

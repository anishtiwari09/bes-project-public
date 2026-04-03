# Contentful Soft Start (With Preview Mode)

This project now includes a secure, server-only Contentful integration with Next.js draft mode.

## 1) Environment Setup

Add these values in `.env`:

```env
CONTENTFUL_SPACE_ID="<your-space-id>"
CONTENTFUL_ENVIRONMENT="master"
CONTENTFUL_DELIVERY_ACCESS_TOKEN="<delivery-token>"
CONTENTFUL_PREVIEW_ACCESS_TOKEN="<preview-token>"
CONTENTFUL_PREVIEW_SECRET="<long-random-secret>"
CONTENTFUL_HOMEPAGE_ENTRY_ID="<entry-id-for-home-test>"
```

Notes:
- `CONTENTFUL_DELIVERY_ACCESS_TOKEN` is for published content.
- `CONTENTFUL_PREVIEW_ACCESS_TOKEN` is for draft/preview content.
- `CONTENTFUL_PREVIEW_SECRET` protects preview activation URL.

## 2) What Was Added

### Server-only CMS helpers
- `app/backend/lib/contentful/client.ts`
- `app/backend/lib/contentful/entries.ts`
- `app/backend/lib/contentful/preview.ts`
- `app/backend/lib/contentful/index.ts`

### Preview endpoints
- Enable preview: `GET /api/draft?secret=...&slug=/target-path`
- Disable preview: `GET /api/draft/disable?slug=/target-path`
- Preview status: `GET /api/draft/status`

## 3) Using Contentful in a Server Page

Use preview-aware helper from server components/pages:

```ts
import { getEntriesForRequest } from "@/app/backend/lib/contentful";

const response = await getEntriesForRequest({
  contentType: "yourContentTypeId",
  query: { limit: 10 },
});

const items = response.items;
```

This automatically reads Next.js draft mode and switches to:
- Delivery API in normal mode
- Preview API in draft mode

## 4) Configure Contentful Preview URL

In Contentful preview settings, use URL format like:

```text
https://your-domain.com/api/draft?secret=YOUR_SECRET&slug=/your-page-slug
```

Local example:

```text
http://localhost:3000/api/draft?secret=YOUR_SECRET&slug=/
```

## 5) Security Best Practices Implemented

- Preview secret is validated server-side.
- Secret comparison uses timing-safe comparison.
- Redirect slug is sanitized (must be same-origin path starting with `/`).
- Contentful tokens are used only in server-only modules.

## 6) Rollout Strategy (Recommended)

1. Start with one low-risk page.
2. Keep fallback to existing static/json data until stable.
3. Migrate one section at a time to `getEntriesForRequest`.
4. Add content model-specific mappers/types after first page is live.

## 7) Homepage Mapping (Editor-Friendly Naming)

Homepage (`app/page.tsx`) reads one optional Contentful entry using these exact fields:

Root fields:
- `announcementsEnabled` (boolean)
- `announcementItems` (array of objects)
- `homepageBanner` (object)

`homepageBanner` fields:
- `title`
- `subtitle`
- `venue`
- `theme`
- `primaryButtonText`
- `primaryButtonLink`
- `countdownStartDateTime`
- `resourceButtons` (array)
- `visitorButtonText`
- `visitorButtonLink`
- `delegateButtonText`
- `delegateButtonLink`

Announcement item shape:

```json
{
  "text": "Announcement title",
  "href": "/some-link-or-full-url",
  "target": "_blank"
}
```

Resource button object shape:

```json
{
  "label": "Brochure",
  "url": "https://assets.ctfassets.net/.../brochure.pdf",
  "target": "_blank"
}
```

Render behavior:
- No hardcoded fallback content is used for homepage notification/ticker.
- If a field is missing, that section is not rendered.
- Resource buttons are rendered only for absolute external URLs (`http://` or `https://`).

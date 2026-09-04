# JaylenSinegal.com measurement plan

## Decision this system supports

Decide which content and distribution channels create qualified consultation opportunities, and where to invest the next month of publishing and outreach.

## Primary KPIs

1. **Delivered consultation leads** — Count of `generate_lead` events sent only after Formspree returns a successful response. Source: GA4, reconciled weekly to accepted Formspree submissions.
2. **Organic lead conversion rate** — Delivered leads from Organic Search divided by organic sessions. Source: GA4. Use directionally until volume is at least 100 organic sessions.
3. **Qualified lead rate** — Formspree submissions judged to match a supported service and market divided by accepted non-spam submissions. Source: weekly manual Formspree review.

## Driver metrics

- Search impressions, clicks, CTR, and average position by query and page — Google Search Console.
- Organic sessions and engaged sessions — GA4.
- Article views (`article_view`) and contact intent (`phone_click`, `email_click`, `booking_click`) — GA4.
- Form starts and successful form deliveries — GA4 plus Formspree.

## Guardrails

- **Submission error rate** — `form_error` divided by all form submission attempts. Investigate any sustained rate above 5%.
- **Spam rate** — Formspree spam submissions divided by all submissions. Investigate any sustained rate above 20% before adding more friction.
- Do not optimize for raw page views, social impressions, or clicks without downstream engagement or lead evidence.

## Weekly review

- Reconcile GA4 delivered leads with Formspree accepted submissions.
- Review Search Console queries/pages with rising impressions and weak CTR.
- Review landing pages and channels behind delivered or qualified leads.
- Choose one action: improve a winning page, fix a funnel issue, or distribute a proven article.

## Expansion rule

Create a standalone landing page only when a coherent query cluster shows repeated impressions for at least four weeks and the existing ranking page cannot fully satisfy that intent. Until then, expand the homepage and focused articles.

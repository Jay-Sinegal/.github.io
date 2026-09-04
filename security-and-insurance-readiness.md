# Website security and cyber-insurance readiness

## Current architecture

- Static public site hosted by GitHub Pages over HTTPS.
- Consultation data is posted directly from the visitor's browser to Formspree; no private API key is stored in the repository.
- GA4 receives behavioral events, not the contents of inquiry fields.
- Formspree Formshield and submission archiving are enabled; a honeypot is present on the form.

## Controls now in place

- A lead is recorded only after Formspree returns a successful response.
- Failed deliveries record `form_error`, without recording inquiry contents.
- Input length limits reduce accidental oversized submissions.
- Public privacy notice identifies collected fields, purposes, processors, retention principles, choices, and contact details.
- External links use appropriate `noopener` controls where opened in a new tab.
- Repository SEO validation parses JSON-LD and runs during deployment.

## Required operating controls

- Enable MFA on GitHub, Google, Formspree, domain registrar, and primary email accounts.
- Use unique passwords stored in a password manager; never reuse mailbox or registrar credentials.
- Give each person their own account and least-privilege access; review access quarterly.
- Review Formspree Inbox and Spam daily while campaigns are active; reconcile accepted submissions with GA4 weekly.
- Define a retention schedule with counsel, then delete stale inquiry exports and messages securely.
- Keep inquiry exports out of this public repository and unencrypted personal devices.
- Maintain an incident contact list and preserve logs before changing systems after a suspected incident.
- Review GitHub security alerts and deployment dependencies monthly.

## Hosting limitation

GitHub Pages does not provide repository-controlled custom HTTP security headers. Strong response-header policy, managed WAF rules, rate limiting, bot controls, and detailed edge logs require placing the custom domain behind a compatible managed proxy/CDN and validating the GitHub Pages domain configuration before changing DNS.

## Cyber-insurance application packet

Prepare these items for a licensed broker or carrier:

- legal entity name, annual revenue, services, employee/contractor count, and jurisdictions served;
- inventory of GitHub, Google Analytics/Search Console, Formspree, domain registrar, email, and any CRM;
- MFA evidence, privileged-user list, access-review schedule, and password-manager policy;
- types and approximate volume of personal/confidential data collected and retained;
- vendor list and contracts/data-processing terms;
- backup/recovery approach, incident-response contacts, notification counsel, and prior incidents/claims;
- requested coverage for breach response, privacy liability, cybercrime/social engineering, business interruption, data restoration, and dependent service interruption;
- confirmation of exclusions, sublimits, waiting periods, retroactive date, territorial scope, and whether voluntary shutdown or vendor outages are covered.

Do not answer an insurance application more favorably than the controls actually implemented. Coverage is created only by a bound policy, not by this checklist.

/**
 * Jaylen Sinegal Growth Engine
 * Version: 1.0.0
 *
 * PURPOSE
 * -------
 * One self-contained growth/SEO/analytics service designed to work
 * alongside jaylensinegal.com without replacing the current website.
 *
 * FEATURES
 * --------
 * - Privacy-conscious first-party event tracking
 * - UTM attribution
 * - Industry classification
 * - Location classification
 * - Service classification
 * - Conversion tracking
 * - JSON-LD schema generation
 * - SEO configuration
 * - Analytics API
 * - Health endpoint
 * - CORS protection
 * - Basic input validation
 *
 * IMPORTANT
 * ---------
 * No passwords, API keys, database credentials, or private customer
 * information belong in this file.
 *
 * PRODUCTION NOTE
 * ---------------
 * The included JSON event store is intentionally simple for the first
 * deployment. For a high-volume production deployment, replace it
 * with a managed database.
 */

"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 3000);

const DATA_DIR = path.join(__dirname, "data");
const EVENT_FILE = path.join(DATA_DIR, "events.jsonl");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/* ============================================================
   BUSINESS CONFIGURATION
   ============================================================ */

const SITE = {
  name: "Jaylen Sinegal",
  url: "https://jaylensinegal.com/",
  description:
    "Helping experts and businesses get seen, trusted, and remembered through branding, SEO, print, digital visibility, sponsorships, and community marketing.",
  phone: "+1-337-523-8767",
  email: "jsinegal@bestversionmedia.com",
  city: "Lafayette",
  state: "Louisiana",
  country: "United States"
};

const STORYBRAND = {
  headline: "Get Seen. Get Trusted. Get Remembered.",
  subheadline:
    "We help experts and businesses reach the families, homeowners, and customers they serve through strategic branding, SEO, print, digital visibility, sponsorships, and community marketing.",
  primaryCTA: "Get Your Business Seen",
  expertCTA: "Become an Expert Contributor"
};

/* ============================================================
   TARGET INDUSTRIES
   ============================================================ */

const INDUSTRIES = {
  "home-services": [
    "hvac",
    "plumbing",
    "roofing",
    "electrical",
    "general-contracting",
    "remodeling",
    "landscaping",
    "lawn-care",
    "pest-control",
    "restoration",
    "painting",
    "pool-services",
    "flooring",
    "fencing",
    "solar",
    "handyman",
    "garage-doors",
    "windows-doors"
  ],

  "professional-experts": [
    "lawyers",
    "attorneys",
    "accountants",
    "financial-professionals",
    "insurance",
    "consultants",
    "architects",
    "engineers",
    "advisors",
    "healthcare",
    "wellness",
    "real-estate"
  ],

  "specialty-businesses": [
    "jewelers",
    "retailers",
    "boutiques",
    "dealerships",
    "authors",
    "daycares",
    "schools",
    "photographers",
    "event-businesses",
    "automotive",
    "restaurants"
  ],

  "travel-destinations": [
    "rv-parks",
    "campgrounds",
    "hotels",
    "resorts",
    "vacation-destinations",
    "tourism",
    "attractions",
    "tour-operators",
    "hospitality"
  ]
};

/* ============================================================
   TARGET LOCATIONS
   ============================================================ */

const LOCATIONS = [
  "broussard",
  "lafayette",
  "youngsville",
  "scott",
  "carencro",
  "breaux-bridge",
  "duson",
  "maurice",
  "new-iberia",
  "abbeville",
  "acadiana",
  "louisiana",
  "nationwide"
];

/* ============================================================
   SERVICES
   ============================================================ */

const SERVICES = [
  "brand-strategy",
  "branding",
  "business-cards",
  "marketing-materials",
  "seo",
  "digital-advertising",
  "community-marketing",
  "sponsorships",
  "market-visibility",
  "growth-strategy",
  "expert-contributor"
];

/* ============================================================
   EVENT TYPES
   ============================================================ */

const ALLOWED_EVENTS = new Set([
  "page_view",
  "landing_page_view",
  "service_view",
  "industry_view",
  "location_view",
  "expert_profile_view",
  "cta_click",
  "phone_click",
  "email_click",
  "quote_request",
  "consultation_request",
  "form_start",
  "form_submit",
  "download",
  "outbound_click"
]);

/* ============================================================
   BASIC HELPERS
   ============================================================ */

function safeString(value, max = 200) {
  if (typeof value !== "string") return null;

  return value
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

function safeObject(input) {
  if (!input || typeof input !== "object") {
    return {};
  }

  const output = {};

  for (const [key, value] of Object.entries(input).slice(0, 30)) {
    const cleanKey = safeString(key, 80);

    if (!cleanKey) continue;

    if (typeof value === "string") {
      output[cleanKey] = safeString(value, 300);
    } else if (
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      output[cleanKey] = value;
    } else if (typeof value === "boolean") {
      output[cleanKey] = value;
    }
  }

  return output;
}

function hashValue(value) {
  return crypto
    .createHash("sha256")
    .update(String(value))
    .digest("hex")
    .slice(0, 32);
}

function getClientIdentifier(req) {
  /*
   * This is a rotating, hashed identifier rather than storing a raw IP.
   * It is intended only for basic session-level analytics.
   *
   * For stricter privacy requirements, remove this entirely.
   */
  const forwarded = req.headers["x-forwarded-for"];

  const rawIP = forwarded
    ? String(forwarded).split(",")[0].trim()
    : req.socket.remoteAddress || "unknown";

  const day = new Date().toISOString().slice(0, 10);

  return hashValue(`${day}:${rawIP}`);
}

function classify(value, collection) {
  if (!value) return null;

  const text = String(value).toLowerCase();

  for (const item of collection) {
    if (text.includes(item.replace(/-/g, " "))) {
      return item;
    }

    if (text.includes(item)) {
      return item;
    }
  }

  return null;
}

function classifyIndustry(value) {
  if (!value) return null;

  const text = String(value).toLowerCase();

  for (const [group, categories] of Object.entries(INDUSTRIES)) {
    for (const category of categories) {
      if (
        text.includes(category) ||
        text.includes(category.replace(/-/g, " "))
      ) {
        return {
          group,
          category
        };
      }
    }
  }

  return null;
}

/* ============================================================
   EVENT STORAGE
   ============================================================ */

function saveEvent(event) {
  fs.appendFile(
    EVENT_FILE,
    JSON.stringify(event) + "\n",
    (error) => {
      if (error) {
        console.error("Analytics write error:", error.message);
      }
    }
  );
}

/* ============================================================
   REQUEST BODY
   ============================================================ */

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    let size = 0;

    req.on("data", chunk => {
      size += chunk.length;

      if (size > 100000) {
        reject(new Error("Request too large"));
        req.destroy();
        return;
      }

      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });

    req.on("error", reject);
  });
}

/* ============================================================
   SEO CONFIGURATION
   ============================================================ */

function buildSEO({
  title,
  description,
  pathName = "/",
  industry = null,
  location = null,
  service = null
}) {
  const cleanTitle =
    safeString(title, 150) ||
    `${SITE.name} | Brand, SEO & Market Visibility`;

  const cleanDescription =
    safeString(description, 300) ||
    SITE.description;

  const canonical =
    SITE.url.replace(/\/$/, "") +
    (pathName.startsWith("/") ? pathName : `/${pathName}`);

  return {
    title: cleanTitle,
    description: cleanDescription,
    canonical,
    industry,
    location,
    service
  };
}

/* ============================================================
   STRUCTURED DATA
   ============================================================ */

function buildSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE.url}#person`,
        name: SITE.name,
        url: SITE.url,
        telephone: SITE.phone,
        email: SITE.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: SITE.city,
          addressRegion: SITE.state,
          addressCountry: "US"
        }
      },

      {
        "@type": "ProfessionalService",
        "@id": `${SITE.url}#business`,
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        telephone: SITE.phone,
        email: SITE.email,
        areaServed: [
          "Broussard, Louisiana",
          "Lafayette, Louisiana",
          "Youngsville, Louisiana",
          "Acadiana, Louisiana",
          "Louisiana",
          "United States"
        ],
        founder: {
          "@id": `${SITE.url}#person`
        },
        knowsAbout: [
          "Brand strategy",
          "SEO",
          "Business cards",
          "Marketing materials",
          "Digital advertising",
          "Community marketing",
          "Sponsorships",
          "Market visibility",
          "Growth strategy"
        ]
      },

      {
        "@type": "WebSite",
        "@id": `${SITE.url}#website`,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        publisher: {
          "@id": `${SITE.url}#person`
        }
      }
    ]
  };
}

/* ============================================================
   EMBEDDABLE TRACKING SCRIPT
   ============================================================ */

function trackingScript() {
  return `
(function () {
  "use strict";

  const ENDPOINT =
    "${SITE.url.replace(/\\/$/, "")}/api/events";

  const STORAGE_KEY = "js_growth_attribution";

  function clean(value) {
    if (typeof value !== "string") return null;
    return value.trim().slice(0, 300);
  }

  function getAttribution() {
    const params = new URLSearchParams(window.location.search);

    const current = {
      source: clean(params.get("utm_source")),
      medium: clean(params.get("utm_medium")),
      campaign: clean(params.get("utm_campaign")),
      content: clean(params.get("utm_content")),
      term: clean(params.get("utm_term")),
      landing_page: window.location.pathname,
      first_seen: new Date().toISOString()
    };

    const hasUTM =
      current.source ||
      current.medium ||
      current.campaign ||
      current.content ||
      current.term;

    if (hasUTM) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(current)
        );
      } catch (_) {}
    }

    try {
      return JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "{}"
      );
    } catch (_) {
      return {};
    }
  }

  function track(eventName, properties) {
    const payload = {
      event: eventName,
      page: window.location.pathname,
      title: document.title,
      referrer: document.referrer || null,
      attribution: getAttribution(),
      properties: properties || {},
      timestamp: new Date().toISOString()
    };

    const body = JSON.stringify(payload);

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          ENDPOINT,
          new Blob([body], {
            type: "application/json"
          })
        );
      } else {
        fetch(ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body,
          keepalive: true
        }).catch(function () {});
      }
    } catch (_) {}
  }

  window.JaylenGrowth = {
    track: track
  };

  track("page_view");

  document.addEventListener("click", function (event) {
    const target = event.target.closest("a");

    if (!target) return;

    const href = target.href || "";

    if (
      href.startsWith("tel:")
    ) {
      track("phone_click", {
        href: href,
        placement: target.dataset.placement || null
      });

      return;
    }

    if (
      href.startsWith("mailto:")
    ) {
      track("email_click", {
        href: href,
        placement: target.dataset.placement || null
      });

      return;
    }

    if (
      target.dataset.cta ||
      target.classList.contains("cta")
    ) {
      track("cta_click", {
        cta:
          target.dataset.cta ||
          target.textContent.trim().slice(0, 120),
        href: href
      });
    }

    if (
      href &&
      !href.includes(window.location.hostname)
    ) {
      track("outbound_click", {
        href: href
      });
    }
  });

  window.JaylenGrowth.getAttribution =
    getAttribution;
})();
`;
}

/* ============================================================
   SECURITY HEADERS
   ============================================================ */

function setSecurityHeaders(res) {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' https:; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';"
  );

  res.setHeader(
    "X-Content-Type-Options",
    "nosniff"
  );

  res.setHeader(
    "X-Frame-Options",
    "SAMEORIGIN"
  );

  res.setHeader(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );

  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
}

/* ============================================================
   JSON RESPONSE
   ============================================================ */

function sendJSON(res, status, data) {
  setSecurityHeaders(res);

  res.statusCode = status;

  res.setHeader(
    "Content-Type",
    "application/json; charset=utf-8"
  );

  res.end(JSON.stringify(data));
}

/* ============================================================
   EVENT API
   ============================================================ */

async function handleEvent(req, res) {
  try {
    const body = await readBody(req);

    const eventName = safeString(body.event, 80);

    if (!eventName || !ALLOWED_EVENTS.has(eventName)) {
      sendJSON(res, 400, {
        success: false,
        error: "Invalid event"
      });

      return;
    }

    const page = safeString(body.page, 300);
    const title = safeString(body.title, 300);
    const referrer = safeString(body.referrer, 500);

    const properties = safeObject(body.properties);
    const attribution = safeObject(body.attribution);

    const combinedText = [
      page,
      title,
      properties.industry,
      properties.category,
      properties.service,
      properties.location
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const industry =
      classifyIndustry(
        properties.industry ||
        properties.category ||
        combinedText
      );

    const location =
      classify(
        properties.location ||
        combinedText,
        LOCATIONS
      );

    const service =
      classify(
        properties.service ||
        combinedText,
        SERVICES
      );

    const event = {
      id: crypto.randomUUID(),
      event: eventName,
      timestamp:
        safeString(body.timestamp, 50) ||
        new Date().toISOString(),

      page,
      title,
      referrer,

      industry: industry
        ? industry.group
        : null,

      industry_category: industry
        ? industry.category
        : null,

      location,
      service,

      attribution: {
        source:
          attribution.source || null,

        medium:
          attribution.medium || null,

        campaign:
          attribution.campaign || null,

        content:
          attribution.content || null,

        term:
          attribution.term || null
      },

      /*
       * Hashed daily visitor identifier.
       * Remove this field completely if you want
       * analytics without even pseudonymous sessions.
       */
      visitor:
        getClientIdentifier(req)
    };

    saveEvent(event);

    sendJSON(res, 202, {
      success: true
    });

  } catch (error) {
    sendJSON(res, 400, {
      success: false,
      error: "Unable to process event"
    });
  }
}

/* ============================================================
   SIMPLE ANALYTICS SUMMARY
   ============================================================ */

function getAnalyticsSummary() {
  if (!fs.existsSync(EVENT_FILE)) {
    return {
      totalEvents: 0,
      events: {},
      industries: {},
      locations: {},
      services: {}
    };
  }

  const lines = fs
    .readFileSync(EVENT_FILE, "utf8")
    .split("\n")
    .filter(Boolean);

  const summary = {
    totalEvents: lines.length,
    events: {},
    industries: {},
    locations: {},
    services: {}
  };

  for (const line of lines.slice(-10000)) {
    try {
      const event = JSON.parse(line);

      summary.events[event.event] =
        (summary.events[event.event] || 0) + 1;

      if (event.industry_category) {
        summary.industries[event.industry_category] =
          (summary.industries[event.industry_category] || 0) + 1;
      }

      if (event.location) {
        summary.locations[event.location] =
          (summary.locations[event.location] || 0) + 1;
      }

      if (event.service) {
        summary.services[event.service] =
          (summary.services[event.service] || 0) + 1;
      }
    } catch (_) {}
  }

  return summary;
}

/* ============================================================
   SERVER
   ============================================================ */

const server = http.createServer(async (req, res) => {
  const requestURL = new URL(
    req.url,
    `http://${req.headers.host || "localhost"}`
  );

  const pathname = requestURL.pathname;

  /* ----------------------------------------------------------
     HEALTH CHECK
     ---------------------------------------------------------- */

  if (
    req.method === "GET" &&
    pathname === "/health"
  ) {
    sendJSON(res, 200, {
      status: "ok",
      service: "jaylen-sinegal-growth-engine",
      version: "1.0.0",
      time: new Date().toISOString()
    });

    return;
  }

  /* ----------------------------------------------------------
     TRACKING SCRIPT
     ---------------------------------------------------------- */

  if (
    req.method === "GET" &&
    pathname === "/growth.js"
  ) {
    setSecurityHeaders(res);

    res.statusCode = 200;

    res.setHeader(
      "Content-Type",
      "application/javascript; charset=utf-8"
    );

    res.end(trackingScript());

    return;
  }

  /* ----------------------------------------------------------
     SEO CONFIG
     ---------------------------------------------------------- */

  if (
    req.method === "GET" &&
    pathname === "/api/seo"
  ) {
    const seo = buildSEO({
      title: requestURL.searchParams.get("title"),
      description:
        requestURL.searchParams.get("description"),
      pathName:
        requestURL.searchParams.get("path") || "/",
      industry:
        requestURL.searchParams.get("industry"),
      location:
        requestURL.searchParams.get("location"),
      service:
        requestURL.searchParams.get("service")
    });

    sendJSON(res, 200, seo);

    return;
  }

  /* ----------------------------------------------------------
     SCHEMA
     ---------------------------------------------------------- */

  if (
    req.method === "GET" &&
    pathname === "/api/schema"
  ) {
    sendJSON(res, 200, buildSchema());

    return;
  }

  /* ----------------------------------------------------------
     ANALYTICS SUMMARY
     ---------------------------------------------------------- */

  /*
   * DO NOT expose this publicly in a production deployment.
   *
   * It is disabled unless ANALYTICS_ADMIN_TOKEN exists and the
   * caller supplies it.
   */

  if (
    req.method === "GET" &&
    pathname === "/api/summary"
  ) {
    const configuredToken =
      process.env.ANALYTICS_ADMIN_TOKEN;

    if (!configuredToken) {
      sendJSON(res, 404, {
        error: "Not available"
      });

      return;
    }

    const suppliedToken =
      requestURL.searchParams.get("token");

    if (
      !suppliedToken ||
      suppliedToken !== configuredToken
    ) {
      sendJSON(res, 403, {
        error: "Forbidden"
      });

      return;
    }

    sendJSON(
      res,
      200,
      getAnalyticsSummary()
    );

    return;
  }

  /* ----------------------------------------------------------
     EVENT COLLECTION
     ---------------------------------------------------------- */

  if (
    req.method === "POST" &&
    pathname === "/api/events"
  ) {
    await handleEvent(req, res);

    return;
  }

  /* ----------------------------------------------------------
     ROOT / INFORMATION
     ---------------------------------------------------------- */

  if (
    req.method === "GET" &&
    pathname === "/"
  ) {
    sendJSON(res, 200, {
      name: "Jaylen Sinegal Growth Engine",
      status: "running",
      website: SITE.url,
      headline: STORYBRAND.headline,
      primaryCTA: STORYBRAND.primaryCTA,
      expertCTA: STORYBRAND.expertCTA,
      endpoints: [
        "/health",
        "/growth.js",
        "/api/events",
        "/api/seo",
        "/api/schema"
      ]
    });

    return;
  }

  sendJSON(res, 404, {
    error: "Not found"
  });
});

/* ============================================================
   START
   ============================================================ */

server.listen(PORT, () => {
  console.log("");
  console.log("==============================================");
  console.log(" Jaylen Sinegal Growth Engine");
  console.log("==============================================");
  console.log(` Running on port ${PORT}`);
  console.log(` Website: ${SITE.url}`);
  console.log("");
  console.log(" Endpoints:");
  console.log(" /health");
  console.log(" /growth.js");
  console.log(" /api/events");
  console.log(" /api/seo");
  console.log(" /api/schema");
  console.log("");
  console.log(" Analytics data:");
  console.log(EVENT_FILE);
  console.log("==============================================");
  console.log("");
});
<script src="https://YOUR-GROWTH-ENGINE-DOMAIN.com/growth.js"></script>
<a
  href="/contact/"
  data-cta="get_your_business_seen"
  class="cta"
>
  Get Your Business Seen
</a>
<a
  href="/experts/"
  data-cta="become_an_expert_contributor"
  class="cta"
>
  Become an Expert Contributor
</a>
<script>
JaylenGrowth.track("industry_view", {
  industry: "hvac",
  location: "broussard"
});
</script>

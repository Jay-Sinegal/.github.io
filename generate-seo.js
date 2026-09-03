"use strict";

const campaign = require("./campaign");

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function makePage({
  title,
  description,
  url,
  audience,
  industry,
  location,
  service,
  CTA
}) {
  return {
    title,
    description,
    canonical:
      `https://jaylensinegal.com${url}`,

    audience: audience || null,
    industry: industry || null,
    location: location || null,
    service: service || null,

    primaryCTA:
      CTA ||
      campaign.brand.primaryCTA
  };
}

const pages = [];

pages.push(
  makePage({
    title:
      "Branding, SEO & Marketing Visibility |",
    description:
      "Helping experts and businesses get seen, trusted, and remembered through branding, SEO, print, digital visibility, sponsorships, and community marketing.",
    url: "/"
  })
);

pages.push(
  makePage({
    title:
      "Expert Contributors | Jaylen Sinegal",
    description:
      "Become an expert contributor and turn your knowledge, expertise, and business story into greater visibility.",
    url: "/experts/",
    audience:
      "Professional experts and businesses",
    CTA:
      campaign.brand.contributorCTA
  })
);

pages.push(
  makePage({
    title:
      "Marketing for Home-Service Businesses | Jaylen Sinegal",
    description:
      "Branding, business cards, SEO, marketing materials, and visibility strategies for businesses that serve homeowners and families.",
    url:
      "/industries/home-services/",
    audience:
      "Home-service businesses"
  })
);

pages.push(
  makePage({
    title:
      "Marketing for Professional Experts | Jaylen Sinegal",
    description:
      "Build visibility and trust for professional experts including lawyers, financial professionals, healthcare professionals, consultants, and advisors.",
    url:
      "/industries/professional-experts/",
    audience:
      "Professional experts"
  })
);

pages.push(
  makePage({
    title:
      "Marketing for Jewelers & Specialty Businesses | Jaylen Sinegal",
    description:
      "Branding and visibility strategies for jewelers, retailers, dealerships, boutiques, and other specialty businesses.",
    url:
      "/industries/specialty-businesses/",
    audience:
      "Specialty businesses"
  })
);

pages.push(
  makePage({
    title:
      "Marketing for RV Parks, Tourism & Vacation Destinations | Jaylen Sinegal",
    description:
      "Branding, digital visibility, and community marketing for RV parks, campgrounds, tourism businesses, hospitality brands, and vacation destinations.",
    url:
      "/industries/travel-destinations/",
    audience:
      "Travel and destination businesses"
  })
);

for (const location of [
  "Broussard",
  "Lafayette",
  "Youngsville",
  "Acadiana"
]) {

  pages.push(
    makePage({
      title:
        `Business Branding & Marketing in ${location} | Jaylen Sinegal`,

      description:
        `Branding, SEO, business cards, marketing materials, and visibility strategies for businesses and experts in ${location}.`,

      url:
        `/locations/${slug(location)}/`,

      location
    })
  );
}

module.exports = {
  generatedAt: new Date().toISOString(),
  pages
};

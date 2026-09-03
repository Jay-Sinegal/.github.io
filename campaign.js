/**
 * Jaylen Sinegal Growth Engine
 * SEO Campaign Configuration
 *
 * Primary market:
 *   Broussard, Lafayette, Youngsville, Acadiana
 *
 * Expansion:
 *   Louisiana -> Nationwide
 *
 * Strategic audience:
 *   Businesses and experts who serve homeowners, families,
 *   consumers, travelers, and local communities.
 */

"use strict";

const campaign = {

  brand: {
    name: "Jaylen Sinegal",

    headline:
      "Get Seen. Get Trusted. Get Remembered.",

    positioning:
      "Helping experts and businesses become more visible, credible, and memorable to the people they serve.",

    primaryCTA:
      "Get Your Business Seen",

    contributorCTA:
      "Become an Expert Contributor"
  },

  geography: {
    primary: [
      "Broussard",
      "Lafayette",
      "Youngsville"
    ],

    regional: [
      "Acadiana",
      "Scott",
      "Carencro",
      "Breaux Bridge",
      "Duson",
      "Maurice",
      "New Iberia",
      "Abbeville"
    ],

    state: [
      "Louisiana"
    ],

    expansion: [
      "United States"
    ]
  },

  audiences: {

    homeowners: {
      name: "Homeowners & Families",
      intent: [
        "find trusted local businesses",
        "compare services",
        "research experts",
        "choose local providers"
      ]
    },

    homeServices: {
      name: "Home-Service Businesses",
      industries: [
        "HVAC",
        "Plumbing",
        "Roofing",
        "Electrical",
        "General Contracting",
        "Remodeling",
        "Landscaping",
        "Lawn Care",
        "Pest Control",
        "Restoration",
        "Painting",
        "Pools",
        "Flooring",
        "Fencing",
        "Solar",
        "Handyman",
        "Garage Doors",
        "Windows & Doors"
      ]
    },

    experts: {
      name: "Professional Experts",
      industries: [
        "Lawyers",
        "Attorneys",
        "Accountants",
        "Financial Professionals",
        "Insurance Professionals",
        "Consultants",
        "Architects",
        "Engineers",
        "Advisors",
        "Healthcare Professionals",
        "Wellness Professionals",
        "Real Estate Professionals"
      ]
    },

    specialty: {
      name: "Specialty Businesses",
      industries: [
        "Jewelers",
        "Retailers",
        "Boutiques",
        "Dealerships",
        "Authors",
        "Daycares",
        "Schools",
        "Photographers",
        "Event Businesses",
        "Automotive",
        "Restaurants"
      ]
    },

    destinations: {
      name: "Destinations & Experiences",
      industries: [
        "RV Parks",
        "Campgrounds",
        "Hotels",
        "Resorts",
        "Vacation Destinations",
        "Tourism",
        "Attractions",
        "Tour Operators",
        "Hospitality"
      ]
    }
  },

  services: {

    branding: {
      name: "Brand Strategy & Branding",

      keywords: [
        "business branding",
        "local business branding",
        "professional branding",
        "contractor branding",
        "expert branding",
        "brand strategy",
        "small business branding"
      ]
    },

    businessCards: {
      name: "Business Cards",

      keywords: [
        "business cards",
        "custom business cards",
        "professional business cards",
        "contractor business cards",
        "HVAC business cards",
        "plumber business cards",
        "electrician business cards",
        "roofer business cards",
        "business cards Lafayette",
        "business cards Broussard"
      ]
    },

    marketingMaterials: {
      name: "Marketing Materials",

      keywords: [
        "marketing materials",
        "branded marketing materials",
        "print marketing",
        "local business marketing materials",
        "contractor marketing materials",
        "professional marketing materials"
      ]
    },

    seo: {
      name: "SEO",

      keywords: [
        "local SEO",
        "small business SEO",
        "contractor SEO",
        "local business SEO",
        "professional SEO",
        "SEO Lafayette",
        "SEO Broussard",
        "Acadiana SEO"
      ]
    },

    digital: {
      name: "Digital Visibility",

      keywords: [
        "digital advertising",
        "local digital marketing",
        "online visibility",
        "local business advertising",
        "digital marketing for contractors",
        "digital marketing for experts"
      ]
    },

    community: {
      name: "Community Marketing",

      keywords: [
        "community marketing",
        "local sponsorship",
        "community sponsorship",
        "local business visibility",
        "community advertising"
      ]
    },

    contributor: {
      name: "Expert Contributor Program",

      keywords: [
        "expert contributor",
        "expert marketing",
        "expert visibility",
        "professional contributor",
        "local expert marketing",
        "business contributor"
      ]
    }
  },

  /**
   * StoryBrand-inspired message architecture.
   *
   * This is our own campaign language rather than copied
   * proprietary StoryBrand material.
   */

  message: {

    character:
      "A business owner or expert who wants to be recognized and trusted by the people they serve.",

    problem:
      "Their expertise may be strong, but their visibility, branding, or marketing may not communicate that value clearly.",

    guide:
      "Jaylen Sinegal helps turn expertise and business value into clear, memorable market visibility.",

    plan: [
      "Clarify your message.",
      "Build a recognizable brand.",
      "Increase local and digital visibility.",
      "Put your expertise in front of the right audience.",
      "Give customers an obvious next step."
    ],

    success:
      "More people recognize the business, understand its value, trust its expertise, and take action.",

    failureAvoided:
      "Being overlooked because the business looks generic, confusing, inconsistent, or difficult to find."
  },

  /**
   * URL architecture.
   *
   * We deliberately avoid automatically generating thousands
   * of thin city/keyword pages.
   */

  urlStructure: {

    services: [
      "/services/branding/",
      "/services/business-cards/",
      "/services/marketing-materials/",
      "/services/seo/",
      "/services/digital-advertising/",
      "/services/community-marketing/",
      "/services/sponsorships/"
    ],

    industries: [
      "/industries/home-services/",
      "/industries/professional-experts/",
      "/industries/specialty-businesses/",
      "/industries/travel-destinations/"
    ],

    expertProgram: [
      "/experts/",
      "/experts/become-a-contributor/"
    ],

    locations: [
      "/locations/broussard/",
      "/locations/lafayette/",
      "/locations/youngsville/",
      "/locations/acadiana/"
    ],

    resources: [
      "/resources/",
      "/resources/home-services/",
      "/resources/expert-marketing/",
      "/resources/local-business-branding/"
    ]
  },

  /**
   * Initial priority pages.
   *
   * These are the pages I would build first rather than
   * attempting to publish the entire universe at once.
   */

  priorityPages: [

    {
      priority: 1,
      url: "/",
      purpose: "Core brand + conversion",
      audience: "Businesses and experts",
      primaryCTA: "Get Your Business Seen"
    },

    {
      priority: 2,
      url: "/experts/",
      purpose: "Expert Contributor ecosystem",
      audience: "Professional experts and businesses",
      primaryCTA: "Become an Expert Contributor"
    },

    {
      priority: 3,
      url: "/industries/home-services/",
      purpose: "Home-service vertical",
      audience: "Businesses serving homeowners",
      primaryCTA: "Get Your Business Seen"
    },

    {
      priority: 4,
      url: "/industries/professional-experts/",
      purpose: "Professional expert vertical",
      audience: "Lawyers, advisors, professionals",
      primaryCTA: "Become an Expert Contributor"
    },

    {
      priority: 5,
      url: "/industries/specialty-businesses/",
      purpose: "Specialty-business vertical",
      audience: "Jewelers, retailers, dealerships, etc.",
      primaryCTA: "Get Your Business Seen"
    },

    {
      priority: 6,
      url: "/industries/travel-destinations/",
      purpose: "Destination vertical",
      audience: "RV parks, tourism, hospitality",
      primaryCTA: "Get Your Business Seen"
    },

    {
      priority: 7,
      url: "/locations/broussard/",
      purpose: "Primary local SEO market",
      audience: "Broussard businesses and experts",
      primaryCTA: "Get Your Business Seen"
    },

    {
      priority: 8,
      url: "/locations/lafayette/",
      purpose: "Regional expansion",
      audience: "Lafayette businesses and experts",
      primaryCTA: "Get Your Business Seen"
    },

    {
      priority: 9,
      url: "/locations/youngsville/",
      purpose: "Regional expansion",
      audience: "Youngsville businesses and experts",
      primaryCTA: "Get Your Business Seen"
    },

    {
      priority: 10,
      url: "/locations/acadiana/",
      purpose: "Regional authority",
      audience: "Acadiana businesses and experts",
      primaryCTA: "Get Your Business Seen"
    }
  ],

  /**
   * Conversion events.
   *
   * These names must correspond with the analytics engine.
   */

  conversions: [

    "quote_request",

    "consultation_request",

    "expert_application",

    "phone_click",

    "email_click",

    "contact_form_submit",

    "cta_click",

    "expert_profile_view",

    "service_view",

    "industry_view",

    "location_view"
  ],

  /**
   * Internal linking strategy.
   */

  internalLinks: {

    homepage: [
      "/experts/",
      "/industries/home-services/",
      "/industries/professional-experts/",
      "/industries/specialty-businesses/",
      "/industries/travel-destinations/",
      "/locations/broussard/",
      "/locations/lafayette/",
      "/services/branding/",
      "/services/business-cards/",
      "/services/seo/"
    ],

    homeServices: [
      "/services/branding/",
      "/services/business-cards/",
      "/services/marketing-materials/",
      "/services/seo/",
      "/locations/broussard/",
      "/locations/lafayette/"
    ],

    experts: [
      "/services/branding/",
      "/services/seo/",
      "/experts/become-a-contributor/",
      "/locations/lafayette/",
      "/locations/acadiana/"
    ],

    destinations: [
      "/services/branding/",
      "/services/digital-advertising/",
      "/services/community-marketing/",
      "/experts/",
      "/locations/acadiana/"
    ]
  }

};

module.exports = campaign;

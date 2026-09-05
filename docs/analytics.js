(function () {
  "use strict";

  var campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  var campaign = {};

  try {
    var query = new URLSearchParams(window.location.search);
    campaignKeys.forEach(function (key) {
      var value = query.get(key);
      if (value) sessionStorage.setItem("jaylen_" + key, value);
      var stored = sessionStorage.getItem("jaylen_" + key);
      if (stored) campaign[key] = stored;
    });
  } catch (error) {
    campaign = {};
  }

  function send(name, parameters) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, Object.assign({}, campaign, parameters || {}));
    }
  }

  if (campaign.utm_source) {
    send("campaign_visit", {
      page_location: window.location.href,
      page_title: document.title
    });
  }

  var main = document.querySelector("main[data-page-type]");
  var openGraphType = document.querySelector('meta[property="og:type"]');
  var pageType = main ? main.dataset.pageType : (openGraphType && openGraphType.content === "article" ? "article" : "page");

  if (pageType === "article" || pageType === "blog_article") {
    send("article_view", {
      article_title: document.querySelector("h1") ? document.querySelector("h1").textContent.trim() : document.title,
      page_location: window.location.href
    });
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href]");
    if (!link) return;

    var href = link.getAttribute("href") || "";
    var parameters = {
      link_url: link.href,
      link_text: link.textContent.trim().slice(0, 100),
      page_type: pageType
    };

    if (href.indexOf("tel:") === 0) send("phone_click", parameters);
    else if (href.indexOf("mailto:") === 0) send("email_click", parameters);
    else if (link.closest(".meeting-card")) send("booking_click", parameters);
    else if (link.hostname && link.hostname !== window.location.hostname) send("outbound_click", parameters);
  });

  window.trackSiteEvent = send;
})();

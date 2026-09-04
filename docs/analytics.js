(function () {
  "use strict";

  function send(name, parameters) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, parameters || {});
    }
  }

  var main = document.querySelector("main[data-page-type]");
  var openGraphType = document.querySelector('meta[property="og:type"]');
  var pageType = main ? main.dataset.pageType : (openGraphType && openGraphType.content === "article" ? "article" : "page");

  if (pageType === "article") {
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

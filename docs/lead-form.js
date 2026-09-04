(function () {
  "use strict";

  var form = document.querySelector("[data-lead-form]");
  if (!form) return;

  var button = form.querySelector('button[type="submit"]');
  var status = form.querySelector("[data-form-status]");
  var originalLabel = button.textContent;
  var formStarted = false;

  form.addEventListener("input", function () {
    if (formStarted) return;
    formStarted = true;
    if (typeof window.trackSiteEvent === "function") {
      window.trackSiteEvent("form_start", { form_name: "consultation_form" });
    }
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    button.disabled = true;
    button.textContent = "Sending…";
    status.textContent = "Sending your request…";
    status.dataset.state = "pending";

    try {
      var response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error("Submission rejected");

      status.textContent = "Thank you. Your request was delivered successfully.";
      status.dataset.state = "success";
      form.reset();
      if (typeof window.trackSiteEvent === "function") {
        window.trackSiteEvent("generate_lead", {
          form_name: "consultation_form",
          delivery_status: "accepted"
        });
      }
    } catch (error) {
      status.textContent = "Your request could not be delivered. Please email or call Jaylen directly.";
      status.dataset.state = "error";
      if (typeof window.trackSiteEvent === "function") {
        window.trackSiteEvent("form_error", {
          form_name: "consultation_form",
          error_type: "delivery_failed"
        });
      }
    } finally {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  });
})();

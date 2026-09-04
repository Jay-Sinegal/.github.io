(function () {
  "use strict";

  var form = document.querySelector("[data-lead-form]");
  if (!form) return;

  var button = form.querySelector('button[type="submit"]');
  var status = form.querySelector("[data-form-status]");
  var originalLabel = button.textContent;
  var formStarted = false;
  var loadedAt = Date.now();
  var cooldownKey = "jsinegal_last_form_submission";
  var minimumCompletionTime = 3000;
  var submissionCooldown = 60000;

  function readPreviousSubmission() {
    try {
      return Number(window.localStorage.getItem(cooldownKey) || 0);
    } catch (error) {
      return 0;
    }
  }

  function rememberSubmission() {
    try {
      window.localStorage.setItem(cooldownKey, String(Date.now()));
    } catch (error) {
      // The form still works when browser privacy settings block local storage.
    }
  }

  form.addEventListener("input", function () {
    if (formStarted) return;
    formStarted = true;
    if (typeof window.trackSiteEvent === "function") {
      window.trackSiteEvent("form_start", { form_name: "consultation_form" });
    }
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    var honeypot = form.querySelector('[name="_gotcha"]');
    if (honeypot && honeypot.value.trim()) {
      status.textContent = "Your request could not be delivered.";
      status.dataset.state = "error";
      return;
    }

    if (Date.now() - loadedAt < minimumCompletionTime) {
      status.textContent = "Please review your information, then try again.";
      status.dataset.state = "error";
      return;
    }

    var previousSubmission = readPreviousSubmission();
    if (previousSubmission && Date.now() - previousSubmission < submissionCooldown) {
      status.textContent = "Your previous request was received recently. Please wait before sending another.";
      status.dataset.state = "error";
      return;
    }
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
      rememberSubmission();
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

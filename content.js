const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList" && mutation.target.className === "ewPPR") {
      // Check if the Google Calendar event editing interface is present
      if (!document.getElementById("add-feedback-survey-btn")) {
        // Insert the "Add a Feedback Survey" button
        const add_survey_div = document.createElement("div");
        add_survey_div.classList.add("FrSOzf");
        add_survey_div.id = "add-feedback-survey-btn";
        add_survey_div.innerHTML = `
          <div aria-hidden="true" class="tzcF6">
            <i class="google-material-icons meh4fc hggPq uSx8Od" aria-hidden="true">
              <div id="rHCnYc">  
                <img alt aria-hidden="true" class="I6gAld" src="https://www.gstatic.com/images/branding/product/1x/forms_2020q4_48dp.png">
              </div>
            </i>
          </div>
          <div class="j3nyw">
            <div class="d27AIf z5I5rf v9VzKf">
              <div class="uArJ5e UQuaGc Y5sE8d y4cid dvv0Pc M9Bg4d" role="button" tabindex="0" id="xAddFeedback">
                <span class="l4V7wb Fxmcue"><span class="NPEfkd RveJvd snByac">Add Feedback Survey</span></span>
              </div>
            </div>
          </div>
        `;

        mutation.target.insertBefore(add_survey_div, mutation.target.firstChild.nextSibling);

        // Add click event listener to the button
        document.getElementById("add-feedback-survey-btn").addEventListener("click", () => {
          console.log("button clicked in content.js")
          const eventTitle = document.querySelector('input[aria-label="Title"]').value;
          const eventId = extractEventIdFromURL(window.location.href);
          chrome.runtime.sendMessage({ action: "createSurvey", eventId, eventTitle }, (resp) => {
            console.log("resp: ", resp)

            if (resp?.surveyId) {
              // Convert the button to a link to edit the survey
              const surveyLink = `https://docs.google.com/forms/d/${resp.surveyId}/edit`;
              console.log("updating button to link", surveyLink)
              const add_survey_div = document.getElementById("add-feedback-survey-btn");
              add_survey_div.innerHTML = `
                <div aria-hidden="true" class="tzcF6">
                  <i class="google-material-icons meh4fc hggPq uSx8Od" aria-hidden="true">
                    <div id="rHCnYc">  
                      <img alt aria-hidden="true" class="I6gAld" src="https://www.gstatic.com/images/branding/product/1x/forms_2020q4_48dp.png">
                    </div>
                  </i>
                </div>
                <div class="j3nyw">
                  <div class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-INsAgc VfPpkd-LgbsSe-OWXEXe-dgl2Hf Rj2Mlf OLiIxf PDpWxe P62QJc LQeN7 UZLCCd xYvThe j9Fkxf">
                    <a href="${surveyLink}" target="_blank" tabindex="0" id="xEditFeedback">
                      <span class="l4V7wb Fxmcue"><span class="NPEfkd RveJvd snByac">Edit Feedback Survey</span></span>
                    </a>
                  </div>
                </div>
              `;
            } else {
              console.error("Failed to create survey or receive surveyId.");
            }


          });
        });
      }
    }
  });
});

// Start observing the body for any DOM changes
observer.observe(document.body, { childList: true, subtree: true });

// Function to extract the event ID from the URL (for example, from a URL like https://calendar.google.com/calendar/u/0/r/eventedit/abcdefg)
function extractEventIdFromURL(url) {
  const match = url.match(/eventedit\/([^?&]+)/);
  return match ? match[1] : null;
}
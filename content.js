const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList" && mutation.target.className === "ewPPR") {
      handleMutation(mutation);
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });

function handleMutation(mutation) {
  if (!document.getElementById("add-feedback-survey-btn")) {
    const addSurveyDiv = createAddSurveyButton();
    mutation.target.insertBefore(addSurveyDiv, mutation.target.firstChild.nextSibling);
    addClickEventListener(addSurveyDiv);
  }
}

function createAddSurveyButton() {
  const addSurveyDiv = document.createElement("div");
  addSurveyDiv.classList.add("FrSOzf");
  addSurveyDiv.id = "add-feedback-survey-btn";
  addSurveyDiv.innerHTML = `
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
  return addSurveyDiv;
}

function addClickEventListener(addSurveyDiv) {
  addSurveyDiv.addEventListener("click", async () => {
    console.log("button clicked in content.js");
    const eventTitle = document.querySelector('input[aria-label="Title"]').value;
    const eventId = extractEventIdFromURL(window.location.href);
    
    try {
      const resp = await createSurvey(eventId, eventTitle);
      if (resp?.surveyId) {
        updateButtonToLink(addSurveyDiv, resp.surveyId);
      } else {
        console.error("Failed to create survey or receive surveyId.");
      }
    } catch (error) {
      console.error("Error creating survey:", error);
    }
  });
}

function createSurvey(eventId, eventTitle) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "createSurvey", eventId, eventTitle }, (resp) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(resp);
      }
    });
  });
}

function updateButtonToLink(addSurveyDiv, surveyId) {
  const surveyLink = `https://docs.google.com/forms/d/${surveyId}/edit`;
  console.log("updating button to link", surveyLink);
  addSurveyDiv.innerHTML = `
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
}

function extractEventIdFromURL(url) {
  const match = url.match(/eventedit\/([^?&]+)/);
  return match ? match[1] : null;
}
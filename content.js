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
    const eventId = extractEventIdFromURL(window.location.href);
    chrome.runtime.sendMessage({ action: "checkIfSurveyExists", eventId }, (resp) => {
      if (resp.surveyId) {
        const editSurveyDiv = createEditSurveyButton(resp.surveyId);
        mutation.target.insertBefore(editSurveyDiv, mutation.target.firstChild.nextSibling);
        addDeleteClickListener(resp.surveyId, editSurveyDiv);
      } else {
        const addSurveyDiv = createAddSurveyButton();
        mutation.target.insertBefore(addSurveyDiv, mutation.target.firstChild.nextSibling);
        addClickEventListener(addSurveyDiv);
      }
    });
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
          <span class="l4V7wb Fxmcue"><span class="NPEfkd RveJvd snByac">Add Meeting Feedback Survey</span></span>
        </div>
      </div>
    </div>
  `;
  return addSurveyDiv;
}

function createEditSurveyButton(surveyId) {
  const surveyLink = `https://docs.google.com/forms/d/${surveyId}/edit`;
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
      <div class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-INsAgc VfPpkd-LgbsSe-OWXEXe-dgl2Hf Rj2Mlf OLiIxf PDpWxe P62QJc LQeN7 UZLCCd xYvThe j9Fkxf">
        <a href="${surveyLink}" target="_blank" tabindex="0" id="xEditFeedback">
          <span class="l4V7wb Fxmcue"><span class="NPEfkd RveJvd snByac">Edit Feedback Survey</span></span>
        </a>
      </div>
      <button class="VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ mN1ivc m2yD4b GjP4J RuPEwd HPut7d" mousedown:UX7yZ; mouseup:lbsD7e; mouseenter:tfO1Yc; mouseleave:JywGue; touchstart:p6p2H; touchmove:FwuNnf; touchend:yfqBxc; touchcancel:JMtRjd; focus:AHmuwe; blur:O22p3e; aria-label="Remove survey" id="xDeleteSurvey">
        <div class="VfPpkd-Bz112c-Jh9lGc"></div><div class="VfPpkd-Bz112c-J1Ukfc-LhBDec"></div>
        <i class="google-material-icons VfPpkd-kBDsod meh4fc hggPq" aria-hidden="true">close</i>
      </button>
    </div>
  `;

  return addSurveyDiv;
}

function addDeleteClickListener(surveyId, addSurveyDiv, responderUri) {
  // Add event listener for the delete button
  document.getElementById("xDeleteSurvey").addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    deleteSurvey(surveyId, addSurveyDiv, responderUri);
  });
}

function addClickEventListener(addSurveyDiv) {
  addSurveyDiv.addEventListener("click", async () => {
    const thisDiv = document.getElementById("xAddFeedback").parentNode.parentNode;
    console.log(thisDiv);
    const loadingCircle = document.createElement("div");
    loadingCircle.id = "new-form-progress";
    loadingCircle.className = "Mciu2 bFNshf";
    loadingCircle.innerHTML = loadingHtml;
    thisDiv.appendChild(loadingCircle);
    const eventTitle = document.querySelector('input[aria-label="Title"]').value;
    const eventId = extractEventIdFromURL(window.location.href);

    try {
      const resp = await createSurvey(eventId, eventTitle);
      if (resp?.surveyId) {
        updateButtonToLink(addSurveyDiv, resp.surveyId, resp.responderUri);
        thisDiv.removeChild(loadingCircle);
        addSurveyLinkToDescription(resp.responderUri);
      } else {
        console.error("Failed to create survey or receive surveyId.");
      }
    } catch (error) {
      console.error("Error creating survey:", error);
    }
  });
}

function addSurveyLinkToDescription(uri) {
  const inputDiv = document.getElementById("xDescIn").querySelector(`div[aria-label="Description"]`);
  inputDiv.appendChild(document.createElement("br"));
  inputDiv.appendChild(document.createTextNode("─────────"));
  inputDiv.appendChild(document.createElement("br"));
  inputDiv.appendChild(document.createTextNode("Please rate the value of this meeting!"));
  inputDiv.appendChild(document.createElement("br"));
  const surveyLink = document.createElement("a");
  surveyLink.href = uri;
  surveyLink.target = "_blank";
  surveyLink.innerHTML = uri;
  inputDiv.appendChild(surveyLink);
  inputDiv.appendChild(document.createElement("br"));
  inputDiv.appendChild(document.createTextNode("─────────"));
  inputDiv.appendChild(document.createElement("br"));
}

function removeSurveyLinkInDescription(uri) {
  const inputDiv = document.getElementById("xDescIn").querySelector(`div[aria-label="Description"]`);
  const surveyLink = inputDiv.querySelector(`a[href="${uri}"]`);
  inputDiv.removeChild(surveyLink.previousSibling);
  inputDiv.removeChild(surveyLink.previousSibling);
  inputDiv.removeChild(surveyLink.previousSibling);
  inputDiv.removeChild(surveyLink.previousSibling);
  inputDiv.removeChild(surveyLink.previousSibling);
  inputDiv.removeChild(surveyLink.nextSibling);
  inputDiv.removeChild(surveyLink.nextSibling);
  inputDiv.removeChild(surveyLink.nextSibling);
  inputDiv.removeChild(surveyLink);
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

function updateButtonToLink(addSurveyDiv, surveyId, responderUri) {
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
      <button class="VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ mN1ivc m2yD4b GjP4J RuPEwd HPut7d" mousedown:UX7yZ; mouseup:lbsD7e; mouseenter:tfO1Yc; mouseleave:JywGue; touchstart:p6p2H; touchmove:FwuNnf; touchend:yfqBxc; touchcancel:JMtRjd; focus:AHmuwe; blur:O22p3e; aria-label="Remove survey" id="xDeleteSurvey">
        <div class="VfPpkd-Bz112c-Jh9lGc"></div><div class="VfPpkd-Bz112c-J1Ukfc-LhBDec"></div>
        <i class="google-material-icons VfPpkd-kBDsod meh4fc hggPq" aria-hidden="true">close</i>
      </button>
    </div>
  `;

  // Add event listener for the delete button
  document.getElementById("xDeleteSurvey").addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    deleteSurvey(surveyId, addSurveyDiv, responderUri);
  });
}

function deleteSurvey(surveyId, addSurveyDiv, responderUri) {
  if (confirm("Are you sure you want to delete this survey?")) {
    chrome.runtime.sendMessage({ action: "deleteSurvey", surveyId }, (response) => {
      if (response.success) {
        console.log("Survey deleted successfully");
        // Reset the button to its original state
        const newAddSurveyDiv = createAddSurveyButton();
        addSurveyDiv.parentNode.replaceChild(newAddSurveyDiv, addSurveyDiv);
        addClickEventListener(newAddSurveyDiv);

        removeSurveyLinkInDescription(responderUri);
      } else {
        console.error("Failed to delete survey:", response.error);
        alert("Failed to delete survey. Please try again.");
      }
    });
  }
}

function extractEventIdFromURL(url) {
  const match = url.match(/eventedit\/([^?&]+)/);
  return match ? match[1] : null;
}

const loadingHtml = `
  <div class="WjSA4b">
    <div class="y0NMy">
      <div data-progressvalue="0" class="DU29of a9u1Hb B85vKf">
        <div class="VfPpkd-JGcpL-Mr8B3-V67aGc"> </div>
        <div role="progressbar" class="VfPpkd-JGcpL-P1ekSe VfPpkd-JGcpL-P1ekSe-OWXEXe-A9y3zc VfPpkd-JGcpL-P1ekSe-OWXEXe-DMahoc-hxXJme" aria-hidden="true" style="width: 20px; height: 20px;">
          <div class="VfPpkd-JGcpL-uI4vCe-haAclf">
            <svg class="VfPpkd-JGcpL-uI4vCe-LkdAo-Bd00G" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <circle class="VfPpkd-JGcpL-uI4vCe-u014N" cx="10" cy="10" r="7.5" stroke-width="2.3333333333333335"></circle>
              <circle class="VfPpkd-JGcpL-uI4vCe-LkdAo" cx="10" cy="10" r="7.5" stroke-dasharray="47.123889" stroke-dashoffset="47.123889" stroke-width="2.3333333333333335"></circle>
            </svg>
          </div>
          <div class="VfPpkd-JGcpL-IdXvz-haAclf">
            <div class="VfPpkd-JGcpL-QYI5B-pbTTYe VfPpkd-JGcpL-Ydhldb-R6PoUb">
              <div class="VfPpkd-JGcpL-lLvYUc-e9ayKc VfPpkd-JGcpL-lLvYUc-LK5yu">
                <svg class="VfPpkd-JGcpL-IdXvz-LkdAo-Bd00G" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="7.5" stroke-dasharray="47.123889" stroke-dashoffset="23.5619445" stroke-width="2.3333333333333335"></circle>
                </svg>
              </div>
              <div class="VfPpkd-JGcpL-OcUoKf-TpMipd">
                <svg class="VfPpkd-JGcpL-IdXvz-LkdAo-Bd00G" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

const f=new MutationObserver(d=>{d.forEach(e=>{e.type==="childList"&&e.target instanceof HTMLElement&&e.target.className==="ewPPR"&&g(e)})});f.observe(document.body,{childList:!0,subtree:!0});function g(d){if(!document.getElementById("add-feedback-survey-btn")){const e=p(window.location.href);chrome.runtime.sendMessage({action:"checkIfSurveyExists",eventId:e},t=>{var s;const i=((s=d.target.firstChild)==null?void 0:s.nextSibling)??null;if(t.surveyId){const r=m(t.surveyId);d.target.insertBefore(r,i),h(t.surveyId,r)}else{const r=l();d.target.insertBefore(r,i),u(r)}})}}function l(){const d=document.createElement("div");return d.classList.add("FrSOzf"),d.id="add-feedback-survey-btn",d.innerHTML=`
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
  `,d}function m(d){const e=`https://docs.google.com/forms/d/${d}/edit`,t=document.createElement("div");return t.classList.add("FrSOzf"),t.id="add-feedback-survey-btn",t.innerHTML=`
    <div aria-hidden="true" class="tzcF6">
      <i class="google-material-icons meh4fc hggPq uSx8Od" aria-hidden="true">
        <div id="rHCnYc">  
          <img alt aria-hidden="true" class="I6gAld" src="https://www.gstatic.com/images/branding/product/1x/forms_2020q4_48dp.png">
        </div>
      </i>
    </div>
    <div class="j3nyw">
      <div class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-INsAgc VfPpkd-LgbsSe-OWXEXe-dgl2Hf Rj2Mlf OLiIxf PDpWxe P62QJc LQeN7 UZLCCd xYvThe j9Fkxf">
        <a href="${e}" target="_blank" tabindex="0" id="xEditFeedback">
          <span class="l4V7wb Fxmcue"><span class="NPEfkd RveJvd snByac">Edit Feedback Survey</span></span>
        </a>
      </div>
      <button class="VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ mN1ivc m2yD4b GjP4J RuPEwd HPut7d" mousedown:UX7yZ; mouseup:lbsD7e; mouseenter:tfO1Yc; mouseleave:JywGue; touchstart:p6p2H; touchmove:FwuNnf; touchend:yfqBxc; touchcancel:JMtRjd; focus:AHmuwe; blur:O22p3e; aria-label="Remove survey" id="xDeleteSurvey">
        <div class="VfPpkd-Bz112c-Jh9lGc"></div><div class="VfPpkd-Bz112c-J1Ukfc-LhBDec"></div>
        <i class="google-material-icons VfPpkd-kBDsod meh4fc hggPq" aria-hidden="true">close</i>
      </button>
    </div>
  `,t}function h(d,e){const t=document.getElementById("xDeleteSurvey");if(!t){console.error("Couldn't find xDeleteSurvey in DOM");return}t.addEventListener("click",i=>{i.stopPropagation(),v(d,e,void 0)})}function u(d){d.addEventListener("click",async()=>{var n,o;const e=document.getElementById("xDeleteSurvey");if(!e){console.error("Couldn't find xDeleteSurvey in DOM");return}const t=(n=e.parentNode)==null?void 0:n.parentNode,i=document.createElement("div");i.id="new-form-progress",i.className="Mciu2 bFNshf",i.innerHTML=S,t==null||t.appendChild(i);const s=(o=document.querySelector('input[aria-label="Title"]'))==null?void 0:o.value,r=p(window.location.href);if(!r){console.error("couldn't get event ID from url");return}try{const c=await y(r,s);c!=null&&c.surveyId?(L(d,c.surveyId,c.responderUri),t==null||t.removeChild(i),b(c.responderUri)):console.error("Failed to create survey or receive surveyId.")}catch(c){console.error("Error creating survey:",c)}})}function y(d,e){return new Promise((t,i)=>{chrome.runtime.sendMessage({action:"createSurvey",eventId:d,eventTitle:e},s=>{chrome.runtime.lastError?i(chrome.runtime.lastError):t(s)})})}function b(d){var i;const e=(i=document.getElementById("xDescIn"))==null?void 0:i.querySelector('div[aria-label="Description"]');if(!e)return;e.appendChild(document.createElement("br")),e.appendChild(document.createTextNode("─────────")),e.appendChild(document.createElement("br")),e.appendChild(document.createTextNode("Please rate the value of this meeting!")),e.appendChild(document.createElement("br"));const t=document.createElement("a");t.href=d,t.target="_blank",t.innerHTML=d,e.appendChild(t),e.appendChild(document.createElement("br")),e.appendChild(document.createTextNode("─────────")),e.appendChild(document.createElement("br"))}function k(d){var i,s,r,n,o,c,a;if(d===void 0)return;const e=(i=document.getElementById("xDescIn"))==null?void 0:i.querySelector('div[aria-label="Description"]');if(!e)return;const t=e.querySelector(`a[href="${d}"]`);t&&(o=(n=(r=(s=t.previousSibling)==null?void 0:s.previousSibling)==null?void 0:r.previousSibling)==null?void 0:n.previousSibling)!=null&&o.previousSibling&&(a=(c=t.nextSibling)==null?void 0:c.nextSibling)!=null&&a.nextSibling&&(e.removeChild(t.previousSibling),e.removeChild(t.previousSibling),e.removeChild(t.previousSibling),e.removeChild(t.previousSibling),e.removeChild(t.previousSibling),e.removeChild(t.nextSibling),e.removeChild(t.nextSibling),e.removeChild(t.nextSibling),e.removeChild(t))}function L(d,e,t){const i=`https://docs.google.com/forms/d/${e}/edit`;console.log("updating button to link",i),d.innerHTML=`
    <div aria-hidden="true" class="tzcF6">
      <i class="google-material-icons meh4fc hggPq uSx8Od" aria-hidden="true">
        <div id="rHCnYc">  
          <img alt aria-hidden="true" class="I6gAld" src="https://www.gstatic.com/images/branding/product/1x/forms_2020q4_48dp.png">
        </div>
      </i>
    </div>
    <div class="j3nyw">
      <div class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-INsAgc VfPpkd-LgbsSe-OWXEXe-dgl2Hf Rj2Mlf OLiIxf PDpWxe P62QJc LQeN7 UZLCCd xYvThe j9Fkxf">
        <a href="${i}" target="_blank" tabindex="0" id="xEditFeedback">
          <span class="l4V7wb Fxmcue"><span class="NPEfkd RveJvd snByac">Edit Feedback Survey</span></span>
        </a>
      </div>
      <button class="VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ mN1ivc m2yD4b GjP4J RuPEwd HPut7d" mousedown:UX7yZ; mouseup:lbsD7e; mouseenter:tfO1Yc; mouseleave:JywGue; touchstart:p6p2H; touchmove:FwuNnf; touchend:yfqBxc; touchcancel:JMtRjd; focus:AHmuwe; blur:O22p3e; aria-label="Remove survey" id="xDeleteSurvey">
        <div class="VfPpkd-Bz112c-Jh9lGc"></div><div class="VfPpkd-Bz112c-J1Ukfc-LhBDec"></div>
        <i class="google-material-icons VfPpkd-kBDsod meh4fc hggPq" aria-hidden="true">close</i>
      </button>
    </div>
  `;const s=document.getElementById("xDeleteSurvey");if(!s){console.error("Couldn't find xDeleteSurvey in DOM");return}s.addEventListener("click",r=>{r.stopPropagation(),v(e,d,t)})}function v(d,e,t){confirm("Are you sure you want to delete this survey?")&&chrome.runtime.sendMessage({action:"deleteSurvey",surveyId:d},i=>{var s;if(i.success){console.log("Survey deleted successfully");const r=l();(s=e.parentNode)==null||s.replaceChild(r,e),u(r),k(t)}else console.error("Failed to delete survey:",i.error),alert("Failed to delete survey. Please try again.")})}function p(d){const e=d.match(/eventedit\/([^?&]+)/);return e?e[1]:null}const S=`
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

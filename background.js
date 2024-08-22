chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "createSurvey") {
    console.log("createSurvey message received in background");
    // Get the eventId and eventTitle from the message
    const { eventId, eventTitle } = request;

    // Ensure the user is authenticated
    ensureAuthenticated()
      .then((token) => {
        // Use the Google Forms API to create a survey
        createSurvey(token, eventTitle)
          .then((surveyId) => {
            console.log("Survey created with ID:", surveyId);
            // You can send the survey ID back to the content script if needed
            sendResponse({ success: true, surveyId });
          })
          .catch((error) => {
            console.error("Error creating survey:", error);
            sendResponse({ success: false, error });
          });
      })
      .catch((authError) => {
        console.error("Authentication failed:", authError);
        sendResponse({ success: false, error: authError });
      });

    // Indicate that the response will be sent asynchronously
    return true;
  }
});

function ensureAuthenticated() {
  return new Promise((resolve, reject) => {
    // Check if the user is already authenticated
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      if (chrome.runtime.lastError || !token) {
        reject(chrome.runtime.lastError);
      } else {
        console.log(token);
        resolve(token);
      }
    });
  });
}

function createSurvey(token, eventTitle) {
  return new Promise((resolve, reject) => {
    const surveyTitle = `Quick Meeting Feedback`;

    // Payload to create the form
    const surveyPayload = {
      info: {
        title: surveyTitle,
        documentTitle: surveyTitle, 
      },
    };

    // Step 1: Create the form
    fetch("https://forms.googleapis.com/v1/forms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(surveyPayload),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(error => {
            throw new Error(`Failed to create survey: ${error.error.message}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Form created:", data);
        if (data?.formId) {
          const formId = data.formId;

          // Step 2: Update the form with content
          const surveyContent = {
            requests: [
              {
                createItem: {
                  item: {
                    title: "Would you go to a meeting like that again?",
                    questionItem: {
                      question: {
                        required: true,
                        scaleQuestion: {
                          low: 0,
                          high: 2,
                          lowLabel: "Not worth it",
                          highLabel: "Absolutely",
                        },
                      },
                    },
                  },
                  location: {
                    index: 0,
                  },
                },
              },
              {
                updateFormInfo: {
                  info: {
                    description: `Feedback survey for the "${eventTitle}" meeting`
                  },
                  updateMask:"description"
                },
              }
            ],
          };

          fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(surveyContent),
          })
            .then((response) => {
              if (!response.ok) {
                return response.json().then(error => {
                  throw new Error(`Failed to update survey: ${error.error.message}`);
                });
              }
              return response.json();
            })
            .then((updateData) => {
              console.log("Form updated:", updateData);
              resolve(formId);
            })
            .catch((error) => reject(error));
        } else {
          reject(new Error("Failed to create survey: No formId returned"));
        }
      })
      .catch((error) => reject(error));
  });
}

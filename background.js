chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "createSurvey") {
    console.log("createSurvey message received in background");
    handleCreateSurvey(request)
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  } else if (request.action === "deleteSurvey") {
    handleDeleteSurvey(request.surveyId)
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

async function handleDeleteSurvey(surveyId) {
  try {
    const token = await ensureAuthenticated();
    await trashFormInDrive(token, surveyId);
    return { success: true };
  } catch (error) {
    console.error("Error trashing form:", error);
    throw error;
  }
}

async function trashFormInDrive(token, fileId) {
  const response = await fetch(`https://www.googleapis.com/drive/v2/files/${fileId}/trash`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.text();
    console.log(error)
    throw new Error(`Failed to trash form: ${error}`);
  }
}

async function handleCreateSurvey(request) {
  const { eventId, eventTitle } = request;
  try {
    const token = await ensureAuthenticated();
    const surveyId = await createSurvey(token, eventTitle);
    console.log("Survey created with ID:", surveyId);
    return { success: true, surveyId };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

function ensureAuthenticated() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      if (chrome.runtime.lastError || !token) {
        reject(new Error(chrome.runtime.lastError?.message || "Authentication failed"));
      } else {
        console.log(token);
        resolve(token);
      }
    });
  });
}

async function createSurvey(token, eventTitle) {
  const surveyTitle = "Quick Meeting Feedback";
  const surveyPayload = {
    info: {
      title: surveyTitle,
      documentTitle: surveyTitle,
    },
  };

  const formData = await fetchWithAuth(
    "https://forms.googleapis.com/v1/forms",
    {
      method: "POST",
      body: JSON.stringify(surveyPayload),
    },
    token
  );

  if (!formData.formId) {
    throw new Error("Failed to create survey: No formId returned");
  }

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
          location: { index: 0 },
        },
      },
      {
        updateFormInfo: {
          info: {
            description: `Feedback survey for the "${eventTitle}" meeting`,
          },
          updateMask: "description",
        },
      },
    ],
  };

  await fetchWithAuth(
    `https://forms.googleapis.com/v1/forms/${formData.formId}:batchUpdate`,
    {
      method: "POST",
      body: JSON.stringify(surveyContent),
    },
    token
  );

  return formData.formId;
}

async function fetchWithAuth(url, options, token) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API request failed: ${error.error.message}`);
  }

  return response.json();
}

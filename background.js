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
  } else if (request.action === "checkIfSurveyExists") {
    handleCheckIfSurveyExists(request.eventId)
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

async function handleCheckIfSurveyExists(eventId) {
  try {
    const token = await ensureAuthenticated();
    const surveyId = await getFileFromDrive(token, eventId);
    return { success: true, surveyId };
  } catch (error) {
    console.error("Error searching for file:", error);
    throw error;
  }
}

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

async function getFileFromDrive(token, fileName) {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${fileName}'`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.log(error);
    throw new Error(`Failed to trash form: ${error}`);
  }

  const data = await response.json();
  console.log(data);

  if (data.files && data.files.length > 0) {
    // Return the first matching file (or handle multiple matches as needed)
    return data.files[0].id;
  } else {
    throw new Error(`No file found with the name: ${fileName}`);
  }
}

async function trashFormInDrive(token, fileId) {
  const response = await fetch(`https://www.googleapis.com/drive/v2/files/${fileId}/trash`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.log(error);
    throw new Error(`Failed to trash form: ${error}`);
  }
}

async function handleCreateSurvey(request) {
  const { eventId, eventTitle } = request;
  try {
    const token = await ensureAuthenticated();
    const createdForm = await createSurvey(token, eventTitle, eventId);
    console.log("Survey created with ID:", createdForm.formId);
    const surveyId = createdForm.formId;
    const responderUri = createdForm.responderUri;
    return { success: true, surveyId, responderUri };
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

async function createSurvey(token, eventTitle, eventId) {
  const surveyTitle = "Quick Meeting Feedback";
  const surveyPayload = {
    info: {
      title: surveyTitle,
      documentTitle: eventId,
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
    includeFormInResponse: true,
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

  const resp = await fetchWithAuth(
    `https://forms.googleapis.com/v1/forms/${formData.formId}:batchUpdate`,
    {
      method: "POST",
      body: JSON.stringify(surveyContent),
    },
    token
  );

  return resp.form;
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

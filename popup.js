document.getElementById('createSurvey').addEventListener('click', () => {
  const eventId = document.getElementById('eventId').value;
  chrome.runtime.getBackgroundPage((backgroundPage) => {
    backgroundPage.authenticateAndCreateSurvey(eventId);
  });
});
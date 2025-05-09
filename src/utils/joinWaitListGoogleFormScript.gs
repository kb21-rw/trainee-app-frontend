function onFormSubmit(e) {
  const formResponse = e.response

  const responseData = {
    timestamp: formResponse.getTimestamp().toISOString(),
    responses: {},
  }

  const itemResponses = formResponse.getItemResponses()

  itemResponses.forEach((itemResponse) => {
    const question = itemResponse
      .getItem()
      .getTitle()
      .replace(" ", "")
      .toLowerCase()
    const answer = itemResponse.getResponse().trim()
    responseData.responses[question] = answer
  })

  console.log(responseData)

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(responseData),
    muteHttpExceptions: true,
  }

  // use actual link for the production backend
  const response = UrlFetchApp.fetch(
    "https://trainee-app-backend-staging-1593.up.railway.app/join-wait-list",
    options,
  )
  Logger.log(response.getContentText())
}

function setTrigger() {
  console.log("Setting the trigger...")
  const form = FormApp.getActiveForm()
  ScriptApp.newTrigger("onFormSubmit").forForm(form).onFormSubmit().create()
}

function onFormSubmit(e) {
  try {
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
        .replace(/\s+/g, "") // Replace all whitespace, not just first space
        .toLowerCase()
      
      let answer = itemResponse.getResponse()
      
      // Handle different response types
      if (typeof answer === 'string') {
        answer = answer.trim()
      } else if (Array.isArray(answer)) {
        answer = answer.map(item => typeof item === 'string' ? item.trim() : item)
      }
      
      responseData.responses[question] = answer
    })

    Logger.log("Form data to send:", JSON.stringify(responseData))

    const options = {
      method: "POST",
      contentType: "application/json",
      payload: JSON.stringify(responseData),
      muteHttpExceptions: true,
    }

    // Replace with your actual deployed backend URL
    // For local testing, use ngrok: https://abc123.ngrok.io/join-wait-list
    const backendUrl = "https://9506bd5a069f.ngrok-free.app/join-wait-list"
    
    const response = UrlFetchApp.fetch(backendUrl, options)
    const responseCode = response.getResponseCode()
    const responseText = response.getContentText()
    
    if (responseCode >= 200 && responseCode < 300) {
      Logger.log("Successfully sent to backend:", responseText)
    } else {
      Logger.log("Backend error - Code:", responseCode, "Response:", responseText)
    }
    
  } catch (error) {
    Logger.log("Script error:", error.toString())
  }
}

function setTrigger() {
  Logger.log("Setting the trigger...")
  try {
    const form = FormApp.getActiveForm()
    ScriptApp.newTrigger("onFormSubmit").forForm(form).onFormSubmit().create()
    Logger.log("Trigger set successfully")
  } catch (error) {
    Logger.log("Error setting trigger:", error.toString())
  }
}

// Test function to verify your backend is reachable
function testBackendConnection() {
  const testData = {
    timestamp: new Date().toISOString(),
    responses: { test: "connection test" }
  }
  
  const options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(testData),
    muteHttpExceptions: true,
  }
  
  const backendUrl = "https://9506bd5a069f.ngrok-free.app/join-wait-list"
  
  try {
    const response = UrlFetchApp.fetch(backendUrl, options)
    Logger.log("Test Response Code:", response.getResponseCode())
    Logger.log("Test Response:", response.getContentText())
  } catch (error) {
    Logger.log("Test Error:", error.toString())
  }
}
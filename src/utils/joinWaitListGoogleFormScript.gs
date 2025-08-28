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
        answer = answer.trim().toLowerCase()
      } else if (Array.isArray(answer)) {
        answer = answer.map(item => typeof item === 'string' ? item.trim() : item)
      }
      
      responseData.responses[question] = answer
    })

    console.log("Form data to send:", JSON.stringify(responseData))

    const options = {
      method: "POST",
      contentType: "application/json",
      payload: JSON.stringify(responseData),
      muteHttpExceptions: true,
    }

    // For local testing, use ngrok: 
    const backendUrl = "https://bf581d0b3061.ngrok-free.app/join-wait-list"
    // const backendUrl = "https://trainee-app-backend-development-c3ad.up.railway.app/join-wait-list"
    
    const response = UrlFetchApp.fetch(backendUrl, options)
    const responseCode = response.getResponseCode()
    const responseText = response.getContentText()
    
    if (responseCode >= 200 && responseCode < 300) {
      console.log("Successfully sent to backend:", responseText)
    } else {
      console.log("Backend error - Code:", responseCode, "Response:", responseText)
    }
    
  } catch (error) {
    console.log("Script error:", error.toString())
  }
}

function setTrigger() {
  console.log("Setting the trigger...")
  try {
    const form = FormApp.getActiveForm()
    ScriptApp.newTrigger("onFormSubmit").forForm(form).onFormSubmit().create()
    console.log("Trigger set successfully")
  } catch (error) {
    console.log("Error setting trigger:", error.toString())
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
  
  
  const backendUrl = "https://bf581d0b3061.ngrok-free.app/join-wait-list"
  // const backendUrl = "https://trainee-app-backend-development-c3ad.up.railway.app/join-wait-list"
  
  try {
    const response = UrlFetchApp.fetch(backendUrl, options)
    console.log("Backend Response: ", response.getResponseCode())
    console.log("Test Response Code:", response.getResponseCode())
    console.log("Test Response:", response.getContentText())
  } catch (error) {
    console.log("Test Error:", error.toString())
  }
}
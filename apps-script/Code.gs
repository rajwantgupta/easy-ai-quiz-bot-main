// Google Apps Script code for creating and managing quiz forms

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'Google Apps Script web app is running',
    version: '1.0.0'
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'createForm') {
      const response = createQuizForm(data);
      return ContentService.createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Invalid action',
      message: 'The requested action is not supported'
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString(),
      message: 'An error occurred while processing your request'
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
  }
}

function createQuizForm(data) {
  try {
    // Validate input data
    if (!data.title || !data.questions || !Array.isArray(data.questions)) {
      throw new Error('Invalid input data');
    }

    // Create a new form
    const form = FormApp.create(data.title);
    form.setTitle(data.title)
        .setDescription('Quiz created by EASY AI Quiz')
        .setIsQuiz(true)
        .setCollectEmail(true)
        .setLimitOneResponsePerUser(true)
        .setAllowResponseEdits(false)
        .setPublishingSummary(true);
    
    // Set quiz settings
    form.setQuizSettings({
      isQuiz: true,
      collectEmail: true,
      limitResponse: true,
      allowResponseEdits: false,
      publishingSummary: true,
      quizSettings: {
        isQuiz: true,
        passingScore: data.passingScore || 70
      }
    });
    
    // Add questions
    data.questions.forEach((q, index) => {
      if (!q.question || !q.options || !Array.isArray(q.options)) {
        throw new Error(`Invalid question data at index ${index}`);
      }

      const item = form.addMultipleChoiceItem();
      item.setTitle(q.question)
          .setChoices(q.options.map((opt, i) => 
            item.createChoice(opt, i === q.correctAnswer)
          ))
          .setRequired(true)
          .setPoints(1);
    });
    
    // Get the form URL and ID
    const formUrl = form.getPublishedUrl();
    const formId = form.getId();
    
    // Return the form details
    return {
      success: true,
      formUrl: formUrl,
      formId: formId,
      message: 'Quiz form created successfully'
    };
    
  } catch (error) {
    throw new Error(`Failed to create quiz form: ${error.message}`);
  }
}

// Function to get form responses
function getFormResponses(formId) {
  try {
    const form = FormApp.openById(formId);
    const responses = form.getResponses();
    
    return responses.map(response => {
      const itemResponses = response.getItemResponses();
      return {
        timestamp: response.getTimestamp(),
        email: response.getRespondentEmail(),
        score: response.getScore(),
        answers: itemResponses.map(itemResponse => ({
          question: itemResponse.getItem().getTitle(),
          answer: itemResponse.getResponse()
        }))
      };
    });
  } catch (error) {
    throw new Error(`Failed to get form responses: ${error.message}`);
  }
}

// Function to generate a summary of responses
function generateResponseSummary(formId) {
  try {
    const responses = getFormResponses(formId);
    
    const summary = {
      totalResponses: responses.length,
      averageScore: 0,
      passingCount: 0,
      failingCount: 0,
      questionStats: {}
    };
    
    if (responses.length > 0) {
      let totalScore = 0;
      
      responses.forEach(response => {
        totalScore += response.score;
        if (response.score >= 70) { // Assuming 70% is passing
          summary.passingCount++;
        } else {
          summary.failingCount++;
        }
        
        // Update question statistics
        response.answers.forEach(answer => {
          if (!summary.questionStats[answer.question]) {
            summary.questionStats[answer.question] = {
              correct: 0,
              incorrect: 0,
              total: 0
            };
          }
          
          summary.questionStats[answer.question].total++;
          if (answer.isCorrect) {
            summary.questionStats[answer.question].correct++;
          } else {
            summary.questionStats[answer.question].incorrect++;
          }
        });
      });
      
      summary.averageScore = totalScore / responses.length;
    }
    
    return summary;
  } catch (error) {
    throw new Error(`Failed to generate response summary: ${error.message}`);
  }
} 
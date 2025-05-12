import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Initialize OAuth2 client
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Initialize Google Sheets API
const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
const forms = google.forms({ version: 'v1', auth: oauth2Client });

export interface GoogleSheetConfig {
  title: string;
  headers: string[];
  data: any[][];
}

export interface GoogleFormConfig {
  title: string;
  description: string;
  questions: {
    title: string;
    options: string[];
    correctAnswer: number;
  }[];
  passingScore: number;
}

export const createGoogleSheet = async (config: GoogleSheetConfig) => {
  try {
    // Create a new spreadsheet
    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: config.title,
        },
        sheets: [
          {
            properties: {
              title: 'Quiz Data',
            },
          },
        ],
      },
    });

    const spreadsheetId = spreadsheet.data.spreadsheetId;

    // Add headers and data
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [config.headers, ...config.data],
      },
    });

    return spreadsheetId;
  } catch (error) {
    console.error('Error creating Google Sheet:', error);
    throw error;
  }
};

export const createGoogleForm = async (config: GoogleFormConfig) => {
  try {
    // Create a new form
    const form = await forms.forms.create({
      requestBody: {
        info: {
          title: config.title,
          description: config.description,
        },
      },
    });

    const formId = form.data.formId;

    // Add questions
    for (const question of config.questions) {
      await forms.forms.batchUpdate({
        formId,
        requestBody: {
          requests: [
            {
              createItem: {
                item: {
                  title: question.title,
                  questionItem: {
                    question: {
                      choiceQuestion: {
                        type: 'RADIO',
                        options: question.options.map((option, index) => ({
                          value: option,
                          isCorrect: index === question.correctAnswer,
                        })),
                        shuffle: true,
                      },
                    },
                  },
                },
                location: {
                  index: 0,
                },
              },
            },
          ],
        },
      });
    }

    // Set form settings
    await forms.forms.batchUpdate({
      formId,
      requestBody: {
        requests: [
          {
            updateSettings: {
              settings: {
                quizSettings: {
                  isQuiz: true,
                  passingScore: config.passingScore,
                },
              },
              updateMask: 'quizSettings',
            },
          },
        ],
      },
    });

    return formId;
  } catch (error) {
    console.error('Error creating Google Form:', error);
    throw error;
  }
};

export const getFormResponses = async (formId: string) => {
  try {
    const responses = await forms.forms.responses.list({
      formId,
    });

    return responses.data;
  } catch (error) {
    console.error('Error getting form responses:', error);
    throw error;
  }
};

export const getSheetData = async (spreadsheetId: string, range: string) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return response.data.values;
  } catch (error) {
    console.error('Error getting sheet data:', error);
    throw error;
  }
}; 
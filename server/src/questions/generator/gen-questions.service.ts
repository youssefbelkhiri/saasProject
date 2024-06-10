import { Injectable } from '@nestjs/common';
import { PormptQuestion } from '../dto/prompt-question.dto';
import { SecondaryGeneratorService } from './secondary-generator.service';
const { GoogleGenerativeAI } = require('@google/generative-ai');

@Injectable()
export class GenQuestionsService {
  constructor(private readonly secondaryGeneratorService: SecondaryGeneratorService) {}

  async genQuestion(question: PormptQuestion) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Generate 7 questions with the following criteria:
                      Content: ${question.content},
                      Difficulty: ${question.difficulty},
                      Number of options for each question: ${question.nbrOptions},
                      Language of questions: ${question.language},
                      The result must be in JSON format like this:
                      [
                        {
                          "content": "question content",
                          "options": [
                            {
                              "option": "option",
                              "correct": true
                            },
                            {
                              "option": "option",
                              "correct": false
                            }
                          ]
                        }
                      ]
                      The result must be in JSON format directly.`;

      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();

      const jsonString = responseText.trim().replace(/```json|```/g, '');
      const questionsGenerated = JSON.parse(jsonString);

      return questionsGenerated;
    }
    catch (error) {
      console.error('Error generating question with Gemini API:', error);
      return this.secondaryGeneratorService.secondaryGenQuestion(question);
    }
  }
}

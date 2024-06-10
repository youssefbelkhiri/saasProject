import { Injectable } from '@nestjs/common';
import { PormptQuestion } from '../dto/prompt-question.dto';
import { SecondaryGeneratorService } from './secondary-generator.service';

@Injectable()
export class GenQuestionsService {
  constructor( private readonly SecondaryGeneratorService: SecondaryGeneratorService) {}

  async genQuestion(question: PormptQuestion){
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);


    async function run() {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

      const prompt = "Write a story about a magic backpack."

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log(text);
    }
    run();



    const promptQuestion = `Generate 7 questions (2400 maximum charcteres and dont use double quotes just single quote) with the following criteria:
                        Content: ${question.content} ,
                        Difficulty: ${question.difficulty},
                        Number of options for each question: ${question.nbrOptions},
                        language of questions: ${question.language},
                        the result must be on json format like this :
                        {
                          "content": question,
                          "options": [
                              {
                                  "option": option,
                                  "correct": true or false
                              },
                              {
                                  "option": option,
                                  "correct": true or false
                              }
                          ]
                        },
                        `

    return "SDS";


  }
}
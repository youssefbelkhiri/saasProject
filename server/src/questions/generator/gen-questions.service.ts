import { Injectable } from '@nestjs/common';
import { TextServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";
import { PormptQuestion } from '../dto/prompt-question.dto';
import { SecondaryGeneratorService } from './secondary-generator.service';

@Injectable()
export class GenQuestionsService {
  constructor( private readonly SecondaryGeneratorService: SecondaryGeneratorService) {}

  async genQuestion(question: PormptQuestion){
    const MODEL_NAME = "models/text-bison-001";
    const API_KEY = process.env.GOOGLEAI_KEY;

    const client = new TextServiceClient({
      authClient: new GoogleAuth().fromAPIKey(API_KEY),
    });

    const promptQuestion = `Generate 10 questions with the following criteria:
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

    const result = await client.generateText({
      model: MODEL_NAME,
      prompt: {
        text: promptQuestion,
      },
    });
    const questionsGenerated = result[0]?.candidates[0]?.output

    if(!questionsGenerated){
      return this.SecondaryGeneratorService.secondaryGenQuestion(question);
    }

    // const parsedResult = JSON.parse(questionsGenerated);
    // const transformedResult = parsedResult.map((questionObj) => {
    //   return {
    //     content: questionObj.content,
    //     options: questionObj.options,
    //   };
    // });

    return questionsGenerated;


  }
}
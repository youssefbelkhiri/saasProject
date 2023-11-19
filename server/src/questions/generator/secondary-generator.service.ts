import { Injectable } from '@nestjs/common';
// import { BardAPI  } from "bard-api-node"
import { PormptQuestion } from '../dto/prompt-question.dto';

@Injectable()
export class SecondaryGeneratorService {
  async secondaryGenQuestion(question: PormptQuestion){
    const { BardAPI } = require('bard-api-node');
    const assistant = new BardAPI();
    await assistant.setSession('__Secure-1PSID', process.env.BARD_API_KEY);

    const promptQuestion = `Generate 10 questions with the following criteria:
                        Content: ${question.content} ,
                        Difficulty: ${question.difficulty},
                        Number of options for each question: ${question.nbrOptions},
                        language of questions: french,
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
                        the result must start with json format directly do not use ''' json on start of the result
                        `

    const response = await assistant.getBardResponse(promptQuestion);
    // return response.content

    // const parsedResult = JSON.parse(response.content);

    return response;
  }
}
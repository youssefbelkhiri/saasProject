import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { gradingDto } from './dto/grading.dto';
import * as path from 'path';
import { createWorker } from 'tesseract.js';
import { gradingGroupDto } from './dto/grading-group.dto';
import * as PDFParse from 'pdf-parse';



@Injectable()
export class GradingService {
  constructor(private readonly prisma: PrismaService) {}

  // Find exam language
  async findExam(gradingDto: gradingDto){
    const exam = await this.prisma.exam.findUnique({ where: { exam_id: +gradingDto.exam_id }, });
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }
    return exam.exam_language
  }

  // Find paper path
  async findPaper(gradingDto: gradingDto){
    const paper = await this.prisma.papers.findUnique({ where: { paper_id: +gradingDto.paper_id }, });
    if (!paper) {
      throw new NotFoundException('Paper not found');
    }
    return paper.paper
  }

  // convert image to text
  async convertImageToTxt(paper_path: string, language: string){
  
    const worker = await createWorker('eng');
    try {
      const imagePath = path.join(process.cwd(), 'uploads', paper_path);

      const ret = await worker.recognize(imagePath);

      console.log("student_answers :", ret.data.text)

      return ret.data.text;
    } 
    finally {
      await worker.terminate();
    }
  }

  // convert pdf to text
  async convertPdfToTxt(paper_path: string){
    const pdfPath = path.join(process.cwd(), 'uploads', paper_path);
    return pdfPath

  }

  // convert text to json
  async convertTxtToJson(text: string) {
    try {
      // const matches = text.match(/Answer of Question (\d+) is\s*:\s*(\d+)/g);
      const matches = text.match(/Answer of Question (\d+)\s*is\s*:\s*(\d+)/g);

      
  
      if (!matches) {
        return
        // throw new Error('No answers found in the text');
      }
  
      const answers = matches.reduce((acc, match) => {
        const [_, question, answer] = match.match(/Answer of Question (\d+)\s*is\s*:\s*(\d+)/);
        acc[parseInt(question)] = parseInt(answer);
        return acc;
      }, {});
  
      const json_data = JSON.stringify(answers, null, 4);
  
      console.log(text);
      console.log(json_data);
      
      return json_data;
    } catch (error) {
      console.error(error.message);
      throw new Error('Error processing papers');
    }
  }
  
  // find exam answers 
  async findExamAnswers(exam_id: number) {
    const exam = await this.prisma.exam.findUnique({
      where: { exam_id: +exam_id },
      include: {
        questions: {
          orderBy: { questionOrder: 'asc' },
          include: {
            options: {
              orderBy: { optionOrder: 'asc' },
            },
          },
        },
      },
    });
  
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }
  
    const examAnswers: Record<string, number> = {};
  
    exam.questions.forEach((question) => {
      const correctOption = question.options.find((option) => option.correct);
  
      if (correctOption) {
        examAnswers[question.questionOrder.toString()] = correctOption.optionOrder;
      } 
      else {
        examAnswers[question.questionOrder.toString()] = 0; 
      }
    });
  
    return examAnswers;
  }

  // update paper note
  async updateNote(id: number, note: number){
    return await this.prisma.papers.update({
      where: { paper_id: +id },
      data: { note: +note }
    });
  }

  // calcul note of paper
  async calcNote(ids: string[], exam_id: number) {
    const questions = await this.prisma.questions.findMany({
      where: {
        questionOrder: {
          in: ids.map((id) => parseInt(id, 10)),
        },
        exam_id: exam_id,
      },
      select: {
        points: true,
      },
    });

    const totalPoints = questions.reduce((acc, question) => acc + question.points, 0);

    return totalPoints;
  }

  // find correct student answers
  async correctAnswers(studentAnswers, examAnswers) {
    const matchingKeys = [];
    for (const questionId in studentAnswers) {
      const studentAnswer = studentAnswers[questionId];
      if (examAnswers.hasOwnProperty(questionId) && examAnswers[questionId] === studentAnswer) {
        matchingKeys.push(questionId);
      }
    }

    return matchingKeys;
  }

  // grading paper
  async gradPaper(gradingDto: gradingDto, user_id: number){
    const paper = await this.prisma.papers.findUnique({
      where: { paper_id: +gradingDto.paper_id },
      include: {
        exam: {
          select: {
            user_id: true,
          },
        },
      },
    });

    const exam = await this.prisma.exam.findUnique({
      where: {
        exam_id: +gradingDto.exam_id,
      },
      select: {
        user_id: true,
      },
    });
  
    if (!paper || !exam) {
      throw new NotFoundException(`Can't find exam paper with id: ${gradingDto.paper_id}`);
    }
  
    if (paper.exam.user_id !== user_id || exam.user_id !== user_id) {
      throw new HttpException('Unauthorized', 401);
    }
    
    const language = await this.findExam(gradingDto);
    const paper_path = await this.findPaper(gradingDto); 

    const fileExtension = path.extname(paper_path).toLowerCase();

    let result: string;
    if (fileExtension === '.pdf') {
      result = await this.convertPdfToTxt(paper_path);
      console.log(result)
    } 
    else if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileExtension)) {
      result = await this.convertImageToTxt(paper_path, language);
    } 
    else {
      throw new Error('Unsupported file type');
    }

    let note;
    
    const student_answers = await this.convertTxtToJson(result);
    console.log("student_answers :", student_answers)
    
    if (student_answers) {
      const student_answers_json = JSON.parse(student_answers);    
      const exam_answers = await this.findExamAnswers(gradingDto.exam_id)
    
      const listQuestionsAnswers = await this.correctAnswers(student_answers_json, exam_answers)
      const note = await this.calcNote(listQuestionsAnswers, gradingDto.exam_id)
      await this.updateNote(gradingDto.paper_id, note)
    
      console.log("Student Answers :", student_answers_json)
      console.log("Exam Correct Answers :", exam_answers)
      console.log("List Correct Questions Answers :", listQuestionsAnswers)
      console.log("Final Note :", note)
    
      return {
        student_answers: student_answers_json,
        exam_answers: exam_answers,
        listQuestionsAnswers: listQuestionsAnswers,
        note: note,
      };
    } 
    else {
      await this.updateNote(gradingDto.paper_id, 0);
      return {
        student_answers: null,
        exam_answers: null,
        listQuestionsAnswers: null,
        note: 0,
      };
    }
    
    return note;
  }

  // grading group of student
  async gradGroup(gradingGroupDto: gradingGroupDto, user_id: number) {
    const students = await this.prisma.students.findMany({
      where: {
        groups: {
          some: {
            group_id: +gradingGroupDto.group_id,
          },
        },
      },
      include: {
        studentPapers: {
          where: {
            exam_id: +gradingGroupDto.exam_id,
          },
        },
      },
    });

    for (const student of students) {
      const paper = student.studentPapers[0];
      console.log(paper)

      if(paper) {
        await this.gradPaper({
          paper_id: paper.paper_id,
          exam_id: +gradingGroupDto.exam_id
        }, user_id);
      }
      
    }
  }

}

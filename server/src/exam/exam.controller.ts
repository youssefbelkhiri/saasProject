import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamDto, UpdateExamDto } from './dto';
import { Prisma } from '@prisma/client';

@Controller('exams')
export class ExamController {
    constructor(private examService:ExamService){}
    
    @Get('/')
    findExams(){
        return this.examService.findExams();
    }
    @Get(':id') 
    findExam(@Param('id') id: number){
        return this.examService.findExam(id);
    }
    @Post('new')
    createExam(@Body() dto:ExamDto){
        console.log({
            dto,  
        })
        return this.examService.createExam(dto);
    }
    @Patch(':id')
    updateExam(@Param('id') id: number,@Body() examDto: UpdateExamDto){
        return this.examService.updateExam(id,examDto);
    }
    @Delete(':id')
    deleteExam(@Param('id') id: number){
        return this.examService.deleteExam(id);
    }
    @Post(':id/export')
    async exportExam(@Param('id') id: number,@Res() res):Promise<void>{
        const pdfBuffer = await this.examService.exportExam(id);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=exam.pdf',
            'Content-Length':pdfBuffer.length,
        })
        res.end(pdfBuffer);
    }
    @Post(':id/exportAnswerSheet/:groupid')
    async exportAnswerSheet(@Param('id') id: number,@Param('groupid') groupeid: number,@Res() res):Promise<void>{
        const pdfBuffer = await this.examService.exportAnswerSheet(id,groupeid);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=exam.pdf',
            'Content-Length':pdfBuffer.length,
        })
        res.end(pdfBuffer);
    }
}

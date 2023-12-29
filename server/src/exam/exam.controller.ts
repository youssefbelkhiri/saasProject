import { Body, Controller, Delete, Get, Param, Patch, Post, Request, Res, UseGuards } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamDto, UpdateExamDto } from './dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('exams')
export class ExamController {
    constructor(private examService:ExamService){}
    
    @Get('/')
    findExams(){
        return this.examService.findExams();
    }

    @UseGuards(JwtAuthGuard) 
    @Get(':id') 
    async findExam(@Param('id') id: number , @Request() req){
        const {user} = req;
        console.log(user.id)
        const userExam = await this.examService.findExam(id)
        if(user.id === userExam.user_id){
            return userExam;
        }  
        else{
            return {
                "message":"unauthorized"
            }
        }
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
    @Get(':id/export')
    async exportExam(@Param('id') id: number,@Res() res):Promise<void>{
        const pdfBuffer = await this.examService.exportExam(id);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=exam.pdf',
            'Content-Length':pdfBuffer.length,
        })
        res.end(pdfBuffer);
    }
    @Get(':id/exportAnswerSheet/:groupid')
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

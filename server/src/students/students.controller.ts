import { Controller, Get, Post,Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  async getStudents(@Request() req){
    return await this.studentsService.getStudents(req.user.id)
  }

  @Get("/:id")
  async getStudent(@Param("id") id: number, @Request() req){
    return await this.studentsService.getStudent(id, req.user.id)
  }

  @Post()
  async createStudent(@Body() StudentDto: CreateStudentDto, @Request() req){
    return await this.studentsService.createStudent(StudentDto, req.user.id)
  }

  @Patch("/:id")
  async updateStudent(@Param("id") id: number, @Body() StudentDto: UpdateStudentDto, @Request() req){
    return await this.studentsService.updateStudent(id, StudentDto, req.user.id)
  }

  @Delete("/:id")
  async deleteStudent(@Param("id") id: number, @Request() req){
    return await this.studentsService.deleteStudent(id, req.user.id)
  }

}
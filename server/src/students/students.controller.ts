import { Controller, Get, Post,Patch, Delete, Param, Body } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  async getStudents(){
    return await this.studentsService.getStudents()
  }

  @Get("/:id")
  async getStudent(@Param("id") id: number){
    return await this.studentsService.getStudent(id)
  }

  @Post()
  async createStudent(@Body() StudentDto: CreateStudentDto){
    return await this.studentsService.createStudent(StudentDto)
  }

  @Patch("/:id")
  async updateStudent(@Param("id") id: number, @Body() StudentDto: UpdateStudentDto){
    return await this.studentsService.updateStudent(id, StudentDto)
  }

  @Delete("/:id")
  async deleteStudent(@Param("id") id: number){
    return await this.studentsService.deleteStudent(id)
  }

}
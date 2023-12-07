import { Controller, Get, Param, Post, UseInterceptors, UploadedFile, Body, BadRequestException, Patch, Delete } from '@nestjs/common';
import { PapersService } from './papers.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaperDto } from './dto/paper.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid'; 
import { UpdatePapertDto } from './dto/update-paper.dto';


@Controller('papers')
export class PapersController {
  constructor(private readonly papersService: PapersService) {}


  @Get()
  async findPapers(){
    return await this.papersService.findPapers()
  }

  @Get(":id")
  async findPaper(@Param("id") id: number){
    return await this.papersService.findPaper(id);
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: "./uploads",
      filename: (req, file, callback) => {
        const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;

        callback(null, filename);
      },
    }),
    fileFilter: (req, file, callback) => {
      const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf'];
      const ext = extname(file.originalname).toLowerCase();

      if (allowedExtensions.includes(ext)) {
        callback(null, true);
      } else {
        callback(new BadRequestException('Invalid file type. Only PNG, JPG, JPEG, and PDF are allowed.'), false);
      }
    },
  }))
  async importPaper(@UploadedFile() file: Express.Multer.File, @Body() PaperDto: PaperDto){
    return await this.papersService.importPaper(file.filename, PaperDto)
  }

  @Patch(":id")
  async updatePaper(@Param("id") id:number, @Body() paperDto: UpdatePapertDto){
    return await this.papersService.updatePaper(id, paperDto);
  }

  @Delete(":id")
  async deletePaper(@Param("id") id:number){
    return await this.papersService.deletePaper(id);
  }

}
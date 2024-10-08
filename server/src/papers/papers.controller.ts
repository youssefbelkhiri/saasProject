import {
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PapersService } from './papers.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaperDto } from './dto/paper.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePapertDto } from './dto/update-paper.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

interface Paper {
  studentIds: number[];
  exams_id: number;
}

@UseGuards(JwtAuthGuard)
@Controller('papers')
export class PapersController {
  constructor(private readonly papersService: PapersService) {}

  @Get(':examId')
  async findPapers(@Param('examId') examId: number, @Request() req) {
    return await this.papersService.findPapers(examId, req.user.id);
  }

  @Get(':id')
  async findPaper(@Param('id') id: number, @Request() req) {
    return await this.papersService.findPaper(id, req.user.id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
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
          callback(
            new BadRequestException(
              'Invalid file type. Only PNG, JPG, JPEG, and PDF are allowed.',
            ),
            false,
          );
        }
      },
    }),
  )
  async importPaper(
    @UploadedFile() file: Express.Multer.File,
    @Body() PaperDto: PaperDto,
    @Request() req,
  ) {
    return await this.papersService.importPaper(
      file.filename,
      PaperDto,
      req.user.id,
    );
  }



  @Patch('upload/:paperId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
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
          callback(
            new BadRequestException(
              'Invalid file type. Only PNG, JPG, JPEG, and PDF are allowed.',
            ),
            false,
          );
        }
      },
    }),
  )
  async updateOrImportPaper(
    @Param('paperId') paperId: number,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<void> {
    return await this.papersService.updateOrImportPaper(
      paperId,
      file.filename,
      req.user.id,
    );
  }


  // @Post('test')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  // }

  @Patch(':id')
  async updatePaper(
    @Param('id') id: number,
    @Body() paperDto: UpdatePapertDto,
    @Request() req,
  ) {
    return await this.papersService.updatePaper(id, paperDto, req.user.id);
  }

  @Post('createPapers')
  async createPapersForExam(@Body() studentsPapaer: Paper, req: Request) {
    const { studentIds, exams_id } = studentsPapaer;
    console.log(studentIds);
    try {
      await this.papersService.createPaper(studentIds, exams_id);
      return { message: 'created' };
    } catch (error) {
      console.error('Error creating papers:', error);
      return { error: 'error when creating papers' };
    }
  }

  @Delete(':id')
  async deletePaper(@Param('id') id: number, @Request() req) {
    return await this.papersService.deletePaper(id, req.user.id);
  }
}

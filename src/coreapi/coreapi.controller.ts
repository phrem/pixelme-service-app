import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CoreapiService } from './coreapi.service';
import { Response } from 'express';
import { Express } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { threadId } from 'worker_threads';

@Controller('api')
export class CoreapiController {
  constructor(private readonly coreapiService: CoreapiService) {}

  @Get('all')
  @UseGuards(AuthGuard('api-key'))
  async getAll(@Res() res: Response) {
    const images = await this.coreapiService.getAll();
    if (images) {
      res.status(HttpStatus.OK).send(images);
    } else {
      res
        .status(HttpStatus.EXPECTATION_FAILED)
        .send('This image out of service.');
    }
  }

  @Get('pagination/skip/:skip/take/:take')
  @UseGuards(AuthGuard('api-key'))
  async getPagination(
    @Res() res: Response,
    @Param('skip') skip: string,
    @Param('take') take: string,
  ) {
    const images = await this.coreapiService.getPagination(
      parseInt(skip),
      parseInt(take),
    );
    if (images) {
      res.status(HttpStatus.OK).send(images);
    } else {
      res
        .status(HttpStatus.EXPECTATION_FAILED)
        .send('This image out of service.');
    }
  }

  @Post('upload')
  @UseGuards(AuthGuard('api-key'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagedata = {
      fileName: file.originalname,
      image: file.buffer.toString('base64'),
      status: 'ACTIVE',
    };

    // console.log(file);
    const create = await this.coreapiService.createImage(imagedata);
    if (create) {
      res.status(HttpStatus.OK).send('SUCCESS');
    } else {
      res.status(HttpStatus.EXPECTATION_FAILED).send('Image already upload.');
    }
  }

  @Post('upload/multiple')
  @UseGuards(AuthGuard('api-key'))
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFiles(
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const rescreate = [];
    for (const i in files) {
      const imagedata = {
        fileName: files[i].originalname,
        image: files[0].buffer.toString('base64'),
        status: 'ACTIVE',
      };
      const create = await this.coreapiService.createImage(imagedata);
      const result = {
        fileName: files[i].originalname,
        status: '',
      };
      if (create) {
        result.status = 'SUCCESS';
      } else {
        result.status = 'Upload Fail';
      }
      rescreate.push(result);
    }
    res.status(HttpStatus.OK).send(rescreate);
  }

  @Get('download/:filename')
  async downloadImage(
    @Res() res: Response,
    @Param('filename') filename: string,
  ) {
    const imagedata = await this.coreapiService.getImage(filename);
    if (imagedata) {
      const buffer = Buffer.from(imagedata.image, 'base64');
      res.send(buffer);
    } else {
      res
        .status(HttpStatus.EXPECTATION_FAILED)
        .send('This image out of service.');
    }
  }

  @Get('download/base64/:filename')
  async downloadImageBase64(
    @Res() res: Response,
    @Param('filename') filename: string,
  ) {
    const imagedata = await this.coreapiService.getImage(filename);
    if (imagedata) {
      res.status(HttpStatus.OK).send(imagedata);
    } else {
      res
        .status(HttpStatus.EXPECTATION_FAILED)
        .send('This image out of service.');
    }
  }

  @Delete('delete/image/:filename')
  @UseGuards(AuthGuard('api-key'))
  async deleteFile(@Res() res: Response, @Param('filename') filename: string) {
    const deleteimage = await this.coreapiService.deleteImage(filename);
    if (deleteimage) {
      res.status(HttpStatus.OK).send('SUCCESS');
    } else {
      res
        .status(HttpStatus.EXPECTATION_FAILED)
        .send('This image out of service.');
    }
  }

  @Delete('delete/multiple')
  @UseGuards(AuthGuard('api-key'))
  async deleteFiles(@Res() res: Response, @Body() images: any) {
    const resdelete = [];
    for (const i in images.data) {
      const deleteimage = await this.coreapiService.deleteImage(images.data[i]);
      const result = {
        fileName: images.data[i],
        status: '',
      };
      if (deleteimage) {
        result.status = 'SUCCESS';
      } else {
        result.status = 'Delete Fail';
      }
      resdelete.push(result);
    }
    res.status(HttpStatus.OK).send(resdelete);
  }

  @Delete('delete/all')
  @UseGuards(AuthGuard('api-key'))
  async deleteAllFile(@Res() res: Response) {
    const deleteall = await this.coreapiService.deleteAll();
    if (deleteall) {
      res.status(HttpStatus.OK).send('SUCCESS');
    } else {
      res
        .status(HttpStatus.EXPECTATION_FAILED)
        .send('Something wrong please try again.');
    }
  }

  @Put('update')
  // @UseGuards(AuthGuard('api-key'))
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagedata = {
      fileName: file.originalname,
      image: file.buffer.toString('base64'),
      status: 'ACTIVE',
    };

    const update = await this.coreapiService.updateImage(imagedata);
    if (update) {
      res.status(HttpStatus.OK).send('SUCCESS');
    } else {
      res
        .status(HttpStatus.EXPECTATION_FAILED)
        .send('This image out of service.');
    }
  }

  @Put('update/multiple')
  @UseGuards(AuthGuard('api-key'))
  @UseInterceptors(AnyFilesInterceptor())
  async updateFiles(
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const resupdate = [];
    for (const i in files) {
      const imagedata = {
        fileName: files[i].originalname,
        image: files[0].buffer.toString('base64'),
        status: 'ACTIVE',
      };
      const create = await this.coreapiService.updateImage(imagedata);
      const result = {
        fileName: files[i].originalname,
        status: '',
      };
      if (create) {
        result.status = 'SUCCESS';
      } else {
        result.status = 'Update Fail';
      }
      resupdate.push(result);
    }
    res.status(HttpStatus.OK).send(resupdate);
  }
}

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

@Controller('api')
export class CoreapiController {
  constructor(private readonly coreapiService: CoreapiService) {
    // this.imageUpdateURL()
  }

  async imageUpdateURL() {
    const images = await this.coreapiService.getAll();
    for (const i in images) {
      const update = await this.coreapiService.updateImageURL(images[i]);
    }
    console.log('Update Complete...');
  }
  // --- Collections
  @Get('collections')
  @UseGuards(AuthGuard('api-key'))
  async getCollections(@Res() res: Response) {
    const collections = await this.coreapiService.getCollections();
    if (collections) {
      res.status(HttpStatus.OK).send(collections);
    } else {
      res.status(HttpStatus.EXPECTATION_FAILED).send('No collection data.');
    }
  }

  @Post('collection')
  @UseGuards(AuthGuard('api-key'))
  async createCollection(@Res() res: Response, @Body() collectiondata: any) {
    const create = await this.coreapiService.createCollection(collectiondata);
    if (create) {
      res.status(HttpStatus.OK).send('SUCCESS');
    } else {
      res
        .status(HttpStatus.EXPECTATION_FAILED)
        .send('This collection already create.');
    }
  }

  @Put('collection/oldname/:oldname/newname/:newname')
  @UseGuards(AuthGuard('api-key'))
  @UseInterceptors(AnyFilesInterceptor())
  async updateCollection(
    @Res() res: Response,
    @Param('oldname') oldname: string,
    @Param('newname') newname: string,
  ) {
    const update = await this.coreapiService.updateCollection(oldname, newname);
    if (update) {
      res.status(HttpStatus.OK).send('SUCCESS');
    } else {
      res
        .status(HttpStatus.EXPECTATION_FAILED)
        .send('Something wrong please try again.');
    }
  }

  @Delete('collection/:collectionname')
  @UseGuards(AuthGuard('api-key'))
  @UseInterceptors(AnyFilesInterceptor())
  async deleteCollection(
    @Res() res: Response,
    @Param('collectionname') collectionname: string,
  ) {
    const deletecol = await this.coreapiService.deleteCollection(
      collectionname,
    );
    if (deletecol) {
      res.status(HttpStatus.OK).send('SUCCESS');
    } else {
      res
        .status(HttpStatus.EXPECTATION_FAILED)
        .send('Something wrong please try again.');
    }
  }

  // --- Images
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

  @Post('upload/:collectionname')
  @UseGuards(AuthGuard('api-key'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Res() res: Response,
    @Param('collectionname') collectionname: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagedata = {
      fileName: file.originalname,
      image: file.buffer.toString('base64'),
      status: 'ACTIVE',
    };

    // console.log(file);
    const create = await this.coreapiService.createImage(
      collectionname,
      imagedata,
    );
    if (create) {
      res.status(HttpStatus.OK).send('SUCCESS');
    } else {
      res.status(HttpStatus.EXPECTATION_FAILED).send('Image already upload.');
    }
  }

  @Post('upload/multiple/:collectionname')
  @UseGuards(AuthGuard('api-key'))
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFiles(
    @Res() res: Response,
    @Param('collectionname') collectionname: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const rescreate = [];
    for (const i in files) {
      const imagedata = {
        fileName: files[i].originalname,
        image: files[0].buffer.toString('base64'),
        status: 'ACTIVE',
      };
      const create = await this.coreapiService.createImage(
        collectionname,
        imagedata,
      );
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

  @Get('download/:collectionname/:filename')
  async downloadImage(
    @Res() res: Response,
    @Param('collectionname') collectionname: string,
    @Param('filename') filename: string,
  ) {
    const imagedata = await this.coreapiService.getImage(
      collectionname,
      filename,
    );
    if (imagedata) {
      const buffer = Buffer.from(imagedata.image, 'base64');
      res.send(buffer);
    } else {
      res
        .status(HttpStatus.EXPECTATION_FAILED)
        .send('This image out of service.');
    }
  }

  @Get('download/base64/:collectionname/:filename')
  async downloadImageBase64(
    @Res() res: Response,
    @Param('collectionname') collectionname: string,
    @Param('filename') filename: string,
  ) {
    const imagedata = await this.coreapiService.getImage(
      collectionname,
      filename,
    );
    if (imagedata) {
      res.status(HttpStatus.OK).send(imagedata);
    } else {
      res
        .status(HttpStatus.EXPECTATION_FAILED)
        .send('This image out of service.');
    }
  }

  @Get('preview/image/:collectionname/:filename')
  async previewImage(
    @Res() res: Response,
    @Param('collectionname') collectionname: string,
    @Param('filename') filename: string,
  ) {
    const imagedata = await this.coreapiService.getImage(
      collectionname,
      filename,
    );
    if (imagedata) {
      const buffer = Buffer.from(imagedata.image, 'base64');
      const arrtext = filename.split('.');

      res.header('Content-Type', 'image/' + arrtext[1]);
      res.header('Content-Length', '');
      res.header('Access-Control-Allow-Origin', '*');
      res.send(buffer);
    } else {
      res
        .status(HttpStatus.EXPECTATION_FAILED)
        .send('This image out of service.');
    }
  }

  @Get('image/collection/:collectionname/name/:filename')
  async viewImage(
    @Res() res: Response,
    @Param('collectionname') collectionname: string,
    @Param('filename') filename: string,
  ) {
    const imagedata = await this.coreapiService.getImage(
      collectionname,
      filename,
    );
    if (imagedata) {
      const buffer = Buffer.from(imagedata.image, 'base64');
      const arrtext = filename.split('.');

      res.header('Content-Type', 'image/' + arrtext[1]);
      res.header('Content-Length', '');
      res.header('Access-Control-Allow-Origin', '*');
      res.send(buffer);
    } else {
      res
        .status(HttpStatus.EXPECTATION_FAILED)
        .send('This image out of service.');
    }
  }

  @Delete('delete/image/:collectionname/:filename')
  @UseGuards(AuthGuard('api-key'))
  async deleteFile(
    @Res() res: Response,
    @Param('collectionname') collectionname: string,
    @Param('filename') filename: string,
  ) {
    const deleteimage = await this.coreapiService.deleteImage(
      collectionname,
      filename,
    );
    if (deleteimage) {
      res.status(HttpStatus.OK).send('SUCCESS');
    } else {
      res
        .status(HttpStatus.EXPECTATION_FAILED)
        .send('This image out of service.');
    }
  }

  @Delete('delete/multiple/:collectionname')
  @UseGuards(AuthGuard('api-key'))
  async deleteFiles(
    @Res() res: Response,
    @Param('collectionname') collectionname: string,
    @Body() images: any,
  ) {
    const resdelete = [];
    for (const i in images.data) {
      const deleteimage = await this.coreapiService.deleteImage(
        collectionname,
        images.data[i],
      );
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

  @Put('update/:collectionname')
  @UseGuards(AuthGuard('api-key'))
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(
    @Res() res: Response,
    @Param('collectionname') collectionname: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagedata = {
      fileName: file.originalname,
      image: file.buffer.toString('base64'),
      status: 'ACTIVE',
    };

    const update = await this.coreapiService.updateImage(
      collectionname,
      imagedata,
    );
    if (update) {
      res.status(HttpStatus.OK).send('SUCCESS');
    } else {
      res
        .status(HttpStatus.EXPECTATION_FAILED)
        .send('This image out of service.');
    }
  }

  @Put('update/multiple/:collectionname')
  @UseGuards(AuthGuard('api-key'))
  @UseInterceptors(AnyFilesInterceptor())
  async updateFiles(
    @Res() res: Response,
    @Param('collectionname') collectionname: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const resupdate = [];
    for (const i in files) {
      const imagedata = {
        fileName: files[i].originalname,
        image: files[0].buffer.toString('base64'),
        status: 'ACTIVE',
      };
      const create = await this.coreapiService.updateImage(
        collectionname,
        imagedata,
      );
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

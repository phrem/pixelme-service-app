import { Injectable } from '@nestjs/common';
import { CreateCoreapiDto } from './dto/create-coreapi.dto';
import { UpdateCoreapiDto } from './dto/update-coreapi.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CoreapiService {
  constructor(private prisma: PrismaService) {}
  async createImage(imagedata: any) {
    try {
      const image = await this.prisma.pixelMeImage.findFirst({
        where: {
          fileName: imagedata.fileName,
        },
      });

      if (image) {
        return false;
      } else {
        const createimage = await this.prisma.pixelMeImage.create({
          data: {
            fileName: imagedata.fileName,
            image: imagedata.image,
            status: imagedata.status,
          },
        });
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getImage(filename: string): Promise<any> {
    try {
      const image = await this.prisma.pixelMeImage.findFirst({
        where: {
          fileName: filename,
        },
      });
      if (image) {
        return image;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getAll(): Promise<any> {
    try {
      const images = await this.prisma.pixelMeImage.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      });
      if (images) {
        return images;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getPagination(skip: number, take: number): Promise<any> {
    try {
      const images = await this.prisma.pixelMeImage.findMany({
        skip: skip,
        take: take,
        orderBy: {
          createdAt: 'asc',
        },
      });
      if (images) {
        return images;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateImage(imagedata: any) {
    try {
      const updateimage = await this.prisma.pixelMeImage.update({
        where: {
          fileName: imagedata.fileName,
        },
        data: {
          image: imagedata.image,
        },
      });
      if (updateimage) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteImage(filename: string): Promise<any> {
    try {
      const deleteimage = await this.prisma.pixelMeImage.delete({
        where: {
          fileName: filename,
        },
      });
      if (deleteimage) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteAll(): Promise<any> {
    try {
      const deleteall = await this.prisma.pixelMeImage.deleteMany({});
      if (deleteall) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

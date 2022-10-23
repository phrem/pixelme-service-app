import { Injectable } from '@nestjs/common';
import { CreateCoreapiDto } from './dto/create-coreapi.dto';
import { UpdateCoreapiDto } from './dto/update-coreapi.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CoreapiService {
  constructor(private prisma: PrismaService) {}

  // Collection

  async createCollection(collectiondata: any) {
    try {
      const collection = await this.getCollectionId(collectiondata.name);
      if (collection) {
        return false;
      } else {
        const createimage = await this.prisma.pixelMeCollection.create({
          data: {
            name: collectiondata.name,
            status: 'ACTIVE',
          },
        });
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getCollections() {
    try {
      const collection = await this.prisma.pixelMeCollection.findMany({});
      if (collection) {
        return collection;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateCollection(oldname: string, newname) {
    try {
      const collection = await this.getCollectionId(oldname);
      if (collection) {
        const updatecollection = await this.prisma.pixelMeCollection.update({
          where: {
            id: collection.id,
          },
          data: {
            name: newname,
          },
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteCollection(collectionname: string) {
    try {
      const collection = await this.getCollectionId(collectionname);
      if (collection) {
        const deletecollection = await this.prisma.pixelMeCollection.delete({
          where: {
            id: collection.id,
          },
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // Image

  async createImage(collectionname: string, imagedata: any) {
    try {
      const collection = await this.getCollectionId(collectionname);
      if (collection) {
        const image = await this.getImageId(collection.id, imagedata.fileName);
        if (image) {
          return false;
        } else {
          const createimage = await this.prisma.pixelMeImage.create({
            data: {
              collectionId: collection.id,
              fileName: imagedata.fileName,
              image: imagedata.image,
              imageURL:
                process.env.SERVER_ENDPOINT +
                '/api/image/' +
                collectionname +
                '/' +
                imagedata.fileName,
              status: imagedata.status,
            },
          });
          return true;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getImage(collectionname: string, filename: string): Promise<any> {
    try {
      const collection = await this.getCollectionId(collectionname);
      if (collection) {
        const image = await this.getImageId(collection.id, filename);
        if (image) {
          return image;
        } else {
          return null;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getAll(): Promise<any> {
    try {
      const images = await this.prisma.pixelMeImage.findMany({
        orderBy: {
          createdAt: 'asc',
        },
        select: {
          id: true,
          fileName: true,
          imageURL: true,
          createdAt: true,
          updatedAt: true,
          collection: true,
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
        select: {
          id: true,
          fileName: true,
          imageURL: true,
          createdAt: true,
          updatedAt: true,
          collection: true,
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

  async updateImage(collectionname: string, imagedata: any) {
    try {
      const collection = await this.getCollectionId(collectionname);
      if (collection) {
        const image = await this.getImageId(collection.id, imagedata.fileName);
        if (!image) return false;
        const updateimage = await this.prisma.pixelMeImage.update({
          where: {
            id: image.id,
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
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateImageURL(imagedata: any) {
    try {
      const updateimage = await this.prisma.pixelMeImage.update({
        where: {
          id: imagedata.id,
        },
        data: {
          imageURL:
            process.env.SERVER_ENDPOINT +
            '/api/image/' +
            imagedata.collection.name +
            '/' +
            imagedata.fileName,
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

  async deleteImage(collectionname: string, filename: string): Promise<any> {
    try {
      const collection = await this.getCollectionId(collectionname);
      if (collection) {
        const image = await this.getImageId(collection.id, filename);
        if (!image) return false;
        const deleteimage = await this.prisma.pixelMeImage.delete({
          where: {
            id: image.id,
          },
        });
        if (deleteimage) {
          return true;
        } else {
          return false;
        }
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

  async getCollectionId(collectionname: string): Promise<any> {
    try {
      const collection = await this.prisma.pixelMeCollection.findFirst({
        where: {
          name: collectionname,
        },
      });
      return collection ? collection : false;
    } catch (error) {
      return false;
    }
  }

  async getImageId(collectionid: any, filename: string): Promise<any> {
    try {
      const image = await this.prisma.pixelMeImage.findFirst({
        // where: {
        //   collectionId: collectionid,
        //   fileName: filename,
        // },
        where: {
          AND: [
            {
              collectionId: {
                equals: collectionid,
              },
            },
            {
              AND: {
                fileName: {
                  equals: filename,
                },
              },
            },
          ],
        },
      });
      return image ? image : false;
    } catch (error) {
      return false;
    }
  }
}

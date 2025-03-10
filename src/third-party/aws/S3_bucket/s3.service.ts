import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get<string>(
          'AWS_S3_BUCKET_ACCESS_KEY_ID',
        ),
        secretAccessKey: this.configService.get<string>(
          'AWS_S3_BUCKET_SECRET_ACCESS_KEY',
        ),
      },
      region: this.configService.get<string>('AWS_S3_BUCKET_REGION'),
    });
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    try {
      // creating unique key using uuid
      const fileExtension = file.mimetype ? file.mimetype.split('/')[1] : '';
      const key = `${uuid()}.${fileExtension}`;

      const parallelUploads3 = new Upload({
        client: this.s3Client,
        params: {
          Key: key,
          Bucket: this.bucketName,
          Body: file.buffer,
          ContentType: file.mimetype,
        },
      });

      return parallelUploads3.done();
    } catch (error) {
      throw error;
    }
  }
}

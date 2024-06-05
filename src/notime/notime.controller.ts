import {
  Body,
  Controller,
  HttpException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { NotimeService } from './notime.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { readFile } from 'fs';
const sharp = require('sharp');
const fs = require('fs');

@Controller('notime')
export class NotimeController {
  constructor(private notimeService: NotimeService) {}

  @Post('/send-email')
  @UseInterceptors(FileInterceptor('file'))
  async sendMessage(
    @UploadedFile() file,
    // @Req() req: RawBodyRequest<Request>,
    @Body() requestBody,
  ) {
    try {
      const body = requestBody;
      const files = file;
      console.log(files);
      const base64 = Buffer.from(files.buffer).toString('base64');

      const targetWidth = 500; // Desired width
      const targetHeight = 500; // Desired height

      const resizedBase64 = await this.notimeService.transform(
        base64,
        targetWidth,
        targetHeight,
      );

      if (!(body.from && body.to && body.subject && body.html)) {
        throw new HttpException('Missing from, to , subject, html', 401);
      }

      const emailRequest = {
        from: body.from,
        to: body.to,
        subject: body.subject,
        html: `<html><img alt="Screenshot" src="cid:image123"  />${body.html}</html>`,

        attachments: [
          {
            filename: 'test.jpg',
            content: resizedBase64,
            cid: 'image123',
          },
        ],
      };

      return await this.notimeService.sendEmail(emailRequest);
    } catch (error) {
      return error.message;
    }
  }
}

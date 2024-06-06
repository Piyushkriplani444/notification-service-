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
import * as cron from 'node-cron';

@Controller('notime')
export class NotimeController {
  file: any;
  req: any;

  constructor(private notimeService: NotimeService) {
    cron.schedule('*/5 * * * *', () => {
      this.sendMessage(this.file, this.req);
    });
  }

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
      this.file = files;
      this.req = requestBody;
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
            path: `data:image/png;base64, ${resizedBase64}`,
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

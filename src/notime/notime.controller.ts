import {
  Body,
  Controller,
  HttpException,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { NotimeService } from './notime.service';
import { Request } from '@nestjs/common';

@Controller('notime')
export class NotimeController {
  constructor(private notimeService: NotimeService) {}

  @Post('/send-email')
  async sendMessage(@Req() req: RawBodyRequest<Request>, @Body() requestBody) {
    try {
      const body = requestBody;
      if (!(body.from && body.to && body.subject && body.html)) {
        throw new HttpException('Missing from, to , subject, html', 401);
      }

      const emailRequest = {
        from: body.from,
        to: body.to,
        subject: body.subject,
        html: body.html,
      };
      console.log(emailRequest);
      return await this.notimeService.sendEmail(emailRequest);
    } catch (error) {
      return error.message;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { channel } from 'diagnostics_channel';
import NotifmeSdk from 'notifme-sdk';
import { EmailRequestType } from 'notifme-sdk';
import sharp from 'sharp';

// Primary use mailgun and if fail use mandrill
@Injectable()
export class NotimeService {
  private notifmeSdk: NotifmeSdk;
  constructor() {
    this.notifmeSdk = new NotifmeSdk({
      channels: {
        email: {
          providers: [
            {
              type: 'mandrill', // privider 2
              apiKey: '', // apikey,
            },
            {
              type: 'mailgun', // provider 1
              // channel: '',
              apiKey: '', // Apikey,
              domainName: '', //domain,
            },
          ],
          multiProviderStrategy: this.fallBackRetryEmail,
        },
      },
    });
  }
  async sendEmail(emailRequest: EmailRequestType) {
    try {
      const result = await this.notifmeSdk.send({ email: emailRequest });
      console.log(result);
      return result;
    } catch (error) {
      console.error('Error sending email through NotifmeSdk:', error);
      throw error; // Or handle it as per your needs
    }
  }
  // Implement other notification methods as needed (SMS, push, etc.)
  fallBackRetryEmail = (providers) => async (request) => {
    try {
      if (providers.length >= 2) {
        console.log('Piyush Kriplani');
        const secondryProvider = providers[0];
        const primaryProvider = providers[1];
        let retry = 2;

        while (retry > 0) {
          try {
            const id = await primaryProvider.send(request);
            return { id, providerID: primaryProvider.id };
          } catch (error) {
            console.error(error);
            retry -= 1;
          }
        }

        try {
          const id = await secondryProvider.send(request);
          return { id, providerID: secondryProvider.id };
        } catch (error) {
          console.error(error);
        }
      }
      return '';
    } catch (error) {
      console.error(error);
    }
  };

  async transform(
    base64Image: string,
    targetWidth: number,
    targetHeight: number,
  ): Promise<string> {
    const imageBuffer = Buffer.from(base64Image, 'base64');
    try {
      const resizedBuffer = await sharp(imageBuffer)
        .resize(targetWidth, targetHeight)
        .toBuffer();
      return resizedBuffer.toString('base64');
    } catch (error) {
      throw new Error(`Error resizing image ${error}`);
    }
  }
}

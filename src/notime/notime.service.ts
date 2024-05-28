import { Injectable } from '@nestjs/common';
import NotifmeSdk from 'notifme-sdk';
import { EmailRequestType } from 'notifme-sdk';

@Injectable()
export class NotimeService {
  private notifmeSdk: NotifmeSdk;
  constructor() {
    this.notifmeSdk = new NotifmeSdk({
      channels: {
        email: {
          providers: [
            {
              type: 'mandrill',
              apiKey: '', // apikey,
            },
            {
              type: 'mailgun',
              apiKey: '', // Apikey,
              domainName: ' ', //domain,
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
        const primaryProvider = providers[0];
        const secondryProvider = providers[1];
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
    } catch (error) {
      console.error(error);
    }
  };
}

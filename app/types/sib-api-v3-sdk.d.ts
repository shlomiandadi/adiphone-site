declare module 'sib-api-v3-sdk' {
  export namespace ApiClient {
    const instance: {
      authentications: {
        'api-key': {
          apiKey: string;
        };
      };
    };
  }

  export class TransactionalEmailsApi {
    sendTransacEmail(email: {
      sender: { email: string; name: string };
      to: Array<{ email: string; name: string }>;
      subject: string;
      htmlContent: string;
    }): Promise<any>;
  }
} 
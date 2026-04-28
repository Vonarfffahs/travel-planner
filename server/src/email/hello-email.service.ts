import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';
import { HelloEmailDTO, PasswordResetEmailDTO } from './dto';
import { config } from 'src/common';
import { EmailTemplateService } from './email-template.service';

@Injectable()
export class HelloEmailService {
  constructor(
    private readonly emailTemplateService: EmailTemplateService,
    private readonly emailService: EmailService,
  ) {}

  public async send(data: PasswordResetEmailDTO): Promise<void> {
    const { subject } = config.email.hello;

    const input = new HelloEmailDTO(data);
    const html = await this.emailTemplateService.render(input);

    await this.emailService.send({
      to: data.email,
      subject,
      html,
    });
  }
}

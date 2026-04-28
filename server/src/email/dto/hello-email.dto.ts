import { config } from 'src/common';
import { PasswordResetEmailDTO } from './password-reset.email.dto';

export class HelloEmailDTO {
  public readonly template = 'hello';

  public readonly nickname: string;

  public readonly link: string;

  public readonly expirationDate: string;

  constructor(data: PasswordResetEmailDTO) {
    const { baseUrl, confirmUrl } = config.frontend;

    this.nickname = data.nickname;
    this.link = `${baseUrl}${confirmUrl}?email=${data.email}&code=${data.code}`;
    this.expirationDate = data.expiresAt.toLocaleDateString('ua-UA');
  }
}

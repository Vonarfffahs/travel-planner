import { ReadProfileDTO } from 'src/users/dto';

export class AccessDTO extends ReadProfileDTO {
  token: string;
}

export type PasswordResetEmailDTO = {
  code: string;
  email: string;
  expiresAt: Date;
  nickname: string;
};

import convict from 'convict';

const schema = convict({
  port: {
    doc: 'The application port',
    format: Number,
    default: 3000,
    env: 'PORT',
  },
  maxPageSize: {
    doc: 'Maximum items number per page',
    format: Number,
    default: 1000,
    env: 'MAX_PAGE_SIZE',
  },
  password: {
    code: {
      min: {
        doc: 'Password reset code minimum value',
        format: Number,
        default: 9_999,
        env: 'PASSWORD_RESET_CODE_MIN',
      },
      max: {
        doc: 'Password reset code maximum value',
        format: Number,
        default: 999_999,
        env: 'PASSWORD_RESET_CODE_MAX',
      },
      expirationDays: {
        doc: 'Password reset expiration days',
        format: Number,
        default: 7,
        env: 'PASSWORD_RESET_EXPIRATION_DAYS',
      },
      attempts: {
        doc: 'Password reset attempts',
        format: Number,
        default: 3,
        env: 'PASSWORD_RESET_ATTEMPTS',
      },
    },
  },
});

schema.validate({ allowed: 'strict' });

export const config = schema.getProperties();

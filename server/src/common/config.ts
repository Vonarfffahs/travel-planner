import convict from 'convict';
import { randomBytes } from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

const schema = convict({
  port: {
    doc: 'The application port',
    format: Number,
    default: 3000,
    env: 'PORT',
  },
  env: {
    doc: 'Application environment',
    format: String,
    default: 'development',
    env: 'ENVIRONMENT',
  },
  email: {
    disabled: {
      doc: 'If true, do not use email client',
      format: Boolean,
      default: false,
      env: 'EMAIL_DISABLED',
    },
    service: {
      doc: 'Service type for email',
      format: String,
      default: 'gmail',
      env: 'EMAIL_SERVICE',
    },
    auth: {
      user: {
        doc: 'Login for email',
        format: String,
        default: '',
        env: 'EMAIL_USER',
      },
      pass: {
        doc: 'Password for email',
        format: String,
        default: '',
        env: 'EMAIL_PASSWORD',
      },
    },
    hello: {
      subject: {
        doc: 'Confirm your email',
        format: String,
        default: 'Confirm your email',
        env: 'EMAIL_HELLO_SUBJECT',
      },
    },
  },
  jwt: {
    secret: {
      doc: 'JWT secret',
      format: String,
      default: randomBytes(32).toString('base64url'),
      env: 'JWT_SECRET',
    },
    expirationSeconds: {
      doc: 'JWT expiration seconds',
      format: Number,
      default: 3_600,
      env: 'JWT_EXPIRATION_SECONDS',
    },
  },
  frontend: {
    baseUrl: {
      doc: 'Frontend application base URL',
      format: String,
      default: 'https://localhost:5173',
      env: 'FRONTEND_URL',
    },
    confirmUrl: {
      doc: 'Frontend confirm-account URL',
      format: String,
      default: '/confirm',
      env: 'FRONTEND_CONFIRM_URL',
    },
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
  seedUser: {
    email: {
      doc: 'Initial user email',
      format: String,
      default: '',
      env: 'USER_EMAIL',
    },
    password: {
      doc: 'Initial user password',
      format: String,
      default: '',
      env: 'USER_PASSWORD',
    },
    nickname: {
      doc: 'Initial user nickname',
      format: String,
      default: '',
      env: 'USER_NICKNAME',
    },
  },
});

schema.validate({ allowed: 'strict' });

export const config = schema.getProperties();

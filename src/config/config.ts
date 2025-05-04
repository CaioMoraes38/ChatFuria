import dotenv from 'dotenv';
dotenv.config();

export const config = {
  telegramToken: process.env.TELEGRAM_TOKEN!,
  port: process.env.PORT || 3000,
};

import path from 'path';

const needDotenv: string[] = ['test', 'development'];
const mode: string = process.env.NODE_ENV || 'development';

if (needDotenv.includes(mode)) {
  require('dotenv').config({
    path: path.resolve(__dirname, `../../../.env.${mode}`),
  });
}

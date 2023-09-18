import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';

async function bootstrap() {
  let options = undefined;
  if (process.env.httpsKey && process.env.httpsCert) {
    options = {
      key: readFileSync(process.env.httpsKey),
      cert: readFileSync(process.env.httpsCert),
    };
  }
  const app = await NestFactory.create(AppModule, {
    cors: true,
    httpsOptions: options,
  });
  await app.listen(7001);
}
bootstrap();

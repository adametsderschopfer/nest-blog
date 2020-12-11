import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const headerTemplate = readFileSync(
    join(__dirname, '..', 'views', 'partials/header.hbs'),
    'utf-8',
  );

  const footerTemplate = readFileSync(
    join(__dirname, '..', 'views', 'partials/footer.hbs'),
    'utf-8',
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir([
    join(__dirname, '..', 'views'),
    join(__dirname, '..', 'views', 'adminPanel'),
  ]);

  app.set('view options', { layout: 'layouts/layout' });
  hbs.registerPartial('header', headerTemplate);
  hbs.registerPartial('footer', footerTemplate);

  app.setViewEngine('hbs');

  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();

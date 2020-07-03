import {NestFactory} from '@nestjs/core';
import { AppModule } from './app.module';
import {join} from "path";
import {NestExpressApplication} from "@nestjs/platform-express";
import * as expressHbs from 'express-handlebars';
import * as handlebarsHelpers from 'handlebars-helpers';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import * as redis from 'redis';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const hbs = expressHbs.create({
    helpers: {
      ...handlebarsHelpers(),
      ASSETS_URL: () => process.env.MIX_ASSETS_URL,
    },
    extname: '.hbs',
    defaultLayout: 'layout',
    partialsDir: [
      join(__dirname, '..', 'views')
    ]
  });

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({
    host: 'redis'
  })
  app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } //true only in HTTPS
  }))

  app.engine('hbs', hbs.engine);
  app.setViewEngine('hbs');
  app.useStaticAssets(join(__dirname, '..', 'public'))

  await app.listen(3000);
}
bootstrap();

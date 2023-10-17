import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './items/items.module';
import { CorsMiddleware } from './cors/cors.middleware';

@Module({
  imports: [ItemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // forRoutes で指定したパスに対してミドルウェアを適用する
    consumer.apply(CorsMiddleware).forRoutes({
      // items
      path: 'item', // items に対して適用
      method: RequestMethod.GET,
    });
  }
}

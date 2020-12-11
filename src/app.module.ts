import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './components/admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './generalModels/post.entity';
import { PostsService } from './components/posts/posts.service';
import { PostsController } from './components/posts/posts.controller';
import { PostsModule } from './components/posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AdminModule,
    TypeOrmModule.forFeature([PostEntity]),
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

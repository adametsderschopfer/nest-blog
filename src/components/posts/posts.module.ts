import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../../generalModels/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Users } from './users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, Users])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}

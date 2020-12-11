import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ConfigService } from '../../config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../../generalModels/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity])],
  providers: [AdminService, ConfigService],
  controllers: [AdminController],
})
export class AdminModule {}

import { Body, Controller, Get, Post, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { PostEntity } from './generalModels/post.entity';
import { Posts } from './generalModels/types';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly _appService: AppService) {}

  @Get()
  @Render('index')
  async getAllPosts(@Req() req: Request): Promise<Posts> {
    const author = req.cookies.author || undefined;

    return { posts: await this._appService.getAllPosts(), author };
  }

  @Post('/getpostcontent')
  async getPostContent(@Body('postId') postId: string) {
    return { content: await this._appService.getPostContent(postId) };
  }
}

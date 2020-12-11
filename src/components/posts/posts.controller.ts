import {
  Body,
  Controller,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PostDto } from './dto/post.dto';
import { PostsService } from './posts.service';
import { Request, Response } from 'express';
import { PostGuard } from './post.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly _postsService: PostsService) {}

  @Post('/auth')
  async createUser(@Body('author') author: string, @Res() res: Response) {
    const {
      identifiers: [{ author: doneAuthor }],
    } = await this._postsService.createUser(author);
    res.cookie('author', doneAuthor, { httpOnly: false });
    res.redirect('/');
    return;
  }

  @Post('/createpost')
  @Redirect('/')
  @UseGuards(PostGuard)
  async createPost(
    @Body() post: PostDto,
    @Req() { cookies: { author } }: Request,
  ) {
    await this._postsService.createPost(post, author);
    return;
  }

  @Post('/view')
  async view(@Body('postId') postId: string) {
    return await this._postsService.view(postId);
  }
}

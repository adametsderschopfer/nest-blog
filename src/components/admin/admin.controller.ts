import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Res,
  HttpStatus,
  UseGuards,
  Req,
  Redirect,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthDto } from './dto/auth.dto';
import { ConfigService } from '../../config/config.service';
import { Request, Response } from 'express';
import { AdminGuard } from './admin.guard';
import { PostEntity } from '../../generalModels/post.entity';
import { Posts } from '../../generalModels/types';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly _adminService: AdminService,
    private readonly _configService: ConfigService,
  ) {}

  @Get('/')
  @Render('admin')
  @UseGuards(AdminGuard)
  async getAllPosts(): Promise<Posts> {
    const posts = await this._adminService.getAllPosts();

    return { posts };
  }

  @Post('accept')
  @Redirect('/admin')
  @UseGuards(AdminGuard)
  async accept(@Body() { postId }) {
    return await this._adminService.accept(postId);
  }

  @Post('reject')
  @Redirect('/admin')
  @UseGuards(AdminGuard)
  async reject(@Body() { postId }) {
    return await this._adminService.reject(postId);
  }

  @Post('remove')
  @Redirect('/admin')
  @UseGuards(AdminGuard)
  async remove(@Body() { postId }) {
    return await this._adminService.remove(postId);
  }

  @Post('api/login')
  signIn(@Body() authDto: AuthDto, @Res() res: Response) {
    const { isAdmin, token } = this._adminService.signIn(
      authDto,
      this._configService.AdminAuthData,
    );

    if (isAdmin) {
      res.cookie('isAdmin', true, { maxAge: 3600 * 1000 });
      res.cookie('token', token, { maxAge: 3600 * 1000 });

      res.status(HttpStatus.OK).json({ success: true });
    } else {
      return res.status(HttpStatus.FORBIDDEN).json({
        msg: 'Login or Password is not valid, please try again!',
        success: false,
      });
    }
  }

  @Get('login')
  login(@Res() res: Response, @Req() req: Request) {
    if (req.cookies.isAdmin && req.cookies.token) {
      return res.redirect('/admin');
    }

    return res.render('login', { title: 'Admin Panel' });
  }
}

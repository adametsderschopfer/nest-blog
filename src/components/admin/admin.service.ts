import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { v4 } from 'uuid';
import { writeFile } from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import { Repository } from 'typeorm';
import { PostEntity } from '../../generalModels/post.entity';
import { InjectRepository } from '@nestjs/typeorm';

const _writeFile = promisify(writeFile);

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(PostEntity)
    readonly postsRepository: Repository<PostEntity>,
  ) {}

  getAllPosts(): Promise<Array<PostEntity>> {
    return this.postsRepository.find();
  }

  async accept(postId) {
    return await this.postsRepository.update({ postId }, { isAccepted: true });
  }

  reject(postId) {
    return this.delPost(postId);
  }

  remove(postId) {
    return this.delPost(postId);
  }

  private async delPost(postId) {
    return await this.postsRepository.delete({ postId });
  }

  signIn({ login, password }: AuthDto, validData) {
    const isAdmin =
      login === validData.login && password === validData.password;

    if (isAdmin) {
      const token: string = v4();
      (async () =>
        _writeFile(
          join(__dirname, 'admin.json'),
          JSON.stringify({ token }),
          'utf-8',
        ))();

      return { isAdmin, token };
    } else {
      return { isAdmin: false, token: '' };
    }
  }
}

import { Injectable } from '@nestjs/common';
import { PostEntity } from './generalModels/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly _postEntity: Repository<PostEntity>,
  ) {}

  async getAllPosts(): Promise<PostEntity[]> {
    return await this._postEntity.find();
  }

  async getPostContent(postId) {
    return await this._postEntity.find({
      where: { postId },
      select: ['content'],
    });
  }
}

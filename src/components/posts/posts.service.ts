import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../../generalModels/post.entity';
import { Users } from './users.entity';
import { PostDto } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity) readonly _posts: Repository<PostEntity>,
    @InjectRepository(Users) readonly _users: Repository<Users>,
  ) {}

  async createUser(author: string) {
    const repeatAuthor = await this._users.findOne({ author });

    if (repeatAuthor?.author.length) {
      return await this._users.insert({ author: `${author}#${Date.now()}` });
    } else {
      return await this._users.insert({ author });
    }
  }

  async createPost({ title, content, img }: PostDto, author) {
    if (title.length && content.length && content.length) {
      return await this._posts.insert({ title, content, author, img });
    }
  }

  async view(postId) {
    const [{ views }] = await this._posts.find({
      where: { postId },
      select: ['views'],
    });
    await this._posts.update({ postId }, { views: views + 1 });
    return;
  }
}

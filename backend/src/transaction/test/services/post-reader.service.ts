import { Repository } from 'typeorm';
import { Post } from '../entities/Post.entity';

export class PostReaderService {
  constructor(readonly repository: Repository<Post>) {}

  async getPostByMessage(message: string): Promise<Post> {
    return this.repository.findOneBy({ message }) as unknown as Post;
  }
}

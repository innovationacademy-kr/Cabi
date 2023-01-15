import { Repository } from 'typeorm';
import { runOnTransactionCommit, runOnTransactionRollback, Transactional } from '../../src';
import { Post } from '../entities/Post.entity';

export class PostWriterService {
  public success: boolean;

  constructor(readonly repository: Repository<Post>) {}

  async createPost(message: string, fail: boolean = false): Promise<Post> {
    const post = new Post();

    post.message = message;
    await this.repository.save(post);

    if (fail) {
      throw Error('Error');
    }

    return post;
  }

  @Transactional()
  async createPostWithDecorator(message: string, fail: boolean = false) {
    const post = new Post();

    post.message = message;

    await this.repository.save(post);

    runOnTransactionCommit(() => (this.success = true));
    runOnTransactionRollback(() => (this.success = false));

    if (fail) {
      throw Error('Error');
    }

    return post;
  }
}

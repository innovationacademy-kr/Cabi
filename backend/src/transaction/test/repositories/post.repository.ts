import { DataSource, Repository } from 'typeorm';
import { Post } from '../entities/Post.entity';

export class PostRepository extends Repository<Post> {
  constructor(dataSource: DataSource) {
    super(Post, dataSource.manager);
  }

  async saveWithSlug(slug: string) {
    return this.save({ slug, message: slug });
  }
}

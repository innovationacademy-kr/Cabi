import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/Post.entity';
import { PostWriterService } from './post-writer.service';

@Injectable()
export class NestPostWriterService extends PostWriterService {
  constructor(
    @InjectRepository(Post)
    readonly repository: Repository<Post>,
  ) {
    super(repository);
  }
}

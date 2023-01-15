import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/Post.entity';
import { PostReaderService } from './post-reader.service';

@Injectable()
export class NestPostReaderService extends PostReaderService {
  constructor(
    @InjectRepository(Post)
    readonly repository: Repository<Post>,
  ) {
    super(repository);
  }
}

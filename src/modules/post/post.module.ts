import { Module } from '@nestjs/common';
import { PostService } from './services/post.service';
import { PostController } from './post.controller';

@Module({
  providers: [PostService],
  controllers: [PostController]
})
export class PostModule {}

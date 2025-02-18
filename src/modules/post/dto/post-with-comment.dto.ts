import { ApiProperty } from '@nestjs/swagger';
import { PostDto } from './post.dto';
import { CommentDto } from './comment.dto';

export class PostWithCommentsDto extends PostDto {
  @ApiProperty({ type: [CommentDto], description: 'List of comments sorted by newest first' })
  comments: CommentDto[];
}
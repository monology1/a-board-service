import { ApiProperty } from '@nestjs/swagger';
import { PostDto } from './post.dto';
import { CommentDto } from '../../comment/dto/comment.dto';

export class PostWithCommentsDto extends PostDto {
  @ApiProperty({ example: 1, description: 'The ID of the author' })
  authorId: number;

  @ApiProperty({ type: [CommentDto], description: 'List of comments sorted by newest first' })
  comments: CommentDto[];
}
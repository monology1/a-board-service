import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'This is a great post!', description: 'The content of the comment' })
  content: string;

  @ApiProperty({ example: 1, description: 'The ID of the post this comment belongs to' })
  postId: number;

  @ApiProperty({ example: 1, description: 'The ID of the user who is creating the comment' })
  authorId: number;
}
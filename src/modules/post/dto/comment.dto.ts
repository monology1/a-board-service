import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty({ example: 1, description: 'The unique identifier of the comment' })
  id: number;

  @ApiProperty({ example: 'Great post!', description: 'The content of the comment' })
  content: string;

  @ApiProperty({ example: 'john_doe', description: 'The author of the comment' })
  author: string;

  @ApiProperty({ example: 1, description: 'The ID of the author' })
  authorId: number;

  @ApiProperty({ example: 1, description: 'The ID of the post this comment belongs to' })
  postId: number;

  @ApiProperty({ example: '2025-02-18T12:00:00Z', description: 'When the comment was created' })
  createdAt: string;

  @ApiProperty({ example: '2025-02-18T12:00:00Z', description: 'When the comment was last updated' })
  updatedAt: string;
}
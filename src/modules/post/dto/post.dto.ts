import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty({ example: 1, description: 'The unique identifier of the post' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'The author of the post' })
  author: string;

  @ApiProperty({ example: 'Tech', description: 'The category of the post' })
  category: string;

  @ApiProperty({ example: 'New Features in NestJS 9', description: 'The title of the post' })
  title: string;

  @ApiProperty({ example: 'A short excerpt or summary of the post content.', description: 'Short excerpt of the post' })
  excerpt: string;

  @ApiProperty({ example: 5, description: 'Number of comments on the post' })
  commentsCount: number;

  @ApiProperty({ example: '2025-02-18T02:23:00.721Z', description: 'Created date' })
  createdAt: Date;

  @ApiProperty({ example: '2025-02-18T02:23:00.721Z', description: 'Updated date' })
  updatedAt: Date;
}
import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Alice' })
  author: string;

  @ApiProperty({ example: 'This is a comment' })
  content: string;

  @ApiProperty({ example: '2025-02-18T12:00:00Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-02-18T12:00:00Z' })
  updatedAt: string;
}
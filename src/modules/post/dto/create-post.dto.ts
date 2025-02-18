import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'My New Post',
    description: 'The title of the post',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'This is the content of the post.',
    description: 'The content of the post',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 'Tech',
    description: 'The category of the post',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the author for the post',
  })
  @IsNumber()
  authorId: number;

  @ApiProperty({
    example: 'A brief excerpt of the post',
    description: 'An optional excerpt for the post',
    required: false,
  })
  @IsOptional()
  @IsString()
  excerpt?: string;
}
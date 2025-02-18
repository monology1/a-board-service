import {
  Controller,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiOkResponse, ApiNotFoundResponse,
} from '@nestjs/swagger';
import { PostDto } from './dto/post.dto';
import { PostService } from './services/post.service';
import { PostWithCommentsDto } from './dto/post-with-comment.dto';
import { Post } from '@prisma/client';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postsService: PostService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all posts or filter by category/author' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter posts by category',
  })
  @ApiQuery({
    name: 'author',
    required: false,
    description: 'Filter posts by author',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Filter posts by title',
  })
  @ApiOkResponse({
    description: 'List of posts',
    type: PostDto,
    isArray: true,
  })
  async getPosts(
    @Query('category') category?: string,
    @Query('author') author?: string,
    @Query('title') title?: string,
  ): Promise<PostDto[]> {
    if (category) {
      return await this.postsService.findByCategory(category);
    }
    if (author) {
      return await this.postsService.findByAuthor(author);
    }
    return await this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a post by its ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the post to retrieve',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Post found',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        title: { type: 'string', example: 'Example Post Title' },
        content: {
          type: 'string',
          example: 'This is the content of the post.',
        },
        category: { type: 'string', example: 'Tech' },
        author: { type: 'string', example: 'John Doe' },
        createdAt: { type: 'string', example: '2025-02-18T12:00:00Z' },
        updatedAt: { type: 'string', example: '2025-02-18T12:00:00Z' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getPostById(@Param('id') id: string): Promise<Post> {
    const post = await this.postsService.findById(Number(id));
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return {
      ...post,
      excerpt: post.excerpt ?? null,
    };
  }

  @Get(':id/details')
  @ApiOperation({ summary: 'Get post details including comments (newest first)' })
  @ApiParam({ name: 'id', description: 'Post ID', example: 1 })
  @ApiOkResponse({
    description: 'Post found, including comments sorted by newest first',
    type: PostWithCommentsDto,
  })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async getPostDetails(@Param('id') id: string): Promise<PostWithCommentsDto> {
    const post = await this.postsService.findByIdWithComments(Number(id));
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return post;
  }
}

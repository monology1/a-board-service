import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException, UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBadRequestResponse,
  ApiNotFoundResponse, ApiCookieAuth, ApiBearerAuth,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentDto } from './dto/comment.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('comments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiCreatedResponse({
    description: 'The comment has been successfully created.',
    type: CommentDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid data.' })
  async create(@Body() dto: CreateCommentDto, @Req() req: any): Promise<CommentDto> {
    // If you have authentication, you might validate that dto.authorId === req.user.id
    // If not, anyone could pass any authorId.
    if (!req.user) {
      // This is optional if you are using a login system.
      throw new UnauthorizedException('User must be logged in');
    }
    // Example check:
    // if (dto.authorId !== req.user.id) {
    //   throw new UnauthorizedException('Author ID mismatch');
    // }

    return this.commentService.createComment(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all comments' })
  @ApiOkResponse({ description: 'List of comments', type: [CommentDto] })
  async findAll(): Promise<CommentDto[]> {
    return this.commentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a comment by id' })
  @ApiOkResponse({ description: 'The found comment', type: CommentDto })
  @ApiNotFoundResponse({ description: 'Comment not found.' })
  async findOne(@Param('id') id: number): Promise<CommentDto> {
    return this.commentService.findOne(+id);
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(dto: CreateCommentDto): Promise<CommentDto> {
    // Notice we now use dto.authorId instead of passing a separate parameter
    const comment = await this.prisma.comment.create({
      data: {
        content: dto.content,
        postId: dto.postId,
        authorId: dto.authorId, // Using the value from the request
      },
      include: {
        author: true, // This includes the related User data
      },
    });
    return this.toCommentDto(comment);
  }

  async findAll(): Promise<CommentDto[]> {
    const comments = await this.prisma.comment.findMany();
    return comments.map((comment) => this.toCommentDto(comment));
  }

  async findOne(id: number): Promise<CommentDto> {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return this.toCommentDto(comment);
  }

  private toCommentDto(comment: any): CommentDto {
    return {
      id: comment.id,
      content: comment.content,
      authorId: comment.authorId,
      postId: comment.postId,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      author: comment.author ? comment.author.username : '',
    };
  }
}
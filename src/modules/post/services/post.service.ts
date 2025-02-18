import { Injectable } from '@nestjs/common';
import { Post } from '../interface/post.interface';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { PostWithCommentsDto } from '../dto/post-with-comment.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Post[]> {
    return this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: number): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async findByCategory(category: string): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        category: {
          equals: category,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByAuthor(author: string): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        author: {
          contains: author,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByTitle(title: string): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByIdWithComments(id: number): Promise<PostWithCommentsDto | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!post) return null;

    return post as unknown as PostWithCommentsDto;
  }
}

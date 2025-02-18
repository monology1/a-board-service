import { Injectable } from '@nestjs/common';
import { Post } from '../interface/post.interface';
import { PrismaService } from '../../../shared/prisma/prisma.service';

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
          contains: title, // partial matching
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc', // newest to oldest
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { Post } from '../interface/post.interface';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Post[]> {
    return this.prisma.post.findMany();
  }

  async findById(id: number): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async findByCategory(category: string): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: { category: { equals: category, mode: 'insensitive' } },
    });
  }

  async findByAuthor(author: string): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: { author: { equals: author, mode: 'insensitive' } },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { Post } from '../interface/post.interface';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { PostWithCommentsDto } from '../dto/post-with-comment.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      include: {
        author: true
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts.map(post => ({
      ...post,
      author: post.author.username,
    }));
  }

  async findById(id: number): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true
      }
    });

    if (!post) return null;

    return {
      ...post,
      author: post.author.username,
    };
  }

  async findByCategory(category: string): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      where: {
        category: {
          equals: category,
          mode: 'insensitive',
        },
      },
      include: {
        author: true
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts.map(post => ({
      ...post,
      author: post.author.username,
    }));
  }

  async findByAuthor(author: string): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      where: {
        author: {
          username: {
            contains: author,
            mode: 'insensitive',
          }
        }
      },
      include: {
        author: true
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts.map(post => ({
      ...post,
      author: post.author.username,
    }));
  }

  async findByIdWithComments(id: number): Promise<PostWithCommentsDto | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: {
          include: {
            author: true
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!post) return null;

    return {
      ...post,
      author: post.author.username,
      authorId: post.authorId,
      comments: post.comments.map(comment => ({
        ...comment,
        author: comment.author.username,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString()
      }))
    };
  }
}
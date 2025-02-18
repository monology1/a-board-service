import { Injectable } from '@nestjs/common';
import { Post } from '../interface/post.interface';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { PostWithCommentsDto } from '../dto/post-with-comment.dto';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Post as PostEntity } from '@prisma/client';

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

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        category: createPostDto.category,
        excerpt: createPostDto.excerpt || null,
        author: {
          connect: { id: createPostDto.authorId },
        },
      },
      include: {
        author: true,
      },
    });

    // Transform the returned post so that the `author` field is the username.
    return {
      ...createdPost,
      author: createdPost.author.username,
    };
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto): Promise<PostEntity | null> {
    // Check if the post exists
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!existingPost) return null;

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: { ...updatePostDto },
      include: { author: true },
    });

    // Ensure excerpt is not undefined; if it is, return null instead.
    return {
      ...updatedPost,
      excerpt: updatedPost.excerpt ?? null,
    };
  }

  async deletePost(id: number): Promise<boolean> {
    // Check if the post exists first
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    });
    if (!existingPost) {
      return false;
    }
    await this.prisma.post.delete({
      where: { id },
    });
    return true;
  }
}
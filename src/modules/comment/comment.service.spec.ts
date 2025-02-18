import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CommentService } from './comment.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

// Mock comment object as returned by Prisma
const mockComment = {
  id: 1,
  content: 'Test comment',
  postId: 1,
  authorId: 99,
  author: {
    id: 99,
    username: 'test_user',
  },
  createdAt: new Date('2025-02-18T12:00:00Z'),
  updatedAt: new Date('2025-02-18T12:00:00Z'),
};

// Mock PrismaService
const prismaServiceMock = {
  comment: {
    create: jest.fn().mockResolvedValue(mockComment),
    findMany: jest.fn().mockResolvedValue([mockComment]),
    findUnique: jest.fn().mockResolvedValue(mockComment),
  },
};

describe('CommentService', () => {
  let service: CommentService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createComment', () => {
    it('should create a comment and return a CommentDto', async () => {
      const createDto: CreateCommentDto = {
        content: 'Test comment content',
        postId: 1,
        authorId: 99,
      };

      const result = await service.createComment(createDto);

      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: {
          content: createDto.content,
          postId: createDto.postId,
          authorId: createDto.authorId,
        },
        include: { author: true }, // Updated expectation for the include option
      });

      expect(result).toEqual({
        id: mockComment.id,
        content: mockComment.content,
        postId: mockComment.postId,
        authorId: mockComment.authorId,
        createdAt: mockComment.createdAt.toISOString(),
        updatedAt: mockComment.updatedAt.toISOString(),
        author: mockComment.author ? mockComment.author.username : '', // if mapped
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of comments as CommentDto', async () => {
      const result = await service.findAll();

      expect(prisma.comment.findMany).toHaveBeenCalled();
      expect(result).toEqual([
        {
          id: mockComment.id,
          content: mockComment.content,
          postId: mockComment.postId,
          authorId: mockComment.authorId,
          createdAt: mockComment.createdAt.toISOString(),
          updatedAt: mockComment.updatedAt.toISOString(),
          author: 'test_user',
        },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a comment as CommentDto', async () => {
      const result = await service.findOne(1);

      expect(prisma.comment.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual({
        id: mockComment.id,
        content: mockComment.content,
        postId: mockComment.postId,
        authorId: mockComment.authorId,
        createdAt: mockComment.createdAt.toISOString(),
        updatedAt: mockComment.updatedAt.toISOString(),
        author: 'test_user',
      });
    });

    it('should throw NotFoundException if comment is not found', async () => {
      prisma.comment.findUnique = jest.fn().mockResolvedValue(null);
      await expect(service.findOne(2)).rejects.toThrow(
        new NotFoundException('Comment with id 2 not found'),
      );
    });
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { Post } from '../interface/post.interface';
import { PrismaService } from '../../../shared/prisma/prisma.service';

describe('PostService', () => {
  let service: PostService;
  let prismaService: PrismaService;

  const mockPosts: Post[] = [
    {
      id: 1,
      title: 'Post 1',
      category: 'Tech',
      author: 'Alice',
      excerpt: '',
      commentsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: 'Post 2',
      category: 'News',
      author: 'Bob',
      excerpt: '',
      commentsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const prismaServiceMock = {
    post: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      (prismaService.post.findMany as jest.Mock).mockResolvedValue(mockPosts);;
      const posts = await service.findAll();
      expect(prismaService.post.findMany).toHaveBeenCalled();
      expect(posts).toEqual(mockPosts);
    });
  });

  describe('findById', () => {
    it('should return a single post when found', async () => {
      const post = mockPosts[0];
      (prismaService.post.findUnique as jest.Mock).mockResolvedValue(post);

      const result = await service.findById(1);

      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(post);
    });

    it('should return null when post is not found', async () => {
      (prismaService.post.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.findById(999);

      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(result).toBeNull();
    });
  });

  describe('findByCategory', () => {
    it('should return posts filtered by category', async () => {
      const category = 'Tech';
      const filteredPosts = mockPosts.filter(
        (post) => post.category.toLowerCase() === category.toLowerCase(),
      );
      (prismaService.post.findMany as jest.Mock).mockResolvedValue(filteredPosts);
      const result = await service.findByCategory(category);
      expect(prismaService.post.findMany).toHaveBeenCalledWith({
        where: { category: { equals: category, mode: 'insensitive' } },
      });
      expect(result).toEqual(filteredPosts);
    });
  });

  describe('findByAuthor', () => {
    it('should return posts filtered by author', async () => {
      const author = 'Alice';
      const filteredPosts = mockPosts.filter(
        (post) => post.author.toLowerCase() === author.toLowerCase(),
      );
      (prismaService.post.findMany as jest.Mock).mockResolvedValue(filteredPosts);
      const result = await service.findByAuthor(author);
      expect(prismaService.post.findMany).toHaveBeenCalledWith({
        where: { author: { equals: author, mode: 'insensitive' } },
      });
      expect(result).toEqual(filteredPosts);
    });
  });
});

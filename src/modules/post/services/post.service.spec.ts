import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { Post, PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UpdatePostDto } from '../dto/update-post.dto';

describe('PostService', () => {
  let service: PostService;
  let prismaService: DeepMockProxy<PrismaClient>;

  const now = new Date();

  // Create mock users
  const mockUsers = [
    {
      id: 1,
      username: 'alice',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 2,
      username: 'bob',
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob@example.com',
      createdAt: now,
      updatedAt: now,
    },
  ];

  // Create mock posts with user relationships
  const mockPosts = [
    {
      id: 1,
      title: 'Post 1',
      content: 'Content for post 1',
      category: 'Tech',
      authorId: 1,
      author: mockUsers[0],
      excerpt: '',
      commentsCount: 0,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 2,
      title: 'Post 2',
      content: 'Content for post 2',
      category: 'News',
      authorId: 2,
      author: mockUsers[1],
      excerpt: 'Excerpt for post 2',
      commentsCount: 5,
      createdAt: now,
      updatedAt: now,
    },
  ];

  // Expected posts after processing
  const expectedPosts = mockPosts.map((post) => ({
    ...post,
    author: post.author.username,
    authorId: post.author.id,
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaClient>(),
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      prismaService.post.findMany.mockResolvedValue(mockPosts);
      const posts = await service.findAll();
      expect(prismaService.post.findMany).toHaveBeenCalledWith({
        include: { author: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(posts).toEqual(expectedPosts);
    });
  });

  describe('findById', () => {
    it('should return a single post when found', async () => {
      const post = mockPosts[0];
      prismaService.post.findUnique.mockResolvedValue(post);

      const result = await service.findById(1);
      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { author: true },
      });
      expect(result).toEqual({
        ...post,
        author: post.author.username,
        authorId: post.author.id,
      });
    });

    it('should return null when post is not found', async () => {
      prismaService.post.findUnique.mockResolvedValue(null);

      const result = await service.findById(999);
      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
        include: { author: true },
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
      prismaService.post.findMany.mockResolvedValue(filteredPosts);

      const result = await service.findByCategory(category);
      expect(prismaService.post.findMany).toHaveBeenCalledWith({
        where: { category: { equals: category, mode: 'insensitive' } },
        include: { author: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(
        filteredPosts.map((post) => ({
          ...post,
          author: post.author.username,
          authorId: post.author.id,
        })),
      );
    });
  });

  describe('findByAuthor', () => {
    it('should return posts filtered by author', async () => {
      const author = 'Alice';
      const filteredPosts = mockPosts.filter((post) =>
        post.author.username.toLowerCase().includes(author.toLowerCase()),
      );
      prismaService.post.findMany.mockResolvedValue(filteredPosts);

      const result = await service.findByAuthor(author);
      expect(prismaService.post.findMany).toHaveBeenCalledWith({
        where: {
          author: {
            username: {
              contains: author,
              mode: 'insensitive',
            },
          },
        },
        include: { author: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(
        filteredPosts.map((post) => ({
          ...post,
          author: post.author.username,
          authorId: post.author.id,
        })),
      );
    });
  });

  describe('UpdatePost', () => {
    let service: PostService;
    let prismaService: DeepMockProxy<PrismaService>;

    const existingPost = {
      id: 1,
      title: 'Old Title',
      content: 'Old Content',
      category: 'Tech',
      excerpt: 'Old excerpt',
      commentsCount: 2,
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: { id: 1, username: 'Alice' },
    };

    const updatePostDto: UpdatePostDto = {
      title: 'Updated Title',
      content: 'Updated Content',
      category: 'Tech',
      excerpt: 'Updated excerpt',
    };

    const updatedPostFromDb = {
      ...existingPost,
      ...updatePostDto,
      updatedAt: new Date(),
    };

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          PostService,
          {
            provide: PrismaService,
            useValue: mockDeep<PrismaService>(),
          },
        ],
      }).compile();

      service = module.get<PostService>(PostService);
      prismaService = module.get(PrismaService);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should update and return the post if it exists', async () => {
      prismaService.post.findUnique.mockResolvedValue(existingPost);
      prismaService.post.update.mockResolvedValue(updatedPostFromDb);

      const result = await service.updatePost(1, updatePostDto);

      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { author: true },
      });
      expect(prismaService.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatePostDto,
        include: { author: true },
      });
      expect(result).toEqual({
        ...updatedPostFromDb,
        excerpt: updatedPostFromDb.excerpt ?? null, // ensuring undefined becomes null
      });
    });

    it('should return null if the post does not exist', async () => {
      prismaService.post.findUnique.mockResolvedValue(null);

      const result = await service.updatePost(999, updatePostDto);

      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
        include: { author: true },
      });
      expect(result).toBeNull();
    });
  });
});

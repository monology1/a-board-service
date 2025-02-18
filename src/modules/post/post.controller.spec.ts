import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './services/post.service';

describe('PostController', () => {
  let postController: PostController;
  let postService: PostService;

  // Sample mock posts matching the Swagger schema
  const mockPost1 = {
    id: 1,
    title: 'Post 1',
    content: 'Content for post 1',
    category: 'Tech',
    author: 'Alice',
    createdAt: '2025-02-18T12:00:00Z',
    updatedAt: '2025-02-18T12:00:00Z',
  };

  const mockPost2 = {
    id: 2,
    title: 'Post 2',
    content: 'Content for post 2',
    category: 'News',
    author: 'Bob',
    createdAt: '2025-02-18T12:00:00Z',
    updatedAt: '2025-02-18T12:00:00Z',
  };

  // Create a mock for PostService
  const postServiceMock = {
    findAll: jest.fn(),
    findByCategory: jest.fn(),
    findByAuthor: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: postServiceMock,
        },
      ],
    }).compile();

    postController = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPosts', () => {
    it('should return posts filtered by category when the "category" query is provided', async () => {
      const category = 'Tech';
      const filteredPosts = [mockPost1];
      postServiceMock.findByCategory.mockResolvedValue(filteredPosts);

      const result = await postController.getPosts(category, undefined);

      expect(postServiceMock.findByCategory).toHaveBeenCalledWith(category);
      expect(result).toEqual(filteredPosts);
    });

    it('should return posts filtered by author when the "author" query is provided and category is not provided', async () => {
      const author = 'Bob';
      const filteredPosts = [mockPost2];
      postServiceMock.findByAuthor.mockResolvedValue(filteredPosts);

      const result = await postController.getPosts(undefined, author);

      expect(postServiceMock.findByAuthor).toHaveBeenCalledWith(author);
      expect(result).toEqual(filteredPosts);
    });

    it('should return all posts when no query parameter is provided', async () => {
      const allPosts = [mockPost1, mockPost2];
      postServiceMock.findAll.mockResolvedValue(allPosts);

      const result = await postController.getPosts(undefined, undefined);

      expect(postServiceMock.findAll).toHaveBeenCalled();
      expect(result).toEqual(allPosts);
    });
  });

  describe('getPostById', () => {
    it('should return a post when found', async () => {
      const postId = '1';
      postServiceMock.findById.mockResolvedValue(mockPost1);

      const result = await postController.getPostById(postId);

      expect(postServiceMock.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPost1);
    });

    it('should throw an HttpException with 404 status if post is not found', async () => {
      const postId = '999';
      postServiceMock.findById.mockResolvedValue(null);

      try {
        await postController.getPostById(postId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Post not found');
        expect(error.getStatus()).toEqual(HttpStatus.NOT_FOUND);
      }
    });
  });
});
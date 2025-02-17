import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../shared/prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;

  //create mock
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('signin', () => {
    it("should return user token when username exist", async () => {
      const username = "test"
      const mockUser = {
        id: 1,
        username: 'test',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.signin({username});

      expect(result.access_token).toBeDefined();
    })
  })
});

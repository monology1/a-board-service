import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CommentModule } from './comment.module';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../../strategies/jwt.strategy';

describe('CommentController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({ JWT_SECRET: 'test-secret' })],
        }),
        PrismaModule,
        CommentModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_SECRET') return 'test-secret';
              return null;
            }),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Important: Enable cookie parsing middleware
    app.use(require('cookie-parser')());

    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Create a valid JWT token for testing
    token = jwtService.sign({
      sub: 1,
      username: 'test_user',
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const prismaService = app.get<PrismaService>(PrismaService);
    await prismaService.comment.deleteMany();
  });

  it('/comments (POST) - create a comment (authorId in request body)', async () => {
    const createCommentDto = {
      content: 'Test comment from e2e with authorId',
      postId: 1,
      authorId: 1,
    };

    const response = await request(app.getHttpServer())
      .post('/comments')
      .send(createCommentDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.content).toEqual(createCommentDto.content);
    expect(response.body.postId).toEqual(createCommentDto.postId);
    expect(response.body.authorId).toEqual(createCommentDto.authorId);
    expect(typeof response.body.createdAt).toBe('string');
  });

  it('/comments (POST) - create a comment using cookie authentication', async () => {
    const createCommentDto = {
      content: 'Test comment with cookie auth',
      postId: 1,
      authorId: 1,
    };

    // Create properly formatted cookie string
    const cookieValue = `access_token=${token}; Path=/; HttpOnly`;

    const response = await request(app.getHttpServer())
      .post('/comments')
      .send(createCommentDto)
      .set('Cookie', [cookieValue])
      .expect(201);

    expect(response.body).toHaveProperty('id');
  });

  it('/comments (GET) - get all comments', async () => {
    const response = await request(app.getHttpServer())
      .get('/comments')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/comments/:id (GET) - get a specific comment', async () => {
    const createCommentDto = {
      content: 'Another test comment',
      postId: 1,
      authorId: 1,
    };

    const createResponse = await request(app.getHttpServer())
      .post('/comments')
      .send(createCommentDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const commentId = createResponse.body.id;

    const response = await request(app.getHttpServer())
      .get(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', commentId);
    expect(response.body.content).toEqual(createCommentDto.content);
    expect(response.body.authorId).toEqual(createCommentDto.authorId);
  });
});
